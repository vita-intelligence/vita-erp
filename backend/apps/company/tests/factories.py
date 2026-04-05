import factory

from apps.company.models import CompanySettings, CompanyTheme


class CompanySettingsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CompanySettings

    decimal_separator = "dot"
    thousands_separator = "comma"
    digit_grouping = "standard"
    quantity_precision = 4
    price_precision = 2
    currency_precision = 2
    exchange_rate_precision = 6
    percentage_precision = 2
    weight_precision = 3
    currency_symbol_position = "before"
    currency_spacing = False
    negative_format = "minus_before"
    rounding_method = "half_up"
    cash_rounding_enabled = False
    cash_rounding_increment = "0.01"
    date_format = "YYYY-MM-DD"
    time_format = "24h"
    week_start_day = "monday"
    calendar_system = "gregorian"
    measurement_system = "metric"
    default_weight_uom = "kg"
    default_length_uom = "m"
    default_volume_uom = "L"
    default_temperature_uom = "celsius"
    default_area_uom = "m2"
    fiscal_year_start_month = 1
    fiscal_year_start_day = 1
    fiscal_calendar_type = "standard"
    cost_method = "average"
    tax_inclusive_pricing = False
    default_tax_rate = "0.000"
    tax_label = "Tax"
    default_document_language = "en"
    default_paper_size = "A4"
    text_direction = "ltr"


class CompanyThemeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CompanyTheme

    active_mode = "light"
    tokens_by_mode: dict[str, dict[str, str]] = {}  # noqa: RUF012 — factory-boy expects a class attribute
