"""
Role permission management tests — GET and PUT on role permissions.
"""

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import ACTION_READ, ACTION_WRITE, MODULE_COMPANY_SETTINGS, MODULE_ORGANOGRAM, ROLE_OWNER
from apps.rbac.models import Role, RolePermission, UserRole

pytestmark = pytest.mark.django_db


def _perms_url(role_id: str) -> str:
    return f"/api/v1/rbac/roles/{role_id}/permissions/"


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


class TestGetRolePermissions:
    def test_returns_permission_list(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        custom = Role.objects.create(name="Viewer", is_system=False)
        RolePermission.objects.create(role=custom, module_code=MODULE_COMPANY_SETTINGS, action=ACTION_READ)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(_perms_url(str(custom.id)))
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0] == {"module_code": MODULE_COMPANY_SETTINGS, "action": ACTION_READ}


class TestSetRolePermissions:
    def test_bulk_replace_permissions(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        _make_owner(user)
        custom = Role.objects.create(name="Editor", is_system=False)
        RolePermission.objects.create(role=custom, module_code=MODULE_COMPANY_SETTINGS, action=ACTION_READ)
        _login_and_select_org(client, user, membership.organization)

        new_perms = [
            {"module_code": MODULE_ORGANOGRAM, "action": ACTION_READ},
            {"module_code": MODULE_ORGANOGRAM, "action": ACTION_WRITE},
        ]
        response = client.put(_perms_url(str(custom.id)), {"permissions": new_perms}, format="json")
        assert response.status_code == 200
        assert len(response.json()) == 2
        # Old permission should be gone
        assert not RolePermission.objects.filter(role=custom, module_code=MODULE_COMPANY_SETTINGS).exists()

    def test_cannot_set_permissions_on_system_role(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.put(
            _perms_url(str(owner_role.id)),
            {"permissions": [{"module_code": MODULE_ORGANOGRAM, "action": ACTION_READ}]},
            format="json",
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "cannot_modify_system_role"
