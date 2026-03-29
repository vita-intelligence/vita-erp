"""
Membership service — manages user-organization associations.

All membership mutations go through this service so audit logging
and validation are consistent.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from apps.organizations.constants import AUDIT_MEMBER_ADDED, AUDIT_MEMBER_REMOVED
from apps.organizations.models import Membership, Organization

if TYPE_CHECKING:
    from django.http import HttpRequest

    from apps.accounts.models import User

logger = logging.getLogger(__name__)


def add_member(
    org: Organization,
    user: User,
    request: HttpRequest | None = None,
    performed_by: User | None = None,
) -> tuple[Membership, str | None]:
    """Add a user to an organization.

    Returns (membership, error_code). On success error_code is None.
    """
    if Membership.objects.filter(user=user, organization=org).exists():
        return None, "already_member"  # type: ignore[return-value]

    membership = Membership.objects.create(
        user=user,
        organization=org,
    )

    if request and performed_by:
        _log_member_event(
            performed_by=performed_by,
            action=AUDIT_MEMBER_ADDED,
            org=org,
            target_user=user,
            request=request,
        )

    logger.info("User %s added to org %s", user.id, org.slug)
    return membership, None


def remove_member(
    org: Organization,
    user: User,
    request: HttpRequest | None = None,
    performed_by: User | None = None,
) -> str | None:
    """Deactivate a user's membership. Returns error code or None."""
    membership = Membership.objects.filter(
        user=user,
        organization=org,
        is_active=True,
    ).first()

    if not membership:
        return "not_a_member"

    membership.is_active = False
    membership.save(update_fields=["is_active"])

    if request and performed_by:
        _log_member_event(
            performed_by=performed_by,
            action=AUDIT_MEMBER_REMOVED,
            org=org,
            target_user=user,
            request=request,
        )

    logger.info("User %s removed from org %s", user.id, org.slug)
    return None


def verify_membership(user_id: str, org_id: str) -> bool:
    """Check if a user has an active membership for an organization."""
    return Membership.objects.filter(
        user_id=user_id,
        organization_id=org_id,
        is_active=True,
    ).exists()


def _log_member_event(
    performed_by: User,
    action: str,
    org: Organization,
    target_user: User,
    request: HttpRequest,
) -> None:
    """Log a membership change to the platform audit log."""
    from apps.accounts.services.auth import log_auth_event

    log_auth_event(
        user=performed_by,
        action=action,
        request=request,
        metadata={
            "org_id": str(org.id),
            "org_name": org.name,
            "target_user_id": str(target_user.id),
            "target_email": target_user.email,
        },
    )
