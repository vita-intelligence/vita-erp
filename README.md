# Vita ERP

A modern, cloud-native manufacturing ERP system built as a SaaS product.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| Backend | Django 5.2, Django REST Framework, Python 3.13 |
| Database | PostgreSQL 16 |
| Cache / Queue | Redis 7, Celery |
| Auth | JWT (SimpleJWT), TOTP 2FA |
| Containerization | Docker Compose (dev), Kubernetes (prod) |

## Repository Structure

```
vita-erp/
├── backend/       # Django REST API
├── frontend/      # Next.js application (coming soon)
└── docs/          # Project documentation
```

## Documentation

- [Getting started](docs/getting-started.md) — prerequisites and first-time setup
- [Running the project](docs/running.md) — daily workflow and common commands
- [Environment variables](docs/environment.md) — env vars and settings files
- [Code quality](docs/code-quality.md) — ruff, mypy, pre-commit
- [Contributing guide](CONTRIBUTING.md) — git workflow, commits, PRs
