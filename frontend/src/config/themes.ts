/**
 * Theme presets — Vita ERP
 *
 * Each theme is a flat map of token name → CSS value (oklch string).
 * The theme store (src/stores/theme.ts) writes these as CSS custom properties
 * onto document.documentElement at runtime.
 *
 * Token names map 1-to-1 with CSS variable names:
 *   primary   → --vita-primary
 *   neutral50 → --vita-neutral-50
 *
 * To add a new preset: add an entry to `themes` satisfying ThemeTokens.
 * To add a new token: extend ThemeTokens, add to CSS_VAR_MAP, update tokens.css :root.
 *
 * Note on HeroUI mapping (globals.css):
 *   --accent  = var(--vita-primary)    primary   → HeroUI accent (buttons, focus rings)
 *   --danger  = var(--vita-error)      error     → HeroUI danger (destructive states)
 *   --success = var(--vita-success)    success   → HeroUI success
 *   --warning = var(--vita-warning)    warning   → HeroUI warning
 */

export type ThemeTokens = {
  // Brand — user-facing colors shown in the theme constructor
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  // Status — semantic meaning, still user-customisable
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
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
 * Single source of truth for JS token names ↔ CSS variable names.
 */
export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  primary: "--vita-primary",
  primaryLight: "--vita-primary-light",
  primaryDark: "--vita-primary-dark",
  secondary: "--vita-secondary",
  secondaryLight: "--vita-secondary-light",
  secondaryDark: "--vita-secondary-dark",
  success: "--vita-success",
  successLight: "--vita-success-light",
  successDark: "--vita-success-dark",
  warning: "--vita-warning",
  warningLight: "--vita-warning-light",
  warningDark: "--vita-warning-dark",
  error: "--vita-error",
  errorLight: "--vita-error-light",
  errorDark: "--vita-error-dark",
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

/**
 * Human-readable metadata for the theme constructor UI.
 * Shown to non-technical users (e.g. manufacturing company admins).
 */
export const BRAND_COLOR_META: {
  key: keyof Pick<
    ThemeTokens,
    "primary" | "secondary" | "success" | "warning" | "error" | "info"
  >;
  label: string;
  description: string;
}[] = [
  {
    key: "primary",
    label: "Primary",
    description: "Main brand color — buttons, active states, links",
  },
  {
    key: "secondary",
    label: "Secondary",
    description: "Complementary brand color — highlights, badges, accents",
  },
  {
    key: "success",
    label: "Success",
    description: "Positive outcomes — completed orders, approvals",
  },
  {
    key: "warning",
    label: "Warning",
    description: "Needs attention — low stock, pending reviews",
  },
  {
    key: "error",
    label: "Error",
    description: "Critical issues — failed operations, urgent alerts",
  },
  {
    key: "info",
    label: "Information",
    description: "General info — tips, neutral status updates",
  },
];

// ---------------------------------------------------------------------------
// Built-in presets
// ---------------------------------------------------------------------------

export const lightTheme: ThemeTokens = {
  primary: "oklch(0.58 0.22 265)",
  primaryLight: "oklch(0.72 0.18 265)",
  primaryDark: "oklch(0.44 0.24 265)",

  secondary: "oklch(0.58 0.18 300)",
  secondaryLight: "oklch(0.72 0.14 300)",
  secondaryDark: "oklch(0.44 0.20 300)",

  success: "oklch(0.64 0.16 155)",
  successLight: "oklch(0.78 0.12 155)",
  successDark: "oklch(0.50 0.18 155)",

  warning: "oklch(0.74 0.18 65)",
  warningLight: "oklch(0.86 0.13 65)",
  warningDark: "oklch(0.60 0.20 65)",

  error: "oklch(0.62 0.22 28)",
  errorLight: "oklch(0.76 0.16 28)",
  errorDark: "oklch(0.48 0.24 28)",

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
  primary: "oklch(0.72 0.18 265)",
  primaryLight: "oklch(0.84 0.14 265)",
  primaryDark: "oklch(0.58 0.22 265)",

  secondary: "oklch(0.72 0.14 300)",
  secondaryLight: "oklch(0.84 0.10 300)",
  secondaryDark: "oklch(0.58 0.18 300)",

  success: "oklch(0.72 0.14 155)",
  successLight: "oklch(0.84 0.10 155)",
  successDark: "oklch(0.58 0.18 155)",

  warning: "oklch(0.82 0.16 65)",
  warningLight: "oklch(0.90 0.11 65)",
  warningDark: "oklch(0.68 0.20 65)",

  error: "oklch(0.72 0.20 28)",
  errorLight: "oklch(0.84 0.14 28)",
  errorDark: "oklch(0.58 0.24 28)",

  info: "oklch(0.72 0.12 220)",
  infoLight: "oklch(0.84 0.08 220)",
  infoDark: "oklch(0.58 0.16 220)",

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
