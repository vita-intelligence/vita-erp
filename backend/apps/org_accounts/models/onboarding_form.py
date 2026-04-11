"""
OnboardingForm — singleton per org holding the active form definition.

The shape of `definition` mirrors the FormSchema TypeScript type at
`frontend/src/components/form-constructor/types.ts`. The frontend
FormEditor produces this JSON; the FormViewer renders it; this model
just stores it server-side and stamps a version on every save so we
can detect when a member's existing responses no longer satisfy the
current required-field set.

Singleton enforcement follows the same pattern as
`apps.rbac.models.organogram_layout.OrganogramLayout` and
`apps.billing.models.billing_config.BillingConfig` — `save()`
collapses inserts onto the existing row.

The `requires_onboarding` flag on `organizations.Membership` is
recomputed for every member of the org whenever this row is saved
(see `apps.org_accounts.services.onboarding.recompute_org_onboarding_status`).
"""

from __future__ import annotations

import uuid
from typing import Any

from django.core.exceptions import ValidationError
from django.db import models


class OnboardingForm(models.Model):
    """The org's user-onboarding form definition."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    definition = models.JSONField(
        default=dict,
        help_text=(
            "Form schema produced by the frontend form constructor. Mirrors `FormSchema` in form-constructor/types.ts."
        ),
    )
    version = models.PositiveIntegerField(
        default=1,
        help_text="Bumps on every save. Stamped on submissions for migration tracking.",
    )
    is_active = models.BooleanField(default=True)

    # User id (central DB) — no FK across DBs, same pattern as UserRole.user_id
    updated_by = models.UUIDField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "org_accounts_onboarding_form"
        verbose_name = "Onboarding form"
        verbose_name_plural = "Onboarding form"

    def __str__(self) -> str:
        field_count = _count_fields(self.definition)
        return f"OnboardingForm v{self.version} ({field_count} fields)"

    def save(self, *args: Any, **kwargs: Any) -> None:
        """Enforce singleton + bump version on definition changes.

        The first row created keeps version=1. Every subsequent save
        increments version IF the definition actually changed (so a
        no-op admin re-save doesn't pollute the version stamp).
        """
        if self._state.adding and OnboardingForm.objects.exists():
            existing = OnboardingForm.objects.first()
            if existing:
                self.pk = existing.pk
                self._state.adding = False

        if not self._state.adding and self.pk:
            try:
                old = OnboardingForm.objects.get(pk=self.pk)
                if old.definition != self.definition:
                    self.version = old.version + 1
            except OnboardingForm.DoesNotExist:
                pass

        super().save(*args, **kwargs)

    def delete(self, *args: Any, **kwargs: Any) -> tuple[int, dict[str, int]]:
        raise ValidationError("OnboardingForm is a singleton and cannot be deleted.")


def _count_fields(definition: dict | list | None) -> int:
    """Cheap field counter for the __str__ helper. Walks groups too."""
    if not isinstance(definition, dict):
        return 0
    elements = definition.get("elements") or []

    count = 0
    stack = list(elements)
    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        kind = node.get("kind")
        if kind == "field":
            count += 1
        elif kind == "group":
            stack.extend(node.get("elements") or [])
    return count
