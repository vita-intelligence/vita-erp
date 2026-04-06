"""Organogram layout serializer — read and full-replace."""

from __future__ import annotations

from rest_framework import serializers

from apps.rbac.models import OrganogramLayout


class OrganogramLayoutSerializer(serializers.ModelSerializer):
    """Serializes the organogram canvas state."""

    class Meta:
        model = OrganogramLayout
        fields = ("nodes_layout", "edges", "updated_at")
        read_only_fields = ("updated_at",)

    def validate_nodes_layout(self, value: dict) -> dict:
        if not isinstance(value, dict):
            raise serializers.ValidationError("Must be a JSON object.")
        for key, pos in value.items():
            if not isinstance(pos, dict) or "x" not in pos or "y" not in pos:
                raise serializers.ValidationError(f'Each entry must have "x" and "y" keys. Invalid: {key}')
            if not isinstance(pos["x"], int | float) or not isinstance(pos["y"], int | float):
                raise serializers.ValidationError(f'"x" and "y" must be numbers. Invalid: {key}')
        return value

    def validate_edges(self, value: list) -> list:
        if not isinstance(value, list):
            raise serializers.ValidationError("Must be a JSON array.")
        for i, edge in enumerate(value):
            if not isinstance(edge, dict) or "source" not in edge or "target" not in edge:
                raise serializers.ValidationError(
                    f'Each edge must have "source" and "target" keys. Invalid at index {i}.'
                )
        return value
