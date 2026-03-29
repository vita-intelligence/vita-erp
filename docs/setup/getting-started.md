# Getting Started

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.13+ | Backend runtime |
| uv | latest | Python package manager |
| Docker Desktop | latest | Runs PostgreSQL and Redis locally |
| Node.js | 20+ | Frontend runtime |

### Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## First-time setup

### 1. Install backend dependencies

```bash
cd backend
uv sync --group dev
```

Creates `.venv/` and installs everything from `uv.lock`.

### 2. Configure environment variables

```bash
# repo root — Docker service ports
cp .env.example .env

# backend — Django app config
cp backend/.env.example backend/.env
```

Edit both files as needed. See [environment.md](environment.md) for all variables.

### 3. Start services

```bash
docker compose up -d
```

### 4. Run migrations

```bash
cd backend
uv run python manage.py migrate
```

This creates all central DB tables (accounts, organizations, billing, platform_audit) and seeds the Trial plan.

### 5. Create a superuser

```bash
uv run python manage.py createsuperuser
```

### 6. Start the development server

```bash
uv run python manage.py runserver
```

The API is now available at `http://localhost:8000`.

---

## Frontend setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

The frontend is now available at `http://localhost:3000`.

---

## Post-setup flow

1. Register a user via `POST /api/v1/auth/register/`
2. Verify email (check terminal for console email)
3. Login via `POST /api/v1/auth/login/`
4. Create an organization via `POST /api/v1/organizations/`
5. The org database is provisioned automatically (PostgreSQL only, skipped in SQLite/test mode)
