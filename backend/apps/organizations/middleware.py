"""
TenantMiddleware — resolves the org database from the JWT access token.

Runs early in the middleware stack. For each request:
1. Defaults to no org context (public/shared endpoints)
2. Reads the access token from the httpOnly cookie
3. Extracts the org_id claim (present after org selection)
4. Verifies the user has an active membership for that org
5. Registers the org database and sets the contextvars
6. Cleans up after the response is sent

Requests without an org_id claim (login, register, org creation)
operate on the central database only.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken

from apps.organizations.constants import ORG_ACTIVE_STATUSES
from apps.organizations.context import clear_current_org_db, set_current_org_db
from apps.organizations.db import register_org_database

if TYPE_CHECKING:
    from django.http import HttpRequest, HttpResponse

logger = logging.getLogger(__name__)


class TenantMiddleware:
    """Sets the PostgreSQL database based on the org_id claim in the JWT."""

    def __init__(self, get_response: Callable[..., Any]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        clear_current_org_db()
        request.tenant_org = None  # type: ignore[attr-defined]
        request.tenant_db = None  # type: ignore[attr-defined]

        org = self._resolve_org(request)
        if org is not None:
            db_alias = register_org_database(org.db_name)
            set_current_org_db(db_alias)
            request.tenant_org = org  # type: ignore[attr-defined]
            request.tenant_db = db_alias  # type: ignore[attr-defined]

        try:
            response: HttpResponse = self.get_response(request)
        finally:
            clear_current_org_db()

        return response

    @staticmethod
    def _resolve_org(request: HttpRequest):
        """Extract org_id from JWT and verify membership.

        Returns the Organization instance if valid, None otherwise.
        """
        raw_token = request.COOKIES.get(settings.VITA_ACCESS_COOKIE)
        if not raw_token:
            return None

        try:
            token = AccessToken(raw_token)  # type: ignore[arg-type]
        except Exception:
            return None

        org_id = token.get("org_id")
        if not org_id:
            return None

        try:
            from apps.organizations.models import Membership, Organization

            org = Organization.objects.filter(
                id=org_id,
                status__in=ORG_ACTIVE_STATUSES,
            ).first()

            if org is None:
                logger.warning("JWT org_id=%s references inactive or missing org", org_id)
                return None

            user_id = token.get("user_id")
            has_membership = Membership.objects.filter(
                user_id=user_id,
                organization=org,
                is_active=True,
            ).exists()

            if not has_membership:
                logger.warning(
                    "User %s has no active membership for org %s",
                    user_id,
                    org_id,
                )
                return None

            return org

        except Exception:
            logger.exception("Failed to resolve tenant for org_id=%s", org_id)
            return None
