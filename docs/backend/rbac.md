# RBAC (Role-Based Access Control)

## Overview

Two-layer authorization on every org-scoped request:

```
Layer 1 — PLAN GATE (central DB):
  "Does this org's subscription include this module?"
  → Yes: proceed | No: 403 upgrade_required

Layer 2 — ROLE GATE (org DB):
  "Does this user's role allow this action on this module?"
  → Yes: proceed | No: 403 permission_denied
```

## Models (org DB)

RBAC models live in each organization's database. Every org defines its own roles.

### Role

| Field | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `name` | CharField(100) | e.g., "Owner", "Production Manager" |
| `description` | TextField | |
| `is_system` | Boolean | System roles cannot be deleted |

Only one system role exists: **Owner** (auto-created with the org, full access to everything).

All other roles are created by org admins with whatever permissions they choose.

### RolePermission

One row per permission. Each combines a module + action.

| Field | Type | Description |
|---|---|---|
| `role` | FK(Role) | |
| `module_code` | CharField(50) | e.g., `inventory`, `production` |
| `action` | CharField(30) | `read`, `write`, `delete`, `export` |

UniqueConstraint on (role, module_code, action).

### UserRole

Assigns a role to a user. References the central DB User by UUID — no ForeignKey across databases.

| Field | Type | Description |
|---|---|---|
| `user_id` | UUID | References accounts.User.id |
| `role` | FK(Role) | |
| `assigned_by` | UUID | Who granted this role |

## Permission Checks

```python
from apps.rbac.services.role import has_permission

# Owner bypasses all checks — always returns True
# Custom roles check explicit RolePermission entries
allowed = has_permission(user_id="...", module_code="inventory", action="write")
```

## Billing Connection

Per-user cost is calculated from granted permissions:

```python
from apps.rbac.services.role import get_user_permissions

# Returns [{"module_code": "inventory", "action": "write"}, ...]
perms = get_user_permissions(user_id="...")

# Billing service looks up PermissionPrice for each and sums the cost
```

Owner returns empty permissions list — billed separately as a special case.

## Org-Level Audit Log

RBAC changes (role created, permission granted, user role assigned) are logged to `audit.AuditLog` in the org database. This model includes `entity_type` and `entity_id` fields for tracing exactly which record was affected — essential for ISO/HIPAA compliance.
