"""
CompanyTheme serializers — read and partial update.

CompanyThemeSerializer: full representation for GET responses.
CompanyThemeUpdateSerializer: partial update; accepts active_mode
and/or tokens_by_mode. Token-value types are deliberately loose
(any JSON-serialisable value) because the frontend owns the token
schema and adds new tokens without needing a backend migration.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.company.models import CompanyTheme


class CompanyThemeSerializer(serializers.ModelSerializer):
    """Read-only representation of the org's theme state."""

    class Meta:
        model = CompanyTheme
        fields = ("active_mode", "tokens_by_mode", "created_at", "updated_at")
        read_only_fields = fields


class CompanyThemeUpdateSerializer(serializers.Serializer):
    """Validates partial updates to CompanyTheme.

    Both fields are optional. `tokens_by_mode` is replaced wholesale
    when provided; the frontend sends the full current map.
    """

    active_mode = serializers.CharField(max_length=20, required=False)
    tokens_by_mode = serializers.JSONField(required=False)

    def validate_tokens_by_mode(self, value: object) -> dict:
        if not isinstance(value, dict):
            raise serializers.ValidationError("tokens_by_mode_must_be_object")
        for mode_key, mode_tokens in value.items():
            if not isinstance(mode_key, str):
                raise serializers.ValidationError("mode_key_must_be_string")
            if not isinstance(mode_tokens, dict):
                raise serializers.ValidationError("mode_value_must_be_object")
        return value
