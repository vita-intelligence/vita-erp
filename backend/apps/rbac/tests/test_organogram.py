"""
Organogram layout tests — GET and PUT canvas state.
"""

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import ACTION_READ, MODULE_ORGANOGRAM, ROLE_OWNER
from apps.rbac.models import Role, RolePermission, UserRole

pytestmark = pytest.mark.django_db

ORGANOGRAM_URL = "/api/v1/rbac/organogram/"


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
    role = Role.objects.create(name="Viewer", is_system=False)
    for action in actions:
        RolePermission.objects.create(role=role, module_code=MODULE_ORGANOGRAM, action=action)
    UserRole.objects.create(user_id=user.id, role=role)
    return role


class TestOrganogramGet:
    def test_owner_gets_empty_layout(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(ORGANOGRAM_URL)
        assert response.status_code == 200
        data = response.json()
        assert data["nodes_layout"] == {}
        assert data["edges"] == []

    def test_read_permission_can_get(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_organogram_role(user, [ACTION_READ])
        _login_and_select_org(client, user, membership.organization)

        assert client.get(ORGANOGRAM_URL).status_code == 200

    def test_no_permission_denied(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _login_and_select_org(client, user, membership.organization)

        assert client.get(ORGANOGRAM_URL).status_code == 403


class TestOrganogramPut:
    def test_owner_can_save_layout(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        payload = {
            "nodes_layout": {str(owner_role.id): {"x": 100, "y": 200}},
            "edges": [{"source": str(owner_role.id), "target": str(owner_role.id)}],
        }
        response = client.put(ORGANOGRAM_URL, payload, format="json")
        assert response.status_code == 200
        data = response.json()
        assert data["nodes_layout"] == payload["nodes_layout"]
        assert data["edges"] == payload["edges"]

    def test_layout_persists_on_reload(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        payload = {"nodes_layout": {str(owner_role.id): {"x": 50, "y": 75}}, "edges": []}
        client.put(ORGANOGRAM_URL, payload, format="json")

        response = client.get(ORGANOGRAM_URL)
        assert response.json()["nodes_layout"] == payload["nodes_layout"]

    def test_read_only_cannot_save(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_organogram_role(user, [ACTION_READ])
        _login_and_select_org(client, user, membership.organization)

        response = client.put(ORGANOGRAM_URL, {"nodes_layout": {}, "edges": []}, format="json")
        assert response.status_code == 403

    def test_invalid_nodes_layout_rejected(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.put(
            ORGANOGRAM_URL,
            {"nodes_layout": {"bad": {"x": "not a number", "y": 0}}, "edges": []},
            format="json",
        )
        assert response.status_code == 400

    def test_invalid_edges_rejected(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.put(
            ORGANOGRAM_URL,
            {"nodes_layout": {}, "edges": [{"bad": "data"}]},
            format="json",
        )
        assert response.status_code == 400
