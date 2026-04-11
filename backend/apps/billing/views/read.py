"""
Read-only billing endpoints — powers the Billing tab in settings.

All endpoints require an authenticated user with an active tenant org
context and the `billing:read` permission. Writing (e.g., raising storage
quota) requires `billing:write` or `billing:manage` depending on
sensitivity.
"""

from __future__ import annotations

from typing import Any

import stripe
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.billing.models import BillingConfig
from apps.billing.serializers import (
    BillingBreakdownSerializer,
    StorageQuotaUpdateSerializer,
    SubscriptionDetailSerializer,
    UsageSerializer,
)
from apps.billing.services.usage import (
    get_billing_breakdown,
    get_storage_quota_gb,
    get_storage_usage_bytes,
)
from apps.billing.stripe_client import StripeError, get_stripe
from apps.organizations.models import Membership
from apps.organizations.permissions import HasOrgContext
from apps.rbac.constants import MODULE_BILLING
from apps.rbac.permissions import HasModulePermission


class SubscriptionDetailView(APIView):
    """GET /api/v1/billing/subscription/ — current subscription state."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        subscription = getattr(org, "subscription", None)
        if subscription is None:
            return Response(
                {"detail": "no_subscription"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(SubscriptionDetailSerializer(subscription).data)


class UsageView(APIView):
    """GET /api/v1/billing/usage/ — lightweight numbers for progress bars."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        seats_used = Membership.objects.filter(organization=org, is_active=True).count()
        storage_quota_gb = get_storage_quota_gb(org)
        storage_used_bytes = get_storage_usage_bytes(org)
        storage_quota_bytes = storage_quota_gb * (1024**3)
        storage_used_percent = (storage_used_bytes / storage_quota_bytes * 100) if storage_quota_bytes else 0.0

        payload = {
            "seats_used": seats_used,
            "storage_used_bytes": storage_used_bytes,
            "storage_quota_gb": storage_quota_gb,
            "storage_quota_bytes": storage_quota_bytes,
            "storage_used_percent": round(storage_used_percent, 2),
        }
        return Response(UsageSerializer(payload).data)


class BillingBreakdownView(APIView):
    """GET /api/v1/billing/breakdown/ — full breakdown with per-user lines."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        breakdown = get_billing_breakdown(org)
        return Response(BillingBreakdownSerializer(breakdown).data)


class StorageQuotaUpdateView(APIView):
    """PATCH /api/v1/billing/storage-quota/ — raise or lower the paid quota.

    This is a user-facing control so anyone with `billing:write` can
    adjust it. Updates the local DB and the Stripe subscription item
    quantity in one transaction. Going below the `BillingConfig.storage_minimum_gb`
    floor or below the current actual usage is rejected.
    """

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"PATCH": "write"}

    def patch(self, request: Request) -> Response:
        org = request.tenant_org
        subscription = getattr(org, "subscription", None)
        if subscription is None:
            return Response({"detail": "no_subscription"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StorageQuotaUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quota_gb = int(serializer.validated_data["quota_gb"])

        cfg = BillingConfig.load()
        if quota_gb < cfg.storage_minimum_gb:
            return Response(
                {"detail": "quota_below_minimum", "minimum_gb": cfg.storage_minimum_gb},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Refuse to set the quota below actual current usage — the user
        # would be instantly locked out of writes.
        from math import ceil

        used_bytes = get_storage_usage_bytes(org)
        used_gb = max(0, ceil(used_bytes / (1024**3)))
        if quota_gb < used_gb:
            return Response(
                {"detail": "quota_below_usage", "used_gb": used_gb},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subscription.storage_quota_gb = quota_gb
        subscription.save(update_fields=["storage_quota_gb", "updated_at"])

        # Mirror the change to Stripe. The storage subscription item is
        # deferred at checkout time (Stripe rejects quantity=0 there), so
        # we may need to CREATE it on the first quota raise above the
        # minimum, MODIFY it on subsequent changes, or DELETE it if the
        # user drops back down to the included minimum.
        billable_gb = max(0, quota_gb - cfg.storage_minimum_gb)
        if subscription.stripe_subscription_id:
            try:
                get_stripe()
                if subscription.stripe_storage_item_id:
                    if billable_gb == 0:
                        # Dropped back to minimum — remove the line item.
                        stripe.SubscriptionItem.delete(
                            subscription.stripe_storage_item_id,
                            proration_behavior="create_prorations",
                        )
                        subscription.stripe_storage_item_id = ""
                        subscription.save(update_fields=["stripe_storage_item_id", "updated_at"])
                    else:
                        stripe.SubscriptionItem.modify(
                            subscription.stripe_storage_item_id,
                            quantity=billable_gb,
                            proration_behavior="create_prorations",
                        )
                elif billable_gb > 0:
                    # First raise above the minimum — create the line item.
                    new_item = stripe.SubscriptionItem.create(
                        subscription=subscription.stripe_subscription_id,
                        price=cfg.stripe_storage_price_id,
                        quantity=billable_gb,
                        proration_behavior="create_prorations",
                    )
                    subscription.stripe_storage_item_id = new_item.id
                    subscription.save(update_fields=["stripe_storage_item_id", "updated_at"])
            except StripeError as exc:
                return Response(
                    {"detail": "stripe_error", "message": str(exc)},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

        return Response(SubscriptionDetailSerializer(subscription).data)


class InvoiceListView(APIView):
    """GET /api/v1/billing/invoices/ — Stripe invoice history for this org."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_BILLING
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        if not org.stripe_customer_id:
            return Response({"data": []})

        try:
            get_stripe()
            invoices = stripe.Invoice.list(customer=org.stripe_customer_id, limit=20)
        except StripeError as exc:
            return Response(
                {"detail": "stripe_error", "message": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        data: list[dict[str, Any]] = [
            {
                "id": inv.id,
                "number": getattr(inv, "number", None),
                "status": inv.status,
                "amount_due": inv.amount_due,
                "amount_paid": inv.amount_paid,
                "currency": inv.currency,
                "created": inv.created,
                "hosted_invoice_url": getattr(inv, "hosted_invoice_url", None),
                "invoice_pdf": getattr(inv, "invoice_pdf", None),
                "period_start": inv.period_start,
                "period_end": inv.period_end,
            }
            for inv in invoices.auto_paging_iter()
            if inv.id  # defensive — skip any phantom rows Stripe may return
        ]

        return Response({"data": data})
