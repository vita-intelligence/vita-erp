"""
Role member views — assign and unassign users to/from roles.

Endpoints:
    GET    /api/v1/rbac/roles/{id}/members/              → list members
    POST   /api/v1/rbac/roles/{id}/members/              → assign member
    DELETE /api/v1/rbac/roles/{id}/members/{user_id}/     → unassign member
"""

from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.permissions import IsEmailVerified
from apps.organizations.models import Membership
from apps.organizations.permissions import HasOrgContext, HasOrgMembership
from apps.rbac.constants import MODULE_ORGANOGRAM
from apps.rbac.permissions import HasModulePermission
from apps.rbac.serializers.role_member import AssignMemberSerializer, RoleMemberSerializer
from apps.rbac.services.role import assign_user_to_role, get_role_members, unassign_user_from_role


class RoleMemberView(APIView):
    """GET: list members of a role. POST: assign a user."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"GET": "read", "POST": "write"}

    def get(self, request: Request, role_id: str) -> Response:
        assignments = get_role_members(role_id)
        user_ids = [str(a.user_id) for a in assignments]
        users = {str(u.id): u for u in User.objects.using("default").filter(id__in=user_ids)}
        result = []
        for a in assignments:
            uid = str(a.user_id)
            user = users.get(uid)
            result.append(
                {
                    "user_id": uid,
                    "email": user.email if user else "",
                    "assigned_at": a.assigned_at,
                }
            )
        return Response(
            RoleMemberSerializer(result, many=True).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request: Request, role_id: str) -> Response:
        serializer = AssignMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = str(serializer.validated_data["user_id"])

        # Verify user is an active member of this org
        org_id = request.tenant_org.id  # type: ignore[attr-defined]
        if (
            not Membership.objects.using("default")
            .filter(
                organization_id=org_id,
                user_id=user_id,
                is_active=True,
            )
            .exists()
        ):
            return Response(
                {"detail": "user_not_org_member"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assignment, error = assign_user_to_role(
            role_id=role_id,
            user_id=user_id,
            assigned_by=str(request.user.id),
        )
        if error:
            code = status.HTTP_404_NOT_FOUND if error == "role_not_found" else status.HTTP_400_BAD_REQUEST
            return Response({"detail": error}, status=code)
        return Response(
            {"user_id": user_id, "assigned_at": assignment.assigned_at},  # type: ignore[union-attr]
            status=status.HTTP_201_CREATED,
        )


class RoleMemberDetailView(APIView):
    """DELETE: unassign a user from a role."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
        HasModulePermission,
    ]
    rbac_module = MODULE_ORGANOGRAM
    rbac_action_map = {"DELETE": "write"}

    def delete(self, request: Request, role_id: str, user_id: str) -> Response:
        error = unassign_user_from_role(role_id, user_id)
        if error:
            return Response(
                {"detail": error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
