"""
RBAC constants — permission actions, system role.

These live in the org database. Only the Owner role is auto-created
when an organization is provisioned. All other roles are defined
by the org admin as they see fit.
"""

# ---------------------------------------------------------------------------
# System role (auto-created per org, cannot be deleted)
# ---------------------------------------------------------------------------

ROLE_OWNER = "Owner"

# ---------------------------------------------------------------------------
# Permission actions — the verbs used in RolePermission.
# Org admins combine module_code + action to build permission sets.
# ---------------------------------------------------------------------------

ACTION_READ = "read"
ACTION_WRITE = "write"
ACTION_DELETE = "delete"
ACTION_EXPORT = "export"
ACTION_MANAGE = "manage"

ALL_ACTIONS = [ACTION_READ, ACTION_WRITE, ACTION_DELETE, ACTION_EXPORT, ACTION_MANAGE]

ACTION_CHOICES = [
    (ACTION_READ, "Read"),
    (ACTION_WRITE, "Write"),
    (ACTION_DELETE, "Delete"),
    (ACTION_EXPORT, "Export"),
    (ACTION_MANAGE, "Manage"),
]

# ---------------------------------------------------------------------------
# Module codes — the nouns paired with actions to form permissions.
# Each ERP module that needs RBAC gating registers its code here so views
# can reference it consistently (see apps.rbac.permissions.HasModulePermission).
#
# Module codes also drive per-permission pricing in `apps.billing.PermissionPrice`:
# each (module_code, action) pair has its own monthly price, and a user's cost
# is the sum of the prices of the permissions they hold.
# ---------------------------------------------------------------------------

MODULE_COMPANY_SETTINGS = "company_settings"
MODULE_COMPANY_THEME = "company_theme"
MODULE_ORGANOGRAM = "organogram"
MODULE_ACCOUNTS = "accounts"
MODULE_BILLING = "billing"

ALL_MODULES = [
    MODULE_COMPANY_SETTINGS,
    MODULE_COMPANY_THEME,
    MODULE_ORGANOGRAM,
    MODULE_ACCOUNTS,
    MODULE_BILLING,
]
