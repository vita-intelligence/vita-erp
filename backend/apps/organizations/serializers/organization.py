"""
Organization serializers — validation and response shaping.

CreateOrganizationSerializer: wizard input (name, industry, country, timezone, currency)
OrganizationSummarySerializer: compact representation for lists and /auth/me/ response
OrganizationDetailSerializer: full representation for org detail endpoint
"""

from __future__ import annotations

from rest_framework import serializers

from apps.organizations.models import Organization
from apps.organizations.services.organization import generate_slug, validate_slug


class CreateOrganizationSerializer(serializers.Serializer):
    """Validates the org creation wizard input."""

    name = serializers.CharField(max_length=255, required=True)
    slug = serializers.SlugField(max_length=63, required=False, allow_blank=True)
    industry = serializers.CharField(max_length=100, required=True)
    country = serializers.CharField(max_length=2, required=True)
    timezone = serializers.CharField(max_length=50, required=True)
    base_currency = serializers.CharField(max_length=3, required=True)

    def validate_name(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("name_required")
        return value

    def validate_slug(self, value: str) -> str:
        if not value:
            return value
        error = validate_slug(value)
        if error:
            raise serializers.ValidationError(error)
        return value.lower().strip()

    def validate(self, attrs: dict) -> dict:
        # Auto-generate slug from name if not provided
        if not attrs.get("slug"):
            slug = generate_slug(attrs["name"])
            if not slug:
                raise serializers.ValidationError({"slug": "slug_generation_failed"})
            attrs["slug"] = slug
        return attrs


class OrganizationSummarySerializer(serializers.ModelSerializer):
    """Compact org representation — used in lists and /auth/me/ response."""

    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "status",
            "industry",
            "country",
        )
        read_only_fields = fields


class OrganizationDetailSerializer(serializers.ModelSerializer):
    """Full org representation — used in org detail endpoint."""

    trial_days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "slug",
            "status",
            "industry",
            "country",
            "timezone",
            "base_currency",
            "created_at",
            "trial_days_remaining",
        )
        read_only_fields = fields

    def get_trial_days_remaining(self, org: Organization) -> int | None:
        from apps.billing.services.subscription import get_trial_days_remaining

        return get_trial_days_remaining(org)
