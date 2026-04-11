"""
Billing enforcement middleware.

Two guards run on every request after TenantMiddleware has resolved the
org context:

1. SubscriptionStatusMiddleware — blocks all write methods (POST/PUT/
   PATCH/DELETE) when the org's subscription is not in a paying state
   (trialing / active). Read traffic is always allowed so users can still
   view their Billing tab to fix the problem.

2. StorageQuotaMiddleware — blocks writes when the org's database size has
   exceeded the paid storage quota. The user sees a 402 Payment Required
   response with error code `storage_quota_exceeded` and is prompted in
   the UI to raise their quota in Billing settings.

Both middlewares whitelist billing endpoints (so the user can always pay,
upgrade storage, or view their breakdown) and skip unauthenticated /
non-tenant requests entirely.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import TYPE_CHECKING

from django.http import HttpRequest, HttpResponse, JsonResponse

from apps.billing.constants import SUB_ACCESSIBLE_STATUSES
from apps.billing.services.usage import is_storage_quota_exceeded

if TYPE_CHECKING:
    from apps.organizations.models import Organization

logger = logging.getLogger(__name__)

# Paths that are always allowed through both guards, even for locked orgs.
# Users must always be able to pay, upgrade, and view their billing state.
BILLING_ALLOWED_PATHS = (
    "/api/v1/billing/",
    "/webhooks/stripe/",
    "/api/v1/auth/",
    "/admin/",
)

# HTTP methods that mutate state. GET/HEAD/OPTIONS are always allowed so
# the Billing tab itself renders even when the org is locked.
WRITE_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})


def _should_skip(request: HttpRequest) -> bool:
    """True if this request is outside the enforcement scope."""
    if request.method not in WRITE_METHODS:
        return True
    path = request.path or ""
    return any(path.startswith(prefix) for prefix in BILLING_ALLOWED_PATHS)


def _resolve_org(request: HttpRequest) -> Organization | None:
    """Pull the tenant org off the request if TenantMiddleware has set it."""
    return getattr(request, "tenant_org", None)


class SubscriptionStatusMiddleware:
    """Rejects writes when the current org's subscription is not paying.

    Paying statuses are defined in `SUB_ACCESSIBLE_STATUSES` — currently
    `trialing`, `active`, and `past_due` (the last gives a grace window
    so Stripe can retry the card before we lock out).
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if _should_skip(request):
            return self.get_response(request)

        org = _resolve_org(request)
        if org is None:
            return self.get_response(request)

        subscription = getattr(org, "subscription", None)
        if subscription is None:
            logger.info("Blocking write on org %s — no subscription", org.slug)
            return JsonResponse(
                {"detail": "subscription_required"},
                status=402,
            )

        if subscription.status not in SUB_ACCESSIBLE_STATUSES:
            logger.info(
                "Blocking write on org %s — subscription status=%s",
                org.slug,
                subscription.status,
            )
            return JsonResponse(
                {
                    "detail": "subscription_inactive",
                    "status": subscription.status,
                },
                status=402,
            )

        return self.get_response(request)


class StorageQuotaMiddleware:
    """Rejects writes when the org has blown through its paid storage quota.

    The user sees 402 + `storage_quota_exceeded` and is prompted to raise
    their quota. Reads are unaffected so they can still view data and free
    up space.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if _should_skip(request):
            return self.get_response(request)

        org = _resolve_org(request)
        if org is None:
            return self.get_response(request)

        try:
            over_quota = is_storage_quota_exceeded(org)
        except Exception:
            # Never let a storage check crash the request pipeline. If the
            # check itself breaks, log and fail open — the daily reporter
            # and admin dashboard will surface the real problem.
            logger.exception("Storage quota check failed for org %s", org.slug)
            return self.get_response(request)

        if over_quota:
            logger.info("Blocking write on org %s — storage quota exceeded", org.slug)
            return JsonResponse(
                {"detail": "storage_quota_exceeded"},
                status=402,
            )

        return self.get_response(request)
