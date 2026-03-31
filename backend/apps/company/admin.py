"""Django admin configuration for company models."""

from django.contrib import admin

from apps.company.models import CompanySettings


@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    """Admin for company settings — view and manage org configuration."""

    list_display = ("__str__", "date_format", "measurement_system", "cost_method", "updated_at")
    readonly_fields = ("id", "created_at", "updated_at")

    fieldsets = (
        (
            "Number Formatting",
            {
                "fields": (
                    "decimal_separator",
                    "thousands_separator",
                    "digit_grouping",
                )
            },
        ),
        (
            "Precision",
            {
                "fields": (
                    "quantity_precision",
                    "price_precision",
                    "currency_precision",
                    "exchange_rate_precision",
                    "percentage_precision",
                    "weight_precision",
                )
            },
        ),
        (
            "Currency Display",
            {
                "fields": (
                    "currency_symbol_position",
                    "currency_spacing",
                    "negative_format",
                    "multi_currency_enabled",
                )
            },
        ),
        (
            "Rounding",
            {
                "fields": (
                    "rounding_method",
                    "cash_rounding_enabled",
                    "cash_rounding_increment",
                )
            },
        ),
        (
            "Date & Time",
            {
                "fields": (
                    "date_format",
                    "time_format",
                    "week_start_day",
                    "calendar_system",
                )
            },
        ),
        (
            "Measurement",
            {
                "fields": (
                    "measurement_system",
                    "default_weight_uom",
                    "default_length_uom",
                    "default_volume_uom",
                    "default_temperature_uom",
                    "default_area_uom",
                )
            },
        ),
        (
            "Fiscal & Financial",
            {
                "fields": (
                    "fiscal_year_start_month",
                    "fiscal_year_start_day",
                    "fiscal_calendar_type",
                    "cost_method",
                    "tax_inclusive_pricing",
                )
            },
        ),
        (
            "Document Defaults",
            {
                "fields": (
                    "default_document_language",
                    "default_paper_size",
                    "text_direction",
                )
            },
        ),
        ("Metadata", {"fields": ("id", "created_at", "updated_at")}),
    )
