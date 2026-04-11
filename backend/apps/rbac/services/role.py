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

from django.db import transaction
from django.db.models import Count, QuerySet

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


# ---------------------------------------------------------------------------
# Role CRUD
# ---------------------------------------------------------------------------


def list_roles() -> QuerySet[Role]:
    """Return all roles in the current org, annotated with member count."""
    return Role.objects.annotate(member_count=Count("user_assignments")).order_by("-is_system", "name")


def get_role(role_id: str) -> Role | None:
    """Fetch a single role by ID, or None if not found."""
    try:
        return Role.objects.get(pk=role_id)
    except Role.DoesNotExist:
        return None


def create_role(name: str, description: str = "") -> Role:
    """Create a new custom (non-system) role."""
    return Role.objects.create(name=name, description=description)


def update_role(
    role_id: str,
    *,
    name: str | None = None,
    description: str | None = None,
) -> tuple[Role | None, str | None]:
    """Update a role's name and/or description.

    Returns (role, error_code). System roles cannot be renamed.
    """
    role = get_role(role_id)
    if role is None:
        return None, "role_not_found"

    if role.is_system and name is not None and name != role.name:
        return None, "cannot_rename_system_role"

    if name is not None:
        role.name = name
    if description is not None:
        role.description = description
    role.save(update_fields=["name", "description", "updated_at"])
    return role, None


def delete_role(role_id: str) -> str | None:
    """Delete a role. Returns error code if system role or not found."""
    role = get_role(role_id)
    if role is None:
        return "role_not_found"
    if role.is_system:
        return "cannot_delete_system_role"
    role.delete()
    return None


# ---------------------------------------------------------------------------
# Role permissions
# ---------------------------------------------------------------------------


def get_role_permissions(role_id: str) -> QuerySet[RolePermission]:
    """Return all permissions for a role."""
    return RolePermission.objects.filter(role_id=role_id).order_by("module_code", "action")


@transaction.atomic
def set_role_permissions(role_id: str, permissions: list[dict]) -> str | None:
    """Bulk-replace all permissions on a role.

    permissions: list of {module_code, action} dicts.
    System roles (Owner) cannot have explicit permissions set.
    """
    role = get_role(role_id)
    if role is None:
        return "role_not_found"
    if role.is_system:
        return "cannot_modify_system_role"

    RolePermission.objects.filter(role=role).delete()
    RolePermission.objects.bulk_create(
        [RolePermission(role=role, module_code=p["module_code"], action=p["action"]) for p in permissions],
        ignore_conflicts=True,
    )
    return None


# ---------------------------------------------------------------------------
# Role member assignment
# ---------------------------------------------------------------------------


def get_role_members(role_id: str) -> QuerySet[UserRole]:
    """Return all user-role assignments for a given role."""
    return UserRole.objects.filter(role_id=role_id).order_by("assigned_at")


def assign_user_to_role(
    role_id: str,
    user_id: str,
    assigned_by: str,
) -> tuple[UserRole | None, str | None]:
    """Assign a user to a role. Returns (assignment, error_code)."""
    role = get_role(role_id)
    if role is None:
        return None, "role_not_found"

    if UserRole.objects.filter(role_id=role_id, user_id=user_id).exists():
        return None, "already_assigned"

    assignment = UserRole.objects.create(
        role=role,
        user_id=user_id,
        assigned_by=assigned_by,
    )
    return assignment, None


def unassign_user_from_role(role_id: str, user_id: str) -> str | None:
    """Remove a user from a role. Returns error code on failure.

    The Owner role is locked: nobody can be unassigned from it through
    this path. Self-removal and one owner removing another both bricked
    orgs in the past, and until a proper ownership-transfer flow exists,
    the only safe rule is "Owner membership is immutable here."
    """
    role = get_role(role_id)
    if role is None:
        return "role_not_found"
    if role.is_system and role.name == ROLE_OWNER:
        return "cannot_remove_owner"

    deleted_count, _ = UserRole.objects.filter(
        role_id=role_id,
        user_id=user_id,
    ).delete()
    if deleted_count == 0:
        return "not_assigned"
    return None
