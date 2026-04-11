"""
DRF serializers for the Billing tab.

All money is serialized as integer pence — frontend converts to display
currency. This keeps us away from float rounding errors at every layer.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.billing.models import AddOn, Subscription
from apps.organizations.constants import SLUG_MAX_LENGTH, SLUG_MIN_LENGTH


class SubscriptionDetailSerializer(serializers.ModelSerializer):
    """Public-facing subscription state for the Billing tab."""

    class Meta:
        model = Subscription
        fields = (
            "id",
            "status",
            "billing_cycle",
            "storage_quota_gb",
            "current_period_start",
            "current_period_end",
            "trial_start",
            "trial_end",
            "canceled_at",
            "cancel_at_period_end",
            "stripe_subscription_id",
        )
        read_only_fields = fields


class UserCostLineSerializer(serializers.Serializer):
    """One row in the per-user cost breakdown table."""

    user_id = serializers.CharField()
    email = serializers.CharField()
    total_pence = serializers.IntegerField()
    permissions = serializers.ListField(
        child=serializers.ListField(),
        help_text="List of [module_code, action, price_pence] triples.",
    )


class BillingBreakdownSerializer(serializers.Serializer):
    """Full breakdown used by the Billing tab's main view."""

    base_price_pence = serializers.IntegerField()
    user_cost_total_pence = serializers.IntegerField()
    storage_quota_gb = serializers.IntegerField()
    storage_minimum_gb = serializers.IntegerField()
    storage_price_per_gb_pence = serializers.IntegerField()
    storage_used_bytes = serializers.IntegerField()
    storage_cost_pence = serializers.IntegerField()
    grand_total_pence = serializers.IntegerField()
    currency = serializers.CharField()
    users = UserCostLineSerializer(many=True)


class UsageSerializer(serializers.Serializer):
    """Small payload used by progress bars — just the numbers."""

    seats_used = serializers.IntegerField()
    storage_used_bytes = serializers.IntegerField()
    storage_quota_gb = serializers.IntegerField()
    storage_quota_bytes = serializers.IntegerField()
    storage_used_percent = serializers.FloatField()


class AddOnSerializer(serializers.ModelSerializer):
    """Purchasable add-ons exposed to the frontend."""

    is_active_on_subscription = serializers.BooleanField(read_only=True)

    class Meta:
        model = AddOn
        fields = (
            "id",
            "slug",
            "name",
            "description",
            "module_code",
            "billing_type",
            "price_pence",
            "is_active",
            "is_active_on_subscription",
        )
        read_only_fields = fields


class StorageQuotaUpdateSerializer(serializers.Serializer):
    """Payload for bumping the paid storage quota."""

    quota_gb = serializers.IntegerField(min_value=1, max_value=10000)


class CheckoutSessionRequestSerializer(serializers.Serializer):
    """Payload for starting a Stripe Checkout session (signup flow)."""

    name = serializers.CharField(max_length=255)
    slug = serializers.SlugField(min_length=SLUG_MIN_LENGTH, max_length=SLUG_MAX_LENGTH)
    industry = serializers.CharField(max_length=100, required=False, allow_blank=True)
    country = serializers.CharField(max_length=2, required=False, allow_blank=True)
    timezone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    base_currency = serializers.CharField(max_length=3, required=False, allow_blank=True)
