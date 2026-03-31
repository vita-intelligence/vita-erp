"""
CompanySettings serializers — read and partial update.

CompanySettingsSerializer: full representation for GET responses.
CompanySettingsUpdateSerializer: partial update with field-level validation.
"""

from __future__ import annotations

from rest_framework import serializers

from apps.company.constants import (
    PRECISION_MAX,
    PRECISION_MIN,
)
from apps.company.models import CompanySettings


class CompanySettingsSerializer(serializers.ModelSerializer):
    """Read-only representation of all company settings."""

    class Meta:
        model = CompanySettings
        exclude = ("id",)
        read_only_fields = [field.name for field in CompanySettings._meta.get_fields() if hasattr(field, "column")]


class CompanySettingsUpdateSerializer(serializers.Serializer):
    """Validates partial updates to CompanySettings.

    All fields are optional — only provided fields are updated.
    Model-level cross-field validation (separator conflicts, fiscal day,
    etc.) runs in CompanySettings.clean() at save time.
    """

    # Number formatting
    decimal_separator = serializers.ChoiceField(
        choices=CompanySettings.decimal_separator.field.choices,
        required=False,
    )
    thousands_separator = serializers.ChoiceField(
        choices=CompanySettings.thousands_separator.field.choices,
        required=False,
    )
    digit_grouping = serializers.ChoiceField(
        choices=CompanySettings.digit_grouping.field.choices,
        required=False,
    )

    # Precision
    quantity_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )
    price_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )
    currency_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )
    exchange_rate_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )
    percentage_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )
    weight_precision = serializers.IntegerField(
        min_value=PRECISION_MIN,
        max_value=PRECISION_MAX,
        required=False,
    )

    # Currency display
    currency_symbol_position = serializers.ChoiceField(
        choices=CompanySettings.currency_symbol_position.field.choices,
        required=False,
    )
    currency_spacing = serializers.BooleanField(required=False)
    negative_format = serializers.ChoiceField(
        choices=CompanySettings.negative_format.field.choices,
        required=False,
    )
    multi_currency_enabled = serializers.BooleanField(required=False)

    # Rounding
    rounding_method = serializers.ChoiceField(
        choices=CompanySettings.rounding_method.field.choices,
        required=False,
    )
    cash_rounding_enabled = serializers.BooleanField(required=False)
    cash_rounding_increment = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        required=False,
    )

    # Date & time
    date_format = serializers.ChoiceField(
        choices=CompanySettings.date_format.field.choices,
        required=False,
    )
    time_format = serializers.ChoiceField(
        choices=CompanySettings.time_format.field.choices,
        required=False,
    )
    week_start_day = serializers.ChoiceField(
        choices=CompanySettings.week_start_day.field.choices,
        required=False,
    )
    calendar_system = serializers.ChoiceField(
        choices=CompanySettings.calendar_system.field.choices,
        required=False,
    )

    # Measurement
    measurement_system = serializers.ChoiceField(
        choices=CompanySettings.measurement_system.field.choices,
        required=False,
    )
    default_weight_uom = serializers.ChoiceField(
        choices=CompanySettings.default_weight_uom.field.choices,
        required=False,
    )
    default_length_uom = serializers.ChoiceField(
        choices=CompanySettings.default_length_uom.field.choices,
        required=False,
    )
    default_volume_uom = serializers.ChoiceField(
        choices=CompanySettings.default_volume_uom.field.choices,
        required=False,
    )
    default_temperature_uom = serializers.ChoiceField(
        choices=CompanySettings.default_temperature_uom.field.choices,
        required=False,
    )
    default_area_uom = serializers.ChoiceField(
        choices=CompanySettings.default_area_uom.field.choices,
        required=False,
    )

    # Fiscal & financial
    fiscal_year_start_month = serializers.IntegerField(
        min_value=1,
        max_value=12,
        required=False,
    )
    fiscal_year_start_day = serializers.IntegerField(
        min_value=1,
        max_value=31,
        required=False,
    )
    fiscal_calendar_type = serializers.ChoiceField(
        choices=CompanySettings.fiscal_calendar_type.field.choices,
        required=False,
    )
    cost_method = serializers.ChoiceField(
        choices=CompanySettings.cost_method.field.choices,
        required=False,
    )
    tax_inclusive_pricing = serializers.BooleanField(required=False)

    # Document defaults
    default_document_language = serializers.CharField(
        max_length=10,
        required=False,
    )
    default_paper_size = serializers.ChoiceField(
        choices=CompanySettings.default_paper_size.field.choices,
        required=False,
    )
    text_direction = serializers.ChoiceField(
        choices=CompanySettings.text_direction.field.choices,
        required=False,
    )
