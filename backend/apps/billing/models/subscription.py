"""
Subscription — links an Organization to a Plan.

One-to-one relationship: each organization has exactly one active subscription.
The subscription tracks billing cycle, current period, trial dates, and Stripe IDs.

Stripe mapping:
    Subscription         → Stripe Subscription
    subscription.status  → stripe_subscription.status (identical values)
    SubscriptionAddOn    → Stripe Subscription Item (additional line item)
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
from apps.billing.models.plan import Plan


class Subscription(models.Model):
    """An organization's active billing subscription."""

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
    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        related_name="subscriptions",
        help_text="PROTECT prevents deleting a plan that has active subscriptions.",
    )

    # --- Status (mirrors Stripe) ---
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

    # --- Billing period ---
    current_period_start = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Start of the current billing period.",
    )
    current_period_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text="End of the current billing period.",
    )

    # --- Trial ---
    trial_start = models.DateTimeField(null=True, blank=True)
    trial_end = models.DateTimeField(null=True, blank=True)

    # --- Cancellation ---
    canceled_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the subscription was canceled. Null = not canceled.",
    )
    cancel_at_period_end = models.BooleanField(
        default=False,
        help_text="If True, subscription remains active until current_period_end.",
    )

    # --- Stripe integration ---
    stripe_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription ID.",
    )
    stripe_customer_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Customer ID for this organization.",
    )

    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_subscription"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["stripe_subscription_id"]),
            models.Index(fields=["stripe_customer_id"]),
        ]

    def __str__(self) -> str:
        return f"{self.organization_id} → {self.plan.slug} ({self.status})"

    @property
    def is_accessible(self) -> bool:
        """Whether this subscription grants access to the organization."""
        return self.status in SUB_ACCESSIBLE_STATUSES

    @property
    def is_trial_expired(self) -> bool:
        """Whether the trial period has ended."""
        if not self.trial_end:
            return False
        return timezone.now() > self.trial_end


class SubscriptionAddOn(models.Model):
    """An active add-on attached to a subscription."""

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

    # --- Stripe integration ---
    stripe_subscription_item_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Subscription Item ID for this add-on.",
    )

    # --- Timestamps ---
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
