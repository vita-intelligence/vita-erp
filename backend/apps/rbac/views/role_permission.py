"""
Role permission views — read and bulk-replace permissions on a role.

Endpoints:
    GET /api/v1/rbac/roles/{id}/permissions/   → list permissions
    PUT /api/v1/rbac/roles/{id}/permissions/   → bulk-replace permissions
"""

from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsEmailVerified
from apps.organizations.permissions import HasOrgContext, HasOrgMembership
from apps.rbac.constants import MODULE_ORGANOGRAM
from apps.rbac.permissions import HasModulePermission
from apps.rbac.serializers.role_permission import (
    RolePermissionSerializer,
    SetPermissionsSerializer,
)
from apps.rbac.services.role import get_role_permissions, set_role_permissions


class RolePermissionView(APIView):
    """GET: list permissions on a role. PUT: bulk-replace."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read", "PUT": "write"}

    def get(self, request: Request, role_id: str) -> Response:
        permissions = get_role_permissions(role_id)
        serializer = RolePermissionSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request, role_id: str) -> Response:
        serializer = SetPermissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        error = set_role_permissions(role_id, serializer.validated_data["permissions"])
        if error:
            code = status.HTTP_404_NOT_FOUND if error == "role_not_found" else status.HTTP_400_BAD_REQUEST
            return Response({"detail": error}, status=code)
        # Return the updated permission list
        permissions = get_role_permissions(role_id)
        return Response(
            RolePermissionSerializer(permissions, many=True).data,
            status=status.HTTP_200_OK,
        )
