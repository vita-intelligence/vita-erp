from rest_framework import serializers
from .models import Role, Membership, Permission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'key', 'description']


class RoleSerializer(serializers.ModelSerializer):
    """Lightweight — used for lists and dropdowns."""
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'is_system']


class RoleDetailSerializer(serializers.ModelSerializer):
    """Full role with assigned permissions — used on create/edit responses."""
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'is_system', 'permissions']

    def get_permissions(self, obj):
        perms = Permission.objects.filter(permission_roles__role=obj)
        return PermissionSerializer(perms, many=True).data


class TeamMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    roles = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = ['id', 'user_id', 'username', 'email', 'is_active', 'joined_at', 'roles']

    def get_roles(self, obj):
        roles = Role.objects.filter(assigned_memberships__membership=obj)
        return RoleSerializer(roles, many=True).data