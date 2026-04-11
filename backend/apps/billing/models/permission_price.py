"""
PermissionPrice — per-permission pricing for user billing.

Each (module_code, action) pair has its own monthly price. A user's total
cost is the sum of the prices of all permissions they hold across their
roles, deduplicated so the same permission held via two different roles
is only charged once.

Example:
    accounts.read    → 200p  (£2.00/mo)
    accounts.write   → 500p  (£5.00/mo)
    billing.manage   → 800p  (£8.00/mo)

A user with all three permissions costs 1500p (£15.00) per month.

Prices are platform-global (not per-plan) — there is only one plan in this
product. Rows are editable in Django admin; changes take effect on the
next billing cycle via the daily usage reporter.
"""

from __future__ import annotations

import uuid

from django.db import models


class PermissionPrice(models.Model):
    """Price for a specific (module, action) permission in pence per user per month."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    module_code = models.CharField(
        max_length=50,
        help_text="Module identifier matching apps.rbac.constants.MODULE_* (e.g., 'accounts', 'billing').",
    )
    action = models.CharField(
        max_length=30,
        help_text="Permission action matching apps.rbac.constants.ACTION_* (e.g., 'read', 'write', 'manage').",
    )
    price_pence = models.PositiveIntegerField(
        default=0,
        help_text="Monthly cost in pence when this permission is granted to a user.",
    )

    description = models.CharField(
        max_length=255,
        blank=True,
        help_text="Human-readable description shown in the billing breakdown UI.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "billing_permission_price"
        constraints = [
            models.UniqueConstraint(
                fields=["module_code", "action"],
                name="unique_permission_price",
            ),
        ]
        ordering = ["module_code", "action"]

    def __str__(self) -> str:
        return f"{self.module_code}.{self.action} → £{self.price_pence / 100:.2f}/mo"
