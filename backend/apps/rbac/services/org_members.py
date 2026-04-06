"""
Org members service — list organization members with their role assignments.

Queries the central DB for Membership + User data, then cross-references
the org database for UserRole assignments. Merges results in Python
because Django does not support cross-database joins.
"""

from __future__ import annotations

from apps.accounts.models import User
from apps.organizations.models import Membership
from apps.rbac.models import UserRole


def list_org_members(org_id: str) -> list[dict]:
    """Return all active members of an organization with their roles.

    Reads from the central DB (Membership, User) and the org DB (UserRole).
    Returns a list of dicts with user info and role assignments.
    """
    memberships = (
        Membership.objects.using("default").filter(organization_id=org_id, is_active=True).select_related("user")
    )

    user_ids = [str(m.user_id) for m in memberships]
    user_map: dict[str, User] = {str(m.user_id): m.user for m in memberships}

    # Fetch role assignments from the org database
    user_roles = UserRole.objects.filter(user_id__in=user_ids).select_related("role")

    # Build user_id → roles mapping
    roles_by_user: dict[str, list[dict]] = {}
    for ur in user_roles:
        uid = str(ur.user_id)
        roles_by_user.setdefault(uid, []).append(
            {
                "id": str(ur.role_id),
                "name": ur.role.name,
            }
        )

    return [
        {
            "user_id": str(uid),
            "email": user.email,
            "roles": roles_by_user.get(str(uid), []),
        }
        for uid, user in user_map.items()
    ]
