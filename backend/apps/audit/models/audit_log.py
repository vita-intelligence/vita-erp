"""
Org-level audit log — immutable record of actions within an organization.

Lives in the ORG DATABASE. Every org has its own audit trail, fully isolated.
Used by RBAC, company settings, inventory, production — all org-level apps.

Append-only — rows are never updated or deleted (compliance requirement).
Supports ISO, BRCGS, GDPR, HIPAA audit trail requirements.

Cross-DB note: user_id and performed_by are UUIDFields referencing the
central DB User model. No ForeignKey across databases.
"""

from __future__ import annotations

import uuid

from django.db import models


class AuditLog(models.Model):
    """Immutable log entry for an action within an organization."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    # Who performed the action (central DB User, no FK)
    user_id = models.UUIDField(
        help_text="References accounts.User.id in the central DB.",
    )

    # What happened
    action = models.CharField(
        max_length=50,
        help_text="Action identifier (e.g., 'role_created', 'item_updated').",
    )

    # What was affected
    entity_type = models.CharField(
        max_length=100,
        blank=True,
        help_text="Model or entity type (e.g., 'Role', 'Item', 'ManufacturingOrder').",
    )
    entity_id = models.CharField(
        max_length=50,
        blank=True,
        help_text="Primary key of the affected record.",
    )

    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # Details — what changed (e.g., old/new values, additional context)
    metadata = models.JSONField(default=dict, blank=True)

    # When
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_log"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user_id"]),
            models.Index(fields=["action"]),
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user_id} — {self.action} — {self.created_at}"
