"""
Organization service — orchestrates org creation and lifecycle.

create_organization() is the main entry point. It performs all steps
atomically in the central DB, then provisions the org database.

Steps:
1. Validate slug uniqueness and format
2. Create Organization record (central DB)
3. Create Membership (owner) record (central DB)
4. Create trial Subscription (central DB)
5. Create PostgreSQL database for the org
6. Run tenant migrations on the new database
7. Create Owner role with all permissions in the org database
8. Log audit event
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from apps.billing.constants import SUB_STATUS_TRIALING, TRIAL_DURATION_DAYS
from apps.organizations.constants import (
    AUDIT_ORG_CREATED,
    MAX_ORGS_PER_USER,
    ORG_STATUS_TRIAL,
    RESERVED_SLUGS,
    SLUG_MAX_LENGTH,
    SLUG_MIN_LENGTH,
)
from apps.organizations.db import (
    create_org_database,
    generate_db_name,
    migrate_org_database,
)
from apps.organizations.models import Membership, Organization

if TYPE_CHECKING:
    from django.http import HttpRequest

    from apps.accounts.models import User

logger = logging.getLogger(__name__)


def validate_slug(slug: str) -> str | None:
    """Validate and normalize an org slug. Returns error code or None."""
    slug = slug.lower().strip()

    if len(slug) < SLUG_MIN_LENGTH:
        return "slug_too_short"
    if len(slug) > SLUG_MAX_LENGTH:
        return "slug_too_long"
    if slug in RESERVED_SLUGS:
        return "slug_reserved"
    if Organization.objects.filter(slug=slug).exists():
        return "slug_taken"
    return None


def generate_slug(name: str) -> str:
    """Generate a URL-safe slug from an organization name."""
    slug = slugify(name)[:SLUG_MAX_LENGTH]
    if not slug or len(slug) < SLUG_MIN_LENGTH:
        return ""

    if not Organization.objects.filter(slug=slug).exists():
        return slug

    # Append a short suffix to avoid collisions
    for i in range(2, 100):
        candidate = f"{slug[: SLUG_MAX_LENGTH - len(str(i)) - 1]}-{i}"
        if not Organization.objects.filter(slug=candidate).exists():
            return candidate

    return ""


def check_org_creation_allowed(user: User) -> str | None:
    """Check if the user is allowed to create a new organization.

    Returns error code or None if allowed.
    """
    active_count = Membership.objects.filter(
        user=user,
        is_active=True,
    ).count()

    if active_count >= MAX_ORGS_PER_USER:
        return "max_orgs_reached"
    return None


def create_organization(
    user: User,
    name: str,
    slug: str,
    industry: str = "",
    country: str = "",
    timezone_str: str = "UTC",
    base_currency: str = "USD",
    request: HttpRequest | None = None,
) -> tuple[Organization, str | None]:
    """Create a new organization with all related records.

    Returns (organization, error_code). On success error_code is None.
    On failure organization is None and error_code describes the issue.
    """
    # Pre-checks
    rate_error = check_org_creation_allowed(user)
    if rate_error:
        return None, rate_error  # type: ignore[return-value]

    slug_error = validate_slug(slug)
    if slug_error:
        return None, slug_error  # type: ignore[return-value]

    db_name = generate_db_name(str(user.id) + slug)

    # Step 1-4: Central DB records (atomic)
    with transaction.atomic():
        org = Organization.objects.create(
            name=name,
            slug=slug,
            db_name=db_name,
            status=ORG_STATUS_TRIAL,
            industry=industry,
            country=country,
            timezone=timezone_str,
            base_currency=base_currency,
            created_by=user,
        )

        Membership.objects.create(
            user=user,
            organization=org,
        )

        _create_trial_subscription(org)

        if request:
            _log_org_created(user, org, request)

    # Step 5-7: Org database provisioning (outside transaction — DDL)
    # Skipped when using SQLite (test environment) since CREATE DATABASE
    # is a PostgreSQL-only operation.
    if _is_postgres():
        try:
            create_org_database(db_name)
            migrate_org_database(db_name)
            _create_owner_role(org, user)
            _create_company_settings(org, user, request)
            _create_company_theme(org, user, request)
        except Exception:
            logger.exception("Failed to provision org database: %s", db_name)
            org.delete()
            return None, "org_provisioning_failed"  # type: ignore[return-value]

    logger.info("Organization created: %s (db=%s)", org.slug, db_name)
    return org, None


def _create_trial_subscription(org: Organization) -> None:
    """Create a trial subscription for the organization."""
    from apps.billing.models import Plan, Subscription

    trial_plan = Plan.objects.filter(is_trial=True, is_active=True).first()
    if not trial_plan:
        logger.warning("No active trial plan found — creating subscription without plan")
        return

    now = timezone.now()
    from datetime import timedelta

    Subscription.objects.create(
        organization=org,
        plan=trial_plan,
        status=SUB_STATUS_TRIALING,
        trial_start=now,
        trial_end=now + timedelta(days=TRIAL_DURATION_DAYS),
        current_period_start=now,
        current_period_end=now + timedelta(days=TRIAL_DURATION_DAYS),
    )


def _create_owner_role(org: Organization, user: User) -> None:
    """Create the Owner system role in the org database with all permissions."""
    from apps.organizations.context import set_current_org_db
    from apps.organizations.db import register_org_database
    from apps.rbac.constants import ROLE_OWNER
    from apps.rbac.models import Role, UserRole

    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)

    try:
        owner_role = Role.objects.create(
            name=ROLE_OWNER,
            description="Full access to all modules and actions. Cannot be deleted.",
            is_system=True,
        )

        UserRole.objects.create(
            user_id=user.id,
            role=owner_role,
        )

        logger.info("Owner role created for org %s, user %s", org.slug, user.id)
    finally:
        from apps.organizations.context import clear_current_org_db

        clear_current_org_db()


def _create_company_settings(
    org: Organization,
    user: User,
    request: HttpRequest | None = None,
) -> None:
    """Create default CompanySettings in the org database."""
    from apps.company.services.company_settings import create_default_settings
    from apps.organizations.context import clear_current_org_db, set_current_org_db
    from apps.organizations.db import register_org_database

    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)

    try:
        create_default_settings(
            country=org.country,
            currency=org.base_currency,
            user_id=user.id,
            request=request,
        )
        logger.info("CompanySettings created for org %s", org.slug)
    finally:
        clear_current_org_db()


def _create_company_theme(
    org: Organization,
    user: User,
    request: HttpRequest | None = None,
) -> None:
    """Create default CompanyTheme in the org database."""
    from apps.company.services.company_theme import create_default_theme
    from apps.organizations.context import clear_current_org_db, set_current_org_db
    from apps.organizations.db import register_org_database

    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)

    try:
        create_default_theme(user_id=user.id, request=request)
        logger.info("CompanyTheme created for org %s", org.slug)
    finally:
        clear_current_org_db()


def _is_postgres() -> bool:
    """Check if the default database is PostgreSQL."""
    from django.db import connections

    engine = connections.databases["default"].get("ENGINE", "")
    return "postgresql" in engine


def _log_org_created(user: User, org: Organization, request: HttpRequest) -> None:
    """Log organization creation to the platform audit log."""
    from apps.accounts.services.auth import log_auth_event

    log_auth_event(
        user=user,
        action=AUDIT_ORG_CREATED,
        request=request,
        metadata={
            "org_id": str(org.id),
            "org_name": org.name,
            "org_slug": org.slug,
        },
    )
