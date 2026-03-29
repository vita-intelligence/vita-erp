# Vita ERP

A modern, cloud-native manufacturing ERP system built as a SaaS product.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, HeroUI v3 |
| Backend | Django 5.2, Django REST Framework, Python 3.13 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | Cookie-based JWT (SimpleJWT), email verification, session management |
| Testing | pytest + factory-boy (backend), Biome (frontend) |
| CI/CD | GitHub Actions |
| Containerization | Docker Compose (dev) |

## Repository Structure

```
vita-erp/
├── backend/           # Django REST API
│   ├── apps/          # Django apps (accounts, ...)
│   ├── config/        # Settings, URLs, WSGI/ASGI
│   └── locale/        # Backend translations (.po/.mo)
├── frontend/          # Next.js application
│   ├── src/           # App source code
│   ├── messages/      # Frontend translations (14 languages)
│   └── tests/         # Test schemas
├── docs/              # Project documentation
└── .github/           # CI workflows, issue templates
```

## Documentation

### Setup
- [Getting started](docs/getting-started.md) — prerequisites and first-time setup
- [Running the project](docs/running.md) — daily workflow and common commands
- [Environment variables](docs/environment.md) — all env vars and settings files

### Architecture
- [Frontend](docs/frontend.md) — stack, structure, components, theming
- [Backend](docs/backend.md) — apps, models, services, API endpoints
- [Authentication](docs/auth.md) — JWT cookies, sessions, verification, security

### Quality
- [Code quality](docs/code-quality.md) — ruff, mypy, biome, pre-commit
- [Testing](docs/testing.md) — pytest, factories, running tests
- [CI/CD](docs/ci.md) — GitHub Actions workflows

### Process
- [Internationalisation](docs/i18n.md) — 14 languages, frontend + backend
- [Contributing guide](CONTRIBUTING.md) — git workflow, commits, PRs
