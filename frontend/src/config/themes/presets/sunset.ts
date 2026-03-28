/**
 * Sunset Warm theme preset — vibrant orange/coral primary with warm backgrounds.
 *
 * A light theme inspired by golden-hour sunsets. Uses warm peach cream
 * backgrounds, bold button font weights, large 16px radius, and subtle
 * warm-toned shadows for an inviting, energetic atmosphere.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const sunsetTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.70 0.18 45)",
  primaryLight: "oklch(0.80 0.14 45)",
  primaryDark: "oklch(0.58 0.20 45)",
  secondary: "oklch(0.62 0.14 15)",
  secondaryLight: "oklch(0.74 0.11 15)",
  secondaryDark: "oklch(0.50 0.16 15)",

  // ── Status ──────────────────────────────────────────────────────────────
  success: "oklch(0.58 0.16 148)",
  successLight: "oklch(0.72 0.12 148)",
  successDark: "oklch(0.44 0.18 148)",
  warning: "oklch(0.76 0.18 65)",
  warningLight: "oklch(0.88 0.13 65)",
  warningDark: "oklch(0.62 0.20 65)",
  error: "oklch(0.58 0.22 20)",
  errorLight: "oklch(0.72 0.16 20)",
  errorDark: "oklch(0.44 0.24 20)",
  info: "oklch(0.60 0.12 222)",
  infoLight: "oklch(0.74 0.08 222)",
  infoDark: "oklch(0.46 0.14 222)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.16 0.02 40)",
  textSecondary: "oklch(0.38 0.02 40)",
  textMuted: "oklch(0.56 0.02 45)",
  textOnPrimary: "oklch(0.12 0.01 40)",
  textOnPrimaryMuted: "oklch(0.12 0.01 40 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(0.98 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.97 0.02 60)",
  surface: "oklch(0.99 0.01 55)",

  // ── Neutral scale (light → dark) ───────────────────────────────────────
  neutral50: "oklch(0.97 0.01 55)",
  neutral100: "oklch(0.94 0.01 50)",
  neutral200: "oklch(0.89 0.01 48)",
  neutral300: "oklch(0.81 0.01 45)",
  neutral400: "oklch(0.69 0.01 42)",
  neutral500: "oklch(0.56 0.01 40)",
  neutral600: "oklch(0.44 0.01 38)",
  neutral700: "oklch(0.34 0.01 36)",
  neutral800: "oklch(0.24 0.01 35)",
  neutral900: "oklch(0.16 0.01 35)",
  neutral950: "oklch(0.12 0.01 35)",

  // ── Component tokens (defaults + sunset overrides) ─────────────────────
  ...componentDefaults,

  // Large radius, bold buttons, warm shadows
  btnRadius: "16px",
  btnFontWeight: "700",
  btnShadow: "0 3px 12px oklch(0.50 0.10 45 / 0.2)",
  btnTransitionDuration: "250ms",

  inputRadius: "16px",
  inputShadow: "0 2px 6px oklch(0.50 0.08 50 / 0.1)",

  cardRadius: "16px",
  cardShadow: "0 4px 20px oklch(0.50 0.08 50 / 0.12)",

  badgeRadius: "16px",

  accordionRadius: "16px",
  accordionShadow: "0 2px 10px oklch(0.50 0.08 50 / 0.1)",

  alertRadius: "16px",
  alertShadow: "0 2px 10px oklch(0.50 0.08 50 / 0.1)",

  alertDialogRadius: "16px",
  alertDialogShadow: "0 8px 32px oklch(0.40 0.10 45 / 0.2)",
  alertDialogBackdropBlur: "6px",
  alertDialogBackdropColor: "oklch(0.30 0.06 45 / 0.4)",

  autocompletePopoverRadius: "16px",
  autocompletePopoverShadow: "0 4px 16px oklch(0.50 0.08 50 / 0.15)",
  autocompleteItemRadius: "10px",

  calendarRadius: "16px",
  calendarShadow: "0 4px 16px oklch(0.50 0.08 50 / 0.12)",

  colorPickerPopoverRadius: "16px",
  colorPickerPopoverShadow: "0 4px 16px oklch(0.50 0.08 50 / 0.15)",
  colorPickerAreaRadius: "12px",
  colorPickerSwatchRadius: "10px",

  comboBoxPopoverRadius: "16px",
  comboBoxPopoverShadow: "0 4px 16px oklch(0.50 0.08 50 / 0.15)",
  comboBoxTriggerRadius: "16px",
  comboBoxItemRadius: "10px",

  datePickerTriggerRadius: "16px",
  datePickerPopoverRadius: "16px",
  datePickerPopoverShadow: "0 4px 16px oklch(0.50 0.08 50 / 0.15)",

  skeletonRadius: "16px",
  selectRadius: "16px",
  modalRadius: "16px",

  tabsListRadius: "18px",
  tabsTabRadius: "14px",

  checkboxRadius: "6px",
};
