"""
Management command: reconcile Stripe subscription quantities to reality.

Run from cron daily:
    0 3 * * * cd /app/backend && uv run python manage.py report_usage_to_stripe

For each organization with an active/trialing subscription, this command:
    - Recalculates `get_org_total_user_cost_pence(org)` from RBAC state
      and writes it to `stripe_user_item_id.quantity` — Stripe invoices
      `unit_amount (1p) × quantity = user_cost_pence` at period end.
    - Recalculates `storage_quota_gb - storage_minimum_gb` and writes it
      to `stripe_storage_item_id.quantity`.

Both updates use `proration_behavior="none"` because this is a nightly
reconciliation pass — intentional mid-cycle changes (like a user raising
their storage quota) happen through their own API endpoint and DO
prorate. This cron just catches drift (new users added, RBAC tweaked,
etc.) and ensures the next invoice matches actual state.

Idempotent: reporting the same values twice is harmless. Errors for
one org don't block the others.
"""

from __future__ import annotations

import logging
from typing import Any

import stripe
from django.core.management.base import BaseCommand

from apps.billing.constants import SUB_ACCESSIBLE_STATUSES
from apps.billing.models import BillingConfig, Subscription
from apps.billing.services.usage import get_org_total_user_cost_pence
from apps.billing.stripe_client import StripeError, StripeNotConfiguredError, get_stripe

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Report per-user and storage usage to Stripe for every active subscription."

    def add_arguments(self, parser: Any) -> None:
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Compute usage values but do not post them to Stripe.",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        dry_run: bool = bool(options.get("dry_run"))

        try:
            get_stripe()
        except StripeNotConfiguredError as exc:
            self.stderr.write(self.style.ERROR(str(exc)))
            return

        cfg = BillingConfig.load()
        subscriptions = Subscription.objects.filter(status__in=SUB_ACCESSIBLE_STATUSES).exclude(
            stripe_subscription_id="",
        )

        total = subscriptions.count()
        reported = 0
        errors = 0

        self.stdout.write(f"Reporting usage for {total} subscription(s)" + (" (dry run)" if dry_run else ""))

        for sub in subscriptions.select_related("organization"):
            try:
                self._report_one(sub, cfg, dry_run=dry_run)
                reported += 1
            except StripeError as exc:
                errors += 1
                logger.exception("Stripe error reporting usage for org %s", sub.organization.slug)
                self.stderr.write(self.style.ERROR(f"  ✗ {sub.organization.slug}: {exc}"))
            except Exception as exc:
                errors += 1
                logger.exception("Unexpected error reporting usage for org %s", sub.organization.slug)
                self.stderr.write(self.style.ERROR(f"  ✗ {sub.organization.slug}: {exc}"))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"Done — {reported} reported, {errors} failed."))

    def _report_one(self, sub: Subscription, cfg: BillingConfig, *, dry_run: bool) -> None:
        org = sub.organization
        user_cost_pence = get_org_total_user_cost_pence(org)
        storage_billable_gb = max(0, sub.storage_quota_gb - cfg.storage_minimum_gb)

        self.stdout.write(
            f"  {org.slug}: users=£{user_cost_pence / 100:.2f}, storage={storage_billable_gb} GB billable",
        )

        if dry_run:
            return

        # ── 1. User licensing line: set quantity = total user cost in pence.
        # Stripe rejects quantity=0, so we floor at 1 (a single penny).
        if sub.stripe_user_item_id:
            stripe.SubscriptionItem.modify(
                sub.stripe_user_item_id,
                quantity=max(1, user_cost_pence),
                proration_behavior="none",
            )

        # ── 2. Storage line: set quantity = GB above the included minimum.
        # Only exists after the user raises quota above the minimum — the
        # StorageQuotaUpdateView creates/deletes it on demand. The cron
        # only maintains it; it never creates or destroys.
        if sub.stripe_storage_item_id and storage_billable_gb > 0:
            stripe.SubscriptionItem.modify(
                sub.stripe_storage_item_id,
                quantity=storage_billable_gb,
                proration_behavior="none",
            )
