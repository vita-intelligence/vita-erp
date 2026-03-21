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
  // Typography
  fontBody: string; // body text, UI labels, navigation
  fontHeading: string; // headings h1-h6, page titles
  fontMono: string; // numbers in tables, codes, IDs
  fontSizeBase: string; // root font size — scales the entire rem system
  lineHeight: string; // body line height — affects readability in dense tables/forms
  fontWeightBody: string; // body font weight — 300/400/500/600
  spacing: string; // base spacing unit — scales all padding/gap/margin (Tailwind --spacing)
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
  // Text colors — independent control per mode
  textPrimary: string; // headings, active labels, important content
  textSecondary: string; // body text, descriptions, navigation
  textMuted: string; // hints, timestamps, placeholders
  textOnPrimary: string; // text/icons on a primary-colored background
  textOnPrimaryMuted: string; // secondary text/icons on a primary-colored background
  textOnWarning: string; // text/icons on a warning-colored background
  textOnDanger: string; // text/icons on a danger/error-colored background
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
  // ── Component tokens ────────────────────────────────────────────────────────
  // Button
  btnRadius: string; // border-radius applied to all button variants
  btnBorderTop: string; // border-top-width
  btnBorderRight: string; // border-right-width
  btnBorderBottom: string; // border-bottom-width
  btnBorderLeft: string; // border-left-width
  btnBorderStyle: string; // border-style: solid | dashed | dotted
  btnFontWeight: string; // font-weight of button label
  btnLetterSpacing: string; // letter-spacing of button label
  btnTextTransform: string; // text-transform: none | uppercase | capitalize
  btnShadow: string; // box-shadow — full CSS value, composed by shadow builder
  btnHoverTransform: string; // CSS transform applied on hover — "none" | "translateY(-2px)" | "scale(1.03)" | combined
  btnHoverFilter: string; // CSS filter applied on hover — "none" | "drop-shadow(...)" | "brightness(1.1)"
  btnPressScale: string; // scale factor on press/click — "0.97" (default), "0.95" (strong), "1" (none)
  btnTransitionDuration: string; // transition-duration for hover/active states
  // Input / Textarea / Search
  inputRadius: string; // border-radius of the input wrapper
  inputBorderTop: string; // border-top-width
  inputBorderRight: string; // border-right-width
  inputBorderBottom: string; // border-bottom-width
  inputBorderLeft: string; // border-left-width
  inputBorderStyle: string; // border-style: solid | dashed | dotted
  inputLabelWeight: string; // font-weight of the label
  inputLabelSize: string; // font-size of the label
  inputShadow: string; // box-shadow of the input wrapper
  inputPaddingX: string; // horizontal internal padding
  inputPaddingY: string; // vertical internal padding
  inputFontSize: string; // font-size of the input text
  inputPlaceholderOpacity: string; // opacity of placeholder text (0–1)
  inputFocusRingWidth: string; // outline-width on focus
  inputFocusRingOffset: string; // outline-offset on focus
  inputTransitionDuration: string; // transition-duration for focus/hover
  inputTextAlign: string; // text-align: left | center | right
  // Card
  cardRadius: string; // border-radius of card panels
  cardBorderWidth: string; // border-width of card panels
  cardShadow: string; // box-shadow of card panels
  // Badge / Chip / Tag
  badgeRadius: string; // border-radius (0 = square tag, 9999px = pill)
  badgeFontWeight: string; // font-weight of badge/chip text
  // Select / Dropdown
  selectRadius: string; // border-radius of select trigger
  selectBorderWidth: string; // border-width of select trigger
  // Modal / Drawer / Popover
  modalRadius: string; // border-radius of overlay panels
};

/**
 * Maps each ThemeTokens key to the CSS custom property on :root.
 * Single source of truth for JS ↔ CSS coupling.
 */
