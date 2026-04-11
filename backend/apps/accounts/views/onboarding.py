"""
Onboarding views — admin form editor + member self-onboarding submit.

Three groups of endpoints:

  1. **Admin**: get/put the org's OnboardingForm definition. Gated by
     `accounts:write` (anyone with that permission can edit the form).
  2. **Member**: get the form + my existing responses, post a multipart
     submission with files inline. The user can always edit their own
     onboarding (`/me/`) regardless of RBAC.
  3. **Media fetch**: serve uploaded files. Dev uses `MEDIA_URL` direct
     serving via Django's static helper; prod will swap to signed S3
     URLs in a follow-up commit.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

from django.http import FileResponse, Http404
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.serializers import (
    OnboardingFormSerializer,
    OnboardingFormUpdateSerializer,
    OnboardingMeSerializer,
    UserSerializer,
)
from apps.organizations.context import (
    clear_current_org_db,
    set_current_org_db,
)
from apps.organizations.db import register_org_database
from apps.organizations.models import Membership
from apps.organizations.permissions import HasOrgContext
from apps.rbac.constants import MODULE_ACCOUNTS
from apps.rbac.permissions import HasModulePermission

logger = logging.getLogger(__name__)


def _resolve_membership(request: Request) -> Membership | None:
    """Resolve the active Membership for the request's (user, org) pair."""
    org = getattr(request, "tenant_org", None)
    if org is None:
        return None
    return (
        Membership.objects.filter(
            user=request.user,
            organization=org,
            is_active=True,
        )
        .select_related("organization")
        .first()
    )


# ── Admin: form editor ─────────────────────────────────────────────────────


class OnboardingFormView(APIView):
    """GET /api/v1/accounts/onboarding-form/  → admin reads the current form
    PUT  /api/v1/accounts/onboarding-form/  → admin replaces the definition.

    GET is gated by `accounts:read`. PUT is gated by `accounts:write`.
    Save bumps the form `version` (only if the definition actually changed)
    and triggers the post_save signal that recomputes
    `Membership.requires_onboarding` for every member of the org.
    """

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_ACCOUNTS
    rbac_action_map = {"GET": "read", "PUT": "write"}

    def get(self, request: Request) -> Response:
        from apps.org_accounts.models import OnboardingForm

        org = request.tenant_org
        db_alias = register_org_database(org.db_name)
        set_current_org_db(db_alias)
        try:
            form = OnboardingForm.objects.using(db_alias).first()
            if form is None:
                # Self-heal: seed the default form for orgs that predate
                # this feature so the admin never sees a 404.
                from apps.org_accounts.services.onboarding import seed_default_onboarding_form

                form = seed_default_onboarding_form(org, request.user.id)
            return Response(OnboardingFormSerializer(form).data)
        finally:
            clear_current_org_db()

    def put(self, request: Request) -> Response:
        from apps.org_accounts.models import OnboardingForm

        org = request.tenant_org
        serializer = OnboardingFormUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        db_alias = register_org_database(org.db_name)
        set_current_org_db(db_alias)
        try:
            form = OnboardingForm.objects.using(db_alias).first()
            if form is None:
                form = OnboardingForm(definition=serializer.validated_data["definition"])
                form.updated_by = request.user.id
                form.save(using=db_alias)
            else:
                form.definition = serializer.validated_data["definition"]
                form.updated_by = request.user.id
                form.save(using=db_alias)
            return Response(OnboardingFormSerializer(form).data)
        finally:
            clear_current_org_db()


# ── Member: self-onboarding ───────────────────────────────────────────────


