"""
Platform audit log — immutable record of all central DB events.

Covers: authentication, organization lifecycle, billing, membership changes.
Append-only — rows are never updated or deleted (compliance requirement).
Supports ISO, BRCGS, GDPR, HIPAA audit trail requirements.

Org-level events (RBAC changes, business actions) are logged in the
org database via apps.audit.AuditLog instead.

Migration note: this model uses db_table="accounts_audit_log" to preserve
the existing table created by apps.accounts.migrations.0001_initial.
"""

from __future__ import annotations

import uuid

from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    """Immutable log entry for a platform-level event."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="platform_audit_logs",
    )

    # What happened — plain string, not an enum (extensible)
    action = models.CharField(max_length=50)

    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # Optional details — what changed (e.g., old email → new email)
    metadata = models.JSONField(default=dict, blank=True)

    # When
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_audit_log"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "action"]),
            models.Index(fields=["action"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.user_id} — {self.action} — {self.created_at}"
