"""Django admin configuration for RBAC models.

Note: These models live in org databases. The admin panel operates
on the default (central) DB, so these registrations are primarily
useful for debugging via shell or custom admin routing.
"""

from django.contrib import admin

from apps.rbac.models import OrganogramLayout, Role, RolePermission, UserRole


class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1


class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0
    readonly_fields = ("assigned_at",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """Admin for roles within an organization."""

    list_display = ("name", "is_system", "created_at")
    list_filter = ("is_system",)
    search_fields = ("name",)
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-is_system", "name")
    inlines = [RolePermissionInline, UserRoleInline]


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    """Admin for user-role assignments."""

    list_display = ("user_id", "role", "assigned_by", "assigned_at")
    search_fields = ("user_id",)
    readonly_fields = ("id", "assigned_at")
    ordering = ("-assigned_at",)


@admin.register(OrganogramLayout)
class OrganogramLayoutAdmin(admin.ModelAdmin):
    """Admin for the organogram canvas layout."""

    list_display = ("__str__", "updated_at")
    readonly_fields = ("id", "created_at", "updated_at")
