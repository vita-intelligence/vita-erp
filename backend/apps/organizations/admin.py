"""Django admin configuration for organization models."""

from django.contrib import admin

from apps.organizations.models import Membership, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """Admin for organizations — view and manage tenants."""

    list_display = ("name", "slug", "status", "industry", "country", "created_at")
    list_filter = ("status", "industry", "country")
    search_fields = ("name", "slug")
    readonly_fields = ("id", "db_name", "created_by", "created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("id", "name", "slug", "db_name")}),
        ("Status", {"fields": ("status",)}),
        ("Profile", {"fields": ("industry", "country", "timezone", "base_currency")}),
        ("Ownership", {"fields": ("created_by",)}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    """Admin for memberships — view user-org associations."""

    list_display = ("user", "organization", "is_active", "joined_at")
    list_filter = ("is_active",)
    search_fields = ("user__email", "organization__name")
    readonly_fields = ("id", "joined_at")
    ordering = ("-joined_at",)
    raw_id_fields = ("user", "organization")
