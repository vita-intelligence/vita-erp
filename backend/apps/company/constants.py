"""
Company settings constants — choice tuples and validation bounds.

Every choice tuple uses a short, stable string key stored in the database.
The second tuple element mirrors the key — no English display labels.
The frontend handles all user-facing translations via i18n, mapping
these keys to its own translation namespace.
"""

# ---------------------------------------------------------------------------
# Number formatting
# ---------------------------------------------------------------------------

DECIMAL_SEP_DOT = "dot"
DECIMAL_SEP_COMMA = "comma"

DECIMAL_SEPARATOR_CHOICES = [
    (DECIMAL_SEP_DOT, DECIMAL_SEP_DOT),
    (DECIMAL_SEP_COMMA, DECIMAL_SEP_COMMA),
]

THOUSANDS_SEP_COMMA = "comma"
THOUSANDS_SEP_DOT = "dot"
THOUSANDS_SEP_SPACE = "space"
THOUSANDS_SEP_APOSTROPHE = "apostrophe"
THOUSANDS_SEP_NONE = "none"

THOUSANDS_SEPARATOR_CHOICES = [
    (THOUSANDS_SEP_COMMA, THOUSANDS_SEP_COMMA),
    (THOUSANDS_SEP_DOT, THOUSANDS_SEP_DOT),
    (THOUSANDS_SEP_SPACE, THOUSANDS_SEP_SPACE),
    (THOUSANDS_SEP_APOSTROPHE, THOUSANDS_SEP_APOSTROPHE),
    (THOUSANDS_SEP_NONE, THOUSANDS_SEP_NONE),
]

DIGIT_GROUPING_STANDARD = "standard"
DIGIT_GROUPING_INDIAN = "indian"
DIGIT_GROUPING_NONE = "none"

DIGIT_GROUPING_CHOICES = [
    (DIGIT_GROUPING_STANDARD, DIGIT_GROUPING_STANDARD),
    (DIGIT_GROUPING_INDIAN, DIGIT_GROUPING_INDIAN),
    (DIGIT_GROUPING_NONE, DIGIT_GROUPING_NONE),
]

# Precision bounds (decimal places)
PRECISION_MIN = 0
PRECISION_MAX = 10

# ---------------------------------------------------------------------------
# Currency display
# ---------------------------------------------------------------------------

CURRENCY_POS_BEFORE = "before"
CURRENCY_POS_AFTER = "after"

CURRENCY_POSITION_CHOICES = [
    (CURRENCY_POS_BEFORE, CURRENCY_POS_BEFORE),
    (CURRENCY_POS_AFTER, CURRENCY_POS_AFTER),
]

NEGATIVE_FMT_MINUS_BEFORE = "minus_before"
NEGATIVE_FMT_MINUS_AFTER = "minus_after"
NEGATIVE_FMT_PARENTHESES = "parentheses"

NEGATIVE_FORMAT_CHOICES = [
    (NEGATIVE_FMT_MINUS_BEFORE, NEGATIVE_FMT_MINUS_BEFORE),
    (NEGATIVE_FMT_MINUS_AFTER, NEGATIVE_FMT_MINUS_AFTER),
    (NEGATIVE_FMT_PARENTHESES, NEGATIVE_FMT_PARENTHESES),
]

# ---------------------------------------------------------------------------
# Rounding
# ---------------------------------------------------------------------------

ROUNDING_HALF_UP = "half_up"
ROUNDING_HALF_EVEN = "half_even"
ROUNDING_CEILING = "ceiling"
ROUNDING_FLOOR = "floor"

ROUNDING_METHOD_CHOICES = [
    (ROUNDING_HALF_UP, ROUNDING_HALF_UP),
    (ROUNDING_HALF_EVEN, ROUNDING_HALF_EVEN),
    (ROUNDING_CEILING, ROUNDING_CEILING),
    (ROUNDING_FLOOR, ROUNDING_FLOOR),
]

