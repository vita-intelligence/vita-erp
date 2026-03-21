/**
 * Theme presets — Vita ERP
 *
 * Each theme is a flat map of token name → CSS value.
 * The theme store (src/stores/theme.ts) writes these as CSS custom properties
 * onto document.documentElement at runtime.
 *
 * Token names map 1-to-1 with CSS variable names via CSS_VAR_MAP.
 *
 * HeroUI mapping (globals.css):
 *   primary   → --accent  (buttons, focus rings)
 *   error     → --danger  (destructive states)
 *   background → --background
 *   surface   → --surface
 */

export type ThemeTokens = {
  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  // Status
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
  // Surfaces — independent from neutral scale so background tint is possible
  background: string;
  surface: string;
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
 * Maps each ThemeTokens key to the CSS custom property on :root.
 * Single source of truth for JS ↔ CSS coupling.
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
  background: "--vita-background",
  surface: "--vita-surface",
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
 * Auto-derive light and dark variants from a base color using CSS color-mix().
 * Supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+).
 *
 * Usage: when a user picks primary = "#3b82f6", call deriveVariants to get
 * primaryLight and primaryDark without requiring a color library.
 */
export function deriveVariants(base: string): { light: string; dark: string } {
  return {
    light: `color-mix(in oklch, ${base} 65%, white)`,
    dark: `color-mix(in oklch, ${base} 75%, black)`,
  };
}

/**
 * Human-readable metadata for the brand color constructor UI.
 * Shown to non-technical users (manufacturing company admins).
 *
 * baseKey: the token the user picks — variants are auto-derived from it.
 */
export const BRAND_COLOR_META: {
  key: keyof Pick<
    ThemeTokens,
    "primary" | "secondary" | "success" | "warning" | "error" | "info"
  >;
  lightKey: keyof ThemeTokens;
  darkKey: keyof ThemeTokens;
  label: string;
  description: string;
}[] = [
  {
    key: "primary",
    lightKey: "primaryLight",
    darkKey: "primaryDark",
    label: "Primary",
    description: "Main brand color — buttons, active states, links",
  },
  {
    key: "secondary",
    lightKey: "secondaryLight",
    darkKey: "secondaryDark",
    label: "Secondary",
    description: "Complementary brand color — highlights, badges, accents",
  },
  {
    key: "success",
    lightKey: "successLight",
    darkKey: "successDark",
    label: "Success",
    description: "Positive outcomes — completed orders, approvals",
  },
  {
    key: "warning",
    lightKey: "warningLight",
    darkKey: "warningDark",
    label: "Warning",
    description: "Needs attention — low stock, pending reviews",
  },
  {
    key: "error",
    lightKey: "errorLight",
    darkKey: "errorDark",
    label: "Error",
    description: "Critical issues — failed operations, urgent alerts",
  },
  {
    key: "info",
    lightKey: "infoLight",
    darkKey: "infoDark",
    label: "Information",
    description: "General info — tips, neutral status updates",
  },
];

/**
 * Metadata for surface tokens — background and card/panel color.
 */
export const SURFACE_COLOR_META: {
  key: keyof Pick<ThemeTokens, "background" | "surface">;
  label: string;
  description: string;
}[] = [
  {
    key: "background",
    label: "Background",
    description: "Page background — tint to match warm or cool brand feel",
  },
  {
    key: "surface",
    label: "Surface",
    description: "Cards and panels — slightly offset from background",
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

  background: "oklch(0.98 0 0)",
  surface: "oklch(1 0 0)",

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

  background: "oklch(0.09 0 0)",
  surface: "oklch(0.14 0 0)",

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
