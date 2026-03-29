# Backend Overview

## Stack

| Package | Purpose |
|---|---|
| Django 5.2 | Web framework |
| Django REST Framework | API serializers, views, permissions |
| SimpleJWT | JWT token generation and validation |
| django-redis | Redis cache backend |
| django-cors-headers | Cross-origin request handling |
| psycopg | PostgreSQL driver |
| python-decouple | Environment variable management |
| pytest + pytest-django | Testing |
| factory-boy | Test data factories |

---

## App Structure

Django apps live in `backend/apps/`. Split into two groups by database:

### Central DB apps

| App | Purpose |
|---|---|
| `apps.accounts` | User authentication (email + password, sessions, rate limiting) |
| `apps.organizations` | Organization lifecycle, membership, multi-DB infrastructure |
| `apps.billing` | Plans, subscriptions, add-ons, permission pricing |
| `apps.platform_audit` | Immutable audit log for platform-level events |

### Org DB apps (per-organization database)

| App | Purpose |
|---|---|
| `apps.rbac` | Roles, permissions, user-role assignments |
| `apps.audit` | Immutable audit log for org-level events |

### App layout convention

Every app follows this structure:

```
apps/{app_name}/
├── models/           # One file per model, __init__.py re-exports
├── serializers/      # DRF serializers (one file per domain)
├── views/            # DRF views (one file per domain)
├── services/         # Business logic (views are thin wrappers)
├── tests/            # pytest tests + factories
├── constants.py      # App-specific constants
├── permissions.py    # DRF permission classes
├── admin.py          # Django admin config
└── urls.py           # URL patterns
```

---

## Design Patterns

- **Views are thin** — validate input, call service, return response
- **Services contain business logic** — testable without HTTP context
- **Models define data + constraints** — no business logic in models
- **Error codes, not messages** — backend returns `"email_taken"`, frontend translates
- **Each app is independently extractable** as a microservice
- **Cross-DB references use UUID only** — no ForeignKeys across databases

---

## Database Architecture

```
Central DB (vita_erp)                      Org DB (vita_org_{uuid12})
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ apps.accounts                │           │ apps.rbac                    │
│   User, Session              │           │   Role, RolePermission       │
│                              │  UUID     │   UserRole                   │
│ apps.organizations           │◄─ ─ ─ ─ ─│                              │
│   Organization, Membership   │  ref     │ apps.audit                   │
│                              │           │   AuditLog                   │
│ apps.billing                 │           │                              │
│   Plan, Subscription, AddOn  │           │ (future ERP modules)         │
│   PlanLimit, PermissionPrice │           └──────────────────────────────┘
│                              │
│ apps.platform_audit          │
│   AuditLog                   │
└──────────────────────────────┘
```

Each organization gets its own PostgreSQL database. The `TenantDatabaseRouter` routes queries based on `contextvars` set by the `TenantMiddleware`.

---

## API Endpoints

### Auth (`/api/v1/auth/`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `register/` | No | Create account |
| POST | `login/` | No | Authenticate |
| POST | `refresh/` | No | Rotate refresh token |
| POST | `verify-email/` | No | Confirm email |
| POST | `logout/` | Yes | Revoke session |
| GET | `me/` | Yes | Current user + organizations |
| POST | `resend-verification/` | Yes | Resend verification email |
| POST | `me/password/` | Yes | Change password |
| POST | `me/email/` | Yes | Change email |
| GET | `sessions/` | Yes | List active sessions |
| DELETE | `sessions/` | Yes | Revoke all sessions |
| DELETE | `sessions/{id}/` | Yes | Revoke specific session |

### Organizations (`/api/v1/organizations/`)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/` | Yes + Verified | Create org + start trial |
| GET | `/` | Yes + Verified | List user's organizations |
| GET | `{id}/` | Yes + Verified | Organization details |
| POST | `{id}/select/` | Yes + Verified | Select org → org-scoped JWT |
