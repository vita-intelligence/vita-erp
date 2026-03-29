"""Django admin configuration for billing models."""

from django.contrib import admin

from apps.billing.models import (
    AddOn,
    PermissionPrice,
    Plan,
    PlanLimit,
    PlanModuleAccess,
    Subscription,
    SubscriptionAddOn,
)


class PlanModuleAccessInline(admin.TabularInline):
    model = PlanModuleAccess
    extra = 1


class PlanLimitInline(admin.TabularInline):
    model = PlanLimit
    extra = 1


class PermissionPriceInline(admin.TabularInline):
    model = PermissionPrice
    extra = 1


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    """Admin for billing plans — manage tiers and pricing."""

    list_display = ("name", "slug", "base_price_monthly", "is_trial", "is_public", "is_active")
    list_filter = ("is_trial", "is_public", "is_active")
    search_fields = ("name", "slug")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("sort_order",)
    inlines = [PlanModuleAccessInline, PlanLimitInline, PermissionPriceInline]

    fieldsets = (
        (None, {"fields": ("id", "name", "slug", "description")}),
        ("Pricing", {"fields": ("base_price_monthly", "base_price_annual")}),
        ("Trial", {"fields": ("is_trial", "trial_duration_days")}),
        ("Visibility", {"fields": ("is_public", "sort_order", "is_active")}),
        ("Stripe", {"fields": ("stripe_product_id", "stripe_price_id_monthly", "stripe_price_id_annual")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(AddOn)
class AddOnAdmin(admin.ModelAdmin):
    """Admin for purchasable add-ons."""

    list_display = ("name", "slug", "module_code", "price_monthly", "is_active")
    list_filter = ("is_active", "module_code")
    search_fields = ("name", "slug")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("name",)


class SubscriptionAddOnInline(admin.TabularInline):
    model = SubscriptionAddOn
    extra = 0
    readonly_fields = ("activated_at",)
    raw_id_fields = ("add_on",)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin for organization subscriptions."""

    list_display = ("organization", "plan", "status", "billing_cycle", "trial_end", "created_at")
    list_filter = ("status", "billing_cycle", "plan")
    search_fields = ("organization__name", "organization__slug", "stripe_subscription_id")
    readonly_fields = ("id", "created_at", "updated_at")
    raw_id_fields = ("organization",)
    ordering = ("-created_at",)
    inlines = [SubscriptionAddOnInline]

    fieldsets = (
        (None, {"fields": ("id", "organization", "plan", "status", "billing_cycle")}),
        ("Billing Period", {"fields": ("current_period_start", "current_period_end")}),
        ("Trial", {"fields": ("trial_start", "trial_end")}),
        ("Cancellation", {"fields": ("canceled_at", "cancel_at_period_end")}),
        ("Stripe", {"fields": ("stripe_subscription_id", "stripe_customer_id")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
