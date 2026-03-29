"""
Test factories for organization models.

Usage:
    org = OrganizationFactory()
    org = OrganizationFactory(name="Acme Corp", slug="acme-corp")
    membership = MembershipFactory(user=user, organization=org)
"""

import factory

from apps.accounts.tests.factories import UserFactory
from apps.organizations.models import Membership, Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    """Creates an Organization with a unique slug and db_name."""

    class Meta:
        model = Organization

    name = factory.Sequence(lambda n: f"Test Org {n}")
    slug = factory.Sequence(lambda n: f"test-org-{n}")
    db_name = factory.Sequence(lambda n: f"vita_org_test{n:08d}")
    status = "trial"
    industry = "Manufacturing"
    country = "US"
    timezone = "UTC"
    base_currency = "USD"
    created_by = factory.SubFactory(UserFactory, is_verified=True)


class MembershipFactory(factory.django.DjangoModelFactory):
    """Creates a Membership linking a user to an organization."""

    class Meta:
        model = Membership

    user = factory.SubFactory(UserFactory, is_verified=True)
    organization = factory.SubFactory(OrganizationFactory)
    is_active = True
