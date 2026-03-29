"""
TenantDatabaseRouter — routes queries to the correct database.

Central DB apps (accounts, organizations, billing, platform_audit)
always use the 'default' database.

Org DB apps (rbac, audit, and all future ERP modules) use whichever
database the TenantMiddleware set via contextvars for the current request.

If no org context is set and a tenant app is queried, falls back to
'default'. This allows migrations and shell commands to work without
an active request.
"""

from __future__ import annotations

from typing import Any

from apps.organizations.context import get_current_org_db

# Apps whose tables live in the central (default) database.
# Add new central-DB apps here as they are created.
SHARED_APPS = frozenset(
    {
        "accounts",
        "organizations",
        "billing",
        "platform_audit",
        # Django built-in apps
        "admin",
        "auth",
        "contenttypes",
        "sessions",
    }
)


class TenantDatabaseRouter:
    """Routes shared apps to 'default' and tenant apps to the active org DB."""

    @staticmethod
    def _resolve_db(model: type, **hints: Any) -> str | None:
        app_label = model._meta.app_label  # type: ignore[attr-defined]
        if app_label in SHARED_APPS:
            return "default"
        org_db = get_current_org_db()
        return org_db if org_db else "default"

    def db_for_read(self, model: type, **hints: Any) -> str | None:
        return self._resolve_db(model, **hints)

    def db_for_write(self, model: type, **hints: Any) -> str | None:
        return self._resolve_db(model, **hints)

    def allow_relation(self, obj1: Any, obj2: Any, **hints: Any) -> bool | None:
        """Only allow relations between objects in the same database."""
        db1 = self._resolve_db(type(obj1))
        db2 = self._resolve_db(type(obj2))
        return db1 == db2

    def allow_migrate(self, db: str, app_label: str, **hints: Any) -> bool | None:
        """Control which apps get migrated on which database.

        - 'default' database: only shared apps
        - org databases: only tenant apps
        """
        if db == "default":
            return app_label in SHARED_APPS
        # Org database — only tenant apps
        return app_label not in SHARED_APPS
