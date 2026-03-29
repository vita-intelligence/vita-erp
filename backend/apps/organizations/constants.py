"""
Organization constants — statuses, audit actions, validation rules.

Kept in one place so models, services, and views share the same values.
"""

# ---------------------------------------------------------------------------
# Organization statuses
# ---------------------------------------------------------------------------

ORG_STATUS_TRIAL = "trial"
ORG_STATUS_ACTIVE = "active"
ORG_STATUS_SUSPENDED = "suspended"
ORG_STATUS_DEACTIVATED = "deactivated"

ORG_STATUS_CHOICES = [
    (ORG_STATUS_TRIAL, "Trial"),
    (ORG_STATUS_ACTIVE, "Active"),
    (ORG_STATUS_SUSPENDED, "Suspended"),
    (ORG_STATUS_DEACTIVATED, "Deactivated"),
]

# Statuses that allow normal access to the organization
ORG_ACTIVE_STATUSES = {ORG_STATUS_TRIAL, ORG_STATUS_ACTIVE}

# ---------------------------------------------------------------------------
# Audit actions (logged to central platform_audit.AuditLog)
# ---------------------------------------------------------------------------

AUDIT_ORG_CREATED = "org_created"
AUDIT_ORG_SELECTED = "org_selected"
AUDIT_ORG_SUSPENDED = "org_suspended"
AUDIT_ORG_DEACTIVATED = "org_deactivated"
AUDIT_MEMBER_ADDED = "member_added"
AUDIT_MEMBER_REMOVED = "member_removed"

# ---------------------------------------------------------------------------
# Slug validation
# ---------------------------------------------------------------------------

SLUG_MIN_LENGTH = 3
SLUG_MAX_LENGTH = 63

# Reserved slugs that cannot be used as organization identifiers.
# Covers common subdomains, API paths, and platform routes.
RESERVED_SLUGS = frozenset(
    {
        "admin",
        "api",
        "app",
        "auth",
        "billing",
        "blog",
        "cdn",
        "dashboard",
        "docs",
        "ftp",
        "help",
        "internal",
        "login",
        "mail",
        "manage",
        "media",
        "null",
        "platform",
        "register",
        "root",
        "settings",
        "static",
        "status",
        "support",
        "system",
        "test",
        "undefined",
        "webhook",
        "www",
    }
)

# ---------------------------------------------------------------------------
# Rate limits
# ---------------------------------------------------------------------------

MAX_ORGS_PER_USER = 3
