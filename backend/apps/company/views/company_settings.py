"""
CompanySettings views — thin wrappers that validate and delegate to services.

Endpoints:
    GET    /api/v1/company/settings/  → retrieve current settings
    PATCH  /api/v1/company/settings/  → partial update
"""

from __future__ import annotations

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsEmailVerified
from apps.company.serializers.company_settings import (
    CompanySettingsSerializer,
    CompanySettingsUpdateSerializer,
)
from apps.company.services.company_settings import get_settings, update_settings
from apps.organizations.permissions import HasOrgContext, HasOrgMembership
from apps.rbac.constants import (
    ACTION_READ,
    ACTION_WRITE,
    MODULE_COMPANY_SETTINGS,
)
from apps.rbac.permissions import HasModulePermission


class CompanySettingsView(APIView):
    """Retrieve or update the org's CompanySettings singleton.

    GET requires `company_settings:read`; PATCH requires `company_settings:write`.
    Owner role bypasses both checks.
    """

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_COMPANY_SETTINGS
    rbac_action_map = {
        "GET": ACTION_READ,
        "PATCH": ACTION_WRITE,
    }

    def get(self, request) -> Response:
        settings = get_settings()
        return Response(CompanySettingsSerializer(settings).data)

    def patch(self, request) -> Response:
        serializer = CompanySettingsUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            settings = update_settings(
                data=serializer.validated_data,
                user_id=request.user.id,
                request=request,
            )
        except DjangoValidationError as exc:
            errors = exc.message_dict if hasattr(exc, "message_dict") else {"detail": exc.messages}
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(CompanySettingsSerializer(settings).data)