CASH_ROUNDING_INCREMENT_CHOICES = [
    ("0.01", "0.01"),
    ("0.05", "0.05"),
    ("0.10", "0.10"),
    ("0.25", "0.25"),
    ("0.50", "0.50"),
    ("1.00", "1.00"),
]

# ---------------------------------------------------------------------------
# Date and time
# ---------------------------------------------------------------------------

DATE_FMT_ISO = "YYYY-MM-DD"
DATE_FMT_EU_SLASH = "DD/MM/YYYY"
DATE_FMT_US = "MM/DD/YYYY"
DATE_FMT_EU_DOT = "DD.MM.YYYY"
DATE_FMT_JP = "YYYY/MM/DD"
DATE_FMT_EU_DASH = "DD-MM-YYYY"

DATE_FORMAT_CHOICES = [
    (DATE_FMT_ISO, DATE_FMT_ISO),
    (DATE_FMT_EU_SLASH, DATE_FMT_EU_SLASH),
    (DATE_FMT_US, DATE_FMT_US),
    (DATE_FMT_EU_DOT, DATE_FMT_EU_DOT),
    (DATE_FMT_JP, DATE_FMT_JP),
    (DATE_FMT_EU_DASH, DATE_FMT_EU_DASH),
]

TIME_FMT_24H = "24h"
TIME_FMT_12H = "12h"

TIME_FORMAT_CHOICES = [
    (TIME_FMT_24H, TIME_FMT_24H),
    (TIME_FMT_12H, TIME_FMT_12H),
]

WEEK_START_MONDAY = "monday"
WEEK_START_SUNDAY = "sunday"
WEEK_START_SATURDAY = "saturday"

WEEK_START_CHOICES = [
    (WEEK_START_MONDAY, WEEK_START_MONDAY),
    (WEEK_START_SUNDAY, WEEK_START_SUNDAY),
    (WEEK_START_SATURDAY, WEEK_START_SATURDAY),
]

CALENDAR_GREGORIAN = "gregorian"
CALENDAR_HIJRI = "hijri"
CALENDAR_THAI_BUDDHIST = "thai_buddhist"
CALENDAR_PERSIAN = "persian"
CALENDAR_JAPANESE = "japanese"

CALENDAR_SYSTEM_CHOICES = [
    (CALENDAR_GREGORIAN, CALENDAR_GREGORIAN),
    (CALENDAR_HIJRI, CALENDAR_HIJRI),
    (CALENDAR_THAI_BUDDHIST, CALENDAR_THAI_BUDDHIST),
    (CALENDAR_PERSIAN, CALENDAR_PERSIAN),
    (CALENDAR_JAPANESE, CALENDAR_JAPANESE),
]

# ---------------------------------------------------------------------------
# Measurement system and default units
# ---------------------------------------------------------------------------

MEASUREMENT_METRIC = "metric"
MEASUREMENT_IMPERIAL = "imperial"

MEASUREMENT_SYSTEM_CHOICES = [
    (MEASUREMENT_METRIC, MEASUREMENT_METRIC),
    (MEASUREMENT_IMPERIAL, MEASUREMENT_IMPERIAL),
]

WEIGHT_KG = "kg"
WEIGHT_G = "g"
WEIGHT_MG = "mg"
WEIGHT_T = "t"
WEIGHT_LB = "lb"
WEIGHT_OZ = "oz"

WEIGHT_UOM_CHOICES = [
    (WEIGHT_KG, WEIGHT_KG),
    (WEIGHT_G, WEIGHT_G),
    (WEIGHT_MG, WEIGHT_MG),
    (WEIGHT_T, WEIGHT_T),
    (WEIGHT_LB, WEIGHT_LB),
    (WEIGHT_OZ, WEIGHT_OZ),
]

LENGTH_M = "m"
LENGTH_CM = "cm"
LENGTH_MM = "mm"
LENGTH_FT = "ft"
LENGTH_IN = "in"
LENGTH_YD = "yd"

