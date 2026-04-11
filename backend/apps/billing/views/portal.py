"""
Stripe Customer Portal — one endpoint that hands the user a hosted URL.

The Customer Portal is Stripe's fully-branded self-serve page for
payment-method updates, invoice download, and subscription cancellation.
We send users there for everything payment-related so we don't have to
rebuild PCI-compliant card forms inside our app.

Flow:
    POST /api/v1/billing/customer-portal/ → returns { url }
    Frontend redirects the user to `url`; they do what they need; on
    return they land at the configured `return_url` (the Billing tab).
"""

from __future__ import annotations

import stripe
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.billing.stripe_client import StripeError, get_stripe
from apps.organizations.permissions import HasOrgContext
from apps.rbac.constants import MODULE_BILLING
from apps.rbac.permissions import HasModulePermission


class CustomerPortalView(APIView):
    """POST /api/v1/billing/customer-portal/ — returns a Stripe Portal URL.

    The Portal session only lives for a few minutes; clients must call
    this endpoint each time they want to redirect, not cache the URL.
    """

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"POST": "manage"}

    def post(self, request: Request) -> Response:
        org = request.tenant_org
        if not org.stripe_customer_id:
            return Response(
                {"detail": "no_stripe_customer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return_url = request.data.get("return_url") or self._default_return_url(request)

        try:
            get_stripe()
            session = stripe.billing_portal.Session.create(
                customer=org.stripe_customer_id,
                return_url=return_url,
            )
        except StripeError as exc:
            return Response(
                {"detail": "stripe_error", "message": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"url": session.url})

    @staticmethod
    def _default_return_url(request: Request) -> str:
        # Sensible default — the Billing tab in settings. The frontend can
        # override by passing `return_url` in the POST body.
        origin = request.headers.get("Origin") or request.headers.get("Referer") or ""
        if origin:
            return origin.rstrip("/") + "/settings#billing"
        return "/settings#billing"
