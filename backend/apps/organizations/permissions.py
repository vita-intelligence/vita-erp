"""
Organization permission classes for DRF views.

These check platform-level access (membership, subscription status).
Org-level RBAC checks (module + action) are handled separately
via apps.rbac.services.role.has_permission().
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission


class HasOrgContext(BasePermission):
    """Requires an active org context on the request.

    The TenantMiddleware sets request.tenant_org when a valid
    org_id claim is present in the JWT. This permission denies
    access if no org context is set.
    """

    message = "no_org_selected"

    def has_permission(self, request, view) -> bool:
        return getattr(request, "tenant_org", None) is not None


class HasOrgMembership(BasePermission):
    """Requires the user to have an active membership for the current org.

    Normally redundant with TenantMiddleware (which already verifies
    membership), but serves as a defense-in-depth check on views
    that require org context.
    """

    message = "not_a_member"

    def has_permission(self, request, view) -> bool:
        org = getattr(request, "tenant_org", None)
        if org is None:
            return False

        from apps.organizations.services.membership import verify_membership

        return verify_membership(
            user_id=str(request.user.id),
            org_id=str(org.id),
        )
