"""
Auth session — tracks refresh tokens and devices.

Each login creates a session. The refresh token hash is stored here
so it can be revoked (logout, "log out all devices", theft detection).
Users can see and manage their active sessions in security settings.
"""

from __future__ import annotations

import uuid

from django.db import models


class Session(models.Model):
    """A logged-in session — one per device/browser."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="sessions",
    )

    # Refresh token — stored as hash, never plaintext
    refresh_token_hash = models.CharField(max_length=255)

    # Device identification
    device_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Parsed from user agent, e.g. 'Chrome on MacOS'.",
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # Lifecycle
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "accounts_session"
        ordering = ["-last_used_at"]

    def __str__(self) -> str:
        status = "active" if self.is_active else "revoked"
        return f"{self.user.email} — {self.device_name or 'Unknown'} — {status}"
