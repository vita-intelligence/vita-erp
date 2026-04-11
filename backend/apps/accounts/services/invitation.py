"""
Invitation service — admin invites a new user, user accepts.

Business rules:
  1. Only one *pending* invite per email per org. Re-inviting an
     accepted/revoked email creates a fresh row with a new token.
  2. Tokens are 64-char URL-safe random strings; default expiry 7 days.
  3. Acceptance is gated on the logged-in user's email matching the
     invite's email — preventing token-leak attacks where a malicious
     user accepts someone else's invite.
  4. After accept: a `Membership` row is created in the central DB and
     the optional `pre_assigned_role_id` is auto-attached via
     `apps.rbac.services.role.assign_user_to_role`. The user's
     `requires_onboarding` flag defaults to True so the OnboardingRequired
     blocker fires on their first request.
  5. Email send mirrors the existing `verification.send_verification_email`
     pattern: Django templates, configurable backend, i18n-aware.

The same email-template approach + i18n templates land in
`backend/templates/emails/invitation_*` so dev sees it in the console
and prod uses the SMTP backend without code changes.
"""

from __future__ import annotations

import logging
import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone

from apps.accounts.models import Invitation, User

if TYPE_CHECKING:
    from apps.organizations.models import Organization

logger = logging.getLogger(__name__)


# ── Create / list / revoke / resend ────────────────────────────────────────


def create_invitation(
    *,
    email: str,
    organization: Organization,
    invited_by: User,
    pre_assigned_role_id: uuid.UUID | str | None = None,
) -> tuple[Invitation | None, str | None]:
    """Create a pending invite. Returns (invitation, error_code).

    Error codes match the auth-service convention so the frontend can
    look them up in i18n. Possible errors:
      - `email_invalid` — empty or unparseable
      - `already_member` — the email already belongs to an active member
      - `pending_exists` — there's already a pending invite for this email
    """
    email = (email or "").lower().strip()
    if not email or "@" not in email:
        return None, "email_invalid"

    if _email_already_member(email, organization):
        return None, "already_member"

    if Invitation.objects.filter(
        email=email,
        organization=organization,
        accepted_at__isnull=True,
        revoked_at__isnull=True,
    ).exists():
        return None, "pending_exists"

    invitation = Invitation.objects.create(
        email=email,
        organization=organization,
        invited_by=invited_by,
        pre_assigned_role_id=uuid.UUID(str(pre_assigned_role_id)) if pre_assigned_role_id else None,
    )
    send_invitation_email(invitation)
    logger.info(
        "Invitation %s created for %s → org %s",
        invitation.id,
        invitation.email,
        organization.slug,
    )
    return invitation, None


def revoke_invitation(invitation: Invitation) -> None:
    """Mark an invitation as revoked. Idempotent."""
    if invitation.revoked_at is None and invitation.accepted_at is None:
        invitation.revoked_at = timezone.now()
        invitation.save(update_fields=["revoked_at"])


def resend_invitation(invitation: Invitation) -> tuple[Invitation | None, str | None]:
    """Re-send the invite email. If the invitation is expired or
    revoked, generates a fresh token + extends the expiry."""
    if invitation.accepted_at is not None:
        return None, "already_accepted"

    from datetime import timedelta

    invitation.expires_at = timezone.now() + timedelta(days=7)
    invitation.revoked_at = None
    invitation.save(update_fields=["expires_at", "revoked_at"])
    send_invitation_email(invitation)
    return invitation, None


# ── Accept ────────────────────────────────────────────────────────────────


def lookup_invitation_by_token(token: str) -> Invitation | None:
    return Invitation.objects.filter(token=token).select_related("organization").first()


def accept_invitation(
    *,
    invitation: Invitation,
    user: User,
) -> tuple[bool, str | None]:
    """Accept a pending invitation as the logged-in user.

    Verifies the user's email matches the invitation, creates the
    Membership in the central DB, and (if the invitation carries a
    `pre_assigned_role_id`) assigns the role inside the org DB.

    Returns (success, error_code). Error codes:
      - `email_mismatch` — logged-in user's email != invite email
      - `expired` — invitation past `expires_at`
      - `revoked` / `already_accepted` — terminal states
      - `not_verified` — user must verify their email first
    """
    if invitation.revoked_at is not None:
        return False, "revoked"
    if invitation.accepted_at is not None:
        return False, "already_accepted"
    if invitation.expires_at is not None and invitation.expires_at < timezone.now():
        return False, "expired"
    if user.email.lower() != invitation.email.lower():
        return False, "email_mismatch"
    if not user.is_verified:
        return False, "not_verified"

    from apps.organizations.models import Membership

    with transaction.atomic(using="default"):
        membership, created = Membership.objects.get_or_create(
            user=user,
            organization=invitation.organization,
            defaults={"is_active": True, "requires_onboarding": True},
        )
        # Reactivate if a soft-disabled row was reused
        if not created and not membership.is_active:
            membership.is_active = True
            membership.save(update_fields=["is_active"])

        invitation.accepted_at = timezone.now()
        invitation.save(update_fields=["accepted_at"])

    # Org-DB role attachment runs outside the central transaction.
    if invitation.pre_assigned_role_id:
        _attach_pre_assigned_role(
            org=invitation.organization,
            user_id=user.id,
            role_id=invitation.pre_assigned_role_id,
        )

    logger.info(
        "Invitation %s accepted by user %s → membership %s",
        invitation.id,
        user.id,
        membership.id,
    )
    return True, None


def _attach_pre_assigned_role(
    *,
    org: Organization,
    user_id: uuid.UUID,
    role_id: uuid.UUID,
) -> None:
    """Attach the invite's pre_assigned_role to the new member, in the
    org DB context. Best-effort — logs and continues if the role no
    longer exists (e.g., admin deleted it after sending the invite)."""
    from apps.organizations.context import clear_current_org_db, set_current_org_db
    from apps.organizations.db import register_org_database
    from apps.rbac.models import Role, UserRole

    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)
    try:
        role = Role.objects.using(db_alias).filter(id=role_id).first()
        if role is None:
            logger.warning(
                "Invitation pre_assigned_role %s no longer exists in org %s",
                role_id,
                org.slug,
            )
            return
        UserRole.objects.using(db_alias).get_or_create(
            user_id=user_id,
            role=role,
        )
    finally:
        clear_current_org_db()


# ── Email send ─────────────────────────────────────────────────────────────


def send_invitation_email(invitation: Invitation) -> None:
    """Send the invite email using Django templates.

    Mirrors the verification-email pattern at
    `apps.accounts.services.verification.send_verification_email`.
    """
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    accept_url = f"{frontend_url}/accept-invite?token={invitation.token}"

    context = {
        "accept_url": accept_url,
        "invited_email": invitation.email,
        "org_name": invitation.organization.name,
        "inviter_email": invitation.invited_by.email if invitation.invited_by else "",
    }

    subject = render_to_string("emails/invitation_subject.txt", context).strip()
    text_body = render_to_string("emails/invitation.txt", context).strip()
    html_body = render_to_string("emails/invitation.html", context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@vita-erp.com"),
        to=[invitation.email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)


# ── Helpers ───────────────────────────────────────────────────────────────


def _email_already_member(email: str, organization: Organization) -> bool:
    """True iff a user with this email already has an active membership
    in the given org."""
    from apps.organizations.models import Membership

    return Membership.objects.filter(
        user__email__iexact=email,
        organization=organization,
        is_active=True,
    ).exists()
