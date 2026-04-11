"""
Stripe Checkout Session — entry point for signup with payment.

Flow:
    POST /api/v1/billing/checkout-session/  with org creation payload
      → server validates the slug, creates a Stripe Checkout Session
        with all subscription line items + trial window + payment-method
        collection + the org creation metadata embedded
      → returns { url }
    Frontend redirects to `url`
    User enters card, Stripe starts the trial subscription
    Stripe sends `checkout.session.completed` webhook
      → our handler creates the Organization, Membership, Subscription,
        Owner role, default CompanySettings/Theme, and attaches the
        Stripe IDs on the Subscription row
    Frontend, meanwhile, polls /api/v1/billing/checkout-session/{id}/
    Once the org exists it redirects into it.

We create a Stripe Customer here (not in the webhook) so we can set
`customer_email` and `metadata` on it — the webhook just retrieves the
already-created records by ID.
"""

from __future__ import annotations

import logging
from typing import Any

import stripe
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.billing.models import BillingConfig
from apps.billing.serializers import CheckoutSessionRequestSerializer
from apps.billing.stripe_client import StripeError, get_stripe, stripe_to_dict
from apps.organizations.models import Organization
from apps.organizations.services.organization import validate_slug

logger = logging.getLogger(__name__)


class CheckoutSessionView(APIView):
    """POST /api/v1/billing/checkout-session/ — start the signup checkout flow."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = CheckoutSessionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Pre-validate the org slug so the user doesn't pay only to find
        # out the slug is taken.
        slug_error = validate_slug(data["slug"])
        if slug_error:
            return Response({"detail": slug_error}, status=status.HTTP_400_BAD_REQUEST)

        cfg = BillingConfig.load()
        if not all(
            [
                cfg.stripe_product_id,
                cfg.stripe_base_price_id,
                cfg.stripe_user_metered_price_id,
                cfg.stripe_storage_price_id,
            ]
        ):
            return Response(
                {
                    "detail": "stripe_not_synced",
                    "message": ("Run `manage.py sync_billing_to_stripe` before allowing new subscriptions."),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Build the success/cancel URLs. Frontend handles whatever query
        # params we append.
        origin = request.headers.get("Origin") or request.headers.get("Referer") or ""
        origin = origin.rstrip("/")
        success_url = data.get("success_url") or f"{origin}/onboarding/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = data.get("cancel_url") or f"{origin}/onboarding/cancel"

        try:
            get_stripe()

            customer = stripe.Customer.create(
                email=request.user.email,
                name=data["name"],
                metadata={
                    "vita_managed": "true",
                    "vita_user_id": str(request.user.id),
                    "vita_org_slug": data["slug"],
                },
            )

            checkout_session = stripe.checkout.Session.create(
                mode="subscription",
                customer=customer.id,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price": cfg.stripe_base_price_id,
                        "quantity": 1,
                    },
                    {
                        # User licensing line — quantity is in pence. Stripe
                        # rejects quantity=0 at Checkout creation, so we
                        # start at 1 (a single penny, invoiced as £0.01).
                        # During the 14-day trial nothing is charged anyway,
                        # and the daily reconciler bumps this to the real
                        # user cost once the org is provisioned.
                        "price": cfg.stripe_user_metered_price_id,
                        "quantity": 1,
                    },
                    # NOTE: storage line is DEFERRED — Stripe rejects
                    # quantity=0 at Checkout, and the included 10 GB comes
                    # with the base fee. The storage subscription item is
                    # added on demand the first time a user raises their
                    # quota above the minimum (see StorageQuotaUpdateView).
                ],
                subscription_data={
                    "trial_period_days": cfg.trial_duration_days,
                    "metadata": {
                        "vita_managed": "true",
                        "vita_user_id": str(request.user.id),
                        "vita_org_slug": data["slug"],
                        "vita_org_name": data["name"],
                        "vita_org_industry": data.get("industry", ""),
                        "vita_org_country": data.get("country", ""),
                        "vita_org_timezone": data.get("timezone", "UTC"),
                        "vita_org_base_currency": data.get("base_currency", "GBP"),
                    },
                },
                payment_method_collection="always",
                automatic_tax={"enabled": True},
                tax_id_collection={"enabled": True},
                customer_update={"address": "auto", "name": "auto"},
                allow_promotion_codes=True,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "vita_managed": "true",
                    "vita_user_id": str(request.user.id),
                    "vita_org_slug": data["slug"],
                },
            )
        except StripeError as exc:
            logger.exception("Failed to create checkout session for user %s", request.user.id)
            return Response(
                {"detail": "stripe_error", "message": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "url": checkout_session.url,
                "session_id": checkout_session.id,
            }
        )


class CheckoutSessionStatusView(APIView):
    """GET /api/v1/billing/checkout-session/{session_id}/ — poll for org creation.

    After the user completes payment at Stripe Checkout, the success page
    polls this endpoint until the webhook handler has finished
    provisioning the org. Returns one of:
        - pending   — webhook hasn't arrived yet
        - ready     — org exists; payload includes slug for redirect
        - failed    — webhook reported an error
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, session_id: str) -> Response:
        # Look up the org via the metadata we embedded. The webhook handler
        # writes the org with a link back to the user_id + slug so we can
        # find it without storing the session ID on the org itself.
        try:
            get_stripe()
            session = stripe.checkout.Session.retrieve(session_id)
        except StripeError as exc:
            return Response(
                {"detail": "stripe_error", "message": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Convert the whole session to a plain dict at the boundary so
        # we can use dict operations on its nested fields (metadata,
        # status, etc.) without tripping on StripeObject's quirks.
        session_dict = stripe_to_dict(session)
        metadata: dict[str, Any] = session_dict.get("metadata") or {}

        if metadata.get("vita_user_id") != str(request.user.id):
            return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

        slug = metadata.get("vita_org_slug") or ""
        org = Organization.objects.filter(slug=slug).first() if slug else None
        if org is not None:
            return Response({"status": "ready", "slug": org.slug, "org_id": str(org.id)})

        session_status = session_dict.get("status") or ""
        if session_status == "complete":
            # Stripe says complete but we don't have the org yet — webhook
            # is likely in flight. Client should keep polling briefly.
            return Response({"status": "pending"})
        if session_status == "expired":
            return Response({"status": "failed", "reason": "session_expired"})
        return Response({"status": "pending"})
