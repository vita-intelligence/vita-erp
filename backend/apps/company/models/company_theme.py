"""
CompanyTheme — singleton theme configuration per organization.

Stores the active preset (mode) and per-mode token overrides applied when
any user of the org loads the app. The browser store (useThemeStore) is
the runtime mirror of this row; this table is the canonical source of
truth the frontend loads on org select.

Lives in the tenant (org) database — every org has exactly one row.
Version history is handled via append-only AuditLog entries logged on
each update, flattened as "<mode>.<token>" keys.
"""

from __future__ import annotations

import uuid
from typing import Any

from django.core.exceptions import ValidationError
from django.db import models


class CompanyTheme(models.Model):
    """Singleton theme configuration for the organization."""

    # === Identity ===

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    # === Theme state ===

    active_mode = models.CharField(
        max_length=20,
        default="light",
        help_text="Selected preset name (e.g. light, dark, ocean, forest).",
    )
    tokens_by_mode = models.JSONField(
        default=dict,
        blank=True,
        help_text=(
            "Per-mode token overrides. Keys are preset names; values are "
            "full ThemeTokens objects for that mode. Only modes that have "
            "been customized are present."
        ),
    )

    # === Metadata ===

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_theme"
        verbose_name = "Company Theme"
        verbose_name_plural = "Company Theme"

    def __str__(self) -> str:
        return "CompanyTheme"

    def clean(self) -> None:
        if not isinstance(self.tokens_by_mode, dict):
            raise ValidationError({"tokens_by_mode": "tokens_by_mode_must_be_object"})
        for mode_key, mode_tokens in self.tokens_by_mode.items():
            if not isinstance(mode_key, str):
                raise ValidationError({"tokens_by_mode": "mode_key_must_be_string"})
            if not isinstance(mode_tokens, dict):
                raise ValidationError(
                    {"tokens_by_mode": "mode_value_must_be_object"},
                )

    def save(self, *args: Any, **kwargs: Any) -> None:
        # UUIDField default fires on __init__, so `self.pk` is always set —
        # use _state.adding to detect new (unsaved) instances.
        if self._state.adding and CompanyTheme.objects.exists():
            raise ValidationError("company_theme_already_exists")
        self.full_clean()
        super().save(*args, **kwargs)
