"""
Test factories for organization models.

Usage:
    org = OrganizationFactory()
    org = OrganizationFactory(name="Acme Corp", slug="acme-corp")
    membership = MembershipFactory(user=user, organization=org)
"""

from datetime import timedelta
from typing import Any

import factory
from django.utils import timezone

from apps.accounts.tests.factories import UserFactory
from apps.billing.constants import SUB_STATUS_TRIALING
from apps.billing.models import Subscription
from apps.organizations.models import Membership, Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    """Creates an Organization with a unique slug, db_name, and a
    placeholder trialing Subscription so write endpoints aren't
    blocked by the SubscriptionStatusMiddleware in tests."""

    class Meta:
        model = Organization
        skip_postgeneration_save = True

    name = factory.Sequence(lambda n: f"Test Org {n}")
    slug = factory.Sequence(lambda n: f"test-org-{n}")
    db_name = factory.Sequence(lambda n: f"vita_org_test{n:08d}")
    status = "trial"
    industry = "Manufacturing"
    country = "US"
    timezone = "UTC"
    base_currency = "USD"
    created_by = factory.SubFactory(UserFactory, is_verified=True)

    @factory.post_generation
    def subscription(self, create: bool, extracted: Any, **kwargs: Any) -> None:
        if not create:
            return
        now = timezone.now()
        Subscription.objects.create(
            organization=self,  # type: ignore[misc]
            status=SUB_STATUS_TRIALING,
            trial_start=now,
            trial_end=now + timedelta(days=14),
            current_period_start=now,
            current_period_end=now + timedelta(days=14),
            storage_quota_gb=10,
        )


class MembershipFactory(factory.django.DjangoModelFactory):
    """Creates a Membership linking a user to an organization."""

    class Meta:
        model = Membership

    user = factory.SubFactory(UserFactory, is_verified=True)
    organization = factory.SubFactory(OrganizationFactory)
    is_active = True
