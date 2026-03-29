"""
Plan models — defines what an organization pays for.

Billing formula per organization per month:
    base_price
    + sum(per-user permission costs via PermissionPrice)
    + sum(quota overages via PlanLimit)
    + sum(active add-on prices)

Per-user cost is NOT a flat rate — each permission (module + action)
has its own price defined in PermissionPrice. The billing service
sums the prices of all permissions granted to each user in the org.

Quotas (storage, sessions, API calls, etc.) are defined via PlanLimit.
Each limit has an included quantity and a price for overages.

Stripe mapping:
    Plan        → Stripe Product
    base_price  → Stripe Price (flat recurring)
    per-user    → Stripe Price (metered usage, reported monthly)
    quotas      → Stripe Price (metered usage, reported monthly)
    AddOn       → Stripe Price (flat recurring, added to subscription)
"""

from __future__ import annotations

import uuid

from django.db import models


class Plan(models.Model):
    """A billing plan / pricing tier (e.g., Free Trial, Starter, Pro, Enterprise)."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    # --- Base platform fee ---
    base_price_monthly = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Flat monthly fee for the platform itself.",
    )
    base_price_annual = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Flat annual fee (typically discounted vs 12× monthly).",
    )

    # --- Trial ---
    is_trial = models.BooleanField(
        default=False,
        help_text="Whether this plan is used for free trial subscriptions.",
    )
    trial_duration_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Trial length in days. Only relevant when is_trial=True.",
    )

    # --- Visibility ---
    is_public = models.BooleanField(
        default=True,
        help_text="Whether this plan is visible on the pricing page.",
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text="Display order on pricing page. Lower = first.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Inactive plans cannot be assigned to new subscriptions.",
    )

    # --- Stripe integration (populated when Stripe is connected) ---
    stripe_product_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Product ID for this plan.",
    )
    stripe_price_id_monthly = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Price ID for the monthly base fee.",
    )
    stripe_price_id_annual = models.CharField(
        max_length=255,
        blank=True,
        help_text="Stripe Price ID for the annual base fee.",
    )

    # --- Timestamps ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_plan"
        ordering = ["sort_order", "base_price_monthly"]

    def __str__(self) -> str:
        return self.name


class PlanModuleAccess(models.Model):
    """Defines which modules a plan grants access to.

    Module codes are plain strings — each Django app registers its own
    code when built. No central enum required.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="module_access",
    )
    module_code = models.CharField(
        max_length=50,
        help_text="Module identifier (e.g., 'inventory', 'production').",
    )

    class Meta:
        db_table = "billing_plan_module_access"
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "module_code"],
                name="unique_module_per_plan",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.plan.slug}:{self.module_code}"
