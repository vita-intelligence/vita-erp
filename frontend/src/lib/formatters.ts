/**
 * Display formatters driven by CompanySettings.
 *
 * Pure functions: all formatters take (value, settings, ...) and return
 * a string. The React hook `useFormatters` (hooks/useFormatters.ts)
 * binds these to the active org's settings.
 *
 * When `settings` is null (pre-load, org-switch, fetch error) every
 * formatter falls back to `String(value)` so consumers never crash.
 *
 * Fields NOT consumed here (fed by downstream modules later):
 *   rounding_method, cost_method, cash_rounding_*, fiscal_year_*,
 *   calendar_system, week_start_day, paper_size, default_*_uom except
 *   default_weight_uom (used by formatWeight).
 */

import type { CompanySettingsResponse } from "@/app/[locale]/(app)/(org)/settings/_types/company-settings";

type Settings = CompanySettingsResponse | null;

// ── Separators ──────────────────────────────────────────────────────────────

const DECIMAL_SEP: Record<string, string> = {
  dot: ".",
  comma: ",",
};

const THOUSANDS_SEP: Record<string, string> = {
  comma: ",",
  dot: ".",
  space: " ",
  apostrophe: "'",
  none: "",
};

function decimalSeparator(settings: Settings): string {
  return DECIMAL_SEP[settings?.decimal_separator ?? "dot"] ?? ".";
}

function thousandsSeparator(settings: Settings): string {
  return THOUSANDS_SEP[settings?.thousands_separator ?? "comma"] ?? ",";
}

// ── Digit grouping ──────────────────────────────────────────────────────────

/** Groups the integer part of a number per the chosen scheme. */
export function applyDigitGrouping(
  intPart: string,
  grouping: string,
  separator: string,
): string {
  if (grouping === "none" || separator === "") return intPart;

  const digits = intPart.replace(/^-/, "");
  const sign = intPart.startsWith("-") ? "-" : "";

  if (grouping === "indian") {
    // 12,34,56,789 — last three digits grouped, then pairs of two
    if (digits.length <= 3) return sign + digits;
    const lastThree = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, separator);
    return `${sign}${grouped}${separator}${lastThree}`;
  }

  // standard — every 3 digits from the right
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

// ── Negative formatting ─────────────────────────────────────────────────────

/** Wraps a formatted body according to the negative-number style. */
export function applyNegativeFormat(
  body: string,
  isNegative: boolean,
  format: string,
): string {
  if (!isNegative) return body;
  switch (format) {
    case "minus_after":
      return `${body}-`;
    case "parentheses":
      return `(${body})`;
    default:
      return `-${body}`;
  }
}

// ── Number ──────────────────────────────────────────────────────────────────

type FormatNumberOptions = {
  /** Override the decimal places (otherwise derived from caller). */
  precision?: number;
  /** Suppress digit grouping (e.g. for IDs). */
  noGrouping?: boolean;
};

/** Format a plain number per decimal/thousands separator + digit grouping. */
export function formatNumber(
  value: number | string | null | undefined,
  settings: Settings,
  opts: FormatNumberOptions = {},
): string {
  if (value == null || value === "") return "";
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num)) return String(value);

  if (!settings) return String(num);

  const precision = opts.precision ?? settings.currency_precision ?? 2;
  const fixed = Math.abs(num).toFixed(precision);
  const [intPart, decPart] = fixed.split(".");

  const grouped = opts.noGrouping
    ? intPart
    : applyDigitGrouping(
        intPart,
        settings.digit_grouping,
        thousandsSeparator(settings),
      );

  const body = decPart
    ? `${grouped}${decimalSeparator(settings)}${decPart}`
    : grouped;

  return applyNegativeFormat(body, num < 0, settings.negative_format);
}

// ── Currency ────────────────────────────────────────────────────────────────

/** Extract the currency symbol for an ISO currency code via Intl. */
export function currencySymbol(currencyCode: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
    }).formatToParts(1);
    return parts.find((p) => p.type === "currency")?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
}

/** Format a monetary amount with symbol placement + currency precision. */
export function formatCurrency(
  value: number | string | null | undefined,
  currencyCode: string | null | undefined,
  settings: Settings,
): string {
  if (value == null || value === "") return "";
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num)) return String(value);

  if (!settings || !currencyCode) return String(num);

  const symbol = currencySymbol(currencyCode);
  const precision = settings.currency_precision ?? 2;

  // Format the absolute value first, apply sign afterwards (so the
  // symbol sits next to the digits, not the minus).
  const fixed = Math.abs(num).toFixed(precision);
  const [intPart, decPart] = fixed.split(".");
  const grouped = applyDigitGrouping(
    intPart,
    settings.digit_grouping,
    thousandsSeparator(settings),
  );
  const body = decPart
    ? `${grouped}${decimalSeparator(settings)}${decPart}`
    : grouped;

  const spacing = settings.currency_spacing ? " " : "";
  const withSymbol =
    settings.currency_symbol_position === "after"
      ? `${body}${spacing}${symbol}`
      : `${symbol}${spacing}${body}`;

  return applyNegativeFormat(withSymbol, num < 0, settings.negative_format);
}

// ── Quantity / Price / Percentage / Weight ──────────────────────────────────

export function formatQuantity(
  value: number | string | null | undefined,
  settings: Settings,
): string {
  return formatNumber(value, settings, {
    precision: settings?.quantity_precision ?? 4,
  });
}

export function formatPrice(
  value: number | string | null | undefined,
  settings: Settings,
): string {
  return formatNumber(value, settings, {
    precision: settings?.price_precision ?? 2,
  });
}

export function formatPercentage(
  value: number | string | null | undefined,
  settings: Settings,
): string {
  const body = formatNumber(value, settings, {
    precision: settings?.percentage_precision ?? 2,
  });
  return body === "" ? "" : `${body}%`;
}

export function formatWeight(
  value: number | string | null | undefined,
  settings: Settings,
): string {
  const body = formatNumber(value, settings, {
    precision: settings?.weight_precision ?? 3,
  });
  if (body === "" || !settings) return body;
  return `${body} ${settings.default_weight_uom}`;
}

// ── Date / Time ─────────────────────────────────────────────────────────────

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Render a date per the `date_format` enum (YYYY-MM-DD / DD.MM.YYYY / …). */
export function formatDate(
  value: Date | string | number | null | undefined,
  settings: Settings,
): string {
  const date = toDate(value);
  if (!date) return "";
  if (!settings) return date.toISOString().slice(0, 10);

  const yyyy = date.getFullYear().toString();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());

  switch (settings.date_format) {
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${yyyy}`;
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${yyyy}`;
    case "DD.MM.YYYY":
      return `${dd}.${mm}.${yyyy}`;
    case "YYYY/MM/DD":
      return `${yyyy}/${mm}/${dd}`;
    case "DD-MM-YYYY":
      return `${dd}-${mm}-${yyyy}`;
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}

/** Render a clock time per `time_format` (24h → HH:mm, 12h → h:mm AM/PM). */
export function formatTime(
  value: Date | string | number | null | undefined,
  settings: Settings,
): string {
  const date = toDate(value);
  if (!date) return "";

  const hours24 = date.getHours();
  const minutes = pad(date.getMinutes());

  if (!settings || settings.time_format === "24h") {
    return `${pad(hours24)}:${minutes}`;
  }

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

/** Convenience: date + time joined by a space. */
export function formatDateTime(
  value: Date | string | number | null | undefined,
  settings: Settings,
): string {
  const date = toDate(value);
  if (!date) return "";
  return `${formatDate(date, settings)} ${formatTime(date, settings)}`;
}
