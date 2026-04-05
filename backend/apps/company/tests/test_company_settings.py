"""
CompanySettings tests — model validation, service layer, and API endpoints.

Tests use the test settings which bypass the tenant database router,
so all models coexist in a single SQLite in-memory database.
"""

import pytest
from django.core.cache import cache
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.audit.models import AuditLog
from apps.company.services.company_settings import (
    create_default_settings,
    get_settings,
    update_settings,
)
from apps.company.services.locale_defaults import get_defaults_for_country
from apps.company.tests.factories import CompanySettingsFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import ROLE_OWNER
from apps.rbac.models import Role, UserRole

pytestmark = pytest.mark.django_db

URL = "/api/v1/company/settings/"


@pytest.fixture()
def client():
    return APIClient()


@pytest.fixture()
def verified_user():
    return UserFactory(is_verified=True)


@pytest.fixture()
def auth_client(client, verified_user):
    """Client logged in as a verified user with Owner role in an active org.

    Sets up the full tenant + RBAC chain so endpoints gated by
    HasOrgContext/HasOrgMembership/HasModulePermission respond as if the
    caller has full access. Individual tests that need a different role
    should build their own client.
    """
    membership = MembershipFactory(user=verified_user)
    owner_role = Role.objects.create(
        name=ROLE_OWNER,
        description="Full access.",
        is_system=True,
    )
    UserRole.objects.create(user_id=verified_user.id, role=owner_role)

    client.post(
        "/api/v1/auth/login/",
        {"email": verified_user.email, "password": DEFAULT_PASSWORD},
    )
    client.post(f"/api/v1/organizations/{membership.organization.id}/select/")
    return client


@pytest.fixture(autouse=True)
def _clear_cache():
    """Clear cache between tests to avoid stale CompanySettings."""
    cache.clear()


@pytest.fixture()
def settings_row():
    """Create a default CompanySettings row for tests that need one."""
    return CompanySettingsFactory()


# ── Model Validation ─────────────────────────────────────────────────────────


class TestModelValidation:
    def test_create_with_defaults(self):
        settings = CompanySettingsFactory()
        assert settings.pk is not None
        assert settings.decimal_separator == "dot"
        assert settings.quantity_precision == 4

    def test_singleton_enforcement(self, settings_row):
        with pytest.raises(ValidationError, match="company_settings_already_exists"):
            CompanySettingsFactory()

    def test_separator_conflict_dot_dot(self):
        with pytest.raises(ValidationError) as exc_info:
            CompanySettingsFactory(
                decimal_separator="dot",
                thousands_separator="dot",
            )
        assert "separator_conflict" in str(exc_info.value)

    def test_separator_conflict_comma_comma(self):
        with pytest.raises(ValidationError) as exc_info:
            CompanySettingsFactory(
                decimal_separator="comma",
                thousands_separator="comma",
            )
        assert "separator_conflict" in str(exc_info.value)

    def test_valid_separator_combinations(self):
        settings = CompanySettingsFactory(
            decimal_separator="comma",
            thousands_separator="dot",
        )
        assert settings.decimal_separator == "comma"
        assert settings.thousands_separator == "dot"

    def test_fiscal_day_exceeds_month(self):
        with pytest.raises(ValidationError) as exc_info:
            CompanySettingsFactory(
                fiscal_year_start_month=2,
                fiscal_year_start_day=30,
            )
        assert "fiscal_day_exceeds_month" in str(exc_info.value)

    def test_fiscal_day_feb_29_valid(self):
        settings = CompanySettingsFactory(
            fiscal_year_start_month=2,
            fiscal_year_start_day=29,
        )
        assert settings.fiscal_year_start_day == 29

    def test_fiscal_day_apr_30_valid(self):
        settings = CompanySettingsFactory(
            fiscal_year_start_month=4,
            fiscal_year_start_day=30,
        )
        assert settings.fiscal_year_start_day == 30

    def test_fiscal_day_apr_31_invalid(self):
        with pytest.raises(ValidationError) as exc_info:
            CompanySettingsFactory(
                fiscal_year_start_month=4,
                fiscal_year_start_day=31,
            )
        assert "fiscal_day_exceeds_month" in str(exc_info.value)

    def test_digit_grouping_requires_separator(self):
        with pytest.raises(ValidationError) as exc_info:
            CompanySettingsFactory(
                digit_grouping="standard",
                thousands_separator="none",
            )
        assert "digit_grouping_requires_separator" in str(exc_info.value)

    def test_digit_grouping_none_with_no_separator(self):
        settings = CompanySettingsFactory(
            digit_grouping="none",
            thousands_separator="none",
        )
        assert settings.digit_grouping == "none"

    def test_precision_upper_bound(self):
        with pytest.raises(ValidationError):
            CompanySettingsFactory(quantity_precision=11)

    def test_precision_lower_bound(self):
        settings = CompanySettingsFactory(quantity_precision=0)
        assert settings.quantity_precision == 0


