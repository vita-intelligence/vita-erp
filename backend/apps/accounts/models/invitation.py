"""
Invitation — admin-initiated invite for a future Org member.

Lives in the central DB. Each invitation carries a one-shot URL-safe
token that the recipient clicks. Two pieces of bookkeeping matter:

  1. **Persistence over caching.** Email verification and password
     reset tokens live in Redis for short TTLs. Invitations need a
     real DB row because admins must list / revoke / resend them
     from the UI, and the data must survive Redis flushes.
  2. **Pre-assigned role.** When an invite is created from the
     organogram MemberList "Invite new user" button, the role being
     viewed is stored in `pre_assigned_role_id`. After the user
     accepts and finishes onboarding, the role is auto-attached so
     the admin doesn't have to come back and assign it.

The unique-while-pending constraint means the same email can be
re-invited after a previous invitation is accepted or revoked, but
only one *pending* invitation can exist per email per org at a time.
"""

from __future__ import annotations

import secrets
from datetime import datetime, timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


def _default_token() -> str:
    """64-char URL-safe random token. ~384 bits of entropy."""
    return secrets.token_urlsafe(48)[:64]


def _default_expiry() -> datetime:
    return timezone.now() + timedelta(days=7)


class Invitation(models.Model):
    """An invite for someone to join an organization."""

    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_REVOKED = "revoked"
    STATUS_EXPIRED = "expired"

    id = models.UUIDField(
        primary_key=True,
        default=__import__("uuid").uuid4,
        editable=False,
    )
    email = models.EmailField(
        help_text="Lowercased on save. Recipient of the invite link.",
    )
    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="invitations",
    )
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="invitations_sent",
    )

    token = models.CharField(
        max_length=64,
        unique=True,
        default=_default_token,
        editable=False,
    )
    expires_at = models.DateTimeField(default=_default_expiry)
    accepted_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)

    # Org DB role id (no FK across DBs — same pattern as UserRole.user_id).
    # If set, the role is automatically attached after the invitee finishes
    # onboarding so the admin doesn't have to assign it manually.
    pre_assigned_role_id = models.UUIDField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_invitation"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "accepted_at", "revoked_at"]),
            models.Index(fields=["email"]),
        ]
        constraints = [
            # One *pending* invite per email per org. Accepted/revoked
            # invites don't block re-invitations.
            models.UniqueConstraint(
                fields=["email", "organization"],
                condition=models.Q(accepted_at__isnull=True, revoked_at__isnull=True),
                name="unique_pending_invitation_per_email_per_org",
            ),
        ]

    def __str__(self) -> str:
        return f"Invitation {self.email} → {self.organization_id} ({self.status})"

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower().strip()
        super().save(*args, **kwargs)

    @property
    def status(self) -> str:
        if self.revoked_at is not None:
            return self.STATUS_REVOKED
        if self.accepted_at is not None:
            return self.STATUS_ACCEPTED
        if self.expires_at and self.expires_at < timezone.now():
            return self.STATUS_EXPIRED
        return self.STATUS_PENDING

    @property
    def is_pending(self) -> bool:
        return self.status == self.STATUS_PENDING
