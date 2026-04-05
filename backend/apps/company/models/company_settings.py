"""
CompanySettings — singleton per org database.

Stores system-level formatting and behavioral settings that cascade into
every ERP module: number precision, date/time formats, measurement units,
currency display, rounding rules, fiscal configuration, and document defaults.

NOT stored here (lives on Organization in central DB):
    timezone, base_currency, country, name, slug

NOT stored here (user-defined via form builder):
    Tax IDs, registration numbers, company identity fields
"""

from __future__ import annotations

import calendar
from typing import Any

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.company.constants import (
    AREA_M2,
    AREA_UOM_CHOICES,
    CALENDAR_GREGORIAN,
    CALENDAR_SYSTEM_CHOICES,
    COST_METHOD_AVERAGE,
    COST_METHOD_CHOICES,
    CURRENCY_POS_BEFORE,
    CURRENCY_POSITION_CHOICES,
    DATE_FMT_ISO,
    DATE_FORMAT_CHOICES,
    DECIMAL_SEP_DOT,
    DECIMAL_SEPARATOR_CHOICES,
    DIGIT_GROUPING_CHOICES,
    DIGIT_GROUPING_NONE,
    DIGIT_GROUPING_STANDARD,
    FISCAL_CAL_STANDARD,
    FISCAL_CALENDAR_CHOICES,
    FISCAL_DAY_MAX,
    FISCAL_DAY_MIN,
    FISCAL_MONTH_MAX,
    FISCAL_MONTH_MIN,
    LENGTH_M,
    LENGTH_UOM_CHOICES,
    MEASUREMENT_METRIC,
    MEASUREMENT_SYSTEM_CHOICES,
    NEGATIVE_FMT_MINUS_BEFORE,
    NEGATIVE_FORMAT_CHOICES,
    PAPER_SIZE_A4,
    PAPER_SIZE_CHOICES,
    PRECISION_MAX,
    PRECISION_MIN,
    ROUNDING_HALF_UP,
    ROUNDING_METHOD_CHOICES,
    SEPARATOR_CONFLICT_PAIRS,
    TEMP_CELSIUS,
    TEMPERATURE_UOM_CHOICES,
    TEXT_DIR_LTR,
    TEXT_DIRECTION_CHOICES,
    THOUSANDS_SEP_COMMA,
    THOUSANDS_SEPARATOR_CHOICES,
    TIME_FMT_24H,
    TIME_FORMAT_CHOICES,
    VOLUME_L,
    VOLUME_UOM_CHOICES,
    WEEK_START_CHOICES,
    WEEK_START_MONDAY,
    WEIGHT_KG,
    WEIGHT_UOM_CHOICES,
)

# Reusable validator instances
_precision_validators = [
    MinValueValidator(PRECISION_MIN),
    MaxValueValidator(PRECISION_MAX),
]


