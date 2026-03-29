"""
PermissionPrice — per-permission pricing for user billing.

Each combination of module + action has its own monthly price.
The billing service calculates per-user cost by summing the prices
of all permissions granted to that user in the org database.

Example:
    accounting.delete  → $5.00/month
    inventory.read     → $0.50/month
    inventory.write    → $1.50/month

A user with all three permissions costs $7.00/month.
"""

from __future__ import annotations

import uuid

from django.db import models

from apps.billing.models.plan import Plan


class PermissionPrice(models.Model):
    """Platform-level price for a specific permission (module + action)."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="permission_prices",
        help_text="Prices can differ per plan (e.g., Pro has different rates than Starter).",
    )
    module_code = models.CharField(
        max_length=50,
        help_text="Module identifier (e.g., 'inventory', 'accounting').",
    )
    action = models.CharField(
        max_length=30,
        help_text="Permission action (e.g., 'read', 'write', 'delete', 'export').",
    )
    price_monthly = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        default=0,
        help_text="Monthly cost when this permission is granted to a user.",
    )

    class Meta:
        db_table = "billing_permission_price"
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "module_code", "action"],
                name="unique_permission_price_per_plan",
            ),
        ]
        ordering = ["module_code", "action"]

    def __str__(self) -> str:
        return f"{self.plan.slug}:{self.module_code}.{self.action} → {self.price_monthly}"
