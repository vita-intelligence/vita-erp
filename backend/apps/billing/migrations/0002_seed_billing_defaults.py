"""
Seed the singleton BillingConfig row and default PermissionPrice entries.

Prices are stored in pence as integers to avoid Decimal/float rounding
across the Stripe boundary. All values are editable in Django admin after
first boot — this migration only ensures sane starting defaults.
"""

from __future__ import annotations

import uuid

from django.db import migrations

# ── BillingConfig defaults ─────────────────────────────────────────────────
# £199/mo flat base, 10 GB included, £2/GB overage, 14-day trial, GBP.
BASE_PRICE_PENCE = 19900
STORAGE_MINIMUM_GB = 10
STORAGE_PRICE_PER_GB_PENCE = 200
TRIAL_DURATION_DAYS = 14
CURRENCY = "gbp"

# ── PermissionPrice defaults (pence per user per month) ───────────────────
# Cross-product of (module, action) — only the combos that make product sense.
ACTION_PRICES = {
    "read": 200,  # £2.00
    "write": 500,  # £5.00
    "delete": 300,  # £3.00
    "export": 100,  # £1.00
    "manage": 800,  # £8.00
}

MODULES_WITH_ACTIONS: dict[str, list[str]] = {
    "company_settings": ["read", "write", "manage"],
    "company_theme": ["read", "write", "manage"],
    "organogram": ["read", "write", "delete", "manage"],
    "accounts": ["read", "write", "delete", "manage"],
    "billing": ["read", "write", "manage"],
}


def seed(apps, schema_editor):
    BillingConfig = apps.get_model("billing", "BillingConfig")
    PermissionPrice = apps.get_model("billing", "PermissionPrice")

    # Singleton billing config
    BillingConfig.objects.get_or_create(
        defaults={
            "id": uuid.uuid4(),
            "base_price_pence": BASE_PRICE_PENCE,
            "storage_minimum_gb": STORAGE_MINIMUM_GB,
            "storage_price_per_gb_pence": STORAGE_PRICE_PER_GB_PENCE,
            "trial_duration_days": TRIAL_DURATION_DAYS,
            "currency": CURRENCY,
        },
    )

    # Permission prices — one row per (module, action) combo in MODULES_WITH_ACTIONS
    for module_code, actions in MODULES_WITH_ACTIONS.items():
        for action in actions:
            PermissionPrice.objects.update_or_create(
                module_code=module_code,
                action=action,
                defaults={
                    "id": uuid.uuid4(),
                    "price_pence": ACTION_PRICES[action],
                    "description": f"{module_code}.{action}",
                },
            )


def unseed(apps, schema_editor):
    BillingConfig = apps.get_model("billing", "BillingConfig")
    PermissionPrice = apps.get_model("billing", "PermissionPrice")
    PermissionPrice.objects.filter(module_code__in=MODULES_WITH_ACTIONS.keys()).delete()
    BillingConfig.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("billing", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
