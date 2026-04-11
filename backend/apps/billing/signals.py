"""
Billing signals — keep Stripe in sync with local model changes.

Two categories:

1. **Config changes** (`BillingConfig`, `PermissionPrice`, `AddOn`) — when
   an admin edits a price in `/admin/`, we push the new values to Stripe
   immediately on save. This replaces manual `sync_billing_to_stripe`
   runs for day-to-day price tweaks; the management command is still
   useful for the initial bootstrap and for CI deploys.

2. **Usage changes** (future) — RBAC mutations will eventually trigger
   a per-org re-sync of the user subscription item quantity. Not wired
   yet — the daily reconciliation cron handles this for now.

All handlers are best-effort: if Stripe isn't configured (dev without a
key, CI, tests) or a call fails, we log and move on rather than break
whatever admin action triggered the save. The daily cron catches any
drift left behind.
"""

from __future__ import annotations

import logging
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.billing.models import AddOn, BillingConfig, PermissionPrice
from apps.billing.stripe_client import StripeError, StripeNotConfiguredError

logger = logging.getLogger(__name__)

# Fields that only the sync itself updates. When the signal sees a save
# that only touches these, it's a re-entry from the sync and should bail
# out to avoid infinite loops.
_SYNC_OWNED_FIELDS = frozenset(
    {
        "stripe_product_id",
        "stripe_base_price_id",
        "stripe_user_metered_price_id",
        "stripe_storage_price_id",
        "stripe_price_id",
        "updated_at",
    }
)


def _is_sync_owned_update(update_fields: frozenset[str] | None) -> bool:
    if not update_fields:
        return False
    return all(f in _SYNC_OWNED_FIELDS for f in update_fields)


def _run_sync(reason: str) -> None:
    """Invoke `sync_billing_to_stripe` defensively.

    Imported lazily so a startup-time circular import can't break the
    app registry, and so environments without Stripe config (tests,
    fresh dev clones) can still run admin saves.
    """
    from apps.billing.services.stripe_sync import sync_billing_to_stripe

    try:
        sync_billing_to_stripe()
        logger.info("Auto-synced billing to Stripe (%s)", reason)
    except StripeNotConfiguredError:
        logger.debug("Skipping auto-sync (%s) — STRIPE_SECRET_KEY not set", reason)
    except StripeError as exc:
        logger.exception("Auto-sync to Stripe failed (%s): %s", reason, exc)
    except Exception:
        logger.exception("Unexpected error auto-syncing billing (%s)", reason)


@receiver(post_save, sender=BillingConfig)
def sync_on_billing_config_save(
    sender: Any,
    instance: BillingConfig,
    created: bool,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    if _is_sync_owned_update(update_fields):
        return
    _run_sync(reason=f"BillingConfig {'created' if created else 'updated'}")


@receiver(post_save, sender=PermissionPrice)
def sync_on_permission_price_save(
    sender: Any,
    instance: PermissionPrice,
    created: bool,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    # PermissionPrice changes only affect the per-user reconciler, not
    # the Stripe Price catalog — the metered user line has a fixed
    # unit_amount of 1 penny. No Stripe sync needed; the daily cron
    # will pick up the new prices on its next run.
    logger.debug("PermissionPrice saved — next usage reconcile will pick it up")


@receiver(post_save, sender=AddOn)
def sync_on_addon_save(
    sender: Any,
    instance: AddOn,
    created: bool,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    if _is_sync_owned_update(update_fields):
        return
    _run_sync(reason=f"AddOn {instance.slug} {'created' if created else 'updated'}")
