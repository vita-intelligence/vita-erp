"""Django admin configuration for platform audit log — strictly read-only."""

from django.contrib import admin

from apps.platform_audit.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin for platform audit log — append-only, no modifications allowed."""

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
