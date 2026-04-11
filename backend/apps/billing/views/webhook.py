"""
Stripe webhook receiver — idempotent processor for subscription lifecycle.

Stripe delivers events with a signature header we MUST verify to prove
the payload actually came from Stripe. The same event may arrive multiple
times (retries, multi-region failover) so every event is logged to
`BillingEvent` with a unique constraint on `stripe_event_id` — a second
delivery short-circuits before any side effect runs.

Events we handle:
    checkout.session.completed         → create the Org + Subscription
    customer.subscription.updated      → sync status, period dates
    customer.subscription.deleted      → mark canceled
    customer.subscription.trial_will_end  → (log only for now, frontend
                                             shows banner from trial_end)
    invoice.paid                       → mark active (unlock after past_due)
    invoice.payment_failed             → mark past_due

Non-handled event types are logged and marked `skipped` so re-sync can
replay them from the audit table if we add a handler later.
"""

from __future__ import annotations

import json
import logging
from datetime import UTC, datetime
from typing import Any

import stripe
from django.conf import settings
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from apps.billing.constants import (
    SUB_STATUS_ACTIVE,
    SUB_STATUS_CANCELED,
    SUB_STATUS_PAST_DUE,
    SUB_STATUS_TRIALING,
)
from apps.billing.models import BillingEvent, Subscription
from apps.billing.services.subscription_provisioning import (
    create_org_from_checkout,
)
from apps.billing.stripe_client import SignatureVerificationError

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(View):
    """POST /webhooks/stripe/ — Stripe event receiver."""

    def post(self, request: HttpRequest) -> HttpResponse:
        payload = request.body
        signature = request.headers.get("Stripe-Signature", "")
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        if not webhook_secret:
            logger.error("STRIPE_WEBHOOK_SECRET is not configured")
            return JsonResponse({"detail": "webhook_not_configured"}, status=503)

        try:
            # Signature verification is a pure HMAC check — it doesn't
            # need STRIPE_SECRET_KEY configured, only STRIPE_WEBHOOK_SECRET.
            # Outbound calls in individual handlers will configure the
            # SDK lazily via `get_stripe()` when needed.
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                webhook_secret,
            )
        except ValueError:
            logger.warning("Webhook payload is not valid JSON")
            return JsonResponse({"detail": "invalid_payload"}, status=400)
        except SignatureVerificationError:
            logger.warning("Webhook signature verification failed")
            return JsonResponse({"detail": "invalid_signature"}, status=400)

        event_id = event["id"]
        event_type = event["type"]
        # Parse the raw JSON bytes directly into a plain Python dict.
        # Stripe SDK v15 `StripeObject` doesn't support a generic dict
        # conversion — no `to_dict_recursive`, and `dict(obj)` iterates
        # via `__getitem__` with integer keys which raises KeyError.
        # Signature was already verified above, so the payload is trusted.
        raw_payload = json.loads(payload.decode("utf-8"))

        # Idempotency — has this event already been processed?
        existing = BillingEvent.objects.filter(stripe_event_id=event_id).first()
        if existing is not None and existing.status == BillingEvent.STATUS_PROCESSED:
            return JsonResponse({"detail": "already_processed"}, status=200)
        # Replay path: existing event in received/failed — fall through to
        # the handler so operators can re-fire webhooks from the Stripe
        # dashboard to retry failed processing.

        event_row = existing or BillingEvent.objects.create(
            stripe_event_id=event_id,
            event_type=event_type,
            payload=raw_payload,
            status=BillingEvent.STATUS_RECEIVED,
        )

        try:
            # `raw_payload` is a fully-nested plain Python dict. Pass that
            # to the handlers (not `event["data"]["object"]`, which is a
            # Stripe SDK v15 `StripeObject` that doesn't support the dict
            # `.get()` method our handlers use).
            self._dispatch(event_type, raw_payload["data"]["object"], event_row)
        except Exception as exc:
            logger.exception("Webhook handler failed for event %s", event_id)
            event_row.status = BillingEvent.STATUS_FAILED
            event_row.error_message = f"{type(exc).__name__}: {exc}"
            event_row.save(update_fields=["status", "error_message"])
            # Return 500 so Stripe retries.
            return JsonResponse({"detail": "handler_error"}, status=500)

        if event_row.status == BillingEvent.STATUS_RECEIVED:
            event_row.status = BillingEvent.STATUS_SKIPPED
            event_row.save(update_fields=["status", "processed_at"])

        return JsonResponse({"received": True})

    # ── Dispatch ──────────────────────────────────────────────────────────

    def _dispatch(self, event_type: str, event_object: Any, event_row: BillingEvent) -> None:
        if event_type == "checkout.session.completed":
            self._handle_checkout_completed(event_object, event_row)
        elif event_type in (
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
        ):
            self._handle_subscription_lifecycle(event_object, event_row)
        elif event_type == "customer.subscription.trial_will_end":
            self._mark_processed(event_row)
            logger.info("Trial ending soon for subscription %s", event_object.get("id"))
        elif event_type == "invoice.paid":
            self._handle_invoice_paid(event_object, event_row)
        elif event_type == "invoice.payment_failed":
            self._handle_invoice_failed(event_object, event_row)
        # Any other event type falls through and stays as 'received' →
        # _mark_skipped in the caller.

    # ── Handlers ──────────────────────────────────────────────────────────

    def _handle_checkout_completed(self, session: Any, event_row: BillingEvent) -> None:
        metadata: dict[str, Any] = dict(session.get("metadata") or {})
        slug = metadata.get("vita_org_slug")
        if not slug:
            logger.warning("checkout.session.completed has no vita_org_slug — ignoring")
            self._mark_processed(event_row)
            return

        # NOTE: no outer `transaction.atomic()` here.
        # `create_org_from_checkout` manages its own atomic block for the
        # central-DB writes (Org + Membership + Subscription) and then
        # runs DDL (`CREATE DATABASE` for the tenant DB) which requires
        # the connection to be in autocommit mode — impossible if we're
        # inside an enclosing transaction.
        subscription = create_org_from_checkout(
            session_id=session["id"],
            stripe_customer_id=session.get("customer", ""),
            stripe_subscription_id=session.get("subscription", ""),
            metadata=metadata,
        )

        if subscription is not None:
            event_row.subscription = subscription
            event_row.save(update_fields=["subscription"])
        self._mark_processed(event_row)

    def _handle_subscription_lifecycle(self, stripe_sub: Any, event_row: BillingEvent) -> None:
        stripe_sub_id = stripe_sub.get("id") or ""
        subscription = Subscription.objects.filter(stripe_subscription_id=stripe_sub_id).first()
        if subscription is None:
            # Lifecycle events can arrive before checkout.session.completed
            # on rare occasions. Leave as received so it will be replayed.
            logger.info("Subscription %s not yet in local DB, deferring", stripe_sub_id)
            return

        # Status + period dates
        subscription.status = stripe_sub.get("status", subscription.status)
        subscription.current_period_start = _from_stripe_ts(stripe_sub.get("current_period_start"))
        subscription.current_period_end = _from_stripe_ts(stripe_sub.get("current_period_end"))
        subscription.trial_start = _from_stripe_ts(stripe_sub.get("trial_start"))
        subscription.trial_end = _from_stripe_ts(stripe_sub.get("trial_end"))
        subscription.cancel_at_period_end = bool(stripe_sub.get("cancel_at_period_end"))
        if stripe_sub.get("canceled_at"):
            subscription.canceled_at = _from_stripe_ts(stripe_sub.get("canceled_at"))
        elif stripe_sub.get("status") == SUB_STATUS_CANCELED:
            subscription.canceled_at = timezone.now()

        # Subscription items — keep stripe_*_item_id fields in sync
        items = (stripe_sub.get("items") or {}).get("data") or []
        for item in items:
            price = (item.get("price") or {}).get("id") or ""
            lookup_key = (item.get("price") or {}).get("lookup_key") or ""
            if lookup_key == "vita_base_monthly":
                subscription.stripe_base_item_id = item.get("id", "")
            elif lookup_key == "vita_user_metered_monthly":
                subscription.stripe_user_item_id = item.get("id", "")
            elif lookup_key == "vita_storage_gb_monthly":
                subscription.stripe_storage_item_id = item.get("id", "")
            else:
                logger.debug("Unmapped subscription item price=%s lookup=%s", price, lookup_key)

        subscription.save()

        event_row.subscription = subscription
        event_row.save(update_fields=["subscription"])
        self._mark_processed(event_row)

    def _handle_invoice_paid(self, invoice: Any, event_row: BillingEvent) -> None:
        sub_id = invoice.get("subscription") or ""
        if not sub_id:
            self._mark_processed(event_row)
            return

        subscription = Subscription.objects.filter(stripe_subscription_id=sub_id).first()
        if subscription is not None:
            # Any successful payment clears past_due.
            if subscription.status == SUB_STATUS_PAST_DUE:
                subscription.status = SUB_STATUS_ACTIVE
                subscription.save(update_fields=["status", "updated_at"])
            elif subscription.status == SUB_STATUS_TRIALING:
                # First charge after trial → move to active.
                subscription.status = SUB_STATUS_ACTIVE
                subscription.save(update_fields=["status", "updated_at"])
            event_row.subscription = subscription
            event_row.save(update_fields=["subscription"])
        self._mark_processed(event_row)

    def _handle_invoice_failed(self, invoice: Any, event_row: BillingEvent) -> None:
        sub_id = invoice.get("subscription") or ""
        if not sub_id:
            self._mark_processed(event_row)
            return

        subscription = Subscription.objects.filter(stripe_subscription_id=sub_id).first()
        if subscription is not None:
            subscription.status = SUB_STATUS_PAST_DUE
            subscription.save(update_fields=["status", "updated_at"])
            event_row.subscription = subscription
            event_row.save(update_fields=["subscription"])
        self._mark_processed(event_row)

    # ── Helpers ───────────────────────────────────────────────────────────

    def _mark_processed(self, event_row: BillingEvent) -> None:
        event_row.status = BillingEvent.STATUS_PROCESSED
        event_row.processed_at = timezone.now()
        event_row.save(update_fields=["status", "processed_at"])


def _from_stripe_ts(ts: int | None) -> Any:
    """Convert a Stripe Unix timestamp to an aware datetime, or None."""
    if ts is None:
        return None
    return datetime.fromtimestamp(int(ts), tz=UTC)
