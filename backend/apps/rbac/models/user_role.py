"""
UserRole — assigns a role to a user within an organization.

Lives in the ORG DATABASE. References the central DB User by UUID only —
no ForeignKey across databases. This clean boundary makes it trivial
to extract RBAC into a standalone microservice later.
"""

from __future__ import annotations

import uuid

from django.db import models


class UserRole(models.Model):
    """Maps a user to a role within this organization."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user_id = models.UUIDField(
        help_text="References accounts.User.id in the central DB.",
    )
    role = models.ForeignKey(
        "rbac.Role",
        on_delete=models.CASCADE,
        related_name="user_assignments",
    )
    assigned_by = models.UUIDField(
        null=True,
        blank=True,
        help_text="User ID of who granted this role.",
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "rbac_user_role"
        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "role"],
                name="unique_user_role",
            ),
        ]
        indexes = [
            models.Index(fields=["user_id"]),
        ]
        ordering = ["-assigned_at"]

    def __str__(self) -> str:
        return f"{self.user_id} → {self.role.name}"