# ── Locale Defaults ──────────────────────────────────────────────────────────


class TestLocaleDefaults:
    def test_us_defaults(self):
        defaults = get_defaults_for_country("US", "USD")
        assert defaults["date_format"] == "MM/DD/YYYY"
        assert defaults["measurement_system"] == "imperial"
        assert defaults["default_paper_size"] == "letter"
        assert defaults["time_format"] == "12h"
        assert defaults["week_start_day"] == "sunday"
        assert defaults["negative_format"] == "parentheses"
        assert defaults["currency_precision"] == 2

    def test_germany_defaults(self):
        defaults = get_defaults_for_country("DE", "EUR")
        assert defaults["decimal_separator"] == "comma"
        assert defaults["thousands_separator"] == "dot"
        assert defaults["date_format"] == "DD.MM.YYYY"
        assert defaults["currency_symbol_position"] == "after"
        assert defaults["currency_spacing"] is True
        assert defaults["default_document_language"] == "de"

    def test_japan_defaults(self):
        defaults = get_defaults_for_country("JP", "JPY")
        assert defaults["date_format"] == "YYYY/MM/DD"
        assert defaults["calendar_system"] == "japanese"
        assert defaults["fiscal_year_start_month"] == 4
        assert defaults["currency_precision"] == 0

    def test_india_defaults(self):
        defaults = get_defaults_for_country("IN", "INR")
        assert defaults["digit_grouping"] == "indian"
        assert defaults["time_format"] == "12h"
        assert defaults["fiscal_year_start_month"] == 4

    def test_saudi_arabia_defaults(self):
        defaults = get_defaults_for_country("SA", "SAR")
        assert defaults["calendar_system"] == "hijri"
        assert defaults["text_direction"] == "rtl"
        assert defaults["week_start_day"] == "saturday"

    def test_switzerland_defaults(self):
        defaults = get_defaults_for_country("CH", "CHF")
        assert defaults["thousands_separator"] == "apostrophe"
        assert defaults["rounding_method"] == "half_even"
        assert defaults["cash_rounding_enabled"] is True
        assert defaults["cash_rounding_increment"] == "0.05"

    def test_sweden_defaults(self):
        defaults = get_defaults_for_country("SE", "SEK")
        assert defaults["cash_rounding_enabled"] is True
        assert defaults["cash_rounding_increment"] == "1.00"

    def test_australia_defaults(self):
        defaults = get_defaults_for_country("AU", "AUD")
        assert defaults["fiscal_year_start_month"] == 7
        assert defaults["tax_inclusive_pricing"] is True

    def test_uk_defaults(self):
        defaults = get_defaults_for_country("GB", "GBP")
        assert defaults["fiscal_year_start_month"] == 4
        assert defaults["fiscal_year_start_day"] == 6

    def test_iran_defaults(self):
        defaults = get_defaults_for_country("IR", "IRR")
        assert defaults["calendar_system"] == "persian"
        assert defaults["text_direction"] == "rtl"
        assert defaults["week_start_day"] == "saturday"

    def test_thailand_defaults(self):
        defaults = get_defaults_for_country("TH", "THB")
        assert defaults["calendar_system"] == "thai_buddhist"

    def test_unknown_country_gets_international_defaults(self):
        defaults = get_defaults_for_country("ZZ", "XYZ")
        assert defaults["date_format"] == "YYYY-MM-DD"
        assert defaults["measurement_system"] == "metric"
        assert defaults["default_paper_size"] == "A4"
        assert defaults["decimal_separator"] == "dot"

    def test_currency_precision_jpy(self):
        defaults = get_defaults_for_country("JP", "JPY")
        assert defaults["currency_precision"] == 0

    def test_currency_precision_kwd(self):
        defaults = get_defaults_for_country("KW", "KWD")
        assert defaults["currency_precision"] == 3

    def test_country_code_case_insensitive(self):
        defaults_upper = get_defaults_for_country("US", "USD")
        defaults_lower = get_defaults_for_country("us", "usd")
        assert defaults_upper == defaults_lower


