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
    "default_document_language": "en",
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
        "default_paper_size": PAPER_SIZE_LETTER,
    },
    # --- UK & Ireland ---
    "GB": {
        "date_format": DATE_FMT_EU_SLASH,
        "fiscal_year_start_month": 4,
        "fiscal_year_start_day": 6,
    },
    "IE": {
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
    },
    # --- Western Europe ---
    "DE": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "de",
    },
    "AT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "de",
    },
    "CH": {
        "thousands_separator": THOUSANDS_SEP_APOSTROPHE,
        "date_format": DATE_FMT_EU_DOT,
        "rounding_method": ROUNDING_HALF_EVEN,
        "cash_rounding_enabled": True,
        "cash_rounding_increment": "0.05",
        "default_document_language": "de",
    },
    "NL": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
    },
    "BE": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
    },
    # --- Southern Europe ---
    "FR": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "fr",
    },
    "ES": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "es",
    },
    "IT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "it",
    },
    "PT": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_SLASH,
        "tax_inclusive_pricing": True,
        "default_document_language": "pt",
    },
    # --- Nordic ---
    "SE": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_ISO,
        "cash_rounding_enabled": True,
        "cash_rounding_increment": "1.00",
    },
    "NO": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    "DK": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    "FI": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    # --- Eastern Europe ---
    "PL": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    "RU": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "ru",
    },
    "UA": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    "CZ": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    "RO": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        **_SYMBOL_AFTER_SPACED,
        "date_format": DATE_FMT_EU_DOT,
    },
    # --- Middle East (RTL) ---
    "SA": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "calendar_system": CALENDAR_HIJRI,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
    },
    "AE": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
    },
    "IL": {
        "date_format": DATE_FMT_EU_DOT,
        "week_start_day": WEEK_START_SUNDAY,
        "text_direction": TEXT_DIR_RTL,
    },
    "IR": {
        "date_format": DATE_FMT_ISO,
        "week_start_day": WEEK_START_SATURDAY,
        "calendar_system": CALENDAR_PERSIAN,
        "text_direction": TEXT_DIR_RTL,
    },
    "EG": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
        "default_document_language": "ar",
    },
    # --- South Asia ---
    "IN": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "fiscal_year_start_month": 4,
        "default_document_language": "hi",
    },
    "PK": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "week_start_day": WEEK_START_SATURDAY,
        "text_direction": TEXT_DIR_RTL,
    },
    "BD": {
        "digit_grouping": DIGIT_GROUPING_INDIAN,
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
    },
    # --- East Asia ---
    "JP": {
        "date_format": DATE_FMT_JP,
        "week_start_day": WEEK_START_SUNDAY,
        "calendar_system": CALENDAR_JAPANESE,
        "fiscal_year_start_month": 4,
        "default_document_language": "ja",
    },
    "CN": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "zh",
    },
    "KR": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "ko",
    },
    "TW": {
        "date_format": DATE_FMT_JP,
        "default_document_language": "zh",
    },
    # --- Southeast Asia ---
    "TH": {
        "date_format": DATE_FMT_EU_SLASH,
        "calendar_system": CALENDAR_THAI_BUDDHIST,
    },
    "ID": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "id",
    },
    "VN": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "currency_precision": 0,
    },
    "MY": {
        "date_format": DATE_FMT_EU_SLASH,
    },
    "PH": {
        "date_format": DATE_FMT_US,
        "time_format": TIME_FMT_12H,
    },
    # --- Oceania ---
    "AU": {
        "date_format": DATE_FMT_EU_SLASH,
        "time_format": TIME_FMT_12H,
        "fiscal_year_start_month": 7,
        "tax_inclusive_pricing": True,
    },
    "NZ": {
        "date_format": DATE_FMT_EU_SLASH,
        "fiscal_year_start_month": 4,
        "tax_inclusive_pricing": True,
    },
    # --- South America ---
    "BR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "pt",
    },
    "AR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
    },
    "CL": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
    },
    "CO": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_SLASH,
        "default_document_language": "es",
    },
    # --- Africa ---
    "ZA": {
        **_COMMA_DECIMAL_SPACE_THOUSANDS,
        "date_format": DATE_FMT_ISO,
    },
    "NG": {
        "date_format": DATE_FMT_EU_SLASH,
    },
    "KE": {
        "date_format": DATE_FMT_EU_SLASH,
    },
    # --- Turkey ---
    "TR": {
        **_COMMA_DECIMAL_DOT_THOUSANDS,
        "date_format": DATE_FMT_EU_DOT,
        "default_document_language": "tr",
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
