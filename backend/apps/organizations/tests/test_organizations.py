"""
Organization endpoint tests — create, list, select, detail.

Tests use the test settings which bypass the tenant database router,
so all models coexist in a single SQLite in-memory database.
"""

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.billing.models import Plan, Subscription
from apps.organizations.models import Membership
from apps.organizations.tests.factories import MembershipFactory, OrganizationFactory
from apps.platform_audit.models import AuditLog


@pytest.fixture()
def client():
    return APIClient()


@pytest.fixture()
def verified_user():
    return UserFactory(is_verified=True)


@pytest.fixture()
def auth_client(client, verified_user):
    """Client logged in as a verified user."""
    client.post(
        "/api/v1/auth/login/",
        {"email": verified_user.email, "password": DEFAULT_PASSWORD},
    )
    return client


@pytest.fixture()
def trial_plan():
    """Ensure a trial plan exists for org creation tests."""
    plan, _ = Plan.objects.get_or_create(
        slug="free-trial",
        defaults={
            "name": "Free Trial",
            "is_trial": True,
            "trial_duration_days": 14,
            "base_price_monthly": 0,
            "base_price_annual": 0,
            "is_active": True,
            "is_public": False,
        },
    )
    return plan


# All required fields for org creation
ORG_DEFAULTS = {
    "name": "Test Org",
    "industry": "electronics",
    "country": "US",
    "timezone": "America/New_York",
    "base_currency": "USD",
}


def org_data(**overrides):
    """Build org creation payload with required fields."""
    return {**ORG_DEFAULTS, **overrides}


# ── Create Organization ──────────────────────────────────────────────────────


@pytest.mark.django_db
class TestCreateOrganization:
    def test_create_success(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Acme Manufacturing"),
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Acme Manufacturing"
        assert data["status"] == "trial"
        assert data["country"] == "US"
        assert "slug" in data

    def test_create_sets_org_scoped_cookies(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Cookie Test Org"),
        )
        assert response.status_code == 201
        assert "vita_access" in response.cookies
        assert "vita_refresh" in response.cookies

    def test_create_creates_membership(self, auth_client, verified_user, trial_plan):
        auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Membership Test Org"),
        )
        assert Membership.objects.filter(
            user=verified_user,
            is_active=True,
        ).exists()

    def test_create_creates_subscription(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Subscription Test Org"),
        )
        org_id = response.json()["id"]
        sub = Subscription.objects.get(organization_id=org_id)
        assert sub.status == "trialing"
        assert sub.plan == trial_plan
        assert sub.trial_end is not None

    def test_create_logs_audit_event(self, auth_client, verified_user, trial_plan):
        auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Audit Test Org"),
        )
        assert AuditLog.objects.filter(
            user=verified_user,
            action="org_created",
        ).exists()

    def test_create_custom_slug(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Custom Slug Org", slug="my-custom-slug"),
        )
        assert response.status_code == 201
        assert response.json()["slug"] == "my-custom-slug"

    def test_create_duplicate_slug(self, auth_client, verified_user, trial_plan):
        OrganizationFactory(slug="taken-slug")
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Dup Slug Org", slug="taken-slug"),
        )
        assert response.status_code == 400

    def test_create_reserved_slug(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="Admin Org", slug="admin"),
        )
        assert response.status_code == 400

    def test_create_max_orgs_reached(self, auth_client, verified_user, trial_plan):
        for _i in range(3):
            MembershipFactory(user=verified_user)

        response = auth_client.post(
            "/api/v1/organizations/",
            org_data(name="One Too Many Org"),
        )
        assert response.status_code == 400
        assert response.json()["detail"] == "max_orgs_reached"

    def test_create_missing_required_fields(self, auth_client, verified_user, trial_plan):
        response = auth_client.post(
            "/api/v1/organizations/",
            {"name": "Missing Fields Org"},
        )
        assert response.status_code == 400

    def test_create_requires_auth(self, client):
        response = client.post(
            "/api/v1/organizations/",
            {"name": "No Auth Org"},
        )
        assert response.status_code == 401

    def test_create_requires_verified_email(self, client):
        unverified = UserFactory(is_verified=False)
        client.post(
            "/api/v1/auth/login/",
            {"email": unverified.email, "password": DEFAULT_PASSWORD},
        )
        response = client.post(
            "/api/v1/organizations/",
            {"name": "Unverified Org"},
        )
        assert response.status_code == 403


