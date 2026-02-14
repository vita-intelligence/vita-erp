from access.models import Permission

def membership_has_perm(membership, perm_key: str) -> bool:
    """
    Returns True if membership has `perm_key` through any assigned role.

    membership -> MembershipRole -> Role -> RolePermission -> Permission(key)
    """
    return Permission.objects.filter(
        key=perm_key,
        permission_roles__role__assigned_memberships__membership=membership,
    ).exists()