"""
Membership model — links a User to an Organization in the central DB.

This is the platform-level association only: "user X belongs to org Y".
Org-specific data (roles, permissions, profile) lives in the org database.

Per-user billing is calculated dynamically from the number of permissions
granted to the user in the org database — not from a fixed tier.
"""

from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models


class Membership(models.Model):
    """Junction table: User belongs to Organization."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    # Lifecycle
    is_active = models.BooleanField(
        default=True,
        help_text="Inactive members lose access but the record is preserved.",
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    # ── Onboarding gate ──────────────────────────────────────────────────
    # `requires_onboarding` is the cached gate AuthGuard reads. It's
    # recomputed by `apps.org_accounts.services.onboarding` whenever the
    # user submits or the org's onboarding form is edited; /auth/me/ does
    # zero work and just reads this flag.
    requires_onboarding = models.BooleanField(
        default=True,
        help_text="True when the user is missing at least one currently-required onboarding field.",
    )
    onboarding_completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Diagnostic timestamp of first successful submission. Not the gate.",
    )
    onboarding_form_version_at_completion = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="OnboardingForm.version the user last cleared. Diagnostic only.",
    )

    class Meta:
        db_table = "organizations_membership"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization"],
                name="unique_user_per_organization",
            ),
        ]
        ordering = ["-joined_at"]
        indexes = [
            models.Index(fields=["user", "is_active"]),
            models.Index(fields=["organization", "is_active"]),
        ]

    def __str__(self) -> str:
        return f"{self.user_id} @ {self.organization_id}"
