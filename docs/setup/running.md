# Running the Project

Both backend and frontend run locally. Docker handles PostgreSQL and Redis.

## Daily workflow

```bash
# 1. Start services (from repo root)
docker compose up -d

# 2. Start Django (from backend/)
cd backend
uv run python manage.py runserver

# 3. Start Next.js (from frontend/, in a separate terminal)
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| API | `http://localhost:8000` |
| Frontend | `http://localhost:3000` |
| Django Admin | `http://localhost:8000/admin/` |

---

## Docker services

| Service | Image | Default port |
|---|---|---|
| PostgreSQL | postgres:16-alpine | `5432` (configurable in `.env`) |
| Redis | redis:7-alpine | `6379` (configurable in `.env`) |

### Docker commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start services in background |
| `docker compose down` | Stop services |
| `docker compose down -v` | Stop services and **wipe all data** (including org databases) |
| `docker compose ps` | Show service status |
| `docker compose logs db` | View PostgreSQL logs |

---

## Backend commands

```bash
cd backend

# Server
uv run python manage.py runserver      # start dev server (port 8000)

# Database
uv run python manage.py migrate        # apply migrations (central DB)
uv run python manage.py makemigrations # create new migrations
uv run python manage.py createsuperuser # create admin user (email-based)

# Shell
uv run python manage.py shell_plus    # interactive shell (django-extensions)

# Tests
uv run pytest                          # run all tests (84 tests)
uv run pytest -v --tb=short            # verbose + short tracebacks
uv run pytest apps/accounts/           # auth tests only (61)
uv run pytest apps/organizations/      # org tests only (23)

# Code quality
uv run ruff check .                    # lint
uv run ruff format .                   # format
uv run mypy .                          # type check
```

### uv commands

| Command | What it does |
|---|---|
| `uv sync --group dev` | Install all dependencies from lockfile |
| `uv add <package>` | Add a production dependency |
| `uv add --dev <package>` | Add a dev-only dependency |
| `uv remove <package>` | Remove a dependency |
| `uv run <command>` | Run any command inside the venv |

> Never use `source .venv/bin/activate`. Always prefix commands with `uv run`.

---

## Frontend commands

```bash
cd frontend

npm run dev        # start dev server (port 3000)
npm run build      # production build
npm run lint       # biome lint + format check
npm run format     # biome format and fix
npm run typecheck  # TypeScript type check
```
