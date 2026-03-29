"""
Dynamic database management for multi-tenant architecture.

Provides helpers to:
- Create a new PostgreSQL database for an organization
- Register an org database in Django's connection handler
- Run migrations on an org database (tenant apps only)
- Load all existing org databases on startup

All org databases inherit connection settings (host, port, user, password)
from the default database. Only the NAME differs.
"""

from __future__ import annotations

import logging

from django.core.management import call_command
from django.db import connections
from psycopg.sql import SQL, Identifier

logger = logging.getLogger(__name__)


def generate_db_name(org_id: str) -> str:
    """Generate a PostgreSQL database name from an organization UUID.

    Uses the first 12 hex characters of the UUID for uniqueness
    while keeping the name short and valid as a PG identifier.
    """
    hex_part = str(org_id).replace("-", "")[:12]
    return f"vita_org_{hex_part}"


def register_org_database(db_name: str) -> str:
    """Register an org database in Django's connection handler.

    Copies connection params from the default database and sets
    a different NAME. Returns the db_alias used for routing.

    Safe to call multiple times — skips if already registered.
    """
    db_alias = db_name

    if db_alias not in connections.databases:
        default_config = connections.databases["default"]
        connections.databases[db_alias] = {
            **default_config,
            "NAME": db_name,
        }
        logger.info("Registered org database: %s", db_alias)

    return db_alias


def create_org_database(db_name: str) -> None:
    """Create a new PostgreSQL database for an organization.

    Uses the default connection to issue CREATE DATABASE.
    Must run outside a transaction (autocommit mode).
    Uses psycopg SQL identifiers to prevent injection.
    """
    conn = connections["default"]
    conn.ensure_connection()

    old_autocommit = conn.connection.autocommit
    conn.connection.autocommit = True
    try:
        with conn.connection.cursor() as cursor:
            cursor.execute(SQL("CREATE DATABASE {}").format(Identifier(db_name)))
        logger.info("Created org database: %s", db_name)
    finally:
        conn.connection.autocommit = old_autocommit


def migrate_org_database(db_name: str) -> None:
    """Run migrations for tenant apps on an org database.

    The TenantDatabaseRouter.allow_migrate ensures only tenant-app
    tables are created in the org database.
    """
    db_alias = register_org_database(db_name)
    call_command("migrate", database=db_alias, verbosity=0)
    logger.info("Migrated org database: %s", db_alias)


def drop_org_database(db_name: str) -> None:
    """Drop an organization's database.

    Closes the Django connection first to release any open handles.
    Intended for cleanup during org deletion or test teardown.
    """
    db_alias = db_name

    if db_alias in connections:
        connections[db_alias].close()

    conn = connections["default"]
    conn.ensure_connection()

    old_autocommit = conn.connection.autocommit
    conn.connection.autocommit = True
    try:
        with conn.connection.cursor() as cursor:
            cursor.execute(SQL("DROP DATABASE IF EXISTS {}").format(Identifier(db_name)))
        logger.info("Dropped org database: %s", db_name)
    finally:
        conn.connection.autocommit = old_autocommit

    if db_alias in connections.databases:
        del connections.databases[db_alias]


def load_all_org_databases() -> None:
    """Register all active org databases in Django's connection handler.

    Called on application startup from OrganizationsConfig.ready().
    """
    from apps.organizations.constants import ORG_ACTIVE_STATUSES
    from apps.organizations.models import Organization

    count = 0
    for db_name in (
        Organization.objects.filter(status__in=ORG_ACTIVE_STATUSES).values_list("db_name", flat=True).iterator()
    ):
        register_org_database(db_name)
        count += 1

    if count:
        logger.info("Loaded %d org databases on startup", count)
