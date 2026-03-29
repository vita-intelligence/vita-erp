# Code Quality

## Backend tools

| Tool | Purpose |
|---|---|
| `ruff` | Linting and formatting — replaces flake8, isort, black |
| `mypy` | Static type checking |
| `pytest` | Test runner — with pytest-django and factory-boy |

Configured in `backend/pyproject.toml` and `backend/pytest.ini`.

## Frontend tools

| Tool | Purpose |
|---|---|
| `biome` | Linting and formatting — replaces ESLint + Prettier |
| `tsc` | Static type checking |

Configured in `frontend/biome.json`.

## pre-commit

Runs automatically on every `git commit` — covers both backend (ruff) and frontend (biome).

```bash
pre-commit run --all-files
```

---

## Backend commands

```bash
cd backend

# Linting
uv run ruff check .          # lint
uv run ruff check . --fix    # lint and auto-fix
uv run ruff format .         # format
uv run ruff format --check . # format check (CI mode)

# Type checking
uv run mypy .

# Tests
uv run pytest                # run all tests (84)
uv run pytest -v             # verbose output
uv run pytest apps/accounts/ # auth tests (61)
uv run pytest apps/organizations/ # org tests (23)
```

## Frontend commands

```bash
cd frontend

npm run lint        # biome lint + format check
npm run format      # biome format and fix
npm run typecheck   # tsc type check
```
