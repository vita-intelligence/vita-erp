"""
CompanyTheme views — thin wrappers that validate and delegate to services.

Endpoints:
    GET    /api/v1/company/theme/  → retrieve current theme
    PATCH  /api/v1/company/theme/  → partial update (mode and/or tokens)
"""

from __future__ import annotations

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsEmailVerified
from apps.company.serializers.company_theme import (
    CompanyThemeSerializer,
    CompanyThemeUpdateSerializer,
)
from apps.company.services.company_theme import get_theme, update_theme
from apps.organizations.permissions import HasOrgContext, HasOrgMembership
from apps.rbac.constants import (
    ACTION_READ,
    ACTION_WRITE,
    MODULE_COMPANY_THEME,
)
from apps.rbac.permissions import HasModulePermission


class CompanyThemeView(APIView):
    """Retrieve or update the org's CompanyTheme singleton.

    GET requires `company_theme:read`; PATCH requires `company_theme:write`.
    Owner role bypasses both checks.
    """

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_COMPANY_THEME
    rbac_action_map = {
        "GET": ACTION_READ,
        "PATCH": ACTION_WRITE,
    }

    def get(self, request) -> Response:
        theme = get_theme()
        return Response(CompanyThemeSerializer(theme).data)

    def patch(self, request) -> Response:
        serializer = CompanyThemeUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            theme = update_theme(
                data=serializer.validated_data,
                user_id=request.user.id,
                request=request,
            )
        except DjangoValidationError as exc:
            errors = exc.message_dict if hasattr(exc, "message_dict") else {"detail": exc.messages}
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(CompanyThemeSerializer(theme).data)
