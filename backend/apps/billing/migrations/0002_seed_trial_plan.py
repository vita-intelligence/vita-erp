"""
Seed the initial Trial plan with limits.

This data migration creates:
- Free Trial plan (14 days, all modules, $0 base price)
- PlanLimits: max_users (3), storage_gb (1 GB), sessions_per_user (1)
"""

import uuid

from django.db import migrations


def seed_trial_plan(apps, schema_editor):
    Plan = apps.get_model("billing", "Plan")
    PlanLimit = apps.get_model("billing", "PlanLimit")

    plan = Plan.objects.create(
        id=uuid.uuid4(),
        name="Free Trial",
        slug="free-trial",
        description="14-day free trial with full module access.",
        base_price_monthly=0,
        base_price_annual=0,
        is_trial=True,
        trial_duration_days=14,
        is_public=False,
        sort_order=0,
        is_active=True,
    )

    limits = [
        {
            "limit_code": "max_users",
            "description": "Maximum active users in the organization.",
            "included_quantity": 3,
            "max_quantity": 3,
            "price_per_extra": 0,
            "per_org": True,
        },
        {
            "limit_code": "storage_gb",
            "description": "Database storage in gigabytes.",
            "included_quantity": 1,
            "max_quantity": 1,
            "price_per_extra": 0,
            "per_org": True,
        },
        {
            "limit_code": "sessions_per_user",
            "description": "Concurrent active sessions per user.",
            "included_quantity": 1,
            "max_quantity": 1,
            "price_per_extra": 0,
            "per_org": False,
        },
    ]

    for limit_data in limits:
        PlanLimit.objects.create(
            id=uuid.uuid4(),
            plan=plan,
            **limit_data,
        )


def reverse_seed(apps, schema_editor):
    Plan = apps.get_model("billing", "Plan")
    Plan.objects.filter(slug="free-trial").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("billing", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_trial_plan, reverse_seed),
    ]
