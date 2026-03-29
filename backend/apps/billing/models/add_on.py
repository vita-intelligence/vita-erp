"""
AddOn — purchasable extras on top of a plan.

Add-ons represent optional features or module extensions that organizations
can activate for an additional monthly/annual fee. They are independent of
the base plan and can be toggled per subscription.

Examples:
    "Advanced Scheduling"   → extends production module
    "Barcode System"        → extends inventory module
    "B2B Customer Portal"   → extends CRM module
    "Priority Support"      → platform-wide, no specific module

Stripe mapping:
    AddOn → Stripe Product + Price (flat recurring, attached to subscription)
"""

from __future__ import annotations

import uuid

from django.db import models


class AddOn(models.Model):
    """An optional feature purchasable on top of a plan."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    # --- Scope ---
    module_code = models.CharField(
        max_length=50,
        blank=True,
        help_text="Module this add-on extends. Blank = platform-wide (e.g., priority support).",
    )

    # --- Pricing ---
    price_monthly = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    price_annual = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Annual price (typically discounted vs 12× monthly).",
    )

    # --- Availability ---
    is_active = models.BooleanField(
        default=True,
        help_text="Inactive add-ons cannot be newly activated.",
    )

    # --- Stripe integration ---
    stripe_product_id = models.CharField(
        max_length=255,
        blank=True,
    )
    stripe_price_id_monthly = models.CharField(
        max_length=255,
        blank=True,
    )
    stripe_price_id_annual = models.CharField(
        max_length=255,
        blank=True,
    )

    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_add_on"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
