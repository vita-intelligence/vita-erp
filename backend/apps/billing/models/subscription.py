"""
Subscription — binds an Organization to its Stripe subscription.

One row per organization. The `status` field mirrors Stripe's subscription
lifecycle exactly (`trialing` / `active` / `past_due` / `canceled` / …) so
webhooks translate 1:1.

Subscription shape in Stripe (see BillingConfig for price definitions):
    Item 1 — base       flat recurring @ base_price_pence
    Item 2 — users      metered, quantity reported daily by cron
    Item 3 — storage    recurring per-GB, quantity = (storage_quota_gb - minimum)

The per-item Stripe IDs are stored here so the daily usage reporter knows
which subscription item to call `create_usage_record` on, and so the UI
storage adjuster knows which item to call `subscription_item.update` on.
"""

from __future__ import annotations

import uuid

from django.db import models
from django.utils import timezone

from apps.billing.constants import (
    BILLING_CYCLE_CHOICES,
    BILLING_CYCLE_MONTHLY,
    SUB_ACCESSIBLE_STATUSES,
    SUB_STATUS_CHOICES,
    SUB_STATUS_TRIALING,
)
from apps.billing.models.add_on import AddOn


class Subscription(models.Model):
    """An organization's billing subscription state, mirrored from Stripe."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    organization = models.OneToOneField(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="subscription",
    )

    # ── Status (mirrors Stripe) ───────────────────────────────────────────
    status = models.CharField(
        max_length=20,
        choices=SUB_STATUS_CHOICES,
        default=SUB_STATUS_TRIALING,
        db_index=True,
    )
    billing_cycle = models.CharField(
        max_length=10,
        choices=BILLING_CYCLE_CHOICES,
        default=BILLING_CYCLE_MONTHLY,
    )

    # ── Billing period ────────────────────────────────────────────────────
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)

    # ── Trial ─────────────────────────────────────────────────────────────
    trial_start = models.DateTimeField(null=True, blank=True)
    trial_end = models.DateTimeField(null=True, blank=True)

    # ── Storage quota chosen by the org (in GB) ───────────────────────────
    storage_quota_gb = models.PositiveIntegerField(
        default=10,
        help_text="Storage ceiling the org is paying for. Must be >= BillingConfig.storage_minimum_gb.",
    )

    # ── Cancellation ──────────────────────────────────────────────────────
    canceled_at = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(
        default=False,
        help_text="If True, subscription remains active until current_period_end then stops auto-renewing.",
    )

    # ── Stripe integration ────────────────────────────────────────────────
    stripe_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription ID. Empty until the subscription has been created in Stripe.",
    )
    stripe_base_item_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription Item ID for the flat base-fee line.",
    )
    stripe_user_item_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription Item ID for the metered per-user line.",
    )
    stripe_storage_item_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription Item ID for the per-GB storage line.",
    )

    # ── Timestamps ────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_subscription"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["stripe_subscription_id"]),
        ]

    def __str__(self) -> str:
        return f"{self.organization_id} — {self.status}"

    @property
    def is_accessible(self) -> bool:
        """Whether this subscription grants access to the organization."""
        return self.status in SUB_ACCESSIBLE_STATUSES

    @property
    def is_trial_expired(self) -> bool:
        """Whether the trial window has already closed."""
        if not self.trial_end:
            return False
        return timezone.now() > self.trial_end


class SubscriptionAddOn(models.Model):
    """A purchasable add-on activated on a subscription."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name="active_add_ons",
    )
    add_on = models.ForeignKey(
        AddOn,
        on_delete=models.PROTECT,
        related_name="subscription_activations",
    )

    stripe_subscription_item_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription Item ID for this add-on line.",
    )

    activated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "billing_subscription_add_on"
        constraints = [
            models.UniqueConstraint(
                fields=["subscription", "add_on"],
                name="unique_add_on_per_subscription",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.subscription.organization_id} + {self.add_on.slug}"