class CompanySettings(models.Model):
    """Singleton settings record for an organization database."""

    # === Number Formatting ===

    decimal_separator = models.CharField(
        max_length=10,
        choices=DECIMAL_SEPARATOR_CHOICES,
        default=DECIMAL_SEP_DOT,
    )
    thousands_separator = models.CharField(
        max_length=10,
        choices=THOUSANDS_SEPARATOR_CHOICES,
        default=THOUSANDS_SEP_COMMA,
    )
    digit_grouping = models.CharField(
        max_length=10,
        choices=DIGIT_GROUPING_CHOICES,
        default=DIGIT_GROUPING_STANDARD,
    )

    # === Precision (decimal places) ===

    quantity_precision = models.PositiveSmallIntegerField(
        default=4,
        validators=_precision_validators,
    )
    price_precision = models.PositiveSmallIntegerField(
        default=2,
        validators=_precision_validators,
    )
    currency_precision = models.PositiveSmallIntegerField(
        default=2,
        validators=_precision_validators,
    )
    exchange_rate_precision = models.PositiveSmallIntegerField(
        default=6,
        validators=_precision_validators,
    )
    percentage_precision = models.PositiveSmallIntegerField(
        default=2,
        validators=_precision_validators,
    )
    weight_precision = models.PositiveSmallIntegerField(
        default=3,
        validators=_precision_validators,
    )

    # === Currency Display ===

    currency_symbol_position = models.CharField(
        max_length=10,
        choices=CURRENCY_POSITION_CHOICES,
        default=CURRENCY_POS_BEFORE,
    )
    currency_spacing = models.BooleanField(
        default=False,
        help_text="Insert a space between the currency symbol and amount.",
    )
    negative_format = models.CharField(
        max_length=15,
        choices=NEGATIVE_FORMAT_CHOICES,
        default=NEGATIVE_FMT_MINUS_BEFORE,
    )

    # === Rounding ===

    rounding_method = models.CharField(
        max_length=10,
        choices=ROUNDING_METHOD_CHOICES,
        default=ROUNDING_HALF_UP,
    )
    cash_rounding_enabled = models.BooleanField(default=False)
    cash_rounding_increment = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default="0.01",
    )

    # === Date & Time ===

    date_format = models.CharField(
        max_length=20,
        choices=DATE_FORMAT_CHOICES,
        default=DATE_FMT_ISO,
    )
    time_format = models.CharField(
        max_length=3,
        choices=TIME_FORMAT_CHOICES,
        default=TIME_FMT_24H,
    )
    week_start_day = models.CharField(
        max_length=10,
        choices=WEEK_START_CHOICES,
        default=WEEK_START_MONDAY,
    )
    calendar_system = models.CharField(
        max_length=15,
        choices=CALENDAR_SYSTEM_CHOICES,
        default=CALENDAR_GREGORIAN,
    )

    # === Measurement System ===

    measurement_system = models.CharField(
        max_length=10,
        choices=MEASUREMENT_SYSTEM_CHOICES,
        default=MEASUREMENT_METRIC,
    )
    default_weight_uom = models.CharField(
        max_length=5,
        choices=WEIGHT_UOM_CHOICES,
        default=WEIGHT_KG,
    )
    default_length_uom = models.CharField(
        max_length=5,
        choices=LENGTH_UOM_CHOICES,
        default=LENGTH_M,
    )
    default_volume_uom = models.CharField(
        max_length=5,
        choices=VOLUME_UOM_CHOICES,
        default=VOLUME_L,
    )
    default_temperature_uom = models.CharField(
        max_length=10,
        choices=TEMPERATURE_UOM_CHOICES,
        default=TEMP_CELSIUS,
    )
    default_area_uom = models.CharField(
        max_length=10,
        choices=AREA_UOM_CHOICES,
        default=AREA_M2,
    )

    # === Fiscal & Financial ===

    fiscal_year_start_month = models.PositiveSmallIntegerField(
        default=1,
        validators=[
            MinValueValidator(FISCAL_MONTH_MIN),
            MaxValueValidator(FISCAL_MONTH_MAX),
        ],
    )
    fiscal_year_start_day = models.PositiveSmallIntegerField(
        default=1,
        validators=[
            MinValueValidator(FISCAL_DAY_MIN),
            MaxValueValidator(FISCAL_DAY_MAX),
        ],
    )
    fiscal_calendar_type = models.CharField(
        max_length=10,
        choices=FISCAL_CALENDAR_CHOICES,
        default=FISCAL_CAL_STANDARD,
    )
    cost_method = models.CharField(
        max_length=10,
        choices=COST_METHOD_CHOICES,
        default=COST_METHOD_AVERAGE,
    )
    tax_inclusive_pricing = models.BooleanField(default=False)

    # === Document Defaults ===

    default_document_language = models.CharField(
        max_length=10,
        default="en",
    )
    default_paper_size = models.CharField(
        max_length=10,
        choices=PAPER_SIZE_CHOICES,
        default=PAPER_SIZE_A4,
    )
    text_direction = models.CharField(
        max_length=3,
        choices=TEXT_DIRECTION_CHOICES,
        default=TEXT_DIR_LTR,
    )

    # === Metadata ===

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_settings"
        verbose_name = "Company Settings"
        verbose_name_plural = "Company Settings"

    def __str__(self) -> str:
        return "CompanySettings"

    def clean(self) -> None:
        errors: dict[str, list[ValidationError]] = {}

        self._validate_separator_conflict(errors)
        self._validate_fiscal_day(errors)
        self._validate_digit_grouping(errors)
        self._validate_cash_rounding(errors)

        if errors:
            raise ValidationError(errors)

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.pk and CompanySettings.objects.exists():
            raise ValidationError("company_settings_already_exists")
        self.full_clean()
        super().save(*args, **kwargs)

    def _validate_separator_conflict(self, errors: dict[str, list[ValidationError]]) -> None:
        pair = (self.decimal_separator, self.thousands_separator)
        if pair in SEPARATOR_CONFLICT_PAIRS:
            msg = ValidationError("separator_conflict", code="separator_conflict")
            errors.setdefault("decimal_separator", []).append(msg)
            errors.setdefault("thousands_separator", []).append(msg)

    def _validate_fiscal_day(self, errors: dict[str, list[ValidationError]]) -> None:
        month = self.fiscal_year_start_month
        day = self.fiscal_year_start_day

        if not (FISCAL_MONTH_MIN <= month <= FISCAL_MONTH_MAX):
            return

        max_day = calendar.monthrange(2000, month)[1]
        if day > max_day:
            errors.setdefault("fiscal_year_start_day", []).append(
                ValidationError(
                    "fiscal_day_exceeds_month",
                    code="fiscal_day_exceeds_month",
                    params={"month": month, "max_day": max_day},
                )
            )

    def _validate_digit_grouping(self, errors: dict[str, list[ValidationError]]) -> None:
        if self.digit_grouping != DIGIT_GROUPING_NONE and self.thousands_separator == "none":
            errors.setdefault("digit_grouping", []).append(
                ValidationError(
                    "digit_grouping_requires_separator",
                    code="digit_grouping_requires_separator",
                )
            )

    def _validate_cash_rounding(self, errors: dict[str, list[ValidationError]]) -> None:
        if self.cash_rounding_enabled and self.cash_rounding_increment <= 0:
            errors.setdefault("cash_rounding_increment", []).append(
                ValidationError(
                    "cash_rounding_increment_must_be_positive",
                    code="cash_rounding_increment_must_be_positive",
                )
            )
