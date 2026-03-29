# Testing

## Backend — pytest

### Setup

| Package | Purpose |
|---|---|
| `pytest` | Test runner |
| `pytest-django` | Django integration (DB, client, settings) |
| `factory-boy` | Test data factories |

Config in `backend/pytest.ini` — automatically uses `config.settings.test`.

### Running tests

```bash
cd backend

uv run pytest                          # all tests (84)
uv run pytest -v                       # verbose
uv run pytest -v --tb=short            # verbose + short tracebacks
uv run pytest apps/accounts/           # auth tests (61)
uv run pytest apps/organizations/      # org tests (23)
uv run pytest -k "test_login"          # match test name
uv run pytest -x                       # stop on first failure
```

### Test database

Tests use in-memory SQLite with `DATABASE_ROUTERS = []` (router disabled). All models — shared and tenant — coexist in the same test DB. Fast password hashing (MD5). Cache uses `LocMemCache`.

Org database provisioning (`CREATE DATABASE`) is skipped in SQLite mode. The organization service detects the engine and skips DDL operations.

### Factories

| Factory | App | What it creates |
|---|---|---|
| `UserFactory` | accounts | User with hashed password |
| `OrganizationFactory` | organizations | Org with unique slug and db_name |
| `MembershipFactory` | organizations | User ↔ Org link |

```python
from apps.accounts.tests.factories import UserFactory, DEFAULT_PASSWORD
from apps.organizations.tests.factories import OrganizationFactory, MembershipFactory

user = UserFactory(is_verified=True)
org = OrganizationFactory(name="Acme Corp")
membership = MembershipFactory(user=user, organization=org)
```

### Test coverage

| App | Tests | Covers |
|---|---|---|
| accounts | 61 | Register, login, refresh, logout, email verification, password reset, change password, change email, sessions |
| organizations | 23 | Create org, list orgs, select org, org detail, /me/ includes orgs, permissions, validation |

---

## Frontend — not set up yet

Planned: Vitest for unit tests, Playwright for E2E.

---

## CI

Tests run automatically via GitHub Actions. See [ci.md](ci.md).
