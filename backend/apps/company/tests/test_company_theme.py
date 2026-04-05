"""
CompanyTheme tests — model, service, and API endpoints.

Tests use the test settings which bypass the tenant database router,
so all models coexist in a single SQLite in-memory database.
"""

from __future__ import annotations

import pytest
from django.core.cache import cache
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.audit.models import AuditLog
from apps.company.services.company_theme import (
    AUDIT_THEME_CREATED,
    AUDIT_THEME_UPDATED,
    create_default_theme,
    get_theme,
    update_theme,
)
from apps.company.tests.factories import CompanyThemeFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import (
    ACTION_READ,
    ACTION_WRITE,
    MODULE_COMPANY_THEME,
    ROLE_OWNER,
)
from apps.rbac.models import Role, RolePermission, UserRole

pytestmark = pytest.mark.django_db

URL = "/api/v1/company/theme/"


# ── Fixtures ─────────────────────────────────────────────────────────────────


@pytest.fixture()
def client() -> APIClient:
    return APIClient()


@pytest.fixture()
def verified_user():
    return UserFactory(is_verified=True)


@pytest.fixture(autouse=True)
def _clear_cache():
    cache.clear()


@pytest.fixture()
def theme_row():
    return CompanyThemeFactory()


def _login_and_select_org(client: APIClient, user, org) -> None:
    client.post(
        "/api/v1/auth/login/",
        {"email": user.email, "password": DEFAULT_PASSWORD},
    )
    client.post(f"/api/v1/organizations/{org.id}/select/")


def _make_owner(user) -> Role:
    role = Role.objects.create(name=ROLE_OWNER, description="", is_system=True)
    UserRole.objects.create(user_id=user.id, role=role)
    return role


def _make_custom_role(user, *, actions: list[str]) -> Role:
    role = Role.objects.create(name="Custom", description="", is_system=False)
    for action in actions:
        RolePermission.objects.create(
            role=role,
            module_code=MODULE_COMPANY_THEME,
            action=action,
        )
    UserRole.objects.create(user_id=user.id, role=role)
    return role


@pytest.fixture()
def auth_client(client, verified_user):
    """Client logged in with Owner role in an active org."""
    membership = MembershipFactory(user=verified_user)
    _make_owner(verified_user)
    _login_and_select_org(client, verified_user, membership.organization)
    return client


# ── Model ─────────────────────────────────────────────────────────────────────


class TestModel:
    def test_create_with_defaults(self):
        theme = CompanyThemeFactory()
        assert theme.pk is not None
        assert theme.active_mode == "light"
        assert theme.tokens_by_mode == {}

    def test_singleton_enforcement(self, theme_row):
        with pytest.raises(ValidationError, match="company_theme_already_exists"):
            CompanyThemeFactory()

    def test_tokens_by_mode_must_be_dict(self):
        with pytest.raises(ValidationError, match="tokens_by_mode_must_be_object"):
            CompanyThemeFactory(tokens_by_mode=["not", "a", "dict"])

    def test_tokens_by_mode_value_must_be_dict(self):
        with pytest.raises(ValidationError, match="mode_value_must_be_object"):
            CompanyThemeFactory(tokens_by_mode={"light": "not-a-dict"})


# ── Service ───────────────────────────────────────────────────────────────────


