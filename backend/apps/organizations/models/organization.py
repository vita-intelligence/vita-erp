"""
Organization model — represents a tenant in the platform.

Each organization owns a dedicated PostgreSQL database (db_name)
where all org-specific data lives (RBAC, company settings, ERP modules).
Platform-level data (user auth, billing, membership) stays in the central DB.
"""

from __future__ import annotations

import re
import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.organizations.constants import (
    ORG_ACTIVE_STATUSES,
    ORG_STATUS_CHOICES,
    ORG_STATUS_TRIAL,
    RESERVED_SLUGS,
    SLUG_MAX_LENGTH,
    SLUG_MIN_LENGTH,
)


def validate_org_slug(value: str) -> None:
    """Enforce slug rules: lowercase alphanumeric + hyphens, no reserved words."""
    if len(value) < SLUG_MIN_LENGTH:
        raise ValidationError(
            "slug_too_short",
            params={"min_length": SLUG_MIN_LENGTH},
        )
    if len(value) > SLUG_MAX_LENGTH:
        raise ValidationError(
            "slug_too_long",
            params={"max_length": SLUG_MAX_LENGTH},
        )
    if not re.match(r"^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", value):
        raise ValidationError("slug_invalid_format")
    if value in RESERVED_SLUGS:
        raise ValidationError("slug_reserved")


class Organization(models.Model):
    """A tenant — one organization, one dedicated database."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField(
        max_length=255,
        help_text="Legal or display name of the organization.",
    )
    slug = models.SlugField(
        max_length=SLUG_MAX_LENGTH,
        unique=True,
        validators=[validate_org_slug],
        help_text="URL-safe identifier. Lowercase alphanumeric and hyphens only.",
    )
    db_name = models.CharField(
        max_length=63,
        unique=True,
        editable=False,
        help_text="PostgreSQL database name for this organization.",
    )

    # Status & lifecycle
    status = models.CharField(
        max_length=20,
        choices=ORG_STATUS_CHOICES,
        default=ORG_STATUS_TRIAL,
        db_index=True,
    )

    # Organization profile (set during creation wizard)
    industry = models.CharField(max_length=100, blank=True)
    country = models.CharField(
        max_length=2,
        blank=True,
        help_text="ISO 3166-1 alpha-2 country code.",
    )
    timezone = models.CharField(
        max_length=50,
        default="UTC",
        help_text="IANA timezone identifier.",
    )
    base_currency = models.CharField(
        max_length=3,
        default="USD",
        help_text="ISO 4217 currency code.",
    )

    # Ownership
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_organizations",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "organizations_organization"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_by"]),
        ]

    def __str__(self) -> str:
        return self.name

    @property
    def is_accessible(self) -> bool:
        """Whether the organization can be accessed by its members."""
        return self.status in ORG_ACTIVE_STATUSES
