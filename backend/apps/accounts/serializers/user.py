"""
User serializers — profile read/update and session list.

Minimal — the User model only has email + flags.
Profile data (name, phone, avatar) lives on the org side.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.accounts.models import Session, User


class UserSerializer(serializers.ModelSerializer):
    """Read-only representation of the current user.

    Includes the list of organizations the user belongs to,
    used by the frontend to determine post-login routing:
    - No orgs → redirect to create-organization
    - One org → auto-select
    - Multiple orgs → show org selector
    """

    organizations = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "is_verified", "date_joined", "organizations")
        read_only_fields = fields

    def get_organizations(self, user: User) -> list[dict]:
        from apps.organizations.models import Membership, Organization
        from apps.organizations.serializers import OrganizationSummarySerializer

        org_ids = Membership.objects.filter(user=user, is_active=True).values_list("organization_id", flat=True)
        orgs = Organization.objects.filter(id__in=org_ids).order_by("-created_at")
        return OrganizationSummarySerializer(orgs, many=True).data  # type: ignore[no-any-return]


class ChangePasswordSerializer(serializers.Serializer):
    """Validates password change: old password + new password."""

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value: str) -> str:
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("invalid_current_password")
        return value

    def validate_new_password(self, value: str) -> str:
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError as DjangoValidationError

        try:
            validate_password(value, user=self.context["request"].user)
        except DjangoValidationError as e:
            codes = [error.code or "password_invalid" for error in e.error_list]
            raise serializers.ValidationError(codes) from None
        return value


class ChangeEmailSerializer(serializers.Serializer):
    """Validates email change: new email + current password for confirmation."""

    new_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value: str) -> str:
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("invalid_current_password")
        return value

    def validate_new_email(self, value: str) -> str:
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("email_taken")
        return email


class SessionSerializer(serializers.ModelSerializer):
    """Read-only representation of an active session."""

    is_current = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = (
            "id",
            "device_name",
            "ip_address",
            "created_at",
            "last_used_at",
            "is_current",
        )
        read_only_fields = fields

    def get_is_current(self, obj: Session) -> bool:
        """Mark the session that matches the current request's refresh token."""
        from apps.accounts.services.auth import hash_token

        request = self.context.get("request")
        if not request:
            return False
        refresh_token = request.COOKIES.get("vita_refresh", "")
        if not refresh_token:
            return False
        return obj.refresh_token_hash == hash_token(refresh_token)
