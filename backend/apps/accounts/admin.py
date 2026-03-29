"""
Django admin configuration for accounts models.

Custom UserAdmin since we use email instead of username.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.accounts.models import AuditLog, Session, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin for the custom User model — email-based, no username."""

    list_display = ("email", "is_verified", "is_active", "is_staff", "date_joined")
    list_filter = ("is_verified", "is_active", "is_staff", "is_superuser")
    search_fields = ("email",)
    ordering = ("-date_joined",)

    # Fields shown when editing an existing user
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Status", {"fields": ("is_verified", "two_factor_enabled", "is_active")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_login")}),
    )

    # Fields shown when creating a new user
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    """Admin for active sessions — read-only, for debugging."""

    list_display = ("user", "device_name", "ip_address", "is_active", "last_used_at")
    list_filter = ("is_active",)
    search_fields = ("user__email", "ip_address", "device_name")
    readonly_fields = (
        "id",
        "user",
        "refresh_token_hash",
        "device_name",
        "ip_address",
        "user_agent",
        "created_at",
        "last_used_at",
    )
    ordering = ("-last_used_at",)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin for audit log — strictly read-only."""

    list_display = ("user", "action", "ip_address", "created_at")
    list_filter = ("action",)
    search_fields = ("user__email", "action", "ip_address")
    readonly_fields = ("id", "user", "action", "ip_address", "user_agent", "metadata", "created_at")
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
