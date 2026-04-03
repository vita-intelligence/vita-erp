/**
 * Ocean Blue theme preset — deep navy/blue primary with soft blue-gray surfaces.
 *
 * A dark theme inspired by deep ocean depths. Uses blue-tinted neutrals
 * throughout, rounded corners (12px), subtle shadows, and smooth 300ms
 * transitions for a calm, immersive feel.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const oceanTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.45 0.15 240)",
  primaryLight: "oklch(0.58 0.13 240)",
  primaryDark: "oklch(0.34 0.16 240)",
  secondary: "oklch(0.55 0.10 200)",
  secondaryLight: "oklch(0.68 0.08 200)",
  secondaryDark: "oklch(0.42 0.12 200)",

  // ── Status ──────────────────────────────────────────────────────────────
  success: "oklch(0.68 0.18 155)",
  successLight: "oklch(0.78 0.13 155)",
  successDark: "oklch(0.54 0.20 155)",
  warning: "oklch(0.80 0.16 75)",
  warningLight: "oklch(0.88 0.11 75)",
  warningDark: "oklch(0.66 0.20 75)",
  error: "oklch(0.68 0.20 25)",
  errorLight: "oklch(0.80 0.14 25)",
  errorDark: "oklch(0.54 0.24 25)",
  info: "oklch(0.68 0.12 230)",
  infoLight: "oklch(0.80 0.08 230)",
  infoDark: "oklch(0.54 0.16 230)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.95 0.01 240)",
  textSecondary: "oklch(0.74 0.03 240)",
  textMuted: "oklch(0.55 0.03 240)",
  textOnPrimary: "oklch(0.98 0 0)",
  textOnPrimaryMuted: "oklch(0.98 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(0.98 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.12 0.02 250)",
  surface: "oklch(0.18 0.03 250)",

  // ── Neutral scale (INVERTED for dark theme: dark → light) ──────────────
  neutral50: "oklch(0.10 0.02 250)",
  neutral100: "oklch(0.15 0.02 250)",
  neutral200: "oklch(0.22 0.02 245)",
  neutral300: "oklch(0.32 0.02 245)",
  neutral400: "oklch(0.44 0.02 240)",
  neutral500: "oklch(0.56 0.02 240)",
  neutral600: "oklch(0.68 0.02 240)",
  neutral700: "oklch(0.78 0.01 240)",
  neutral800: "oklch(0.87 0.01 240)",
  neutral900: "oklch(0.93 0.005 240)",
  neutral950: "oklch(0.97 0.003 240)",

  // ── Component tokens (defaults + ocean overrides) ──────────────────────
  ...componentDefaults,

  // ── Border colors (mode-dependent) ────────────────────────────────────────
  btnBorderColor: "oklch(0.22 0.02 245)",
  inputBorderColor: "oklch(0.22 0.02 245)",
  cardBorderColor: "oklch(0.22 0.02 245)",
  accordionBorderColor: "oklch(0.22 0.02 245)",
  autocompleteBorderColor: "oklch(0.22 0.02 245)",
  avatarBorderColor: "oklch(0.22 0.02 245)",
  breadcrumbsItemBorderColor: "oklch(0.22 0.02 245)",
  buttonGroupBorderColor: "oklch(0.22 0.02 245)",
  calendarBorderColor: "oklch(0.22 0.02 245)",
  checkboxBorderColor: "oklch(0.32 0.02 245)",
  checkboxGroupBorderColor: "oklch(0.22 0.02 245)",
  colorPickerBorderColor: "oklch(0.22 0.02 245)",
  comboBoxBorderColor: "oklch(0.22 0.02 245)",
  datePickerBorderColor: "oklch(0.22 0.02 245)",

  // Rounded corners, subtle shadows, smooth transitions
  btnRadius: "12px",
  btnShadow: "0 2px 8px oklch(0.10 0.04 240 / 0.3)",
  btnTransitionDuration: "300ms",

  inputRadius: "12px",
  inputShadow: "0 1px 4px oklch(0.10 0.04 240 / 0.2)",
  inputTransitionDuration: "300ms",

  cardRadius: "12px",
  cardShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.35)",
  cardTransitionDuration: "300ms",

  badgeRadius: "12px",

  accordionRadius: "12px",
  accordionShadow: "0 2px 8px oklch(0.10 0.04 240 / 0.2)",

  alertRadius: "12px",
  alertShadow: "0 2px 8px oklch(0.10 0.04 240 / 0.2)",

  alertDialogRadius: "12px",
  alertDialogShadow: "0 8px 32px oklch(0.06 0.04 240 / 0.5)",
  alertDialogBackdropBlur: "8px",
  alertDialogBackdropColor: "oklch(0.08 0.03 240 / 0.6)",

  autocompletePopoverRadius: "12px",
  autocompletePopoverShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.3)",
  autocompleteItemRadius: "8px",

  calendarRadius: "12px",
  calendarShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.3)",

  colorPickerPopoverRadius: "12px",
  colorPickerPopoverShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.3)",
  colorPickerAreaRadius: "10px",

  comboBoxPopoverRadius: "12px",
  comboBoxPopoverShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.3)",
  comboBoxTriggerRadius: "12px",
  comboBoxItemRadius: "8px",

  datePickerTriggerRadius: "12px",
  datePickerPopoverRadius: "12px",
  datePickerPopoverShadow: "0 4px 16px oklch(0.08 0.04 240 / 0.3)",
  datePickerTransitionDuration: "300ms",

  skeletonRadius: "12px",
  selectRadius: "12px",
  modalRadius: "12px",

  tabsListRadius: "14px",
  tabsTabRadius: "10px",
  tabsTransitionDuration: "300ms",

  checkboxRadius: "6px",
  checkboxTransitionDuration: "300ms",
};
