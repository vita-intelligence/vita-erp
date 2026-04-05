"""
MePermissionsView — returns the caller's effective permissions in the
currently-active organization.

Frontend calls this after selecting an org to populate its permissions
store, then gates UI (disable fields, hide save bars, etc.) based on the
response. Response shape:

    {
        "is_owner": true,
        "permissions": {
            "company_settings": ["read", "write"],
            "inventory": ["read"]
        }
    }

`is_owner` short-circuits every permission check on the client — Owner
has full access by convention. For non-Owner users, `permissions` is a
module → list-of-actions map derived from RolePermission entries on the
roles assigned to the user.
"""

from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsEmailVerified
from apps.organizations.permissions import HasOrgContext, HasOrgMembership
from apps.rbac.constants import ROLE_OWNER
from apps.rbac.models import UserRole
from apps.rbac.services.role import get_user_permissions


class MePermissionsView(APIView):
    """GET /api/v1/rbac/me/permissions/ — caller's perms for the active org."""

    permission_classes = [
        IsAuthenticated,
        IsEmailVerified,
        HasOrgContext,
        HasOrgMembership,
    ]

    def get(self, request: Request) -> Response:
        user_id = str(request.user.id)
        is_owner = self._is_owner(user_id=user_id)
        permissions = _group_by_module(get_user_permissions(user_id=user_id))

        return Response(
            {"is_owner": is_owner, "permissions": permissions},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def _is_owner(*, user_id: str) -> bool:
        """True if the user holds the Owner system role in this org."""
        return UserRole.objects.filter(
            user_id=user_id,
            role__is_system=True,
            role__name=ROLE_OWNER,
        ).exists()


def _group_by_module(
    permissions: list[dict],
) -> dict[str, list[str]]:
    """Fold a flat [{module_code, action}] list into {module: [actions]}."""
    grouped: dict[str, list[str]] = {}
    for entry in permissions:
        module = entry["module_code"]
        action = entry["action"]
        if action not in grouped.setdefault(module, []):
            grouped[module].append(action)
    return grouped
