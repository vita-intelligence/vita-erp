"""Tests for the Stripe webhook receiver.

Signature verification is stubbed by patching `stripe.Webhook.construct_event`
to return a pre-built event dict. This lets us exercise the full idempotency
+ dispatch path without real Stripe credentials or network access.
"""

from __future__ import annotations

import json
from unittest.mock import patch

import pytest
from django.test import override_settings
from rest_framework.test import APIClient

from apps.billing.constants import SUB_STATUS_ACTIVE, SUB_STATUS_PAST_DUE, SUB_STATUS_TRIALING
from apps.billing.models import BillingEvent
from apps.organizations.tests.factories import OrganizationFactory

WEBHOOK_URL = "/webhooks/stripe/"


@pytest.fixture()
def client() -> APIClient:
    return APIClient()


def _build_event(event_type: str, data_object: dict, event_id: str = "evt_test_123") -> dict:
    return {
        "id": event_id,
        "type": event_type,
        "data": {"object": data_object},
    }


def _post_event(client: APIClient, evt: dict):
    """Post an event to the webhook endpoint, serializing the event dict
    as the request body so the view's `json.loads(payload)` matches the
    structure the signature-verification mock returns."""
    return client.post(
        WEBHOOK_URL,
        data=json.dumps(evt).encode("utf-8"),
        content_type="application/json",
    )


@pytest.mark.django_db
class TestWebhookIdempotency:
    def test_duplicate_event_short_circuits(self, client: APIClient) -> None:
        with override_settings(STRIPE_WEBHOOK_SECRET="whsec_test"):
            evt = _build_event(
                "customer.subscription.trial_will_end",
                {"id": "sub_test", "status": SUB_STATUS_TRIALING},
                event_id="evt_dup_1",
            )
            with patch("stripe.Webhook.construct_event", return_value=evt):
                first = _post_event(client, evt)
                second = _post_event(client, evt)

        assert first.status_code == 200
        assert second.status_code == 200
        assert BillingEvent.objects.filter(stripe_event_id="evt_dup_1").count() == 1


@pytest.mark.django_db
class TestSignatureVerification:
    def test_missing_webhook_secret_returns_503(self, client: APIClient) -> None:
        with override_settings(STRIPE_WEBHOOK_SECRET=""):
            response = client.post(WEBHOOK_URL, data=b"{}", content_type="application/json")
        assert response.status_code == 503

    def test_invalid_signature_returns_400(self, client: APIClient) -> None:
        from stripe import SignatureVerificationError

        with (
            override_settings(STRIPE_WEBHOOK_SECRET="whsec_test"),
            patch(
                "stripe.Webhook.construct_event",
                side_effect=SignatureVerificationError("bad sig", ""),
            ),
        ):
            response = client.post(WEBHOOK_URL, data=b"{}", content_type="application/json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestSubscriptionLifecycle:
    def test_invoice_paid_flips_past_due_to_active(self, client: APIClient) -> None:
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_PAST_DUE
        org.subscription.stripe_subscription_id = "sub_test_past"
        org.subscription.save()

        evt = _build_event(
            "invoice.paid",
            {"id": "in_test", "subscription": "sub_test_past"},
            event_id="evt_invoice_paid",
        )

        with (
            override_settings(STRIPE_WEBHOOK_SECRET="whsec_test"),
            patch("stripe.Webhook.construct_event", return_value=evt),
        ):
            response = _post_event(client, evt)

        assert response.status_code == 200
        org.subscription.refresh_from_db()
        assert org.subscription.status == SUB_STATUS_ACTIVE

    def test_invoice_payment_failed_marks_past_due(self, client: APIClient) -> None:
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_ACTIVE
        org.subscription.stripe_subscription_id = "sub_test_fail"
        org.subscription.save()

        evt = _build_event(
            "invoice.payment_failed",
            {"id": "in_fail", "subscription": "sub_test_fail"},
            event_id="evt_invoice_failed",
        )

        with (
            override_settings(STRIPE_WEBHOOK_SECRET="whsec_test"),
            patch("stripe.Webhook.construct_event", return_value=evt),
        ):
            response = _post_event(client, evt)

        assert response.status_code == 200
        org.subscription.refresh_from_db()
        assert org.subscription.status == SUB_STATUS_PAST_DUE
