"""
Tenant context — stores the active org database alias for the current request.

Uses contextvars (not threading.local) so it works correctly with both
WSGI (sync) and ASGI (async) Django deployments.

The TenantMiddleware sets this on each request. The TenantDatabaseRouter
reads it to route queries to the correct org database.
"""

from contextvars import ContextVar

_current_org_db: ContextVar[str | None] = ContextVar("current_org_db", default=None)


def set_current_org_db(db_alias: str) -> None:
    """Set the active org database for the current request context."""
    _current_org_db.set(db_alias)


def get_current_org_db() -> str | None:
    """Get the active org database alias. Returns None if no org context is set."""
    return _current_org_db.get()


def clear_current_org_db() -> None:
    """Reset the org database context. Called after each request completes."""
    _current_org_db.set(None)
