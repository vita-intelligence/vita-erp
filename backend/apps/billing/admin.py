"""Django admin configuration for billing models."""

from __future__ import annotations

from django.contrib import admin
from django.http import HttpRequest

from apps.billing.models import (
    AddOn,
    BillingConfig,
    BillingEvent,
    PermissionPrice,
    Subscription,
    SubscriptionAddOn,
)


@admin.register(BillingConfig)
class BillingConfigAdmin(admin.ModelAdmin):
    """Admin for the singleton BillingConfig row."""

    list_display = (
        "__str__",
        "base_price_pence",
        "storage_minimum_gb",
        "storage_price_per_gb_pence",
        "trial_duration_days",
        "currency",
    )
    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
        "stripe_product_id",
        "stripe_base_price_id",
        "stripe_user_metered_price_id",
        "stripe_storage_price_id",
    )
    fieldsets = (
        (None, {"fields": ("id",)}),
        ("Base fee", {"fields": ("base_price_pence",)}),
        ("Storage", {"fields": ("storage_minimum_gb", "storage_price_per_gb_pence")}),
        ("Trial", {"fields": ("trial_duration_days",)}),
        ("Currency", {"fields": ("currency",)}),
        (
            "Stripe sync (populated by `manage.py sync_billing_to_stripe`)",
            {
                "fields": (
                    "stripe_product_id",
                    "stripe_base_price_id",
                    "stripe_user_metered_price_id",
                    "stripe_storage_price_id",
                )
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    def has_add_permission(self, request: HttpRequest) -> bool:
        """Enforce singleton — only one row may exist."""
        return not BillingConfig.objects.exists()

    def has_delete_permission(self, request: HttpRequest, obj: BillingConfig | None = None) -> bool:
        """The billing config cannot be deleted."""
        return False


@admin.register(PermissionPrice)
class PermissionPriceAdmin(admin.ModelAdmin):
    """Admin for per-permission pricing. Prices here drive user metered billing."""

    list_display = ("module_code", "action", "price_pence", "description")
    list_filter = ("module_code", "action")
    search_fields = ("module_code", "action", "description")
    list_editable = ("price_pence", "description")
    ordering = ("module_code", "action")
    readonly_fields = ("id", "created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("id", "module_code", "action", "price_pence", "description")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(AddOn)
class AddOnAdmin(admin.ModelAdmin):
    """Admin for purchasable add-ons."""

    list_display = ("name", "slug", "module_code", "billing_type", "price_pence", "is_active")
    list_filter = ("is_active", "billing_type", "module_code")
    search_fields = ("name", "slug")
    list_editable = ("price_pence", "is_active")
    readonly_fields = ("id", "created_at", "updated_at", "stripe_product_id", "stripe_price_id")
    ordering = ("name",)
    fieldsets = (
        (None, {"fields": ("id", "name", "slug", "description", "module_code")}),
        ("Pricing", {"fields": ("billing_type", "price_pence")}),
        ("Availability", {"fields": ("is_active",)}),
        ("Stripe", {"fields": ("stripe_product_id", "stripe_price_id")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


class SubscriptionAddOnInline(admin.TabularInline):
    model = SubscriptionAddOn
    extra = 0
    readonly_fields = ("activated_at", "stripe_subscription_item_id")
    raw_id_fields = ("add_on",)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin for organization subscriptions — mostly read-only; Stripe is the source of truth."""

    list_display = (
        "organization",
        "status",
        "billing_cycle",
        "storage_quota_gb",
        "trial_end",
        "current_period_end",
    )
    list_filter = ("status", "billing_cycle")
    search_fields = (
        "organization__name",
        "organization__slug",
        "stripe_subscription_id",
    )
    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
        "stripe_subscription_id",
        "stripe_base_item_id",
        "stripe_user_item_id",
        "stripe_storage_item_id",
    )
    raw_id_fields = ("organization",)
    ordering = ("-created_at",)
    inlines = [SubscriptionAddOnInline]
    fieldsets = (
        (None, {"fields": ("id", "organization", "status", "billing_cycle")}),
        ("Storage", {"fields": ("storage_quota_gb",)}),
        ("Billing period", {"fields": ("current_period_start", "current_period_end")}),
        ("Trial", {"fields": ("trial_start", "trial_end")}),
        ("Cancellation", {"fields": ("canceled_at", "cancel_at_period_end")}),
        (
            "Stripe (read-only)",
            {
                "fields": (
                    "stripe_subscription_id",
                    "stripe_base_item_id",
                    "stripe_user_item_id",
                    "stripe_storage_item_id",
                )
            },
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(BillingEvent)
class BillingEventAdmin(admin.ModelAdmin):
    """Audit log for Stripe webhooks. Read-only — events are written by the webhook handler."""

    list_display = ("stripe_event_id", "event_type", "status", "received_at", "processed_at")
    list_filter = ("status", "event_type")
    search_fields = ("stripe_event_id", "event_type")
    readonly_fields = (
        "id",
        "stripe_event_id",
        "event_type",
        "subscription",
        "payload",
        "status",
        "error_message",
        "received_at",
        "processed_at",
    )
    ordering = ("-received_at",)

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: BillingEvent | None = None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj: BillingEvent | None = None) -> bool:
        return False
