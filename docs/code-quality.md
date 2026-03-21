# Code Quality

## Tools

| Tool | Purpose |
|---|---|
| `ruff` | Linting and formatting — replaces flake8, isort, black |
| `mypy` | Static type checking |
| `pre-commit` | Runs ruff automatically on every `git commit` |

All configured in `backend/pyproject.toml`.

---

## Ruff

```bash
cd backend

uv run ruff check .          # lint
uv run ruff check . --fix    # lint and auto-fix
uv run ruff format .         # format
```

## Mypy

```bash
cd backend
uv run mypy .
```

## pre-commit

Hooks run automatically on every `git commit`. To run manually against all files:

```bash
pre-commit run --all-files
```

> `pre-commit install` was already run during project setup. The hook is active — nothing to configure.
