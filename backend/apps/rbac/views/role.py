"""
Role views — CRUD for organization roles.

Endpoints:
    GET    /api/v1/rbac/roles/          → list all roles
    POST   /api/v1/rbac/roles/          → create a custom role
    GET    /api/v1/rbac/roles/{id}/     → role detail with permissions + members
    PATCH  /api/v1/rbac/roles/{id}/     → update role name/description
    DELETE /api/v1/rbac/roles/{id}/     → delete non-system role
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
from apps.rbac.serializers.role import (
    RoleCreateSerializer,
    RoleDetailSerializer,
    RoleListSerializer,
    RoleUpdateSerializer,
)
from apps.rbac.services.role import (
    create_role,
    delete_role,
    get_role,
    list_roles,
    update_role,
)


class RoleListCreateView(APIView):
    """GET: list roles. POST: create a new custom role."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read", "POST": "write"}

    def get(self, request: Request) -> Response:
        roles = list_roles()
        serializer = RoleListSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        serializer = RoleCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = create_role(**serializer.validated_data)
        return Response(
            RoleListSerializer(role).data,
            status=status.HTTP_201_CREATED,
        )


class RoleDetailView(APIView):
    """GET: role detail. PATCH: update. DELETE: delete."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read", "PATCH": "write", "DELETE": "write"}

    def get(self, request: Request, role_id: str) -> Response:
        role = get_role(role_id)
        if role is None:
            return Response(
                {"detail": "role_not_found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(RoleDetailSerializer(role).data, status=status.HTTP_200_OK)

    def patch(self, request: Request, role_id: str) -> Response:
        serializer = RoleUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role, error = update_role(role_id, **serializer.validated_data)
        if error:
            code = status.HTTP_404_NOT_FOUND if error == "role_not_found" else status.HTTP_400_BAD_REQUEST
            return Response({"detail": error}, status=code)
        return Response(RoleDetailSerializer(role).data, status=status.HTTP_200_OK)

    def delete(self, request: Request, role_id: str) -> Response:
        error = delete_role(role_id)
        if error:
            code = status.HTTP_404_NOT_FOUND if error == "role_not_found" else status.HTTP_400_BAD_REQUEST
            return Response({"detail": error}, status=code)
        return Response(status=status.HTTP_204_NO_CONTENT)
