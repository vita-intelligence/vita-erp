"""
Role service — manages roles and permission checks in the org database.

The Owner role is the only system role. It is auto-created when an
organization is provisioned and grants full access to everything.
All other roles are created by org admins.

Permission check logic:
- Owner (is_system=True) → always full access, no explicit permissions needed
- Custom roles → access determined by RolePermission entries
"""

from __future__ import annotations

import logging

from apps.rbac.constants import ROLE_OWNER
from apps.rbac.models import Role, RolePermission, UserRole

logger = logging.getLogger(__name__)


def create_owner_role(user_id: str) -> Role:
    """Create the Owner system role and assign it to the given user.

    Called during org provisioning. Must be invoked with the org DB
    context already set via contextvars.
    """
    role = Role.objects.create(
        name=ROLE_OWNER,
        description="Full access to all modules and actions. Cannot be deleted.",
        is_system=True,
    )

    UserRole.objects.create(
        user_id=user_id,
        role=role,
    )

    logger.info("Owner role created and assigned to user %s", user_id)
    return role


def has_permission(user_id: str, module_code: str, action: str) -> bool:
    """Check if a user has a specific permission in the current org.

    Must be called with the org DB context set via contextvars.

    Owner role bypasses all permission checks — full access always.
    Custom roles require an explicit RolePermission entry.
    """
    user_roles = UserRole.objects.filter(user_id=user_id).select_related("role")

    for user_role in user_roles:
        # Owner has full access — no need to check permissions
        if user_role.role.is_system and user_role.role.name == ROLE_OWNER:
            return True

    # Check explicit permissions on the user's roles
    role_ids = [ur.role_id for ur in user_roles]
    return RolePermission.objects.filter(
        role_id__in=role_ids,
        module_code=module_code,
        action=action,
    ).exists()


def get_user_permissions(user_id: str) -> list[dict]:
    """Get all permissions granted to a user in the current org.

    Returns a list of {module_code, action} dicts. Used by the billing
    service to calculate per-user cost via PermissionPrice.

    Owner role returns an empty list — billing treats Owner as a
    special case (or the org admin sets the Owner's billing tier).
    """
    user_roles = UserRole.objects.filter(user_id=user_id).select_related("role")

    role_ids = []
    for user_role in user_roles:
        if user_role.role.is_system and user_role.role.name == ROLE_OWNER:
            return []
        role_ids.append(user_role.role_id)

    permissions = RolePermission.objects.filter(
        role_id__in=role_ids,
    ).values("module_code", "action")

    return list(permissions)  # type: ignore[arg-type]


def get_user_permission_count(user_id: str) -> int:
    """Count the number of distinct permissions granted to a user.

    Used by the billing service to calculate per-user cost.
    Owner returns 0 — billed separately.
    """
    return len(get_user_permissions(user_id))
