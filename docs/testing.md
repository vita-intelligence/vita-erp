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

uv run pytest                      # all tests
uv run pytest -v                   # verbose
uv run pytest -v --tb=short        # verbose + short tracebacks
uv run pytest apps/accounts/       # one app only
uv run pytest -k "test_login"      # match test name
uv run pytest -x                   # stop on first failure
```

### Writing tests

Tests live in `apps/{app}/tests/`. Each app has:

```
tests/
├── __init__.py
├── factories.py        # factory-boy model factories
├── test_auth.py        # auth endpoint tests
└── test_*.py           # more test files as needed
```

**Pattern:**

```python
import pytest
from rest_framework.test import APIClient
from apps.accounts.tests.factories import UserFactory, DEFAULT_PASSWORD

pytestmark = pytest.mark.django_db

@pytest.fixture()
def client():
    return APIClient()

@pytest.fixture()
def user():
    return UserFactory()

class TestSomething:
    def test_example(self, client, user):
        response = client.post("/api/v1/auth/login/", {
            "email": user.email,
            "password": DEFAULT_PASSWORD,
        })
        assert response.status_code == 200
```

### Factories

Use `factory-boy` to create test data. Define factories in `tests/factories.py`:

```python
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@test.com")
    password = factory.LazyFunction(lambda: make_password(DEFAULT_PASSWORD))
    is_verified = False
```

Usage: `UserFactory()`, `UserFactory(is_verified=True)`, `UserFactory(email="custom@test.com")`.

### Test database

Tests use in-memory SQLite (`config/settings/test.py`) — no Docker needed. Fast password hashing (MD5 instead of bcrypt) for speed.

Cache uses `LocMemCache` in tests — no Redis needed.

---

## Frontend — not set up yet

Frontend tests will be added when application pages are built. Planned: Vitest for unit tests, Playwright for E2E.

---

## CI

Tests run automatically via GitHub Actions:

| Event | What runs |
|---|---|
| Push to any branch | Quick check (lint + types, ~30 sec) |
| Push to main/dev | Full suite (lint + types + tests) |
| PR to main/dev | Full suite (must pass to merge) |

See [ci.md](ci.md) for details.
