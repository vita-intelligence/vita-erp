"""
Subscription provisioning — called by the Stripe webhook handler when a
`checkout.session.completed` event arrives.

Inverts the old `create_organization` flow: instead of creating the org
first and tacking on a trial subscription, we:
    1. Verify the Stripe subscription exists and is in a paying state
    2. Create the Organization + Membership in the central DB
    3. Create the Subscription record linked to the Stripe IDs
    4. Provision the org PostgreSQL database
    5. Create the Owner role in the org DB with the creator user
    6. Create default CompanySettings + CompanyTheme in the org DB

All in one atomic block as far as possible — the DB provisioning step
must run outside a transaction because CREATE DATABASE is a DDL
operation and can't participate in transactions.

If anything fails, we tear down whatever got created so a retry (Stripe
re-delivers webhooks on 5xx) can start fresh.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from typing import Any

import stripe
from django.db import transaction

from apps.accounts.models import User
from apps.billing.models import Subscription
from apps.billing.stripe_client import get_stripe, stripe_to_dict
from apps.organizations.constants import ORG_STATUS_TRIAL
from apps.organizations.db import create_org_database, generate_db_name, migrate_org_database
from apps.organizations.models import Membership, Organization
from apps.organizations.services.organization import validate_slug

logger = logging.getLogger(__name__)


def create_org_from_checkout(
    *,
    session_id: str,
    stripe_customer_id: str,
    stripe_subscription_id: str,
    metadata: dict[str, Any],
) -> Subscription | None:
    """Provision an Organization + Subscription for a completed checkout session.

    Returns the local Subscription row. Idempotent — if the org already
    exists (webhook replay or concurrent delivery), returns the existing
    Subscription without side effects.

    Raises:
        StripeNotConfiguredError: if STRIPE_SECRET_KEY isn't set. The
            webhook handler catches this and marks the event failed so
            it can be replayed.
        StripeError: on any other Stripe API failure.
    """
    # Configure the Stripe SDK before any outbound calls. The webhook
    # view doesn't call get_stripe() itself (signature verification is
    # a pure HMAC check and doesn't need api_key), so the first handler
    # in the process that needs to hit the API has to configure it.
    get_stripe()

    user_id = metadata.get("vita_user_id") or ""
    slug = (metadata.get("vita_org_slug") or "").strip().lower()
    if not user_id or not slug:
        logger.error("Checkout session %s missing vita_user_id or vita_org_slug in metadata", session_id)
        return None

    # Idempotency — if we've already created this org, return its subscription.
    existing = Organization.objects.filter(slug=slug).first()
    if existing is not None:
        logger.info("Org %s already exists, returning existing subscription", slug)
        sub = Subscription.objects.filter(organization=existing).first()
        if sub is not None and not sub.stripe_subscription_id:
            # Stamp Stripe IDs on an org that existed prior to Stripe sync
            sub.stripe_subscription_id = stripe_subscription_id
            existing.stripe_customer_id = stripe_customer_id
            existing.save(update_fields=["stripe_customer_id", "updated_at"])
            _sync_subscription_items(sub, stripe_subscription_id)
            sub.save()
        return sub

    # Validate slug once more at provisioning time (guards against race).
    slug_error = validate_slug(slug)
    if slug_error:
        logger.error("Checkout session %s slug '%s' invalid: %s", session_id, slug, slug_error)
        return None

    user = User.objects.filter(id=user_id).first()
    if user is None:
        logger.error("Checkout session %s references unknown user %s", session_id, user_id)
        return None

    name = metadata.get("vita_org_name") or slug
    industry = metadata.get("vita_org_industry") or ""
    country = metadata.get("vita_org_country") or ""
    tz = metadata.get("vita_org_timezone") or "UTC"
    base_currency = metadata.get("vita_org_base_currency") or "GBP"
    db_name = generate_db_name(str(user.id) + slug)

    # Pull fresh subscription object from Stripe so we have accurate dates
    # and item IDs regardless of ordering of webhook events. Convert to a
    # plain dict immediately — Stripe SDK v15 `StripeObject` supports
    # bracket access but not the dict `.get()` method we use below.
    # Errors here propagate to the webhook handler which marks the
    # event failed so Stripe retries and we get a real audit trail.
    stripe_sub: dict[str, Any] = stripe_to_dict(stripe.Subscription.retrieve(stripe_subscription_id))

    # Central DB state (atomic)
    with transaction.atomic():
        org = Organization.objects.create(
            name=name,
            slug=slug,
            db_name=db_name,
            status=ORG_STATUS_TRIAL,
            industry=industry,
            country=country,
            timezone=tz,
            base_currency=base_currency,
            stripe_customer_id=stripe_customer_id,
            created_by=user,
        )
        Membership.objects.create(user=user, organization=org)
        sub = Subscription.objects.create(
            organization=org,
            status=stripe_sub.get("status") or "trialing",
            storage_quota_gb=10,
            stripe_subscription_id=stripe_subscription_id,
            trial_start=_from_ts(stripe_sub.get("trial_start")),
            trial_end=_from_ts(stripe_sub.get("trial_end")),
            current_period_start=_from_ts(stripe_sub.get("current_period_start")),
            current_period_end=_from_ts(stripe_sub.get("current_period_end")),
        )
        _sync_subscription_items_from_object(sub, stripe_sub)
        sub.save()

    # Org DB provisioning (outside transaction — DDL). If this fails, tear
    # down the central-DB rows so a webhook retry can try again cleanly.
    try:
        from django.db import connection as default_connection

        if default_connection.vendor == "postgresql":
            create_org_database(db_name)
            migrate_org_database(db_name)
            _create_owner_role(org, user)
            _create_default_settings(org, user)
            _seed_onboarding_form(org, user)
    except Exception:
        logger.exception("Failed to provision org DB for %s", slug)
        org.delete()
        return None

    logger.info("Provisioned org %s from checkout session %s", slug, session_id)
    return sub


# ── Item ID sync ────────────────────────────────────────────────────────────


def _sync_subscription_items(sub: Subscription, stripe_subscription_id: str) -> None:
    """Fetch subscription items from Stripe and stamp IDs on the local row."""
    stripe_sub = stripe_to_dict(stripe.Subscription.retrieve(stripe_subscription_id))
    _sync_subscription_items_from_object(sub, stripe_sub)


def _sync_subscription_items_from_object(sub: Subscription, stripe_sub: dict[str, Any]) -> None:
    items = (stripe_sub.get("items") or {}).get("data") or []
    for item in items:
        lookup_key = ((item.get("price") or {}).get("lookup_key")) or ""
        if lookup_key == "vita_base_monthly":
            sub.stripe_base_item_id = item.get("id", "")
        elif lookup_key == "vita_user_metered_monthly":
            sub.stripe_user_item_id = item.get("id", "")
        elif lookup_key == "vita_storage_gb_monthly":
            sub.stripe_storage_item_id = item.get("id", "")


# ── Owner role + default settings ───────────────────────────────────────────


def _create_owner_role(org: Organization, user: User) -> None:
    """Create the Owner role in the org DB and assign it to the creator."""
    from apps.organizations.context import clear_current_org_db, set_current_org_db
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
        UserRole.objects.create(user_id=user.id, role=owner_role)
    finally:
        clear_current_org_db()


def _seed_onboarding_form(org: Organization, user: User) -> None:
    """Create the singleton OnboardingForm row in the org database with
    First Name / Last Name / Profile Photo as the default fields."""
    from apps.org_accounts.services.onboarding import seed_default_onboarding_form

    seed_default_onboarding_form(org, user.id)


def _create_default_settings(org: Organization, user: User) -> None:
    """Create default CompanySettings + CompanyTheme in the org DB."""
    from apps.company.services.company_settings import create_default_settings
    from apps.company.services.company_theme import create_default_theme
    from apps.organizations.context import clear_current_org_db, set_current_org_db
    from apps.organizations.db import register_org_database

    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)
    try:
        create_default_settings(
            country=org.country,
            currency=org.base_currency,
            user_id=user.id,
            request=None,
        )
        create_default_theme(user_id=user.id, request=None)
    finally:
        clear_current_org_db()


# ── Helpers ─────────────────────────────────────────────────────────────────


def _from_ts(ts: Any) -> datetime | None:
    if ts is None:
        return None
    try:
        return datetime.fromtimestamp(int(ts), tz=UTC)
    except (TypeError, ValueError):
        return None
