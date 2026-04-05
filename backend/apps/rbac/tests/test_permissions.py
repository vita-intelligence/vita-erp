"""
RBAC permission tests — HasModulePermission + MePermissionsView.

Covers the Owner bypass, explicit RolePermission matches, denied actions,
and the /me/permissions/ endpoint response shape. Uses the shared test
settings which coexist all models in a single SQLite DB (tenant router
is bypassed in tests).
"""

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.company.tests.factories import CompanySettingsFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import (
    ACTION_DELETE,
    ACTION_READ,
    ACTION_WRITE,
    MODULE_COMPANY_SETTINGS,
    ROLE_OWNER,
)
from apps.rbac.models import Role, RolePermission, UserRole

pytestmark = pytest.mark.django_db

ME_PERMISSIONS_URL = "/api/v1/rbac/me/permissions/"
COMPANY_SETTINGS_URL = "/api/v1/company/settings/"


# ── Fixtures ─────────────────────────────────────────────────────────────────


@pytest.fixture()
def client() -> APIClient:
    return APIClient()


def _login_and_select_org(client: APIClient, user, org) -> None:
    """Log in + select org so subsequent requests carry the org_id claim."""
    client.post(
        "/api/v1/auth/login/",
        {"email": user.email, "password": DEFAULT_PASSWORD},
    )
    client.post(f"/api/v1/organizations/{org.id}/select/")


def _make_owner(user):
    """Create the Owner system role and assign it to the user.

    In production the role lives in the org DB; in tests all models
    coexist in one SQLite DB, so the org is implicit.
    """
    role = Role.objects.create(
        name=ROLE_OWNER,
        description="Full access.",
        is_system=True,
    )
    UserRole.objects.create(user_id=user.id, role=role)
    return role


def _make_custom_role(user, *, actions: list[str], module: str = MODULE_COMPANY_SETTINGS):
    """Create a non-system role with explicit module+action permissions."""
    role = Role.objects.create(name="Custom", description="", is_system=False)
    for action in actions:
        RolePermission.objects.create(role=role, module_code=module, action=action)
    UserRole.objects.create(user_id=user.id, role=role)
    return role


# ── MePermissionsView ────────────────────────────────────────────────────────


class TestMePermissionsView:
    def test_unauthenticated_returns_401(self, client):
        response = client.get(ME_PERMISSIONS_URL)
        assert response.status_code == 401

    def test_no_org_selected_returns_403(self, client):
        user = UserFactory(is_verified=True)
        client.post(
            "/api/v1/auth/login/",
            {"email": user.email, "password": DEFAULT_PASSWORD},
        )
        response = client.get(ME_PERMISSIONS_URL)
        # HasOrgContext fails — no org_id in JWT yet.
        assert response.status_code == 403

    def test_owner_returns_is_owner_true(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(ME_PERMISSIONS_URL)

        assert response.status_code == 200
        data = response.json()
        assert data["is_owner"] is True
        assert data["permissions"] == {}

    def test_custom_role_returns_grouped_permissions(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_custom_role(user, actions=[ACTION_READ, ACTION_WRITE])
        _login_and_select_org(client, user, membership.organization)

        response = client.get(ME_PERMISSIONS_URL)

        assert response.status_code == 200
        data = response.json()
        assert data["is_owner"] is False
        assert data["permissions"] == {
            MODULE_COMPANY_SETTINGS: [ACTION_READ, ACTION_WRITE],
        }

    def test_user_with_no_role_returns_empty(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(ME_PERMISSIONS_URL)

        assert response.status_code == 200
        assert response.json() == {"is_owner": False, "permissions": {}}


# ── HasModulePermission via CompanySettingsView ──────────────────────────────


class TestCompanySettingsRbacGate:
    def test_owner_can_get(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        response = client.get(COMPANY_SETTINGS_URL)
        assert response.status_code == 200

    def test_owner_can_patch(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        response = client.patch(
            COMPANY_SETTINGS_URL,
            {"quantity_precision": 2},
            format="json",
        )
        assert response.status_code == 200

    def test_read_only_role_can_get_but_not_patch(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_custom_role(user, actions=[ACTION_READ])
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        assert client.get(COMPANY_SETTINGS_URL).status_code == 200
        assert (
            client.patch(
                COMPANY_SETTINGS_URL,
                {"quantity_precision": 2},
                format="json",
            ).status_code
            == 403
        )

    def test_write_only_role_cannot_get(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_custom_role(user, actions=[ACTION_WRITE])
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        assert client.get(COMPANY_SETTINGS_URL).status_code == 403

    def test_unrelated_action_denied(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_custom_role(user, actions=[ACTION_DELETE])
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        assert client.get(COMPANY_SETTINGS_URL).status_code == 403
        assert (
            client.patch(
                COMPANY_SETTINGS_URL,
                {"quantity_precision": 2},
                format="json",
            ).status_code
            == 403
        )

    def test_user_with_no_role_denied(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        CompanySettingsFactory()
        _login_and_select_org(client, user, membership.organization)

        assert client.get(COMPANY_SETTINGS_URL).status_code == 403
