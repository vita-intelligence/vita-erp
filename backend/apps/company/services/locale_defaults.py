"""
Locale defaults — maps country codes to sensible CompanySettings defaults.

Called during org provisioning to initialize CompanySettings with values
appropriate for the organization's country and currency. The user can
always override any setting afterward.

Country codes follow ISO 3166-1 alpha-2.
Currency codes follow ISO 4217.
"""

from __future__ import annotations

from apps.company.constants import (
    AREA_ACRE,
    AREA_FT2,
    AREA_M2,
    CALENDAR_GREGORIAN,
    CALENDAR_HIJRI,
    CALENDAR_JAPANESE,
    CALENDAR_PERSIAN,
    CALENDAR_THAI_BUDDHIST,
    COST_METHOD_AVERAGE,
    CURRENCY_POS_AFTER,
    CURRENCY_POS_BEFORE,
    DATE_FMT_EU_DOT,
    DATE_FMT_EU_SLASH,
    DATE_FMT_ISO,
    DATE_FMT_JP,
    DATE_FMT_US,
    DECIMAL_SEP_COMMA,
    DECIMAL_SEP_DOT,
    DIGIT_GROUPING_INDIAN,
    DIGIT_GROUPING_STANDARD,
    LENGTH_FT,
    LENGTH_M,
    MEASUREMENT_IMPERIAL,
    MEASUREMENT_METRIC,
    NEGATIVE_FMT_MINUS_BEFORE,
    NEGATIVE_FMT_PARENTHESES,
    PAPER_SIZE_A4,
    PAPER_SIZE_LETTER,
    ROUNDING_HALF_EVEN,
    ROUNDING_HALF_UP,
    TEMP_CELSIUS,
    TEMP_FAHRENHEIT,
    TEXT_DIR_LTR,
    TEXT_DIR_RTL,
    THOUSANDS_SEP_APOSTROPHE,
    THOUSANDS_SEP_COMMA,
    THOUSANDS_SEP_DOT,
    THOUSANDS_SEP_SPACE,
    TIME_FMT_12H,
    TIME_FMT_24H,
    VOLUME_FL_OZ,
    VOLUME_L,
    WEEK_START_MONDAY,
    WEEK_START_SATURDAY,
    WEEK_START_SUNDAY,
    WEIGHT_KG,
    WEIGHT_LB,
)

# ---------------------------------------------------------------------------
# International defaults — base template
# ---------------------------------------------------------------------------

_INTERNATIONAL_DEFAULTS: dict[str, object] = {
    "decimal_separator": DECIMAL_SEP_DOT,
    "thousands_separator": THOUSANDS_SEP_COMMA,
    "digit_grouping": DIGIT_GROUPING_STANDARD,
    "quantity_precision": 4,
    "price_precision": 2,
    "currency_precision": 2,
    "exchange_rate_precision": 6,
    "percentage_precision": 2,
    "weight_precision": 3,
    "currency_symbol_position": CURRENCY_POS_BEFORE,
    "currency_spacing": False,
    "negative_format": NEGATIVE_FMT_MINUS_BEFORE,
    "rounding_method": ROUNDING_HALF_UP,
    "cash_rounding_enabled": False,
    "cash_rounding_increment": "0.01",
    "date_format": DATE_FMT_ISO,
    "time_format": TIME_FMT_24H,
    "week_start_day": WEEK_START_MONDAY,
    "calendar_system": CALENDAR_GREGORIAN,
    "measurement_system": MEASUREMENT_METRIC,
    "default_weight_uom": WEIGHT_KG,
    "default_length_uom": LENGTH_M,
    "default_volume_uom": VOLUME_L,
    "default_temperature_uom": TEMP_CELSIUS,
    "default_area_uom": AREA_M2,
    "fiscal_year_start_month": 1,
    "fiscal_year_start_day": 1,
    "fiscal_calendar_type": "standard",
    "cost_method": COST_METHOD_AVERAGE,
    "tax_inclusive_pricing": False,
    "default_tax_rate": "0.000",
    "tax_label": "Tax",
    "default_document_language": "en",
    "default_ui_language": "en",
    "default_paper_size": PAPER_SIZE_A4,
    "text_direction": TEXT_DIR_LTR,
}

