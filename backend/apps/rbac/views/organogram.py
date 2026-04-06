"""
Organogram layout view — read and save the canvas state.

Endpoints:
    GET /api/v1/rbac/organogram/   → retrieve layout
    PUT /api/v1/rbac/organogram/   → full-replace layout
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
from apps.rbac.serializers.organogram import OrganogramLayoutSerializer
from apps.rbac.services.organogram import get_layout, update_layout


class OrganogramLayoutView(APIView):
    """GET: retrieve canvas layout. PUT: full-replace canvas layout."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read", "PUT": "write"}

    def get(self, request: Request) -> Response:
        layout = get_layout()
        serializer = OrganogramLayoutSerializer(layout)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request) -> Response:
        serializer = OrganogramLayoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        layout = update_layout(
            nodes_layout=serializer.validated_data["nodes_layout"],
            edges=serializer.validated_data["edges"],
        )
        return Response(
            OrganogramLayoutSerializer(layout).data,
            status=status.HTTP_200_OK,
        )
