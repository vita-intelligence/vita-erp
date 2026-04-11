"""
BillingEvent — audit log and idempotency ledger for Stripe webhooks.

Every Stripe webhook we receive is recorded here before any side effect runs.
The `stripe_event_id` unique constraint lets us short-circuit duplicate
deliveries — Stripe retries indefinitely until it sees a 2xx response, and
the same event may arrive multiple times across retries or during failover.

We intentionally store the full raw payload (as JSON) so we can re-run
processing offline when a handler has a bug, and so an auditor can trace
what Stripe actually sent us at any point.
"""

from __future__ import annotations

import uuid

from django.db import models


class BillingEvent(models.Model):
    """One row per Stripe webhook delivery we have acknowledged."""

    STATUS_RECEIVED = "received"
    STATUS_PROCESSED = "processed"
    STATUS_FAILED = "failed"
    STATUS_SKIPPED = "skipped"

    STATUS_CHOICES = [
        (STATUS_RECEIVED, "Received"),
        (STATUS_PROCESSED, "Processed"),
        (STATUS_FAILED, "Failed"),
        (STATUS_SKIPPED, "Skipped"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    stripe_event_id = models.CharField(
        max_length=255,
        unique=True,
        help_text="Stripe `event.id` — used for idempotency.",
    )
    event_type = models.CharField(
        max_length=100,
        db_index=True,
        help_text="Stripe `event.type` (e.g., `customer.subscription.updated`).",
    )
    subscription = models.ForeignKey(
        "billing.Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
        help_text="Subscription this event relates to, if resolvable. Null for account-level events.",
    )
    payload = models.JSONField(
        help_text="Raw Stripe event payload.",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_RECEIVED,
        db_index=True,
    )
    error_message = models.TextField(
        blank=True,
        help_text="Populated if `status=failed`. Used to retry or debug.",
    )

    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "billing_event"
        ordering = ["-received_at"]
        indexes = [
            models.Index(fields=["event_type", "status"]),
            models.Index(fields=["-received_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.event_type} ({self.stripe_event_id}) — {self.status}"