# ---------------------------------------------------------------------------
# Region templates — shared by multiple countries
# ---------------------------------------------------------------------------

_COMMA_DECIMAL_DOT_THOUSANDS: dict[str, object] = {
    "decimal_separator": DECIMAL_SEP_COMMA,
    "thousands_separator": THOUSANDS_SEP_DOT,
}

_COMMA_DECIMAL_SPACE_THOUSANDS: dict[str, object] = {
    "decimal_separator": DECIMAL_SEP_COMMA,
    "thousands_separator": THOUSANDS_SEP_SPACE,
}

_IMPERIAL_US: dict[str, object] = {
    "measurement_system": MEASUREMENT_IMPERIAL,
    "default_weight_uom": WEIGHT_LB,
    "default_length_uom": LENGTH_FT,
    "default_volume_uom": VOLUME_FL_OZ,
    "default_temperature_uom": TEMP_FAHRENHEIT,
    "default_area_uom": AREA_FT2,
}

_SYMBOL_AFTER_SPACED: dict[str, object] = {
    "currency_symbol_position": CURRENCY_POS_AFTER,
    "currency_spacing": True,
}

# ---------------------------------------------------------------------------
# Per-country overrides (merged on top of _INTERNATIONAL_DEFAULTS)
# ---------------------------------------------------------------------------

