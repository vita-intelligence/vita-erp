"""
Org members view — list all organization members with role assignments.

Endpoint:
    GET /api/v1/rbac/org-members/   → list members with roles
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
from apps.rbac.serializers.org_member import OrgMemberSerializer
from apps.rbac.services.org_members import list_org_members


class OrgMemberListView(APIView):
    """GET: list all active members of the current organization."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read"}

    def get(self, request: Request) -> Response:
        org_id = request.tenant_org.id
        members = list_org_members(org_id)
        serializer = OrgMemberSerializer(members, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
