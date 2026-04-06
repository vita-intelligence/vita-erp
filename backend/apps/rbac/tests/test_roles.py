"""
Role CRUD tests — list, create, update, delete via the API.
"""

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import ACTION_READ, ACTION_WRITE, MODULE_ORGANOGRAM, ROLE_OWNER
from apps.rbac.models import Role, RolePermission, UserRole

pytestmark = pytest.mark.django_db

ROLES_URL = "/api/v1/rbac/roles/"


def _role_url(role_id: str) -> str:
    return f"{ROLES_URL}{role_id}/"


@pytest.fixture()
def client() -> APIClient:
    return APIClient()


def _login_and_select_org(client: APIClient, user, org) -> None:
    client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
    client.post(f"/api/v1/organizations/{org.id}/select/")


def _make_owner(user) -> Role:
    role = Role.objects.create(name=ROLE_OWNER, description="Full access.", is_system=True)
    UserRole.objects.create(user_id=user.id, role=role)
    return role


def _make_organogram_role(user, actions: list[str]) -> Role:
    role = Role.objects.create(name="Organogram Editor", is_system=False)
    for action in actions:
        RolePermission.objects.create(role=role, module_code=MODULE_ORGANOGRAM, action=action)
    UserRole.objects.create(user_id=user.id, role=role)
    return role


class TestRoleList:
    def test_owner_can_list_roles(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(ROLES_URL)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) >= 1  # At least the Owner role

    def test_read_permission_can_list(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_organogram_role(user, [ACTION_READ])
        _login_and_select_org(client, user, membership.organization)

        assert client.get(ROLES_URL).status_code == 200

    def test_no_permission_denied(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _login_and_select_org(client, user, membership.organization)

        assert client.get(ROLES_URL).status_code == 403

    def test_unauthenticated_returns_401(self, client):
        assert client.get(ROLES_URL).status_code == 401


class TestRoleCreate:
    def test_owner_can_create(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.post(ROLES_URL, {"name": "New Role"}, format="json")
        assert response.status_code == 201
        assert response.json()["name"] == "New Role"
        assert response.json()["is_system"] is False

    def test_write_permission_can_create(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_organogram_role(user, [ACTION_WRITE])
        _login_and_select_org(client, user, membership.organization)

        response = client.post(ROLES_URL, {"name": "Manager"}, format="json")
        assert response.status_code == 201

    def test_read_only_cannot_create(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_organogram_role(user, [ACTION_READ])
        _login_and_select_org(client, user, membership.organization)

        response = client.post(ROLES_URL, {"name": "Manager"}, format="json")
        assert response.status_code == 403


class TestRoleUpdate:
    def test_owner_can_update_custom_role(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        custom = Role.objects.create(name="Old Name", is_system=False)
        response = client.patch(_role_url(str(custom.id)), {"name": "New Name"}, format="json")
        assert response.status_code == 200
        assert response.json()["name"] == "New Name"

    def test_cannot_rename_system_role(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.patch(_role_url(str(owner_role.id)), {"name": "Boss"}, format="json")
        assert response.status_code == 400
        assert response.json()["detail"] == "cannot_rename_system_role"

    def test_can_update_system_role_description(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.patch(
            _role_url(str(owner_role.id)),
            {"description": "Updated description"},
            format="json",
        )
        assert response.status_code == 200


class TestRoleDelete:
    def test_owner_can_delete_custom_role(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        custom = Role.objects.create(name="Temp", is_system=False)
        response = client.delete(_role_url(str(custom.id)))
        assert response.status_code == 204
        assert not Role.objects.filter(pk=custom.id).exists()

    def test_cannot_delete_system_role(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.delete(_role_url(str(owner_role.id)))
        assert response.status_code == 400
        assert response.json()["detail"] == "cannot_delete_system_role"

    def test_delete_nonexistent_returns_404(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.delete(_role_url("00000000-0000-0000-0000-000000000000"))
        assert response.status_code == 404
