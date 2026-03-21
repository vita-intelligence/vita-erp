# Environment Variables

There are two `.env` files with different purposes.

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
| `DB_PORT` | `5432` | PostgreSQL port — must match `POSTGRES_PORT` in root `.env` |

> Never commit either `.env` file. Both are gitignored. Commit the `.env.example` files instead.

---

## Settings files

| File | Used when | Purpose |
|---|---|---|
| `config/settings/base.py` | always | Shared settings across all environments |
| `config/settings/dev.py` | local development | `DEBUG=True`, relaxed CORS |
| `config/settings/prod.py` | production | `DEBUG=False`, security headers enforced |
| `config/settings/test.py` | test runner | In-memory SQLite, fast password hashing |

`manage.py` defaults to `dev`. `wsgi.py` and `asgi.py` default to `prod`.

To run with a specific settings file:

```bash
DJANGO_SETTINGS_MODULE=config.settings.test uv run python manage.py test
```
