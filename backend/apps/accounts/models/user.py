"""
Custom User model — email-based authentication, no username.

Uses UUID primary key for security (non-sequential, non-guessable).
Pure auth identity only — email + password + account flags.

Everything else lives on the org side:
- Profile data → Membership (per-org custom fields)
- 2FA methods → org database (GDPR: org owns their security data)
- Permissions → org database (RBAC per-org)
"""

from __future__ import annotations

import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from apps.accounts.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Vita ERP user — pure auth identity, email + password only."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(
        unique=True,
        max_length=255,
        error_messages={"unique": "email_taken"},
    )

    # Email verification
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether the user has verified their email address.",
    )

    # Django admin access
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Timestamps
    date_joined = models.DateTimeField(default=timezone.now)

    # Auth config
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = "accounts_user"
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-date_joined"]

    def __str__(self) -> str:
        return self.email
