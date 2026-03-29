"""
Custom user manager — email-based authentication, no username field.

Overrides Django's default UserManager to use email as the unique
identifier instead of username. All user creation goes through here.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib.auth.models import BaseUserManager

if TYPE_CHECKING:
    from apps.accounts.models.user import User


class UserManager(BaseUserManager["User"]):
    """Manager for the custom User model with email-based auth."""

    def _create_user(self, email: str, password: str | None, **extra_fields) -> User:
        """Shared logic for creating any type of user."""
        if not email:
            raise ValueError("email_required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str | None = None, **extra_fields) -> User:
        """Create a regular (non-staff, non-superuser) user."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str | None = None, **extra_fields) -> User:
        """Create a superuser with full admin access."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("superuser_must_be_staff")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("superuser_must_be_superuser")

        return self._create_user(email, password, **extra_fields)
