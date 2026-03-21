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

---

## Services

| Service | Host | Default port |
|---|---|---|
| PostgreSQL | `localhost` | `5432` |
| Redis | `localhost` | `6379` |

Port conflicts? See [environment.md](environment.md).

## Docker commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start services in background |
| `docker compose down` | Stop services |
| `docker compose down -v` | Stop services and wipe all data |
| `docker compose ps` | Show service status |
| `docker compose logs db` | View PostgreSQL logs |

## Common Django commands

```bash
cd backend

uv run python manage.py runserver        # start dev server
uv run python manage.py migrate          # apply migrations
uv run python manage.py makemigrations   # create new migrations
uv run python manage.py createsuperuser  # create admin user
uv run python manage.py shell_plus       # interactive shell (django-extensions)
```

## uv commands

| Command | What it does |
|---|---|
| `uv sync --group dev` | Install all dependencies from lockfile |
| `uv add <package>` | Add a production dependency |
| `uv add --dev <package>` | Add a dev-only dependency |
| `uv remove <package>` | Remove a dependency |
| `uv run <command>` | Run any command inside the venv |

> Never use `source .venv/bin/activate`. Always prefix commands with `uv run`.

## Common frontend commands

```bash
cd frontend

npm run dev        # start dev server
npm run build      # production build
npm run lint       # biome lint + format check
npm run format     # biome format and fix
npm run typecheck  # TypeScript check
```