export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  fontBody: "--vita-font-body",
  fontHeading: "--vita-font-heading",
  fontMono: "--vita-font-mono",
  fontSizeBase: "--vita-font-size-base",
  lineHeight: "--vita-line-height",
  fontWeightBody: "--vita-font-weight-body",
  spacing: "--vita-spacing",
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
  textPrimary: "--vita-text-primary",
  textSecondary: "--vita-text-secondary",
  textMuted: "--vita-text-muted",
  textOnPrimary: "--vita-text-on-primary",
  textOnPrimaryMuted: "--vita-text-on-primary-muted",
  textOnWarning: "--vita-text-on-warning",
  textOnDanger: "--vita-text-on-danger",
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
  // Component tokens
  btnRadius: "--vita-btn-radius",
  btnBorderTop: "--vita-btn-border-top",
  btnBorderRight: "--vita-btn-border-right",
  btnBorderBottom: "--vita-btn-border-bottom",
  btnBorderLeft: "--vita-btn-border-left",
  btnBorderStyle: "--vita-btn-border-style",
  btnFontWeight: "--vita-btn-font-weight",
  btnLetterSpacing: "--vita-btn-letter-spacing",
  btnTextTransform: "--vita-btn-text-transform",
  btnShadow: "--vita-btn-shadow",
  btnHoverTransform: "--vita-btn-hover-transform",
  btnHoverFilter: "--vita-btn-hover-filter",
  btnPressScale: "--vita-btn-press-scale",
  btnTransitionDuration: "--vita-btn-transition-duration",
  inputRadius: "--vita-input-radius",
  inputBorderTop: "--vita-input-border-top",
  inputBorderRight: "--vita-input-border-right",
  inputBorderBottom: "--vita-input-border-bottom",
  inputBorderLeft: "--vita-input-border-left",
  inputBorderStyle: "--vita-input-border-style",
  inputLabelWeight: "--vita-input-label-weight",
  inputLabelSize: "--vita-input-label-size",
  inputShadow: "--vita-input-shadow",
  inputPaddingX: "--vita-input-padding-x",
  inputPaddingY: "--vita-input-padding-y",
  inputFontSize: "--vita-input-font-size",
  inputPlaceholderOpacity: "--vita-input-placeholder-opacity",
  inputFocusRingWidth: "--vita-input-focus-ring-width",
  inputFocusRingOffset: "--vita-input-focus-ring-offset",
  inputTransitionDuration: "--vita-input-transition-duration",
  inputTextAlign: "--vita-input-text-align",
  cardRadius: "--vita-card-radius",
  cardBorderWidth: "--vita-card-border-width",
  cardShadow: "--vita-card-shadow",
  badgeRadius: "--vita-badge-radius",
  badgeFontWeight: "--vita-badge-font-weight",
  selectRadius: "--vita-select-radius",
  selectBorderWidth: "--vita-select-border-width",
  modalRadius: "--vita-modal-radius",
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
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // Brutalist black — primary actions use pure black
  primary: "oklch(0.09 0 0)",
  primaryLight: "oklch(0.32 0 0)",
  primaryDark: "oklch(0 0 0)",

  secondary: "oklch(0.44 0 0)",
  secondaryLight: "oklch(0.62 0 0)",
  secondaryDark: "oklch(0.28 0 0)",

  // Status colors keep semantic meaning
  success: "oklch(0.56 0.18 148)",
  successLight: "oklch(0.72 0.13 148)",
  successDark: "oklch(0.42 0.19 148)",

  warning: "oklch(0.74 0.18 68)",
  warningLight: "oklch(0.86 0.13 68)",
  warningDark: "oklch(0.60 0.20 68)",

  error: "oklch(0.60 0.22 27)",
  errorLight: "oklch(0.74 0.16 27)",
  errorDark: "oklch(0.46 0.24 27)",

  info: "oklch(0.62 0.14 222)",
  infoLight: "oklch(0.76 0.10 222)",
  infoDark: "oklch(0.48 0.16 222)",

  textPrimary: "oklch(0.09 0 0)",
  textSecondary: "oklch(0.38 0 0)",
  textMuted: "oklch(0.56 0 0)",
  textOnPrimary: "oklch(1 0 0)",
  textOnPrimaryMuted: "oklch(1 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(1 0 0)",

  background: "oklch(1 0 0)",
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

  // Brutalist component defaults — sharp, flat, no decorative radius or shadow
  btnRadius: "0px",
  btnBorderTop: "1px",
  btnBorderRight: "1px",
  btnBorderBottom: "1px",
  btnBorderLeft: "1px",
  btnBorderStyle: "solid",
  btnFontWeight: "500",
  btnLetterSpacing: "0.02em",
  btnTextTransform: "none",
  btnShadow: "none",
  btnHoverTransform: "none",
  btnHoverFilter: "none",
  btnPressScale: "0.97",
  btnTransitionDuration: "150ms",
  inputRadius: "0px",
  inputBorderTop: "1px",
  inputBorderRight: "1px",
  inputBorderBottom: "1px",
  inputBorderLeft: "1px",
  inputBorderStyle: "solid",
  inputLabelWeight: "500",
  inputLabelSize: "12px",
  inputShadow: "none",
  inputPaddingX: "12px",
  inputPaddingY: "8px",
  inputFontSize: "14px",
  inputPlaceholderOpacity: "0.45",
  inputFocusRingWidth: "2px",
  inputFocusRingOffset: "0px",
  inputTransitionDuration: "150ms",
  inputTextAlign: "left",
  cardRadius: "0px",
  cardBorderWidth: "1px",
  cardShadow: "none",
  badgeRadius: "0px",
  badgeFontWeight: "600",
  selectRadius: "0px",
  selectBorderWidth: "1px",
  modalRadius: "0px",
};

