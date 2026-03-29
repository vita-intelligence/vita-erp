# Environment Variables

Two `.env` files control the local dev environment. Neither is committed to git.

---

## Root `.env` — Docker service ports

Located at repo root. Read by Docker Compose.

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_PORT` | `5432` | Host port mapped to PostgreSQL |
| `REDIS_PORT` | `6379` | Host port mapped to Redis |

If those ports are already in use on your machine, change them here. Then update `backend/.env` to match.

---

## `backend/.env` — Django app config

Located at `backend/.env`. Read by Django via `python-decouple`.

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | — | Django secret key — must be long, random, and secret |
| `DB_NAME` | `vita_erp` | PostgreSQL database name |
| `DB_USER` | `postgres` | PostgreSQL user |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | Must match `POSTGRES_PORT` in root `.env` |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Must match `REDIS_PORT` in root `.env` |

> Never commit either `.env` file. Both are gitignored. Copy from `.env.example` files.

---

## Settings files

| File | Used when | How it's selected |
|---|---|---|
| `config/settings/base.py` | always | Shared — imported by all others |
| `config/settings/dev.py` | local development | Default via `manage.py` |
| `config/settings/prod.py` | production | Default via `wsgi.py` / `asgi.py`, or set by hosting env var |
| `config/settings/test.py` | running tests | Set via `pytest.ini` or `DJANGO_SETTINGS_MODULE` |

### What each environment adds

| Concern | dev | test | prod |
|---|---|---|---|
| DEBUG | True | False | False |
| Database | PostgreSQL (Docker) | SQLite (in-memory) | PostgreSQL (Azure) |
| Cache | Redis (Docker) | LocMemCache | Redis (Azure) |
| Email | Console (prints to terminal) | In-memory (inspectable in tests) | Real service |
| Cookie Secure | False (HTTP) | False | True (HTTPS only) |
| CORS | Allow all origins | — | Whitelist |
| Media files | Local filesystem (`media/`) | Local filesystem | Azure Blob Storage |

### Switching settings manually

```bash
# Use test settings
DJANGO_SETTINGS_MODULE=config.settings.test uv run pytest

# Use prod settings (rarely needed locally)
DJANGO_SETTINGS_MODULE=config.settings.prod uv run python manage.py check
```
