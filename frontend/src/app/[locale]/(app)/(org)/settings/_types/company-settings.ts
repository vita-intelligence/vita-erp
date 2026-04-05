import { z } from "zod";

// ── Choice value unions ─────────────────────────────────────────────────────

export const DECIMAL_SEPARATORS = ["dot", "comma"] as const;
export const THOUSANDS_SEPARATORS = [
  "comma",
  "dot",
  "space",
  "apostrophe",
  "none",
] as const;
export const DIGIT_GROUPINGS = ["standard", "indian", "none"] as const;
export const CURRENCY_POSITIONS = ["before", "after"] as const;
export const NEGATIVE_FORMATS = [
  "minus_before",
  "minus_after",
  "parentheses",
] as const;
export const ROUNDING_METHODS = [
  "half_up",
  "half_even",
  "ceiling",
  "floor",
] as const;
export const DATE_FORMATS = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "DD.MM.YYYY",
  "YYYY/MM/DD",
  "DD-MM-YYYY",
] as const;
export const TIME_FORMATS = ["24h", "12h"] as const;
export const WEEK_START_DAYS = ["monday", "sunday", "saturday"] as const;
export const CALENDAR_SYSTEMS = [
  "gregorian",
  "hijri",
  "thai_buddhist",
  "persian",
  "japanese",
] as const;
export const MEASUREMENT_SYSTEMS = ["metric", "imperial"] as const;
export const WEIGHT_UOMS = ["kg", "g", "mg", "t", "lb", "oz"] as const;
export const LENGTH_UOMS = ["m", "cm", "mm", "ft", "in", "yd"] as const;
export const VOLUME_UOMS = ["L", "mL", "m3", "gal", "fl_oz", "ft3"] as const;
export const TEMPERATURE_UOMS = ["celsius", "fahrenheit"] as const;
export const AREA_UOMS = ["m2", "ft2", "hectare", "acre"] as const;
export const COST_METHODS = ["standard", "average", "fifo"] as const;
export const FISCAL_CALENDAR_TYPES = [
  "standard",
  "445_week",
  "454_week",
  "544_week",
] as const;
export const PAPER_SIZES = ["A4", "letter", "legal"] as const;
export const TEXT_DIRECTIONS = ["ltr", "rtl"] as const;

// ── Zod schema ──────────────────────────────────────────────────────────────

const precision = z.number().int().min(0).max(10);

export const companySettingsSchema = z
  .object({
    // Number formatting
    decimal_separator: z.enum(DECIMAL_SEPARATORS),
    thousands_separator: z.enum(THOUSANDS_SEPARATORS),
    digit_grouping: z.enum(DIGIT_GROUPINGS),

    // Precision
    quantity_precision: precision,
    price_precision: precision,
    currency_precision: precision,
    exchange_rate_precision: precision,
    percentage_precision: precision,
    weight_precision: precision,

    // Currency display
    currency_symbol_position: z.enum(CURRENCY_POSITIONS),
    currency_spacing: z.boolean(),
    negative_format: z.enum(NEGATIVE_FORMATS),

    // Rounding
    rounding_method: z.enum(ROUNDING_METHODS),
    cash_rounding_enabled: z.boolean(),
    cash_rounding_increment: z.string(),

    // Date & time
    date_format: z.enum(DATE_FORMATS),
    time_format: z.enum(TIME_FORMATS),
    week_start_day: z.enum(WEEK_START_DAYS),
    calendar_system: z.enum(CALENDAR_SYSTEMS),

    // Measurement
    measurement_system: z.enum(MEASUREMENT_SYSTEMS),
    default_weight_uom: z.enum(WEIGHT_UOMS),
    default_length_uom: z.enum(LENGTH_UOMS),
    default_volume_uom: z.enum(VOLUME_UOMS),
    default_temperature_uom: z.enum(TEMPERATURE_UOMS),
    default_area_uom: z.enum(AREA_UOMS),

    // Fiscal & financial
    fiscal_year_start_month: z.number().int().min(1).max(12),
    fiscal_year_start_day: z.number().int().min(1).max(31),
    fiscal_calendar_type: z.enum(FISCAL_CALENDAR_TYPES),
    cost_method: z.enum(COST_METHODS),
    tax_inclusive_pricing: z.boolean(),

    // Document defaults
    default_document_language: z.string().min(2).max(10),
    default_paper_size: z.enum(PAPER_SIZES),
    text_direction: z.enum(TEXT_DIRECTIONS),
  })
  .refine(
    (data) => {
      if (
        data.decimal_separator === "dot" &&
        data.thousands_separator === "dot"
      )
        return false;
      if (
        data.decimal_separator === "comma" &&
        data.thousands_separator === "comma"
      )
        return false;
      return true;
    },
    { path: ["thousands_separator"], message: "separator_conflict" },
  )
  .refine(
    (data) => {
      if (data.digit_grouping !== "none" && data.thousands_separator === "none")
        return false;
      return true;
    },
    { path: ["digit_grouping"], message: "digit_grouping_requires_separator" },
  );

// ── Types ───────────────────────────────────────────────────────────────────

export type CompanySettings = z.infer<typeof companySettingsSchema>;

export type CompanySettingsResponse = CompanySettings & {
  created_at: string;
  updated_at: string;
};