export const darkTheme: ThemeTokens = {
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // Brutalist white — primary actions use pure white on dark
  primary: "oklch(0.96 0 0)",
  primaryLight: "oklch(1 0 0)",
  primaryDark: "oklch(0.80 0 0)",

  secondary: "oklch(0.62 0 0)",
  secondaryLight: "oklch(0.76 0 0)",
  secondaryDark: "oklch(0.46 0 0)",

  success: "oklch(0.68 0.18 148)",
  successLight: "oklch(0.80 0.13 148)",
  successDark: "oklch(0.54 0.20 148)",

  warning: "oklch(0.82 0.16 68)",
  warningLight: "oklch(0.90 0.11 68)",
  warningDark: "oklch(0.68 0.20 68)",

  error: "oklch(0.70 0.20 27)",
  errorLight: "oklch(0.82 0.14 27)",
  errorDark: "oklch(0.56 0.24 27)",

  info: "oklch(0.70 0.12 222)",
  infoLight: "oklch(0.82 0.08 222)",
  infoDark: "oklch(0.56 0.16 222)",

  textPrimary: "oklch(0.96 0 0)",
  textSecondary: "oklch(0.72 0 0)",
  textMuted: "oklch(0.54 0 0)",
  textOnPrimary: "oklch(0.09 0 0)",
  textOnPrimaryMuted: "oklch(0.09 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(0.96 0 0)",

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

  // Brutalist component defaults — same structural values across modes
  btnRadius: "0px",
  btnBorderTop: "1px",
  btnBorderRight: "1px",
  btnBorderBottom: "1px",
  btnBorderLeft: "1px",
  btnBorderStyle: "solid",
  btnFontWeight: "500",
  btnLetterSpacing: "0.02em",
  btnTextTransform: "none",
  btnShadow: "none",
  btnHoverTransform: "none",
  btnHoverFilter: "none",
  btnPressScale: "0.97",
  btnTransitionDuration: "150ms",
  inputRadius: "0px",
  inputBorderTop: "1px",
  inputBorderRight: "1px",
  inputBorderBottom: "1px",
  inputBorderLeft: "1px",
  inputBorderStyle: "solid",
  inputLabelWeight: "500",
  inputLabelSize: "12px",
  inputShadow: "none",
  inputPaddingX: "12px",
  inputPaddingY: "8px",
  inputFontSize: "14px",
  inputPlaceholderOpacity: "0.45",
  inputFocusRingWidth: "2px",
  inputFocusRingOffset: "0px",
  inputTransitionDuration: "150ms",
  inputTextAlign: "left",
  cardRadius: "0px",
  cardBorderWidth: "1px",
  cardShadow: "none",
  badgeRadius: "0px",
  badgeFontWeight: "600",
  selectRadius: "0px",
  selectBorderWidth: "1px",
  modalRadius: "0px",
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
