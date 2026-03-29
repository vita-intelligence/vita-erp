# Organizations & Multi-Tenancy

## Architecture

Each organization gets its own PostgreSQL database for maximum data isolation. This supports military/government security requirements and compliance standards (ISO, BRCGS, GDPR, HIPAA).

```
Central DB (vita_erp)              Org DB (vita_org_{uuid12})
├── accounts_user                  ├── rbac_role
├── accounts_session               ├── rbac_role_permission
├── organizations_organization     ├── rbac_user_role
├── organizations_membership       ├── audit_log
├── billing_plan                   └── (future ERP modules)
├── billing_subscription
├── billing_*
└── accounts_audit_log
```

## How It Works

### Request flow

1. Request arrives with JWT cookie
2. `TenantMiddleware` reads `org_id` claim from the access token
3. Verifies the user has an active `Membership` for that org
4. Registers the org database in Django's `connections.databases`
5. Sets `contextvars` with the database alias
6. `TenantDatabaseRouter` routes all tenant-app queries to the org DB
7. View executes — shared models hit central DB, tenant models hit org DB
8. After response, contextvars are cleared

### Database routing

Defined in `apps/organizations/router.py`:

| App category | Database | Examples |
|---|---|---|
| Shared apps | `default` (central) | accounts, organizations, billing, platform_audit |
| Tenant apps | `vita_org_{uuid12}` | rbac, audit, future ERP modules |
| Django built-in | `default` | admin, auth, contenttypes, sessions |

### Database provisioning

When an organization is created (`create_organization()` service):

1. Central DB records created atomically (Organization, Membership, Subscription)
2. `CREATE DATABASE vita_org_{uuid12}` via raw SQL (psycopg, injection-safe)
3. `manage.py migrate --database={alias}` — router ensures only tenant apps migrate
4. Owner role created in the org DB with full access
5. Audit event logged

### JWT org context

- Login → JWT with `user_id` only (no org context)
- `GET /auth/me/` → returns user + list of organizations
- `POST /organizations/{id}/select/` → issues new JWT with `org_id` claim
- Token refresh preserves `org_id` from old token

## Models

### Organization (central DB)

| Field | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `name` | CharField(255) | Display name |
| `slug` | SlugField(63) | URL-safe identifier, unique |
| `db_name` | CharField(63) | PostgreSQL database name, unique |
| `status` | CharField(20) | trial, active, suspended, deactivated |
| `industry` | CharField(100) | Optional |
| `country` | CharField(2) | ISO 3166-1 alpha-2 |
| `timezone` | CharField(50) | IANA timezone |
| `base_currency` | CharField(3) | ISO 4217 |
| `created_by` | FK(User) | Org creator |

### Membership (central DB)

| Field | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `user` | FK(User) | |
| `organization` | FK(Organization) | |
| `is_active` | Boolean | Soft-deactivate without deleting |
| `joined_at` | DateTime | |

UniqueConstraint on (user, organization).

## Slug Validation

- 3-63 characters
- Lowercase alphanumeric + hyphens
- No leading/trailing hyphens
- 30 reserved words blocked (admin, api, app, auth, billing, etc.)

## Limits

- Max 3 organizations per user
- Org must be in `trial` or `active` status to be accessible

## Microservice Readiness

Cross-database references use UUID only — no ForeignKeys across databases. Central DB apps can FK to each other. Org DB apps can FK to each other. To split into microservices: replace DB queries with API calls at the boundary.