LENGTH_UOM_CHOICES = [
    (LENGTH_M, LENGTH_M),
    (LENGTH_CM, LENGTH_CM),
    (LENGTH_MM, LENGTH_MM),
    (LENGTH_FT, LENGTH_FT),
    (LENGTH_IN, LENGTH_IN),
    (LENGTH_YD, LENGTH_YD),
]

VOLUME_L = "L"
VOLUME_ML = "mL"
VOLUME_M3 = "m3"
VOLUME_GAL = "gal"
VOLUME_FL_OZ = "fl_oz"
VOLUME_FT3 = "ft3"

VOLUME_UOM_CHOICES = [
    (VOLUME_L, VOLUME_L),
    (VOLUME_ML, VOLUME_ML),
    (VOLUME_M3, VOLUME_M3),
    (VOLUME_GAL, VOLUME_GAL),
    (VOLUME_FL_OZ, VOLUME_FL_OZ),
    (VOLUME_FT3, VOLUME_FT3),
]

TEMP_CELSIUS = "celsius"
TEMP_FAHRENHEIT = "fahrenheit"

TEMPERATURE_UOM_CHOICES = [
    (TEMP_CELSIUS, TEMP_CELSIUS),
    (TEMP_FAHRENHEIT, TEMP_FAHRENHEIT),
]

AREA_M2 = "m2"
AREA_FT2 = "ft2"
AREA_HECTARE = "hectare"
AREA_ACRE = "acre"

AREA_UOM_CHOICES = [
    (AREA_M2, AREA_M2),
    (AREA_FT2, AREA_FT2),
    (AREA_HECTARE, AREA_HECTARE),
    (AREA_ACRE, AREA_ACRE),
]

# ---------------------------------------------------------------------------
# Fiscal and financial
# ---------------------------------------------------------------------------

COST_METHOD_STANDARD = "standard"
COST_METHOD_AVERAGE = "average"
COST_METHOD_FIFO = "fifo"

COST_METHOD_CHOICES = [
    (COST_METHOD_STANDARD, COST_METHOD_STANDARD),
    (COST_METHOD_AVERAGE, COST_METHOD_AVERAGE),
    (COST_METHOD_FIFO, COST_METHOD_FIFO),
]

FISCAL_CAL_STANDARD = "standard"
FISCAL_CAL_445 = "445_week"
FISCAL_CAL_454 = "454_week"
FISCAL_CAL_544 = "544_week"

FISCAL_CALENDAR_CHOICES = [
    (FISCAL_CAL_STANDARD, FISCAL_CAL_STANDARD),
    (FISCAL_CAL_445, FISCAL_CAL_445),
    (FISCAL_CAL_454, FISCAL_CAL_454),
    (FISCAL_CAL_544, FISCAL_CAL_544),
]

FISCAL_MONTH_MIN = 1
FISCAL_MONTH_MAX = 12
FISCAL_DAY_MIN = 1
FISCAL_DAY_MAX = 31

# ---------------------------------------------------------------------------
# Document defaults
# ---------------------------------------------------------------------------

PAPER_SIZE_A4 = "A4"
PAPER_SIZE_LETTER = "letter"
PAPER_SIZE_LEGAL = "legal"

PAPER_SIZE_CHOICES = [
    (PAPER_SIZE_A4, PAPER_SIZE_A4),
    (PAPER_SIZE_LETTER, PAPER_SIZE_LETTER),
    (PAPER_SIZE_LEGAL, PAPER_SIZE_LEGAL),
]

TEXT_DIR_LTR = "ltr"
TEXT_DIR_RTL = "rtl"

TEXT_DIRECTION_CHOICES = [
    (TEXT_DIR_LTR, TEXT_DIR_LTR),
    (TEXT_DIR_RTL, TEXT_DIR_RTL),
]

# ---------------------------------------------------------------------------
# Conflicting separator pairs — used by model validation
# ---------------------------------------------------------------------------

SEPARATOR_CONFLICT_PAIRS = frozenset(
    {
        (DECIMAL_SEP_DOT, THOUSANDS_SEP_DOT),
        (DECIMAL_SEP_COMMA, THOUSANDS_SEP_COMMA),
    }
)
