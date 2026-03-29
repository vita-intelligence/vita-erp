# Backend

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

Django apps live in `backend/apps/`. Each app uses a modular folder structure:

```
apps/
└── accounts/                  # Auth & user identity
    ├── models/                # One file per model
    │   ├── __init__.py        # Re-exports all models
    │   ├── user.py            # Custom User (email-based, UUID PK)
    │   ├── session.py         # Refresh token tracking
    │   └── audit_log.py       # Immutable auth event log
    ├── serializers/           # One file per domain
    │   ├── auth.py            # Register, Login
    │   └── user.py            # Profile, ChangePassword, ChangeEmail, Sessions
    ├── views/                 # One file per domain
    │   ├── auth.py            # Register, Login, Refresh, Logout, Verify
    │   └── user.py            # Me, ChangePassword, ChangeEmail, Sessions
    ├── services/              # Business logic (views are thin)
    │   ├── auth.py            # Token creation, cookies, session management
    │   ├── rate_limit.py      # 3-layer brute force protection
    │   └── verification.py    # Email verification tokens + sending
    ├── tests/                 # pytest tests + factories
    │   ├── factories.py       # UserFactory
    │   └── test_auth.py       # 44 tests covering all auth flows
    ├── templates/emails/      # Email templates (Django i18n)
    ├── authentication.py      # Cookie-based JWT auth class
    ├── permissions.py         # IsEmailVerified permission
    ├── constants.py           # Audit log action strings
    ├── managers.py            # Custom UserManager
    ├── admin.py               # Django admin config
    └── urls.py                # /api/v1/auth/...
```

### Design patterns

- **Views are thin** — validate input, call service, return response
- **Services contain business logic** — testable without HTTP context
- **Models define data + constraints** — no business logic in models
- **Error codes, not messages** — backend returns `"email_taken"`, frontend translates
- **Each app is independently extractable** as a microservice

---

## Central DB vs Org DB

| Central DB (accounts app) | Org DB (future, per-org) |
|---|---|
| User (email + password) | Membership (profile, custom fields) |
| Session (refresh tokens) | Roles + Permissions (RBAC) |
| AuditLog (auth events) | 2FA methods (TOTP, WebAuthn) |
| | Business data (orders, inventory...) |

The central DB holds **only platform-level auth**. All org-specific data (profiles, permissions, 2FA, business records) lives in the org's own database — GDPR compliant, org owns their data.

---

## API Endpoints

All under `/api/v1/auth/`:

| Method | Endpoint | Auth | Verified | Purpose |
|---|---|---|---|---|
| POST | `register/` | No | — | Create account + send verification email |
| POST | `login/` | No | — | Authenticate → set JWT cookies |
| POST | `refresh/` | No | — | Rotate refresh token |
| POST | `verify-email/` | No | — | Confirm email with token |
| POST | `logout/` | Yes | No | Revoke session + clear cookies |
| GET | `me/` | Yes | No | Current user profile |
| POST | `resend-verification/` | Yes | No | Resend verification email |
| POST | `me/password/` | Yes | Yes | Change password |
| POST | `me/email/` | Yes | Yes | Change email |
| GET | `sessions/` | Yes | Yes | List active sessions |
| DELETE | `sessions/` | Yes | Yes | Revoke all sessions except current |
| DELETE | `sessions/{id}/` | Yes | Yes | Revoke specific session |

**Auth = requires login. Verified = requires email verification.**
