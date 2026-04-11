"""
Stripe sync service — pushes BillingConfig + active AddOns to Stripe.

This module owns the mapping between our local billing tables and Stripe's
Product/Price catalog. The sync is idempotent: running it twice does
nothing if nothing has changed. When an admin edits a price in Django
admin (e.g., bumps `base_price_pence` from 19900 to 24900), the next sync
archives the old Stripe Price and creates a new one with the same
`lookup_key` so any links or Checkout sessions referencing the key keep
working.

Stripe Prices are immutable for their `unit_amount` and `recurring`
fields, so "update" always means "archive old + create new." Existing
subscriptions continue billing at the old price until they're migrated
explicitly — that's a separate flow, not part of this sync.

Usage:
    from apps.billing.services.stripe_sync import sync_billing_to_stripe
    report = sync_billing_to_stripe()
    print(report.format())
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

import stripe

from apps.billing.models import AddOn, BillingConfig
from apps.billing.stripe_client import InvalidRequestError, get_stripe

logger = logging.getLogger(__name__)

# ── Static metadata ─────────────────────────────────────────────────────────
PRODUCT_NAME = "Vita ERP Subscription"
PRODUCT_DESCRIPTION = (
    "Vita ERP platform subscription — flat base fee, metered per-user licensing, and storage overage."
)

# Stable lookup keys so a re-sync after a price change can re-attach the
# key to the new Stripe Price via `transfer_lookup_key=True`.
LOOKUP_KEY_BASE = "vita_base_monthly"
LOOKUP_KEY_USER_METERED = "vita_user_metered_monthly"
LOOKUP_KEY_STORAGE = "vita_storage_gb_monthly"

# Metadata key used to mark records this project owns. Lets an operator
# distinguish vita-managed Stripe objects from anything created manually
# in the dashboard.
METADATA_MANAGED = {"vita_managed": "true"}


# ── Report types ────────────────────────────────────────────────────────────


@dataclass
class PriceSync:
    """Result of syncing one price slot."""

    slot: str
    created: bool = False
    reused: bool = False
    archived_old: bool = False
    stripe_price_id: str = ""


@dataclass
class AddOnSync:
    """Result of syncing one AddOn row."""

    slug: str
    created: bool = False
    reused: bool = False
    archived_old: bool = False


@dataclass
class SyncReport:
    """Structured report returned by `sync_billing_to_stripe` and rendered
    by the management command for CLI output."""

    product_id: str = ""
    product_created: bool = False
    product_reused: bool = False
    prices: list[PriceSync] = field(default_factory=list)
    addons: list[AddOnSync] = field(default_factory=list)

    def format(self) -> str:
        """Render a human-readable summary for the CLI."""
        lines: list[str] = []

        if self.product_created:
            lines.append(f"  [+] Product created: {self.product_id}")
        elif self.product_reused:
            lines.append(f"  [=] Product reused:  {self.product_id}")

        for price in self.prices:
            marker = "[+]" if price.created else "[=]"
            verb = "created" if price.created else "reused "
            archive_note = "  (old archived)" if price.archived_old else ""
            lines.append(f"  {marker} {price.slot:<14} price {verb}: {price.stripe_price_id}{archive_note}")

        if self.addons:
            for addon in self.addons:
                marker = "[+]" if addon.created else "[=]"
                verb = "created" if addon.created else "reused "
                archive_note = "  (old archived)" if addon.archived_old else ""
                lines.append(f"  {marker} add-on {addon.slug!r} {verb}{archive_note}")
        else:
            lines.append("  (no active add-ons to sync)")

        return "\n".join(lines)


# ── Entry point ─────────────────────────────────────────────────────────────


def sync_billing_to_stripe() -> SyncReport:
    """Push BillingConfig + active AddOns to Stripe. Idempotent."""
    get_stripe()  # Side effect: validates STRIPE_SECRET_KEY, raises if missing.

    cfg = BillingConfig.load()
    report = SyncReport()

    # Step 1 — Product
    report.product_id = _ensure_product(cfg, report)

    # Step 2 — Core prices (base, user-metered, storage)
    report.prices.append(
        _sync_price(
            slot="base",
            product_id=report.product_id,
            current_id=cfg.stripe_base_price_id,
            lookup_key=LOOKUP_KEY_BASE,
            currency=cfg.currency,
            desired_unit_amount=cfg.base_price_pence,
            desired_recurring={"interval": "month"},
        )
    )
    cfg.stripe_base_price_id = report.prices[-1].stripe_price_id
    cfg.save(update_fields=["stripe_base_price_id", "updated_at"])

    report.prices.append(
        _sync_price(
            slot="user_metered",
            product_id=report.product_id,
            current_id=cfg.stripe_user_metered_price_id,
            lookup_key=LOOKUP_KEY_USER_METERED,
            currency=cfg.currency,
            # Unit = 1 penny so the daily reconciler can set the quantity
            # directly to the running total user cost in pence. This is NOT a
            # Stripe metered price — those were replaced by Billing Meters in
            # API version 2025-03-31.basil. We instead use a regular recurring
            # per-unit price and mutate `subscription_item.quantity` to match
            # current usage. Result is equivalent: Stripe invoices
            # `unit_amount × quantity = user_cost_pence` each cycle.
            desired_unit_amount=1,
            desired_recurring={"interval": "month"},
        )
    )
    cfg.stripe_user_metered_price_id = report.prices[-1].stripe_price_id
    cfg.save(update_fields=["stripe_user_metered_price_id", "updated_at"])

    report.prices.append(
        _sync_price(
            slot="storage",
            product_id=report.product_id,
            current_id=cfg.stripe_storage_price_id,
            lookup_key=LOOKUP_KEY_STORAGE,
            currency=cfg.currency,
            desired_unit_amount=cfg.storage_price_per_gb_pence,
            desired_recurring={"interval": "month"},
        )
    )
    cfg.stripe_storage_price_id = report.prices[-1].stripe_price_id
    cfg.save(update_fields=["stripe_storage_price_id", "updated_at"])

    # Step 3 — Active add-ons (may be empty — Phase 1 ships with none)
    for addon in AddOn.objects.filter(is_active=True):
        report.addons.append(_sync_addon(addon, currency=cfg.currency))

    logger.info("Stripe billing sync complete: product=%s", report.product_id)
    return report


# ── Product helpers ─────────────────────────────────────────────────────────


def _ensure_product(cfg: BillingConfig, report: SyncReport) -> str:
    """Fetch the existing product by stored ID, or create a new one."""
    if cfg.stripe_product_id:
        try:
            product = stripe.Product.retrieve(cfg.stripe_product_id)
            if product.active:
                report.product_reused = True
                return product.id
            logger.info(
                "Stored product %s is archived in Stripe, creating a fresh one",
                cfg.stripe_product_id,
            )
        except InvalidRequestError:
            logger.warning(
                "Stored product %s not found in Stripe, creating a fresh one",
                cfg.stripe_product_id,
            )

    new_product = stripe.Product.create(
        name=PRODUCT_NAME,
        description=PRODUCT_DESCRIPTION,
        metadata=METADATA_MANAGED,
    )
    cfg.stripe_product_id = new_product.id
    cfg.save(update_fields=["stripe_product_id", "updated_at"])
    report.product_created = True
    return new_product.id


# ── Price helpers ───────────────────────────────────────────────────────────


def _sync_price(
    *,
    slot: str,
    product_id: str,
    current_id: str,
    lookup_key: str,
    currency: str,
    desired_unit_amount: int,
    desired_recurring: dict[str, Any],
) -> PriceSync:
    """Reuse the current price if it matches; otherwise archive and recreate."""
    result = PriceSync(slot=slot)

    if current_id:
        try:
            existing = stripe.Price.retrieve(current_id)
            if _price_matches(existing, desired_unit_amount, desired_recurring):
                result.reused = True
                result.stripe_price_id = current_id
                return result
            # Config drifted — Stripe Prices are immutable for unit_amount and
            # recurring, so archive the stale one and create a replacement.
            stripe.Price.modify(current_id, active=False)
            result.archived_old = True
            logger.info("Archived stale price %s (slot=%s)", current_id, slot)
        except InvalidRequestError:
            logger.warning("Price %s not found in Stripe (slot=%s), creating new", current_id, slot)

    new_price = stripe.Price.create(
        product=product_id,
        unit_amount=desired_unit_amount,
        currency=currency,
        recurring=desired_recurring,  # type: ignore[arg-type]
        lookup_key=lookup_key,
        transfer_lookup_key=True,
        metadata={**METADATA_MANAGED, "vita_slot": slot},
    )
    result.created = True
    result.stripe_price_id = new_price.id
    return result


def _price_matches(
    existing: Any,
    desired_unit_amount: int,
    desired_recurring: dict[str, Any],
) -> bool:
    """Decide whether a live Stripe Price is still fit for reuse.

    Stripe SDK v15 `StripeObject` supports bracket access but NOT the
    dict `.get()` method, so we access nested fields via `[]` with
    KeyError handling.
    """
    if not existing.active:
        return False
    if existing.unit_amount != desired_unit_amount:
        return False
    existing_recurring = existing.recurring
    if existing_recurring is None:
        return not desired_recurring
    for key, value in desired_recurring.items():
        try:
            if existing_recurring[key] != value:
                return False
        except (KeyError, AttributeError):
            return False
    return True


# ── Add-on helpers ──────────────────────────────────────────────────────────


def _sync_addon(addon: AddOn, *, currency: str) -> AddOnSync:
    """Create or reuse a Stripe Product + Price for one AddOn row."""
    result = AddOnSync(slug=addon.slug)

    # ── Product ─────────────────────────────────────────────────────────────
    if addon.stripe_product_id:
        try:
            stripe.Product.retrieve(addon.stripe_product_id)
        except InvalidRequestError:
            logger.warning("AddOn product %s not found, recreating", addon.stripe_product_id)
            addon.stripe_product_id = ""

    if not addon.stripe_product_id:
        product_kwargs: dict[str, Any] = {
            "name": addon.name,
            "metadata": {**METADATA_MANAGED, "vita_addon_slug": addon.slug},
        }
        if addon.description:
            product_kwargs["description"] = addon.description
        new_product = stripe.Product.create(**product_kwargs)
        addon.stripe_product_id = new_product.id

    # ── Price ───────────────────────────────────────────────────────────────
    is_recurring = addon.billing_type == AddOn.BILLING_TYPE_RECURRING

    if addon.stripe_price_id:
        try:
            existing = stripe.Price.retrieve(addon.stripe_price_id)
            if _addon_price_matches(existing, addon.price_pence, is_recurring=is_recurring):
                result.reused = True
                addon.save(update_fields=["stripe_product_id", "updated_at"])
                return result
            stripe.Price.modify(addon.stripe_price_id, active=False)
            result.archived_old = True
        except InvalidRequestError:
            logger.warning("AddOn price %s not found, recreating", addon.stripe_price_id)

    price_kwargs: dict[str, Any] = {
        "product": addon.stripe_product_id,
        "unit_amount": addon.price_pence,
        "currency": currency,
        "lookup_key": f"vita_addon_{addon.slug}",
        "transfer_lookup_key": True,
        "metadata": {**METADATA_MANAGED, "vita_addon_slug": addon.slug},
    }
    if is_recurring:
        price_kwargs["recurring"] = {"interval": "month"}

    new_price = stripe.Price.create(**price_kwargs)
    addon.stripe_price_id = new_price.id
    addon.save(update_fields=["stripe_product_id", "stripe_price_id", "updated_at"])
    result.created = True
    return result


def _addon_price_matches(existing: Any, desired_unit_amount: int, *, is_recurring: bool) -> bool:
    """Decide whether a live AddOn Stripe Price is still fit for reuse."""
    if not existing.active:
        return False
    if existing.unit_amount != desired_unit_amount:
        return False
    if not is_recurring:
        return existing.recurring is None
    if existing.recurring is None:
        return False
    try:
        return bool(existing.recurring["interval"] == "month")
    except (KeyError, AttributeError):
        return False
