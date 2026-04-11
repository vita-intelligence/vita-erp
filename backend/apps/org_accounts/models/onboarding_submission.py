"""
OnboardingSubmission — one row per Membership.

Holds the latest state of a member's responses to the org's
OnboardingForm. The same row is mutated in place when the user
re-submits (e.g., updating their photo later); previous values are
not retained as history. The orphaned-file cleanup logic in
`apps.org_accounts.services.onboarding.submit_onboarding` relies on
this single-row-per-member shape.

Cross-DB note: `membership_id` references
`organizations.Membership.id` in the central DB. We don't model it as
a ForeignKey because Django doesn't support FKs across databases —
same pattern used by `apps.rbac.models.user_role.UserRole.user_id`.
The view layer enforces referential integrity by validating
membership existence before writes.

Dataset queryability: the `responses` JSONField gets a GIN index with
`jsonb_path_ops` opclass at migration time so containment queries
like `responses @> '{"department": "Sales"}'` use the index instead
of a sequential scan. This is the SurveyCTO-style dataset use case
the user named.
"""

from __future__ import annotations

import uuid

from django.contrib.postgres.indexes import GinIndex
from django.db import models


class OnboardingSubmission(models.Model):
    """A member's onboarding form responses, latest state."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    membership_id = models.UUIDField(
        db_index=True,
        help_text="References organizations.Membership.id in the central DB.",
    )
    form_version = models.PositiveIntegerField(
        help_text="OnboardingForm.version at the time of this submission.",
    )
    responses = models.JSONField(
        default=dict,
        help_text=(
            "Flat dict keyed by form field name. Values are scalars or "
            'media references like {"type": "media", "asset_id": "..."}.'
        ),
    )

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "org_accounts_onboarding_submission"
        constraints = [
            models.UniqueConstraint(
                fields=["membership_id"],
                name="unique_submission_per_membership",
            ),
        ]
        indexes = [
            # JSONB containment index for dataset-style queries.
            # `jsonb_path_ops` is faster + smaller than the default,
            # at the cost of supporting only `@>` (which is what we use).
            GinIndex(
                name="onboarding_responses_gin",
                fields=["responses"],
                opclasses=["jsonb_path_ops"],
            ),
        ]
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return f"OnboardingSubmission membership={self.membership_id} v{self.form_version}"
