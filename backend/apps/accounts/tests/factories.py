"""
Test factories — create model instances with sensible defaults.

Usage:
    user = UserFactory()                          # unverified user
    user = UserFactory(is_verified=True)           # verified user
    user = UserFactory(email="custom@test.com")    # custom email
"""

import factory
from django.contrib.auth.hashers import make_password

from apps.accounts.models import User

DEFAULT_PASSWORD = "TestPassword99"


class UserFactory(factory.django.DjangoModelFactory):
    """Creates a User with a hashed password and unique email."""

    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@test.com")
    password = factory.LazyFunction(lambda: make_password(DEFAULT_PASSWORD))
    is_verified = False
    is_active = True
    is_staff = False
