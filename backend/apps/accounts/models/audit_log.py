"""
Auth audit log — immutable record of platform-level authentication events.

Logged here (central DB): login, logout, password change, email change,
failed attempts, session revocation, account registration.

NOT logged here (org DB): 2FA events, profile changes, business actions.
Those live in the org's own activity log.

Append-only — rows are never updated or deleted (compliance requirement).
"""

from __future__ import annotations

import uuid

from django.db import models


class AuditLog(models.Model):
    """Immutable log entry for an auth event."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="audit_logs",
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
        # No update/delete permissions — append-only by convention
        # (enforced in service layer, not at DB level)

    def __str__(self) -> str:
        return f"{self.user.email} — {self.action} — {self.created_at}"
