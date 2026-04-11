"""Tests for SubscriptionStatusMiddleware and StorageQuotaMiddleware."""

# mypy: ignore-errors

from __future__ import annotations

import pytest
from rest_framework.test import APIClient

from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory
from apps.billing.constants import SUB_STATUS_CANCELED, SUB_STATUS_TRIALING
from apps.organizations.tests.factories import MembershipFactory, OrganizationFactory


@pytest.fixture()
def client() -> APIClient:
    return APIClient()


def _login_and_select(client: APIClient, user, org) -> None:
    client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
    client.post(f"/api/v1/organizations/{org.id}/select/")


@pytest.mark.django_db
class TestSubscriptionStatusMiddleware:
    def test_trialing_subscription_allows_writes(self, client: APIClient) -> None:
        user = UserFactory(is_verified=True)
        membership = MembershipFactory(user=user, organization=OrganizationFactory())
        _login_and_select(client, user, membership.organization)

        # Any write endpoint is fine; using org select again just confirms
        # middleware doesn't 402 on trialing subs.
        response = client.post(f"/api/v1/organizations/{membership.organization.id}/select/")
        assert response.status_code != 402

    def test_canceled_subscription_blocks_writes(self, client: APIClient) -> None:
        user = UserFactory(is_verified=True)
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_CANCELED
        org.subscription.save()
        MembershipFactory(user=user, organization=org)
        _login_and_select(client, user, org)

        response = client.post("/api/v1/rbac/roles/", {"name": "Staff"}, format="json")
        assert response.status_code == 402
        assert response.json()["detail"] == "subscription_inactive"

    def test_billing_endpoints_are_always_allowed(self, client: APIClient) -> None:
        user = UserFactory(is_verified=True)
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_CANCELED
        org.subscription.save()
        MembershipFactory(user=user, organization=org)
        _login_and_select(client, user, org)

        # GET on billing subscription works even when canceled.
        response = client.get("/api/v1/billing/subscription/")
        # May be 404 (no RBAC Owner role in test) or 200, but never 402.
        assert response.status_code != 402

    def test_read_requests_always_allowed(self, client: APIClient) -> None:
        user = UserFactory(is_verified=True)
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_CANCELED
        org.subscription.save()
        MembershipFactory(user=user, organization=org)
        _login_and_select(client, user, org)

        response = client.get("/api/v1/organizations/")
        assert response.status_code != 402


@pytest.mark.django_db
class TestStorageQuotaMiddleware:
    def test_empty_storage_never_blocks(self, client: APIClient) -> None:
        """SQLite test DB always reports 0 bytes, so quota is never exceeded."""
        user = UserFactory(is_verified=True)
        org = OrganizationFactory()
        org.subscription.status = SUB_STATUS_TRIALING
        org.subscription.save()
        MembershipFactory(user=user, organization=org)
        _login_and_select(client, user, org)

        response = client.post("/api/v1/rbac/roles/", {"name": "Staff"}, format="json")
        # May be 201 or some RBAC-related error; just never the quota error.
        assert response.status_code != 402 or response.json().get("detail") != "storage_quota_exceeded"
