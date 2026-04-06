"""
Role member assignment tests — assign and unassign users to/from roles.
"""

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.organizations.tests.factories import MembershipFactory
from apps.rbac.constants import ROLE_OWNER
from apps.rbac.models import Role, UserRole

pytestmark = pytest.mark.django_db


def _members_url(role_id: str) -> str:
    return f"/api/v1/rbac/roles/{role_id}/members/"


def _member_url(role_id: str, user_id: str) -> str:
    return f"/api/v1/rbac/roles/{role_id}/members/{user_id}/"


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


class TestRoleMemberList:
    def test_list_members(self, client):
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user)
        owner_role = _make_owner(user)
        _login_and_select_org(client, user, membership.organization)

        response = client.get(_members_url(str(owner_role.id)))
        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["user_id"] == str(user.id)


class TestAssignMember:
    def test_assign_org_member(self, client):
        owner = UserFactory(is_verified=True)
        member = UserFactory(is_verified=True)
        membership = MembershipFactory(user=owner)
        MembershipFactory(user=member, organization=membership.organization)
        _make_owner(owner)
        custom = Role.objects.create(name="Worker", is_system=False)
        _login_and_select_org(client, owner, membership.organization)

        response = client.post(
            _members_url(str(custom.id)),
            {"user_id": str(member.id)},
            format="json",
        )
        assert response.status_code == 201
        assert response.json()["user_id"] == str(member.id)

    def test_assign_non_org_member_rejected(self, client):
        owner = UserFactory(is_verified=True)
        outsider = UserFactory(is_verified=True)
        membership = MembershipFactory(user=owner)
        _make_owner(owner)
        custom = Role.objects.create(name="Worker", is_system=False)
        _login_and_select_org(client, owner, membership.organization)

        response = client.post(
            _members_url(str(custom.id)),
            {"user_id": str(outsider.id)},
            format="json",
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "user_not_org_member"

    def test_duplicate_assignment_rejected(self, client):
        owner = UserFactory(is_verified=True)
        membership = MembershipFactory(user=owner)
        _make_owner(owner)
        custom = Role.objects.create(name="Worker", is_system=False)
        UserRole.objects.create(user_id=owner.id, role=custom)
        _login_and_select_org(client, owner, membership.organization)

        response = client.post(
            _members_url(str(custom.id)),
            {"user_id": str(owner.id)},
            format="json",
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "already_assigned"


class TestUnassignMember:
    def test_unassign_member(self, client):
        owner = UserFactory(is_verified=True)
        member = UserFactory(is_verified=True)
        membership = MembershipFactory(user=owner)
        MembershipFactory(user=member, organization=membership.organization)
        _make_owner(owner)
        custom = Role.objects.create(name="Worker", is_system=False)
        UserRole.objects.create(user_id=member.id, role=custom)
        _login_and_select_org(client, owner, membership.organization)

        response = client.delete(_member_url(str(custom.id), str(member.id)))
        assert response.status_code == 204
        assert not UserRole.objects.filter(role=custom, user_id=member.id).exists()

    def test_unassign_not_assigned_returns_error(self, client):
        owner = UserFactory(is_verified=True)
        member = UserFactory(is_verified=True)
        membership = MembershipFactory(user=owner)
        MembershipFactory(user=member, organization=membership.organization)
        _make_owner(owner)
        custom = Role.objects.create(name="Worker", is_system=False)
        _login_and_select_org(client, owner, membership.organization)

        response = client.delete(_member_url(str(custom.id), str(member.id)))
        assert response.status_code == 400
        assert response.json()["detail"] == "not_assigned"
