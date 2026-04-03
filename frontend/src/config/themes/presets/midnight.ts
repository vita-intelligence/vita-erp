/**
 * Midnight Purple theme preset — deep purple/violet primary with dark surfaces.
 *
 * A dark theme inspired by the late-night sky. Uses vibrant purple accents,
 * pill-shaped buttons (9999px radius), 20px card radius, and glowing
 * purple-tinted shadows for a futuristic, premium aesthetic.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const midnightTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.55 0.22 290)",
  primaryLight: "oklch(0.68 0.18 290)",
  primaryDark: "oklch(0.42 0.24 290)",
  secondary: "oklch(0.60 0.15 320)",
  secondaryLight: "oklch(0.72 0.12 320)",
  secondaryDark: "oklch(0.46 0.18 320)",

  // ── Status ──────────────────────────────────────────────────────────────
  success: "oklch(0.68 0.18 155)",
  successLight: "oklch(0.80 0.13 155)",
  successDark: "oklch(0.54 0.20 155)",
  warning: "oklch(0.82 0.16 75)",
  warningLight: "oklch(0.90 0.11 75)",
  warningDark: "oklch(0.68 0.20 75)",
  error: "oklch(0.68 0.20 15)",
  errorLight: "oklch(0.80 0.14 15)",
  errorDark: "oklch(0.54 0.24 15)",
  info: "oklch(0.68 0.14 260)",
  infoLight: "oklch(0.80 0.10 260)",
  infoDark: "oklch(0.54 0.18 260)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.94 0.02 290)",
  textSecondary: "oklch(0.72 0.04 290)",
  textMuted: "oklch(0.52 0.04 290)",
  textOnPrimary: "oklch(0.98 0 0)",
  textOnPrimaryMuted: "oklch(0.98 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(0.98 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.10 0.03 290)",
  surface: "oklch(0.16 0.02 290)",

  // ── Neutral scale (INVERTED for dark theme: dark → light) ──────────────
  neutral50: "oklch(0.08 0.03 290)",
  neutral100: "oklch(0.13 0.025 290)",
  neutral200: "oklch(0.20 0.02 290)",
  neutral300: "oklch(0.30 0.02 290)",
  neutral400: "oklch(0.42 0.02 288)",
  neutral500: "oklch(0.54 0.02 286)",
  neutral600: "oklch(0.66 0.02 284)",
  neutral700: "oklch(0.76 0.015 282)",
  neutral800: "oklch(0.86 0.01 280)",
  neutral900: "oklch(0.92 0.005 280)",
  neutral950: "oklch(0.96 0.003 280)",

  // ── Component tokens (defaults + midnight overrides) ───────────────────
  ...componentDefaults,

  // ── Border colors (mode-dependent) ────────────────────────────────────────
  btnBorderColor: "oklch(0.20 0.02 290)",
  inputBorderColor: "oklch(0.20 0.02 290)",
  cardBorderColor: "oklch(0.20 0.02 290)",
  accordionBorderColor: "oklch(0.20 0.02 290)",
  autocompleteBorderColor: "oklch(0.20 0.02 290)",
  avatarBorderColor: "oklch(0.20 0.02 290)",
  breadcrumbsItemBorderColor: "oklch(0.20 0.02 290)",
  buttonGroupBorderColor: "oklch(0.20 0.02 290)",
  calendarBorderColor: "oklch(0.20 0.02 290)",
  checkboxBorderColor: "oklch(0.30 0.02 290)",
  checkboxGroupBorderColor: "oklch(0.20 0.02 290)",
  colorPickerBorderColor: "oklch(0.20 0.02 290)",
  comboBoxBorderColor: "oklch(0.20 0.02 290)",
  datePickerBorderColor: "oklch(0.20 0.02 290)",

  // Pill buttons, rounded cards, glow shadows
  btnRadius: "9999px",
  btnShadow:
    "0 0 12px oklch(0.55 0.22 290 / 0.3), 0 2px 6px oklch(0.10 0.03 290 / 0.4)",
  btnTransitionDuration: "250ms",
  btnFontWeight: "600",

  inputRadius: "14px",
  inputShadow: "0 0 8px oklch(0.55 0.15 290 / 0.15)",
  inputTransitionDuration: "250ms",

  cardRadius: "20px",
  cardShadow:
    "0 0 20px oklch(0.45 0.18 290 / 0.2), 0 4px 12px oklch(0.08 0.03 290 / 0.4)",
  cardTransitionDuration: "250ms",

  badgeRadius: "9999px",

  accordionRadius: "20px",
  accordionShadow: "0 0 12px oklch(0.45 0.15 290 / 0.15)",

  alertRadius: "20px",
  alertShadow: "0 0 12px oklch(0.45 0.15 290 / 0.15)",

  alertDialogRadius: "20px",
  alertDialogShadow:
    "0 0 40px oklch(0.50 0.20 290 / 0.3), 0 8px 24px oklch(0.06 0.03 290 / 0.5)",
  alertDialogBackdropBlur: "12px",
  alertDialogBackdropColor: "oklch(0.06 0.04 290 / 0.7)",

  autocompletePopoverRadius: "16px",
  autocompletePopoverShadow:
    "0 0 16px oklch(0.45 0.15 290 / 0.2), 0 4px 12px oklch(0.08 0.03 290 / 0.3)",
  autocompleteItemRadius: "10px",

  calendarRadius: "20px",
  calendarShadow: "0 0 16px oklch(0.45 0.15 290 / 0.2)",

  colorPickerPopoverRadius: "16px",
  colorPickerPopoverShadow: "0 0 16px oklch(0.45 0.15 290 / 0.2)",
  colorPickerAreaRadius: "12px",
  colorPickerSwatchRadius: "9999px",

  comboBoxPopoverRadius: "16px",
  comboBoxPopoverShadow: "0 0 16px oklch(0.45 0.15 290 / 0.2)",
  comboBoxTriggerRadius: "14px",
  comboBoxItemRadius: "10px",

  datePickerTriggerRadius: "14px",
  datePickerPopoverRadius: "20px",
  datePickerPopoverShadow: "0 0 16px oklch(0.45 0.15 290 / 0.2)",
  datePickerTransitionDuration: "250ms",

  skeletonRadius: "14px",
  skeletonBaseColor: "var(--vita-neutral-200)",

  selectRadius: "14px",
  modalRadius: "20px",

  tabsListRadius: "9999px",
  tabsTabRadius: "9999px",
  tabsTransitionDuration: "250ms",

  switchTrackRadius: "9999px",
  switchThumbRadius: "9999px",

  checkboxRadius: "8px",
  checkboxTransitionDuration: "250ms",
};
