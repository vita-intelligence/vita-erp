"""
Add-on endpoints — list purchasable add-ons and toggle them on a subscription.

Recurring add-ons map to a Stripe Subscription Item appended to the org's
existing subscription. One-time add-ons map to a Stripe Invoice Item
attached to the next invoice (not yet implemented — needs a separate
flow because one-time items don't live on the subscription).
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

from apps.billing.models import AddOn, Subscription, SubscriptionAddOn
from apps.billing.serializers import AddOnSerializer
from apps.billing.stripe_client import StripeError, get_stripe
from apps.organizations.permissions import HasOrgContext
from apps.rbac.constants import MODULE_BILLING
from apps.rbac.permissions import HasModulePermission

logger = logging.getLogger(__name__)


class AddOnListView(APIView):
    """GET /api/v1/billing/addons/ — list available add-ons."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        subscription = getattr(org, "subscription", None)
        active_slugs: set[str] = set()
        if subscription is not None:
            active_slugs = set(
                SubscriptionAddOn.objects.filter(subscription=subscription).values_list("add_on__slug", flat=True),
            )

        addons = AddOn.objects.filter(is_active=True).order_by("name")
        payload: list[dict[str, Any]] = []
        for addon in addons:
            data = AddOnSerializer(addon).data
            data["is_active_on_subscription"] = addon.slug in active_slugs
            payload.append(data)
        return Response({"data": payload})


class SubscriptionAddOnToggleView(APIView):
    """POST /api/v1/billing/addons/{slug}/toggle/ — activate or deactivate."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"POST": "manage"}

    def post(self, request: Request, slug: str) -> Response:
        org = request.tenant_org
        subscription: Subscription | None = getattr(org, "subscription", None)
        if subscription is None or not subscription.stripe_subscription_id:
            return Response({"detail": "no_subscription"}, status=status.HTTP_400_BAD_REQUEST)

        addon = AddOn.objects.filter(slug=slug, is_active=True).first()
        if addon is None:
            return Response({"detail": "addon_not_found"}, status=status.HTTP_404_NOT_FOUND)

        if addon.billing_type == AddOn.BILLING_TYPE_ONE_TIME:
            return Response(
                {"detail": "one_time_addons_not_supported_yet"},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )

        existing = SubscriptionAddOn.objects.filter(subscription=subscription, add_on=addon).first()
        try:
            get_stripe()
            if existing is not None:
                # Deactivate — remove the subscription item.
                if existing.stripe_subscription_item_id:
                    stripe.SubscriptionItem.delete(existing.stripe_subscription_item_id)
                existing.delete()
                return Response({"status": "removed"})

            # Activate — append a subscription item for this addon's Price.
            if not addon.stripe_price_id:
                return Response(
                    {"detail": "addon_not_synced_to_stripe"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            new_item = stripe.SubscriptionItem.create(
                subscription=subscription.stripe_subscription_id,
                price=addon.stripe_price_id,
                quantity=1,
                proration_behavior="create_prorations",
            )
            SubscriptionAddOn.objects.create(
                subscription=subscription,
                add_on=addon,
                stripe_subscription_item_id=new_item.id,
            )
            return Response({"status": "added"})
        except StripeError as exc:
            logger.exception("Stripe error toggling addon %s for org %s", slug, org.slug)
            return Response(
                {"detail": "stripe_error", "message": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