# ── Service Layer ────────────────────────────────────────────────────────────


class TestServiceLayer:
    def test_create_default_settings(self):
        settings = create_default_settings(country="DE", currency="EUR")
        assert settings.pk is not None
        assert settings.decimal_separator == "comma"
        assert settings.thousands_separator == "dot"
        assert settings.date_format == "DD.MM.YYYY"

    def test_create_default_settings_with_audit(self, verified_user):
        settings = create_default_settings(
            country="US",
            currency="USD",
            user_id=verified_user.id,
        )
        assert settings.pk is not None

        audit = AuditLog.objects.filter(
            action="company_settings_created",
            entity_type="CompanySettings",
        ).first()
        assert audit is not None
        assert audit.user_id == verified_user.id
        assert "initial_values" in audit.metadata
        assert audit.metadata["country"] == "US"
        assert audit.metadata["currency"] == "USD"

    def test_create_default_settings_snapshot_complete(self, verified_user):
        create_default_settings(
            country="US",
            currency="USD",
            user_id=verified_user.id,
        )
        audit = AuditLog.objects.get(action="company_settings_created")
        snapshot = audit.metadata["initial_values"]

        assert "decimal_separator" in snapshot
        assert "date_format" in snapshot
        assert "cost_method" in snapshot
        assert "text_direction" in snapshot
        assert "created_at" not in snapshot
        assert "updated_at" not in snapshot
        assert "id" not in snapshot

    def test_get_settings(self, settings_row):
        result = get_settings()
        assert result.pk == settings_row.pk
        assert result.decimal_separator == "dot"

    def test_get_settings_caches(self, settings_row):
        first = get_settings()
        settings_row.time_format = "12h"
        settings_row.save()
        second = get_settings()
        assert second.time_format == first.time_format

    def test_update_settings(self, settings_row, verified_user):
        updated = update_settings(
            data={"date_format": "DD/MM/YYYY", "time_format": "12h"},
            user_id=verified_user.id,
        )
        assert updated.date_format == "DD/MM/YYYY"
        assert updated.time_format == "12h"

    def test_update_settings_audit_trail(self, settings_row, verified_user):
        update_settings(
            data={"decimal_separator": "comma", "thousands_separator": "dot"},
            user_id=verified_user.id,
        )
        audit = AuditLog.objects.filter(action="company_settings_updated").first()
        assert audit is not None
        assert audit.user_id == verified_user.id
        changes = audit.metadata["changes"]
        assert changes["decimal_separator"]["old"] == "dot"
        assert changes["decimal_separator"]["new"] == "comma"
        assert changes["thousands_separator"]["old"] == "comma"
        assert changes["thousands_separator"]["new"] == "dot"

    def test_update_settings_no_op_skips_audit(self, settings_row, verified_user):
        update_settings(
            data={"decimal_separator": "dot"},
            user_id=verified_user.id,
        )
        assert not AuditLog.objects.filter(action="company_settings_updated").exists()

    def test_update_settings_invalidates_cache(self, settings_row, verified_user):
        get_settings()
        update_settings(
            data={"date_format": "DD.MM.YYYY"},
            user_id=verified_user.id,
        )
        fresh = get_settings()
        assert fresh.date_format == "DD.MM.YYYY"

    def test_update_settings_validation_error(self, settings_row, verified_user):
        with pytest.raises(ValidationError) as exc_info:
            update_settings(
                data={"decimal_separator": "dot", "thousands_separator": "dot"},
                user_id=verified_user.id,
            )
        assert "separator_conflict" in str(exc_info.value)


# ── API Endpoints ────────────────────────────────────────────────────────────


