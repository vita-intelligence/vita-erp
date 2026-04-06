"""Role member serializers — read and assign."""

from __future__ import annotations

from rest_framework import serializers


class RoleMemberSerializer(serializers.Serializer):
    """Read-only representation of a user assigned to a role."""

    user_id = serializers.UUIDField()
    email = serializers.EmailField()
    assigned_at = serializers.DateTimeField()


class AssignMemberSerializer(serializers.Serializer):
    """Validates member assignment payload."""

    user_id = serializers.UUIDField()
