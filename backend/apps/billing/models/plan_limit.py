"""
PlanLimit — generic quota/limit system for plans.

Each limit defines an included quantity and a price for overages.
New limit types are added as rows, not as model fields — no migrations
required when introducing new quotas.

Examples:
    limit_code='max_users'              included=10   overage=$5/user
    limit_code='storage_gb'             included=1    overage=$0.50/GB
    limit_code='sessions_per_user'      included=1    overage=$2/session
    limit_code='api_calls_monthly'      included=1000 overage=$0.01/call

Scope:
    per_org=True  → limit applies to the entire organization (e.g., max_users, storage_gb)
    per_org=False → limit applies per user (e.g., sessions_per_user)
"""

from __future__ import annotations

import uuid

from django.db import models

from apps.billing.models.plan import Plan


class PlanLimit(models.Model):
    """A quota or limit included with a plan, with overage pricing."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="limits",
    )
    limit_code = models.CharField(
        max_length=50,
        help_text="Identifier for this limit (e.g., 'max_users', 'storage_gb', 'sessions_per_user').",
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        help_text="Human-readable description of what this limit controls.",
    )

    # --- Quota ---
    included_quantity = models.DecimalField(
        max_digits=15,
        decimal_places=4,
        default=0,
        help_text="Quantity included in the plan at no extra cost.",
    )
    max_quantity = models.DecimalField(
        max_digits=15,
        decimal_places=4,
        null=True,
        blank=True,
        help_text="Hard cap. Null = no hard limit (unlimited overage allowed).",
    )

    # --- Overage pricing ---
    price_per_extra = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=0,
        help_text="Cost per unit above included_quantity per billing period.",
    )

    # --- Scope ---
    per_org = models.BooleanField(
        default=True,
        help_text="True = org-wide limit (e.g., total storage). False = per-user limit (e.g., sessions).",
    )

    class Meta:
        db_table = "billing_plan_limit"
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "limit_code"],
                name="unique_limit_per_plan",
            ),
        ]
        ordering = ["limit_code"]

    def __str__(self) -> str:
        scope = "org" if self.per_org else "user"
        return f"{self.plan.slug}:{self.limit_code} ({scope}) — {self.included_quantity} included"
