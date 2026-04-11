"""
Management command: sync BillingConfig + active AddOns to Stripe.

Example:
    uv run python manage.py sync_billing_to_stripe

Prerequisites:
    STRIPE_SECRET_KEY must be set in the environment. Use a test key
    (`sk_test_*`) in development and the corresponding live key in prod.

What it does:
    1. Ensures a single "Vita ERP Subscription" Product exists in Stripe.
    2. Creates (or reuses) three Prices — base flat fee, metered per-user
       line, and per-GB storage line — and stores their IDs on the
       BillingConfig singleton.
    3. Creates (or reuses) a Product + Price per active AddOn row.
    4. On any admin-edited price change, archives the old Stripe Price
       and creates a replacement under the same `lookup_key`.

The command is idempotent: running it twice in a row should only print
"reused" lines.
"""

from __future__ import annotations

from typing import Any

from django.core.management.base import BaseCommand, CommandError

from apps.billing.services.stripe_sync import sync_billing_to_stripe
from apps.billing.stripe_client import StripeError, StripeNotConfiguredError


class Command(BaseCommand):
    help = (
        "Sync the BillingConfig singleton and all active AddOn rows to Stripe "
        "as Products and Prices. Idempotent — safe to re-run."
    )

    def handle(self, *args: Any, **options: Any) -> None:
        self.stdout.write("Syncing billing config to Stripe...\n")

        try:
            report = sync_billing_to_stripe()
        except StripeNotConfiguredError as exc:
            raise CommandError(str(exc)) from exc
        except StripeError as exc:
            raise CommandError(f"Stripe API error: {exc}") from exc

        self.stdout.write("")
        self.stdout.write(report.format())
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Sync complete."))