class OnboardingMeView(APIView):
    """GET  /api/v1/accounts/me/onboarding/ → form + my responses
    POST /api/v1/accounts/me/onboarding/ → multipart submission.

    No RBAC gating — every member can read and submit their own onboarding.
    """

    permission_classes = [IsAuthenticated, HasOrgContext]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request: Request) -> Response:
        from apps.org_accounts.models import OnboardingForm, OnboardingSubmission

        membership = _resolve_membership(request)
        if membership is None:
            return Response({"detail": "no_membership"}, status=status.HTTP_404_NOT_FOUND)

        org = membership.organization
        db_alias = register_org_database(org.db_name)
        set_current_org_db(db_alias)
        try:
            form = OnboardingForm.objects.using(db_alias).first()
            if form is None:
                from apps.org_accounts.services.onboarding import seed_default_onboarding_form

                form = seed_default_onboarding_form(org, request.user.id)
            submission = OnboardingSubmission.objects.using(db_alias).filter(membership_id=membership.id).first()
            payload = {
                "form": OnboardingFormSerializer(form).data,
                "responses": submission.responses if submission else {},
                "requires_onboarding": membership.requires_onboarding,
                "submitted_at": submission.submitted_at if submission else None,
            }
            return Response(OnboardingMeSerializer(payload).data)
        finally:
            clear_current_org_db()

    def post(self, request: Request) -> Response:
        from apps.org_accounts.services.onboarding import submit_onboarding

        membership = _resolve_membership(request)
        if membership is None:
            return Response({"detail": "no_membership"}, status=status.HTTP_404_NOT_FOUND)

        # The frontend posts a multipart body with:
        #   - `responses`: JSON-encoded string of the form responses
        #   - `file:<field_name>`: one binary part per file/image field
        responses = self._extract_responses(request)
        files = self._extract_files(request)

        try:
            submit_onboarding(
                membership=membership,
                responses=responses,
                files=files,
            )
        except Exception:
            logger.exception("Failed to submit onboarding for membership %s", membership.id)
            return Response(
                {"detail": "submission_failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Return refreshed user so the client can drop the OnboardingRequired
        # blocker without a full reload.
        membership.refresh_from_db()
        request.user.refresh_from_db()
        return Response(UserSerializer(request.user).data)

    @staticmethod
    def _extract_responses(request: Request) -> dict[str, Any]:
        raw = request.data.get("responses")
        if raw is None:
            return {}
        if isinstance(raw, dict):
            return dict(raw)
        if isinstance(raw, str):
            import json as _json

            try:
                parsed = _json.loads(raw)
                return dict(parsed) if isinstance(parsed, dict) else {}
            except _json.JSONDecodeError:
                return {}
        return {}

    @staticmethod
    def _extract_files(request: Request) -> dict[str, Any]:
        """Pull file uploads keyed by their form field name.

        Convention: every file part is named `file:<field_name>` so the
        backend doesn't need a separate metadata blob to map uploads to
        form fields. The frontend wrapper component builds the FormData
        with that key shape.
        """
        files: dict[str, Any] = {}
        for key, value in request.FILES.items():
            if key.startswith("file:"):
                field_name = key[5:]
                if field_name:
                    files[field_name] = value
        return files


# ── Media fetch ────────────────────────────────────────────────────────────


class UserMediaAssetView(APIView):
    """GET /api/v1/accounts/media/{asset_id}/ — fetch one uploaded file.

    Permission: the requesting user must own the asset OR have
    `accounts:read` for the org. Dev streams the file directly via
    Django's `FileResponse`. Prod will swap to a signed S3 URL redirect
    in a follow-up commit; the contract (one GET → file bytes) stays
    the same so frontend code doesn't change.
    """

    permission_classes = [IsAuthenticated, HasOrgContext]

    def get(self, request: Request, asset_id: uuid.UUID) -> Response | FileResponse:
        from apps.org_accounts.models import UserMediaAsset
        from apps.rbac.services.role import has_permission

        membership = _resolve_membership(request)
        if membership is None:
            return Response({"detail": "no_membership"}, status=status.HTTP_404_NOT_FOUND)

        org = membership.organization
        db_alias = register_org_database(org.db_name)
        set_current_org_db(db_alias)
        try:
            asset = UserMediaAsset.objects.using(db_alias).filter(id=asset_id).first()
            if asset is None:
                raise Http404("media_not_found")

            owner_membership_id = asset.submission.membership_id
            is_owner = owner_membership_id == membership.id
            can_admin_read = has_permission(
                user_id=str(request.user.id),
                module_code=MODULE_ACCOUNTS,
                action="read",
            )
            if not (is_owner or can_admin_read):
                return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

            return FileResponse(asset.file.open("rb"), content_type=asset.mime_type or None)
        finally:
            clear_current_org_db()
