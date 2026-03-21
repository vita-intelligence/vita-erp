# Code Quality

## Backend tools

| Tool | Purpose |
|---|---|
| `ruff` | Linting and formatting — replaces flake8, isort, black |
| `mypy` | Static type checking |

Configured in `backend/pyproject.toml`.

## Frontend tools

| Tool | Purpose |
|---|---|
| `biome` | Linting and formatting — replaces ESLint + Prettier |
| `tsc` | Static type checking |

Configured in `frontend/biome.json`.

## pre-commit

Runs automatically on every `git commit` — covers both backend (ruff) and frontend (biome).

To run manually against all files:

```bash
pre-commit run --all-files
```

> `pre-commit install` was already run during project setup. Nothing to configure.

---

## Backend commands

```bash
cd backend

uv run ruff check .          # lint
uv run ruff check . --fix    # lint and auto-fix
uv run ruff format .         # format
uv run mypy .                # type check
```

## Frontend commands

```bash
cd frontend

npm run lint        # biome lint + format check
npm run format      # biome format and fix
npm run typecheck   # tsc type check
```
