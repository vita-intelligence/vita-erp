"""Role serializers — list, create, update, detail."""

from __future__ import annotations

from rest_framework import serializers

from apps.accounts.models import User
from apps.rbac.models import Role


class RoleListSerializer(serializers.ModelSerializer):
    """Compact role representation for list endpoints."""

    member_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Role
        fields = ("id", "name", "description", "is_system", "member_count", "created_at")
        read_only_fields = fields


class RoleCreateSerializer(serializers.Serializer):
    """Validates role creation payload."""

    name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, default="", allow_blank=True)


class RoleUpdateSerializer(serializers.Serializer):
    """Validates partial role update payload."""

    name = serializers.CharField(max_length=100, required=False)
    description = serializers.CharField(required=False, allow_blank=True)


class RoleDetailSerializer(serializers.ModelSerializer):
    """Full role representation with permissions and members."""

    permissions = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
            "is_system",
            "permissions",
            "members",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_permissions(self, obj: Role) -> list[dict]:
        return [
            dict(entry) for entry in obj.permissions.values("module_code", "action").order_by("module_code", "action")
        ]

    def get_members(self, obj: Role) -> list[dict]:
        assignments = obj.user_assignments.order_by("assigned_at")
        user_ids = [str(a.user_id) for a in assignments]
        users = {str(u.id): u for u in User.objects.using("default").filter(id__in=user_ids)}
        return [
            {
                "user_id": str(a.user_id),
                "email": users[str(a.user_id)].email if str(a.user_id) in users else "",
                "assigned_at": a.assigned_at,
            }
            for a in assignments
        ]
