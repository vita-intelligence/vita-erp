"""
RBAC permission classes for DRF views.

These gate individual HTTP methods against the user's role permissions
in the currently-active organization. Views declare which module they
belong to and which action maps to each HTTP method; this class reads
those declarations and delegates to apps.rbac.services.role.has_permission.

Usage:

    from apps.rbac.constants import MODULE_COMPANY_SETTINGS
    from apps.rbac.permissions import HasModulePermission

    class MyView(APIView):
        permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
        rbac_module = MODULE_COMPANY_SETTINGS
        rbac_action_map = {"GET": "read", "PATCH": "write"}

Views without rbac_module or with an unmapped HTTP method are allowed
through so this class can be attached globally without breaking
non-tenant endpoints.
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission

from apps.rbac.services.role import has_permission


class HasModulePermission(BasePermission):
    """Checks module+action permissions on the active org's tenant DB.

    Relies on TenantMiddleware having set the org DB context via
    contextvars before this runs — `apps.rbac.services.role.has_permission`
    queries the org database transparently through that context.
    """

    message = "permission_denied"

    def has_permission(self, request, view) -> bool:
        module = getattr(view, "rbac_module", None)
        if module is None:
            # View opted out of RBAC gating — trust its other permission classes.
            return True

        action_map = getattr(view, "rbac_action_map", {}) or {}
        action = action_map.get(request.method)
        if action is None:
            # HTTP method not gated (e.g., OPTIONS, HEAD) — allow.
            return True

        user = getattr(request, "user", None)
        if user is None or not getattr(user, "is_authenticated", False):
            return False

        return has_permission(
            user_id=str(user.id),
            module_code=module,
            action=action,
        )
