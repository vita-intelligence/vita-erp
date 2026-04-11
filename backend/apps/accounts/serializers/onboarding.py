"""
Serializers for the onboarding + invitation API.

Most of the heavy lifting (validation of the form definition,
validation of submitted responses) happens client-side via the
existing form constructor + zod. Server-side serializers here are
deliberately permissive: they accept the full JSON blob and trust
the form-walker service to enforce required-field presence at write
time. This avoids duplicating the form-constructor's validation
rules across two languages.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.accounts.models import Invitation


class OnboardingFormSerializer(serializers.Serializer):
    """The org's current onboarding form definition."""

    id = serializers.UUIDField(read_only=True)
    definition = serializers.JSONField()
    version = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class OnboardingFormUpdateSerializer(serializers.Serializer):
    """Admin payload for updating the form definition."""

    definition = serializers.JSONField()


class OnboardingMeSerializer(serializers.Serializer):
    """Bundle returned by `GET /me/onboarding/` — the form to render
    plus any existing responses to pre-fill it with."""

    form = OnboardingFormSerializer()
    responses = serializers.JSONField()
    requires_onboarding = serializers.BooleanField()
    submitted_at = serializers.DateTimeField(allow_null=True)


class InvitationCreateSerializer(serializers.Serializer):
    """Admin payload for creating a new invitation."""

    email = serializers.EmailField()
    pre_assigned_role_id = serializers.UUIDField(required=False, allow_null=True)


class InvitationDetailSerializer(serializers.ModelSerializer):
    """Public-facing invitation row used by both the admin list view
    and the public token-lookup endpoint."""

    status = serializers.CharField(read_only=True)
    invited_by_email = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = (
            "id",
            "email",
            "status",
            "expires_at",
            "accepted_at",
            "revoked_at",
            "created_at",
            "invited_by_email",
            "organization_name",
            "pre_assigned_role_id",
        )
        read_only_fields = fields

    def get_invited_by_email(self, obj: Invitation) -> str | None:
        return obj.invited_by.email if obj.invited_by else None

    def get_organization_name(self, obj: Invitation) -> str:
        return obj.organization.name


class InvitationLookupSerializer(serializers.Serializer):
    """Public lookup payload — just enough info to render the accept page
    without leaking PII about other users or the inviter."""

    email = serializers.EmailField()
    org_name = serializers.CharField()
    status = serializers.CharField()
    pre_assigned_role_id = serializers.UUIDField(allow_null=True)


class InvitationAcceptSerializer(serializers.Serializer):
    """Body for `POST /invitations/accept/` — just the token."""

    token = serializers.CharField(max_length=64)