class TestService:
    def test_get_theme_raises_if_missing(self):
        from apps.company.models import CompanyTheme

        with pytest.raises(CompanyTheme.DoesNotExist):
            get_theme()

    def test_get_theme_returns_row(self, theme_row):
        assert get_theme().pk == theme_row.pk

    def test_create_default_theme_logs_creation(self, verified_user):
        theme = create_default_theme(user_id=verified_user.id)
        assert theme.active_mode == "light"
        assert theme.tokens_by_mode == {}
        audit = AuditLog.objects.get(action=AUDIT_THEME_CREATED)
        assert audit.entity_type == "CompanyTheme"
        assert audit.metadata == {"active_mode": "light"}

    def test_update_theme_mode_only(self, theme_row, verified_user):
        updated = update_theme(
            data={"active_mode": "dark"},
            user_id=verified_user.id,
        )
        assert updated.active_mode == "dark"
        assert updated.tokens_by_mode == {}

    def test_update_theme_logs_mode_change(self, theme_row, verified_user):
        update_theme(data={"active_mode": "dark"}, user_id=verified_user.id)
        audit = AuditLog.objects.get(action=AUDIT_THEME_UPDATED)
        assert audit.metadata == {
            "active_mode": {"old": "light", "new": "dark"},
        }

    def test_update_theme_tokens_logs_diff(self, theme_row, verified_user):
        update_theme(
            data={
                "tokens_by_mode": {
                    "light": {"primary": "#06c", "cardRadius": "8px"},
                }
            },
            user_id=verified_user.id,
        )
        audit = AuditLog.objects.get(action=AUDIT_THEME_UPDATED)
        changes = audit.metadata["changes"]
        assert changes == {
            "light.primary": {"old": None, "new": "#06c"},
            "light.cardRadius": {"old": None, "new": "8px"},
        }

    def test_update_theme_diffs_existing_tokens(self, verified_user):
        CompanyThemeFactory(tokens_by_mode={"light": {"primary": "#000", "cardRadius": "8px"}})
        update_theme(
            data={
                "tokens_by_mode": {
                    "light": {"primary": "#06c", "cardRadius": "8px"},
                }
            },
            user_id=verified_user.id,
        )
        audit = AuditLog.objects.get(action=AUDIT_THEME_UPDATED)
        # Only the changed key appears — cardRadius is unchanged
        assert audit.metadata["changes"] == {
            "light.primary": {"old": "#000", "new": "#06c"},
        }

    def test_update_theme_noop_does_not_log(self, theme_row, verified_user):
        update_theme(
            data={"active_mode": "light", "tokens_by_mode": {}},
            user_id=verified_user.id,
        )
        assert AuditLog.objects.filter(action=AUDIT_THEME_UPDATED).count() == 0


# ── API: GET ─────────────────────────────────────────────────────────────────


class TestGetTheme:
    def test_get_requires_auth(self, client, theme_row):
        assert client.get(URL).status_code == 401

    def test_owner_can_get(self, auth_client, theme_row):
        response = auth_client.get(URL)
        assert response.status_code == 200
        data = response.json()
        assert data["active_mode"] == "light"
        assert data["tokens_by_mode"] == {}

    def test_read_permission_can_get(self, client, verified_user, theme_row):
        membership = MembershipFactory(user=verified_user)
        _make_custom_role(verified_user, actions=[ACTION_READ])
        _login_and_select_org(client, verified_user, membership.organization)
        assert client.get(URL).status_code == 200

    def test_no_permission_denied(self, client, verified_user, theme_row):
        membership = MembershipFactory(user=verified_user)
        _login_and_select_org(client, verified_user, membership.organization)
        assert client.get(URL).status_code == 403


# ── API: PATCH ────────────────────────────────────────────────────────────────


class TestPatchTheme:
    def test_patch_mode(self, auth_client, theme_row):
        response = auth_client.patch(URL, {"active_mode": "dark"}, format="json")
        assert response.status_code == 200
        assert response.json()["active_mode"] == "dark"

    def test_patch_tokens(self, auth_client, theme_row):
        payload = {"tokens_by_mode": {"light": {"primary": "#06c", "cardRadius": "12px"}}}
        response = auth_client.patch(URL, payload, format="json")
        assert response.status_code == 200
        data = response.json()
        assert data["tokens_by_mode"]["light"]["primary"] == "#06c"

    def test_patch_both(self, auth_client, theme_row):
        response = auth_client.patch(
            URL,
            {
                "active_mode": "dark",
                "tokens_by_mode": {"dark": {"primary": "#fff"}},
            },
            format="json",
        )
        assert response.status_code == 200

    def test_patch_invalid_tokens_by_mode(self, auth_client, theme_row):
        response = auth_client.patch(URL, {"tokens_by_mode": ["not", "a", "dict"]}, format="json")
        assert response.status_code == 400

    def test_write_permission_can_patch(self, client, verified_user, theme_row):
        membership = MembershipFactory(user=verified_user)
        _make_custom_role(verified_user, actions=[ACTION_READ, ACTION_WRITE])
        _login_and_select_org(client, verified_user, membership.organization)
        response = client.patch(URL, {"active_mode": "dark"}, format="json")
        assert response.status_code == 200

    def test_read_only_cannot_patch(self, client, verified_user, theme_row):
        membership = MembershipFactory(user=verified_user)
        _make_custom_role(verified_user, actions=[ACTION_READ])
        _login_and_select_org(client, verified_user, membership.organization)
        response = client.patch(URL, {"active_mode": "dark"}, format="json")
        assert response.status_code == 403
