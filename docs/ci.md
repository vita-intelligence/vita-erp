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
- Gives instant feedback on every push without running tests

**Backend CI** (~1-2 minutes)
- Install Python + uv + dependencies
- Lint (`ruff check`)
- Format check (`ruff format --check`)
- Type check (`mypy`)
- Tests (`pytest -v --tb=short`)
- Uses `config.settings.test` (SQLite, no Docker)

**Frontend CI** (~1-2 minutes)
- Install Node + npm dependencies
- Lint + format check (`biome`)
- Type check (`tsc`)
- Tests (`npm run test -- --run`)

**CI Success** gate
- Aggregates results from all jobs
- Must pass for PRs to be mergeable

### Concurrency

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

If you push twice quickly, the first run is cancelled — saves CI minutes.

### Secrets / Environment

CI tests need no secrets or external services:
- `SECRET_KEY: ci-secret-key` — hardcoded in workflow (test-only)
- Database: in-memory SQLite (no PostgreSQL)
- Cache: LocMemCache (no Redis)
- Email: in-memory backend (no SMTP)