class TestGetSettings:
    def test_get_success(self, auth_client, settings_row):
        response = auth_client.get(URL)
        assert response.status_code == 200
        data = response.json()
        assert data["decimal_separator"] == "dot"
        assert data["quantity_precision"] == 4
        assert data["date_format"] == "YYYY-MM-DD"
        assert "id" not in data

    def test_get_returns_all_fields(self, auth_client, settings_row):
        response = auth_client.get(URL)
        data = response.json()
        expected_fields = {
            "decimal_separator",
            "thousands_separator",
            "digit_grouping",
            "quantity_precision",
            "price_precision",
            "currency_precision",
            "exchange_rate_precision",
            "percentage_precision",
            "weight_precision",
            "currency_symbol_position",
            "currency_spacing",
            "negative_format",
            "rounding_method",
            "cash_rounding_enabled",
            "cash_rounding_increment",
            "date_format",
            "time_format",
            "week_start_day",
            "calendar_system",
            "measurement_system",
            "default_weight_uom",
            "default_length_uom",
            "default_volume_uom",
            "default_temperature_uom",
            "default_area_uom",
            "fiscal_year_start_month",
            "fiscal_year_start_day",
            "fiscal_calendar_type",
            "cost_method",
            "tax_inclusive_pricing",
            "default_tax_rate",
            "tax_label",
            "default_document_language",
            "default_paper_size",
            "text_direction",
            "created_at",
            "updated_at",
        }
        assert set(data.keys()) == expected_fields

    def test_get_requires_auth(self, client, settings_row):
        response = client.get(URL)
        assert response.status_code == 401

    def test_get_requires_verified_email(self, client, settings_row):
        unverified = UserFactory(is_verified=False)
        client.post(
            "/api/v1/auth/login/",
            {"email": unverified.email, "password": DEFAULT_PASSWORD},
        )
        response = client.get(URL)
        assert response.status_code == 403


class TestPatchSettings:
    def test_patch_single_field(self, auth_client, settings_row):
        response = auth_client.patch(URL, {"date_format": "DD/MM/YYYY"}, format="json")
        assert response.status_code == 200
        assert response.json()["date_format"] == "DD/MM/YYYY"

    def test_patch_multiple_fields(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {
                "decimal_separator": "comma",
                "thousands_separator": "space",
                "measurement_system": "imperial",
            },
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data["decimal_separator"] == "comma"
        assert data["thousands_separator"] == "space"
        assert data["measurement_system"] == "imperial"

    def test_patch_persists(self, auth_client, settings_row):
        auth_client.patch(URL, {"time_format": "12h"}, format="json")
        response = auth_client.get(URL)
        assert response.json()["time_format"] == "12h"

    def test_patch_separator_conflict(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"decimal_separator": "comma", "thousands_separator": "comma"},
            format="json",
        )
        assert response.status_code == 400
        assert "separator_conflict" in str(response.json())

    def test_patch_invalid_choice(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"date_format": "NOT_A_FORMAT"},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_precision_out_of_range(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"quantity_precision": 15},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_fiscal_day_invalid(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"fiscal_year_start_month": 2, "fiscal_year_start_day": 30},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_tax_rate_above_max(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"default_tax_rate": "150.000"},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_tax_rate_below_min(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"default_tax_rate": "-5.000"},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_tax_rate_valid(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"default_tax_rate": "20.500", "tax_label": "VAT"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data["default_tax_rate"] == "20.500"
        assert data["tax_label"] == "VAT"

    def test_patch_tax_label_too_long(self, auth_client, settings_row):
        response = auth_client.patch(
            URL,
            {"tax_label": "x" * 25},
            format="json",
        )
        assert response.status_code == 400

    def test_patch_empty_body_no_change(self, auth_client, settings_row):
        response = auth_client.patch(URL, {}, format="json")
        assert response.status_code == 200

    def test_patch_requires_auth(self, client, settings_row):
        response = client.patch(URL, {"date_format": "DD/MM/YYYY"}, format="json")
        assert response.status_code == 401

    def test_patch_requires_verified_email(self, client, settings_row):
        unverified = UserFactory(is_verified=False)
        client.post(
            "/api/v1/auth/login/",
            {"email": unverified.email, "password": DEFAULT_PASSWORD},
        )
        response = client.patch(URL, {"date_format": "DD/MM/YYYY"}, format="json")
        assert response.status_code == 403
