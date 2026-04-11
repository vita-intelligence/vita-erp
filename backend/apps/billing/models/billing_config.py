"""
BillingConfig — singleton row holding platform-wide pricing config.

Exactly one row exists per deployment. Editable via Django admin so prices
can be changed without a deploy. All monetary values are stored as integer
pence (1/100 of a pound) to avoid Decimal rounding across the Stripe
boundary. Display layers convert to pounds for presentation.

Stripe mapping:
    base_price_pence              → Stripe Price (recurring, flat)
    user_metered price slot       → Stripe Price (recurring, metered)
    storage_price_per_gb_pence    → Stripe Price (recurring, per-unit quantity)

The three `stripe_*_price_id` fields are populated by the sync management
command (`manage.py sync_billing_to_stripe`) the first time prices are
pushed to Stripe, and thereafter identify the Price objects attached to
each subscription line item.
"""

from __future__ import annotations

import uuid

from django.core.exceptions import ValidationError
from django.db import models


class BillingConfig(models.Model):
    """Singleton row storing base fee, storage pricing, trial length, and
    the Stripe Price IDs we sync against."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    # ── Base platform fee ─────────────────────────────────────────────────
    base_price_pence = models.PositiveIntegerField(
        default=19900,
        help_text="Flat monthly platform fee in pence. Default: 19900 (£199).",
    )

    # ── Storage pricing ───────────────────────────────────────────────────
    storage_minimum_gb = models.PositiveIntegerField(
        default=10,
        help_text="Storage quota included in the base fee. Users cannot choose less than this.",
    )
    storage_price_per_gb_pence = models.PositiveIntegerField(
        default=200,
        help_text="Monthly price per GB of additional storage in pence. Default: 200 (£2/GB).",
    )

    # ── Trial ─────────────────────────────────────────────────────────────
    trial_duration_days = models.PositiveIntegerField(
        default=14,
        help_text="Free trial length in days. Card is required upfront; Stripe auto-charges at trial end.",
    )

    # ── Currency ──────────────────────────────────────────────────────────
    currency = models.CharField(
        max_length=3,
        default="gbp",
        help_text=(
            "ISO 4217 code (lowercase, to match Stripe convention). Platform charges exclusively in this currency."
        ),
    )

    # ── Stripe sync ───────────────────────────────────────────────────────
    stripe_product_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Product ID — created on first sync, shared across all three Prices.",
    )
    stripe_base_price_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Price ID for the flat recurring base fee.",
    )
    stripe_user_metered_price_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Price ID for the metered per-user line. Unit = 1 penny.",
    )
    stripe_storage_price_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Price ID for the per-GB storage line. Quantity on subscription = GB above minimum.",
    )

    # ── Timestamps ────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_config"
        verbose_name = "Billing config"
        verbose_name_plural = "Billing config"

    def __str__(self) -> str:
        return f"BillingConfig (£{self.base_price_pence / 100:.2f}/mo base, {self.storage_minimum_gb} GB included)"

    def save(self, *args: object, **kwargs: object) -> None:
        """Enforce singleton — only one BillingConfig row ever exists."""
        if self._state.adding and BillingConfig.objects.exists():
            existing = BillingConfig.objects.first()
            if existing:
                self.pk = existing.pk
                self._state.adding = False
        super().save(*args, **kwargs)  # type: ignore[arg-type]

    def delete(self, *args: object, **kwargs: object) -> tuple[int, dict[str, int]]:
        """Prevent deletion of the singleton — billing config must always exist."""
        raise ValidationError("BillingConfig is a singleton and cannot be deleted.")

    @classmethod
    def load(cls) -> BillingConfig:
        """Fetch the singleton, creating it with defaults on first access."""
        obj, _ = cls.objects.get_or_create(pk=cls.objects.values_list("pk", flat=True).first() or uuid.uuid4())
        return obj
