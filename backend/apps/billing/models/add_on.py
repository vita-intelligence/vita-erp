"""
AddOn — purchasable extras on top of the base subscription.

Add-ons are optional features an organization can toggle on for an extra
monthly fee, or buy once for a one-time charge (think of them like DLCs).
Phase 1 ships without any add-ons seeded; new ones are created in Django
admin as product features are built.

Stripe mapping:
    Recurring add-on    → Stripe Product + recurring Price
    One-time add-on     → Stripe Product + one-time Price
    SubscriptionAddOn   → Stripe Subscription Item (for recurring)
                          or Stripe Invoice Item / Payment Intent (one-time)
"""

from __future__ import annotations

import uuid

from django.db import models


class AddOn(models.Model):
    """An optional feature purchasable on top of the base subscription."""

    BILLING_TYPE_RECURRING = "recurring"
    BILLING_TYPE_ONE_TIME = "one_time"

    BILLING_TYPE_CHOICES = [
        (BILLING_TYPE_RECURRING, "Recurring (monthly)"),
        (BILLING_TYPE_ONE_TIME, "One-time purchase"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    # ── Scope (optional) ──────────────────────────────────────────────────
    module_code = models.CharField(
        max_length=50,
        blank=True,
        help_text="Module this add-on extends. Blank = platform-wide (e.g., priority support).",
    )

    # ── Pricing ───────────────────────────────────────────────────────────
    billing_type = models.CharField(
        max_length=20,
        choices=BILLING_TYPE_CHOICES,
        default=BILLING_TYPE_RECURRING,
        help_text="Whether this add-on charges monthly or as a single one-off payment.",
    )
    price_pence = models.PositiveIntegerField(
        default=0,
        help_text="Price in pence. Monthly amount for recurring, total amount for one-time.",
    )

    # ── Availability ──────────────────────────────────────────────────────
    is_active = models.BooleanField(
        default=True,
        help_text="Inactive add-ons are hidden in the UI and cannot be newly purchased.",
    )

    # ── Stripe integration ────────────────────────────────────────────────
    stripe_product_id = models.CharField(max_length=255, blank=True)
    stripe_price_id = models.CharField(max_length=255, blank=True)

    # ── Timestamps ────────────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_add_on"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