_COUNTRY_OVERRIDES: dict[str, dict[str, object]] = {
    # --- North America ---
    "US": {
        **_IMPERIAL_US,
        "date_format": DATE_FMT_US,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SUNDAY,
        "negative_format": NEGATIVE_FMT_PARENTHESES,
        "default_paper_size": PAPER_SIZE_LETTER,
        "default_area_uom": AREA_ACRE,
    },
    "CA": {
        **_IMPERIAL_US,
        "date_format": DATE_FMT_ISO,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SUNDAY,
        "default_paper_size": PAPER_SIZE_LETTER,
    },
    "MX": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
        "default_ui_language": "es",
        "default_paper_size": PAPER_SIZE_LETTER,
        "default_tax_rate": "16.000",
        "tax_label": "IVA",
    },
    # --- UK & Ireland ---
    "GB": {
        "date_format": DATE_FMT_EU_SLASH,
        "fiscal_year_start_month": 4,
        "fiscal_year_start_day": 6,
        "default_tax_rate": "20.000",
        "tax_label": "VAT",
    },
    "IE": {
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_tax_rate": "23.000",
        "tax_label": "VAT",
    },
    # --- Western Europe ---
    "DE": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "de",
        "default_ui_language": "de",
        "default_tax_rate": "19.000",
        "tax_label": "VAT",
    },
    "AT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "de",
        "default_ui_language": "de",
        "default_tax_rate": "20.000",
        "tax_label": "VAT",
    },
    "CH": {
        "thousands_separator": THOUSANDS_SEP_APOSTROPHE,
        "date_format": DATE_FMT_EU_DOT,
        "rounding_method": ROUNDING_HALF_EVEN,
        "cash_rounding_enabled": True,
        "cash_rounding_increment": "0.05",
        "default_document_language": "de",
        "default_ui_language": "de",
        "default_tax_rate": "8.100",
        "tax_label": "VAT",
    },
    "NL": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_tax_rate": "21.000",
        "tax_label": "VAT",
    },
    "BE": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_tax_rate": "21.000",
        "tax_label": "VAT",
    },
    # --- Southern Europe ---
    "FR": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "fr",
        "default_ui_language": "fr",
        "default_tax_rate": "20.000",
        "tax_label": "VAT",
    },
    "ES": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "es",
        "default_ui_language": "es",
        "default_tax_rate": "21.000",
        "tax_label": "IVA",
    },
    "IT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "it",
        "default_ui_language": "it",
        "default_tax_rate": "22.000",
        "tax_label": "IVA",
    },
    "PT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "pt",
        "default_ui_language": "pt",
        "default_tax_rate": "23.000",
        "tax_label": "IVA",
    },
    # --- Nordic ---
    "SE": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_ISO,
        "cash_rounding_enabled": True,
        "cash_rounding_increment": "1.00",
        "default_tax_rate": "25.000",
        "tax_label": "Moms",
    },
    "NO": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "25.000",
        "tax_label": "MVA",
    },
    "DK": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "25.000",
        "tax_label": "Moms",
    },
    "FI": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "24.000",
        "tax_label": "ALV",
    },
    # --- Eastern Europe ---
    "PL": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "23.000",
        "tax_label": "VAT",
    },
    "RU": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "ru",
        "default_ui_language": "ru",
        "default_tax_rate": "20.000",
        "tax_label": "НДС",
    },
    "UA": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "20.000",
        "tax_label": "ПДВ",
    },
    "CZ": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "21.000",
        "tax_label": "DPH",
    },
    "RO": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_tax_rate": "19.000",
        "tax_label": "TVA",
    },
    # --- Middle East (RTL) ---
    "SA": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "calendar_system": CALENDAR_HIJRI,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
        "default_ui_language": "ar",
        "default_tax_rate": "15.000",
        "tax_label": "VAT",
    },
    "AE": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
        "default_ui_language": "ar",
        "default_tax_rate": "5.000",
        "tax_label": "VAT",
    },
    "IL": {
        "date_format": DATE_FMT_EU_DOT,
        "week_start_day": WEEK_START_SUNDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_tax_rate": "17.000",
        "tax_label": "Ma'am",
    },
    "IR": {
        "date_format": DATE_FMT_ISO,
        "week_start_day": WEEK_START_SATURDAY,
        "calendar_system": CALENDAR_PERSIAN,
        "text_direction": TEXT_DIR_RTL,
        "default_tax_rate": "9.000",
        "tax_label": "VAT",
    },
    "EG": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
        "default_ui_language": "ar",
        "default_tax_rate": "14.000",
        "tax_label": "VAT",
    },
    # --- South Asia ---
    "IN": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "fiscal_year_start_month": 4,
        "default_document_language": "hi",
        "default_ui_language": "hi",
        "default_tax_rate": "18.000",
        "tax_label": "GST",
    },
    "PK": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_tax_rate": "18.000",
        "tax_label": "Sales Tax",
    },
    "BD": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "default_tax_rate": "15.000",
        "tax_label": "VAT",
    },
    # --- East Asia ---
    "JP": {
        "date_format": DATE_FMT_JP,
        "week_start_day": WEEK_START_SUNDAY,
        "calendar_system": CALENDAR_JAPANESE,
        "fiscal_year_start_month": 4,
        "default_document_language": "ja",
        "default_ui_language": "ja",
        "default_tax_rate": "10.000",
        "tax_label": "Consumption Tax",
    },
    "CN": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "zh",
        "default_ui_language": "zh",
        "default_tax_rate": "13.000",
        "tax_label": "VAT",
    },
    "KR": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "ko",
        "default_ui_language": "ko",
        "default_tax_rate": "10.000",
        "tax_label": "VAT",
    },
    "TW": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "zh",
        "default_ui_language": "zh",
        "default_tax_rate": "5.000",
        "tax_label": "VAT",
    },
    # --- Southeast Asia ---
    "TH": {
        "date_format": DATE_FMT_EU_SLASH,
        "calendar_system": CALENDAR_THAI_BUDDHIST,
        "default_tax_rate": "7.000",
        "tax_label": "VAT",
    },
    "ID": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "id",
        "default_ui_language": "id",
        "default_tax_rate": "11.000",
        "tax_label": "PPN",
    },
    "VN": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "currency_precision": 0,
        "default_tax_rate": "10.000",
        "tax_label": "VAT",
    },
    "MY": {
        "date_format": DATE_FMT_EU_SLASH,
        "default_tax_rate": "6.000",
        "tax_label": "SST",
    },
    "PH": {
        "date_format": DATE_FMT_US,
        "time_format": TIME_FMT_12H,
        "default_tax_rate": "12.000",
        "tax_label": "VAT",
    },
    # --- Oceania ---
    "AU": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "fiscal_year_start_month": 7,
        "tax_inclusive_pricing": True,
        "default_tax_rate": "10.000",
        "tax_label": "GST",
    },
    "NZ": {
        "date_format": DATE_FMT_EU_SLASH,
        "fiscal_year_start_month": 4,
        "tax_inclusive_pricing": True,
        "default_tax_rate": "15.000",
        "tax_label": "GST",
    },
    # --- South America ---
    "BR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "pt",
        "default_ui_language": "pt",
        "default_tax_rate": "18.000",
        "tax_label": "ICMS",
    },
    "AR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
        "default_ui_language": "es",
        "default_tax_rate": "21.000",
        "tax_label": "IVA",
    },
    "CL": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
        "default_ui_language": "es",
        "default_tax_rate": "19.000",
        "tax_label": "IVA",
    },
    "CO": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
        "default_ui_language": "es",
        "default_tax_rate": "19.000",
        "tax_label": "IVA",
    },
    # --- Africa ---
    "ZA": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        "date_format": DATE_FMT_ISO,
        "default_tax_rate": "15.000",
        "tax_label": "VAT",
    },
    "NG": {
        "date_format": DATE_FMT_EU_SLASH,
        "default_tax_rate": "7.500",
        "tax_label": "VAT",
    },
    "KE": {
        "date_format": DATE_FMT_EU_SLASH,
        "default_tax_rate": "16.000",
        "tax_label": "VAT",
    },
    # --- Turkey ---
    "TR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "tr",
        "default_ui_language": "tr",
        "default_tax_rate": "20.000",
        "tax_label": "KDV",
    },
}

