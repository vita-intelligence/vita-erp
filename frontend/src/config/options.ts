/**
 * Dropdown options for org creation wizard and settings.
 *
 * Languages, industries, and countries are static arrays.
 * Timezones and currencies use the browser's Intl API —
 * always complete, zero maintenance, auto-localized.
 */

import type { I18N } from "@/config/i18n";

// ---------------------------------------------------------------------------
// Languages — derived from i18n config
// ---------------------------------------------------------------------------

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "es", label: "Español (Spanish)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "ar", label: "العربية (Arabic)" },
  { value: "fr", label: "Français (French)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ru", label: "Русский (Russian)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "it", label: "Italiano (Italian)" },
  { value: "tr", label: "Türkçe (Turkish)" },
  { value: "id", label: "Bahasa Indonesia" },
] as const satisfies readonly {
  value: (typeof I18N.locales)[number];
  label: string;
}[];

// ---------------------------------------------------------------------------
// Industries — values stored in DB, labels translated via i18n
// ---------------------------------------------------------------------------

export const INDUSTRY_CODES = [
  "aerospace",
  "automotive",
  "chemicals",
  "construction",
  "consumer_goods",
  "electronics",
  "energy",
  "food_beverage",
  "furniture",
  "healthcare",
  "industrial_equipment",
  "metals",
  "packaging",
  "paper",
  "pharma",
  "plastics",
  "printing",
  "textiles",
  "other",
] as const;

// ---------------------------------------------------------------------------
// Countries (ISO 3166-1 alpha-2) — uses Intl.DisplayNames for labels
// ---------------------------------------------------------------------------

/** Get all country options with localized display names. */
export function getCountryOptions(
  locale: string,
): { value: string; label: string }[] {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });

  // All ISO 3166-1 alpha-2 codes
  const codes = [
    "AF",
    "AL",
    "DZ",
    "AD",
    "AO",
    "AG",
    "AR",
    "AM",
    "AU",
    "AT",
    "AZ",
    "BS",
    "BH",
    "BD",
    "BB",
    "BY",
    "BE",
    "BZ",
    "BJ",
    "BT",
    "BO",
    "BA",
    "BW",
    "BR",
    "BN",
    "BG",
    "BF",
    "BI",
    "KH",
    "CM",
    "CA",
    "CV",
    "CF",
    "TD",
    "CL",
    "CN",
    "CO",
    "KM",
    "CG",
    "CD",
    "CR",
    "CI",
    "HR",
    "CU",
    "CY",
    "CZ",
    "DK",
    "DJ",
    "DM",
    "DO",
    "EC",
    "EG",
    "SV",
    "GQ",
    "ER",
    "EE",
    "SZ",
    "ET",
    "FJ",
    "FI",
    "FR",
    "GA",
    "GM",
    "GE",
    "DE",
    "GH",
    "GR",
    "GD",
    "GT",
    "GN",
    "GW",
    "GY",
    "HT",
    "HN",
    "HU",
    "IS",
    "IN",
    "ID",
    "IR",
    "IQ",
    "IE",
    "IL",
    "IT",
    "JM",
    "JP",
    "JO",
    "KZ",
    "KE",
    "KI",
    "KP",
    "KR",
    "KW",
    "KG",
    "LA",
    "LV",
    "LB",
    "LS",
    "LR",
    "LY",
    "LI",
    "LT",
    "LU",
    "MG",
    "MW",
    "MY",
    "MV",
    "ML",
    "MT",
    "MH",
    "MR",
    "MU",
    "MX",
    "FM",
    "MD",
    "MC",
    "MN",
    "ME",
    "MA",
    "MZ",
    "MM",
    "NA",
    "NR",
    "NP",
    "NL",
    "NZ",
    "NI",
    "NE",
    "NG",
    "MK",
    "NO",
    "OM",
    "PK",
    "PW",
    "PA",
    "PG",
    "PY",
    "PE",
    "PH",
    "PL",
    "PT",
    "QA",
    "RO",
    "RU",
    "RW",
    "KN",
    "LC",
    "VC",
    "WS",
    "SM",
    "ST",
    "SA",
    "SN",
    "RS",
    "SC",
    "SL",
    "SG",
    "SK",
    "SI",
    "SB",
    "SO",
    "ZA",
    "SS",
    "ES",
    "LK",
    "SD",
    "SR",
    "SE",
    "CH",
    "SY",
    "TW",
    "TJ",
    "TZ",
    "TH",
    "TL",
    "TG",
    "TO",
    "TT",
    "TN",
    "TR",
    "TM",
    "TV",
    "UG",
    "UA",
    "AE",
    "GB",
    "US",
    "UY",
    "UZ",
    "VU",
    "VE",
    "VN",
    "YE",
    "ZM",
    "ZW",
  ];

  return codes
    .map((code) => ({
      value: code,
      label: displayNames.of(code) ?? code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

// ---------------------------------------------------------------------------
// Timezones — uses Intl.supportedValuesOf + Intl.DateTimeFormat for labels
// ---------------------------------------------------------------------------

/** Get all timezone options with localized display names. */
export function getTimezoneOptions(
  locale: string,
): { value: string; label: string }[] {
  let timezones: string[];
  try {
    timezones = Intl.supportedValuesOf("timeZone");
  } catch {
    // Fallback for older browsers
    timezones = ["UTC"];
  }

  return timezones.map((tz) => {
    let label: string;
    try {
      const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: tz,
        timeZoneName: "longOffset",
      });
      const parts = formatter.formatToParts(new Date());
      const offsetPart = parts.find((p) => p.type === "timeZoneName");
      const offset = offsetPart?.value ?? "";
      // Format: "America/New_York (GMT-05:00)"
      const displayName = tz.replace(/_/g, " ").replace(/\//g, " / ");
      label = `${displayName} (${offset})`;
    } catch {
      label = tz;
    }
    return { value: tz, label };
  });
}

// ---------------------------------------------------------------------------
// Currencies — uses Intl.supportedValuesOf + Intl.DisplayNames for labels
// ---------------------------------------------------------------------------

/** Get all currency options with localized display names. */
export function getCurrencyOptions(
  locale: string,
): { value: string; label: string }[] {
  let currencies: string[];
  try {
    currencies = Intl.supportedValuesOf("currency");
  } catch {
    // Fallback
    currencies = ["USD", "EUR", "GBP"];
  }

  const displayNames = new Intl.DisplayNames([locale], { type: "currency" });

  return currencies
    .map((code) => ({
      value: code,
      label: `${code} — ${displayNames.of(code) ?? code}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
