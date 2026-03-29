"""
Role and RolePermission — org-level RBAC.

These models live in the ORG DATABASE, not the central DB.
Each organization defines its own roles and permissions.

Only the Owner role is auto-created and marked as is_system=True.
All other roles are created by org admins with whatever permissions
they choose. The billing service uses these permissions to calculate
per-user cost via PermissionPrice in the central DB.

Cross-DB note: No ForeignKey to the central DB User model.
User references use UUIDField only (see UserRole).
"""

from __future__ import annotations

import uuid

from django.db import models

from apps.rbac.constants import ACTION_CHOICES


class Role(models.Model):
    """A named role within an organization (e.g., Owner, Production Manager)."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(
        max_length=100,
        help_text="Display name (e.g., 'Owner', 'Warehouse Staff').",
    )
    description = models.TextField(blank=True)
    is_system = models.BooleanField(
        default=False,
        help_text="System roles (Owner) cannot be deleted or renamed.",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rbac_role"
        ordering = ["-is_system", "name"]

    def __str__(self) -> str:
        return self.name


class RolePermission(models.Model):
    """A single permission granted to a role: module + action.

    Each row represents one permission (e.g., inventory.write).
    The billing service counts these per user to calculate cost
    via PermissionPrice in the central DB.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="permissions",
    )
    module_code = models.CharField(
        max_length=50,
        help_text="Module identifier (e.g., 'inventory', 'production').",
    )
    action = models.CharField(
        max_length=30,
        choices=ACTION_CHOICES,
        help_text="Permission action (read, write, delete, export).",
    )

    class Meta:
        db_table = "rbac_role_permission"
        constraints = [
            models.UniqueConstraint(
                fields=["role", "module_code", "action"],
                name="unique_permission_per_role",
            ),
        ]
        ordering = ["module_code", "action"]

    def __str__(self) -> str:
        return f"{self.role.name}: {self.module_code}.{self.action}"