# ---------------------------------------------------------------------------
# Currency precision overrides — currencies with non-standard decimal places
# ---------------------------------------------------------------------------

_CURRENCY_PRECISION_OVERRIDES: dict[str, int] = {
    # Zero decimal places
    "JPY": 0,
    "KRW": 0,
    "VND": 0,
    "CLP": 0,
    "ISK": 0,
    "HUF": 0,
    "TWD": 0,
    "PYG": 0,
    "UGX": 0,
    "RWF": 0,
    # Three decimal places
    "KWD": 3,
    "BHD": 3,
    "OMR": 3,
    "TND": 3,
    "IQD": 3,
    "LYD": 3,
}


def get_defaults_for_country(country_code: str, currency_code: str = "") -> dict[str, object]:
    """Build a complete defaults dict for the given country and currency.

    Starts from international defaults, applies country-specific overrides,
    then applies currency precision if the currency has a non-standard
    number of decimal places.

    Args:
        country_code: ISO 3166-1 alpha-2 (e.g. "US", "DE", "JP").
        currency_code: ISO 4217 (e.g. "USD", "EUR", "JPY"). Optional.

    Returns:
        Dict with all CompanySettings field names and their default values.
    """
    defaults = dict(_INTERNATIONAL_DEFAULTS)

    country_upper = country_code.upper().strip()
    overrides = _COUNTRY_OVERRIDES.get(country_upper, {})
    defaults.update(overrides)

    currency_upper = currency_code.upper().strip()
    if currency_upper in _CURRENCY_PRECISION_OVERRIDES:
        defaults["currency_precision"] = _CURRENCY_PRECISION_OVERRIDES[currency_upper]

    return defaults
