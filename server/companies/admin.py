from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """
    Admin configuration for Company model.

    Provides searchable company listing with useful metadata
    for management and auditing.
    """

    # Columns shown in admin list view
    list_display = (
        "id",
        "name",
        "date_created",
    )

    # Clickable column opens detail page
    list_display_links = ("id", "name")

    # Search box behavior
    search_fields = ("name",)

    # Filters sidebar
    list_filter = ("date_created",)

    # Default ordering
    ordering = ("-date_created",)

    # Pagination inside admin
    list_per_page = 25

    # Read-only fields (protect audit fields)
    readonly_fields = ("date_created",)

    # Layout for edit page
    fieldsets = (
        ("Company Information", {
            "fields": ("name", "description"),
        }),
        ("Metadata", {
            "fields": ("date_created",),
        }),
    )