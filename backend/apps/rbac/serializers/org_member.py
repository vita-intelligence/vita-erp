"""Org member serializer — user info with role assignments."""

from __future__ import annotations

from rest_framework import serializers


class OrgMemberRoleSerializer(serializers.Serializer):
    """Compact role reference within a member listing."""

    id = serializers.UUIDField()
    name = serializers.CharField()


class OrgMemberSerializer(serializers.Serializer):
    """Organization member with their assigned roles."""

    user_id = serializers.UUIDField()
    email = serializers.EmailField()
    roles = OrgMemberRoleSerializer(many=True)