# ── List Organizations ────────────────────────────────────────────────────────


@pytest.mark.django_db
class TestListOrganizations:
    def test_list_empty(self, auth_client):
        response = auth_client.get("/api/v1/organizations/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_with_orgs(self, auth_client, verified_user):
        MembershipFactory(user=verified_user)
        MembershipFactory(user=verified_user)

        response = auth_client.get("/api/v1/organizations/")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_list_excludes_inactive_memberships(self, auth_client, verified_user):
        MembershipFactory(user=verified_user, is_active=True)
        MembershipFactory(user=verified_user, is_active=False)

        response = auth_client.get("/api/v1/organizations/")
        assert response.status_code == 200
        assert len(response.json()) == 1

    def test_list_excludes_other_users_orgs(self, auth_client):
        MembershipFactory()  # different user

        response = auth_client.get("/api/v1/organizations/")
        assert response.status_code == 200
        assert len(response.json()) == 0


# ── Select Organization ───────────────────────────────────────────────────────


@pytest.mark.django_db
class TestSelectOrganization:
    def test_select_success(self, auth_client, verified_user):
        membership = MembershipFactory(user=verified_user)
        org = membership.organization

        response = auth_client.post(f"/api/v1/organizations/{org.id}/select/")
        assert response.status_code == 200
        assert response.json()["id"] == str(org.id)
        assert "vita_access" in response.cookies

    def test_select_not_a_member(self, auth_client):
        org = OrganizationFactory()

        response = auth_client.post(f"/api/v1/organizations/{org.id}/select/")
        assert response.status_code == 403
        assert response.json()["detail"] == "not_a_member"

    def test_select_inactive_org(self, auth_client, verified_user):
        org = OrganizationFactory(status="deactivated", created_by=verified_user)
        MembershipFactory(user=verified_user, organization=org)

        response = auth_client.post(f"/api/v1/organizations/{org.id}/select/")
        assert response.status_code == 403
        assert response.json()["detail"] == "org_not_accessible"

    def test_select_inactive_membership(self, auth_client, verified_user):
        membership = MembershipFactory(user=verified_user, is_active=False)
        org = membership.organization

        response = auth_client.post(f"/api/v1/organizations/{org.id}/select/")
        assert response.status_code == 403


# ── Organization Detail ───────────────────────────────────────────────────────


@pytest.mark.django_db
class TestOrganizationDetail:
    def test_detail_success(self, auth_client, verified_user):
        membership = MembershipFactory(user=verified_user)
        org = membership.organization

        response = auth_client.get(f"/api/v1/organizations/{org.id}/")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(org.id)
        assert data["name"] == org.name
        assert "timezone" in data
        assert "base_currency" in data

    def test_detail_not_a_member(self, auth_client):
        org = OrganizationFactory()

        response = auth_client.get(f"/api/v1/organizations/{org.id}/")
        assert response.status_code == 403


# ── /auth/me/ includes organizations ─────────────────────────────────────────


@pytest.mark.django_db
class TestMeIncludesOrganizations:
    def test_me_returns_organizations(self, auth_client, verified_user):
        MembershipFactory(user=verified_user)

        response = auth_client.get("/api/v1/auth/me/")
        assert response.status_code == 200
        data = response.json()
        assert "organizations" in data
        assert len(data["organizations"]) == 1

    def test_me_empty_organizations(self, auth_client):
        response = auth_client.get("/api/v1/auth/me/")
        assert response.status_code == 200
        assert response.json()["organizations"] == []
