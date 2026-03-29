# CI/CD

## GitHub Actions

One workflow at `.github/workflows/ci.yml` handles everything.

### Triggers

| Event | Jobs that run |
|---|---|
| Push to **any branch** | Quick Check only (lint + format + types) |
| Push to **main** or **dev** | Quick Check + Full Backend CI + Full Frontend CI |
| PR to **main** or **dev** | Quick Check + Full Backend CI + Full Frontend CI |

### Jobs

**Quick Check** (~30 seconds)
- Backend: `ruff check` + `ruff format --check`
- Frontend: `biome check` + `tsc --noEmit`

**Backend CI** (~1-2 minutes)
- Install Python + uv + dependencies
- Lint, format check, type check
- Tests (`pytest -v --tb=short`) — 84 tests
- Uses `config.settings.test` (SQLite, no Docker, router disabled)

**Frontend CI** (~1-2 minutes)
- Install Node + npm dependencies
- Lint + format check, type check
- Tests (not yet set up)

**CI Success** gate — aggregates all jobs, must pass for PRs.

### Concurrency

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

### Secrets / Environment

CI tests need no secrets or external services:
- `SECRET_KEY: ci-secret-key` — hardcoded in workflow
- Database: in-memory SQLite
- Cache: LocMemCache
- Email: in-memory backend
- DATABASE_ROUTERS: disabled in test settings
