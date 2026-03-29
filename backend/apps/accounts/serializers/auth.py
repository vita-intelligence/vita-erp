"""
Auth serializers — registration and login input validation.

These serializers validate incoming data and return error codes (not
human-readable messages). The frontend maps codes to translated strings.
"""

from __future__ import annotations

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from apps.accounts.models import User


class RegisterSerializer(serializers.Serializer):
    """Validates registration input: email + password."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value: str) -> str:
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("email_taken")
        return email

    def validate_password(self, value: str) -> str:
        try:
            validate_password(value)
        except DjangoValidationError as e:
            # Map Django's verbose messages to error codes
            codes = []
            for error in e.error_list:
                code = error.code or "password_invalid"
                codes.append(code)
            raise serializers.ValidationError(codes) from None
        return value

    def create(self, validated_data: dict) -> User:
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    """Validates login input: email + password."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        email = attrs["email"].lower().strip()
        password = attrs["password"]

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError({"non_field_errors": ["invalid_credentials"]})

        if not user.is_active:
            raise serializers.ValidationError({"non_field_errors": ["account_disabled"]})

        attrs["user"] = user
        return attrs
