/**
 * Theme presets — Vita ERP
 *
 * Each theme is a flat map of token name → CSS value (oklch string).
 * The theme store (src/stores/theme.ts) writes these as CSS custom properties
 * onto document.documentElement at runtime.
 *
 * Token names map 1-to-1 with CSS variable names:
 *   accent → --vita-accent
 *   neutral50 → --vita-neutral-50
 *
 * To add a new preset: add an entry to `themes` satisfying ThemeTokens.
 * To add a new token: extend ThemeTokens, add to CSS_VAR_MAP, update tokens.css :root.
 */

export type ThemeTokens = {
  // Brand
  accent: string;
  accentLight: string;
  accentDark: string;
  // Semantic
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  danger: string;
  dangerLight: string;
  dangerDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  // Neutral scale
  neutral50: string;
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral400: string;
  neutral500: string;
  neutral600: string;
  neutral700: string;
  neutral800: string;
  neutral900: string;
  neutral950: string;
};

/**
 * Maps each ThemeTokens key to the CSS custom property name on :root.
 * This is the single place where JS token names ↔ CSS variable names are coupled.
 */
export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  accent: "--vita-accent",
  accentLight: "--vita-accent-light",
  accentDark: "--vita-accent-dark",
  success: "--vita-success",
  successLight: "--vita-success-light",
  successDark: "--vita-success-dark",
  warning: "--vita-warning",
  warningLight: "--vita-warning-light",
  warningDark: "--vita-warning-dark",
  danger: "--vita-danger",
  dangerLight: "--vita-danger-light",
  dangerDark: "--vita-danger-dark",
  info: "--vita-info",
  infoLight: "--vita-info-light",
  infoDark: "--vita-info-dark",
  neutral50: "--vita-neutral-50",
  neutral100: "--vita-neutral-100",
  neutral200: "--vita-neutral-200",
  neutral300: "--vita-neutral-300",
  neutral400: "--vita-neutral-400",
  neutral500: "--vita-neutral-500",
  neutral600: "--vita-neutral-600",
  neutral700: "--vita-neutral-700",
  neutral800: "--vita-neutral-800",
  neutral900: "--vita-neutral-900",
  neutral950: "--vita-neutral-950",
};

/** Apply a full or partial set of tokens to the document root. */
export function applyTokens(tokens: Partial<ThemeTokens>): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(tokens) as [
    keyof ThemeTokens,
    string,
  ][]) {
    root.style.setProperty(CSS_VAR_MAP[key], value);
  }
}

// ---------------------------------------------------------------------------
// Built-in presets
// ---------------------------------------------------------------------------

export const lightTheme: ThemeTokens = {
  accent: "oklch(0.58 0.22 265)",
  accentLight: "oklch(0.72 0.18 265)",
  accentDark: "oklch(0.44 0.24 265)",

  success: "oklch(0.64 0.16 155)",
  successLight: "oklch(0.78 0.12 155)",
  successDark: "oklch(0.50 0.18 155)",

  warning: "oklch(0.74 0.18 65)",
  warningLight: "oklch(0.86 0.13 65)",
  warningDark: "oklch(0.60 0.20 65)",

  danger: "oklch(0.62 0.22 28)",
  dangerLight: "oklch(0.76 0.16 28)",
  dangerDark: "oklch(0.48 0.24 28)",

  info: "oklch(0.64 0.14 220)",
  infoLight: "oklch(0.78 0.10 220)",
  infoDark: "oklch(0.50 0.16 220)",

  neutral50: "oklch(0.98 0 0)",
  neutral100: "oklch(0.95 0 0)",
  neutral200: "oklch(0.90 0 0)",
  neutral300: "oklch(0.82 0 0)",
  neutral400: "oklch(0.70 0 0)",
  neutral500: "oklch(0.56 0 0)",
  neutral600: "oklch(0.44 0 0)",
  neutral700: "oklch(0.32 0 0)",
  neutral800: "oklch(0.22 0 0)",
  neutral900: "oklch(0.14 0 0)",
  neutral950: "oklch(0.09 0 0)",
};

export const darkTheme: ThemeTokens = {
  // Slightly brighter accent for dark backgrounds
  accent: "oklch(0.72 0.18 265)",
  accentLight: "oklch(0.84 0.14 265)",
  accentDark: "oklch(0.58 0.22 265)",

  success: "oklch(0.72 0.14 155)",
  successLight: "oklch(0.84 0.10 155)",
  successDark: "oklch(0.58 0.18 155)",

  warning: "oklch(0.82 0.16 65)",
  warningLight: "oklch(0.90 0.11 65)",
  warningDark: "oklch(0.68 0.20 65)",

  danger: "oklch(0.72 0.20 28)",
  dangerLight: "oklch(0.84 0.14 28)",
  dangerDark: "oklch(0.58 0.24 28)",

  info: "oklch(0.72 0.12 220)",
  infoLight: "oklch(0.84 0.08 220)",
  infoDark: "oklch(0.58 0.16 220)",

  // Neutral scale is inverted for dark mode
  neutral50: "oklch(0.09 0 0)",
  neutral100: "oklch(0.14 0 0)",
  neutral200: "oklch(0.22 0 0)",
  neutral300: "oklch(0.32 0 0)",
  neutral400: "oklch(0.44 0 0)",
  neutral500: "oklch(0.56 0 0)",
  neutral600: "oklch(0.70 0 0)",
  neutral700: "oklch(0.82 0 0)",
  neutral800: "oklch(0.90 0 0)",
  neutral900: "oklch(0.95 0 0)",
  neutral950: "oklch(0.98 0 0)",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
