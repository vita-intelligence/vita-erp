"""Role permission serializers — read and bulk-replace."""

from __future__ import annotations

from rest_framework import serializers

from apps.rbac.constants import ALL_ACTIONS
from apps.rbac.models import RolePermission


class RolePermissionSerializer(serializers.ModelSerializer):
    """Read-only representation of a single permission entry."""

    class Meta:
        model = RolePermission
        fields = ("module_code", "action")
        read_only_fields = fields


class PermissionEntrySerializer(serializers.Serializer):
    """Validates a single {module_code, action} pair."""

    module_code = serializers.CharField(max_length=50)
    action = serializers.ChoiceField(choices=[(a, a) for a in ALL_ACTIONS])


class SetPermissionsSerializer(serializers.Serializer):
    """Validates bulk permission replacement payload."""

    permissions = PermissionEntrySerializer(many=True)
