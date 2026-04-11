"""Tests for billing usage calculation services.

Covers the pure functions — price map, storage fallback, quota
resolution. The end-to-end breakdown test lives in integration tests
because it requires a real tenant database to query RBAC tables.
"""

# mypy: ignore-errors

from __future__ import annotations

import pytest

from apps.billing.models import BillingConfig, PermissionPrice
from apps.billing.services.usage import (
    get_permission_price_map,
    get_storage_quota_gb,
    get_storage_usage_bytes,
    get_storage_usage_gb,
    is_storage_quota_exceeded,
)
from apps.organizations.tests.factories import OrganizationFactory


@pytest.mark.django_db
class TestPermissionPriceMap:
    def test_returns_all_rows_keyed_by_module_action(self) -> None:
        PermissionPrice.objects.create(module_code="a", action="read", price_pence=100)
        PermissionPrice.objects.create(module_code="a", action="write", price_pence=500)

        price_map = get_permission_price_map()

        assert price_map[("a", "read")] == 100
        assert price_map[("a", "write")] == 500

    def test_seeded_defaults_are_present(self) -> None:
        """Migration 0002 seeds sensible defaults — they should load cleanly."""
        price_map = get_permission_price_map()
        # The 0002_seed_billing_defaults migration seeds these entries.
        assert ("billing", "read") in price_map
        assert ("accounts", "write") in price_map
        assert price_map[("billing", "manage")] > 0

    def test_missing_pair_returns_zero_via_get(self) -> None:
        price_map = get_permission_price_map()
        assert price_map.get(("ghost", "haunt"), 0) == 0


@pytest.mark.django_db
class TestStorageUsage:
    def test_sqlite_fallback_returns_zero_bytes(self) -> None:
        org = OrganizationFactory()
        # Test DB is SQLite — storage query should fall through to 0.
        assert get_storage_usage_bytes(org) == 0

    def test_gb_reports_zero_for_empty_db(self) -> None:
        org = OrganizationFactory()
        assert get_storage_usage_gb(org) == 0

    def test_quota_defaults_to_config_minimum_when_no_subscription(self) -> None:
        org = OrganizationFactory()
        org.subscription.delete()
        cfg = BillingConfig.load()
        assert get_storage_quota_gb(org) == cfg.storage_minimum_gb

    def test_quota_reads_from_subscription(self) -> None:
        org = OrganizationFactory()
        org.subscription.storage_quota_gb = 42
        org.subscription.save()
        assert get_storage_quota_gb(org) == 42

    def test_is_quota_exceeded_false_when_empty(self) -> None:
        org = OrganizationFactory()
        assert is_storage_quota_exceeded(org) is False
