/**
 * Minimal Gray theme preset — pure grayscale, ultra-clean design.
 *
 * A light theme with zero chromatic color. Every hue channel is 0, creating
 * a purely achromatic palette. Uses 6px radius, very thin 1px borders,
 * no shadows at all, and Inter font throughout for maximum clarity.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const minimalTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "14px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.45 0 0)",
  primaryLight: "oklch(0.60 0 0)",
  primaryDark: "oklch(0.30 0 0)",
  secondary: "oklch(0.62 0 0)",
  secondaryLight: "oklch(0.74 0 0)",
  secondaryDark: "oklch(0.48 0 0)",

  // ── Status (gray-based, no hue) ────────────────────────────────────────
  success: "oklch(0.52 0 0)",
  successLight: "oklch(0.68 0 0)",
  successDark: "oklch(0.38 0 0)",
  warning: "oklch(0.68 0 0)",
  warningLight: "oklch(0.80 0 0)",
  warningDark: "oklch(0.54 0 0)",
  error: "oklch(0.40 0 0)",
  errorLight: "oklch(0.56 0 0)",
  errorDark: "oklch(0.28 0 0)",
  info: "oklch(0.58 0 0)",
  infoLight: "oklch(0.72 0 0)",
  infoDark: "oklch(0.44 0 0)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.12 0 0)",
  textSecondary: "oklch(0.40 0 0)",
  textMuted: "oklch(0.60 0 0)",
  textOnPrimary: "oklch(1 0 0)",
  textOnPrimaryMuted: "oklch(1 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(1 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(1 0 0)",
  surface: "oklch(1 0 0)",

  // ── Neutral scale (light → dark) ───────────────────────────────────────
  neutral50: "oklch(0.98 0 0)",
  neutral100: "oklch(0.96 0 0)",
  neutral200: "oklch(0.92 0 0)",
  neutral300: "oklch(0.85 0 0)",
  neutral400: "oklch(0.72 0 0)",
  neutral500: "oklch(0.58 0 0)",
  neutral600: "oklch(0.45 0 0)",
  neutral700: "oklch(0.34 0 0)",
  neutral800: "oklch(0.24 0 0)",
  neutral900: "oklch(0.16 0 0)",
  neutral950: "oklch(0.10 0 0)",

  // ── Component tokens (defaults + minimal overrides) ────────────────────
  ...componentDefaults,

  // ── Border colors (mode-dependent) ────────────────────────────────────────
  btnBorderColor: "oklch(0.92 0 0)",
  inputBorderColor: "oklch(0.92 0 0)",
  cardBorderColor: "oklch(0.92 0 0)",
  accordionBorderColor: "oklch(0.92 0 0)",
  autocompleteBorderColor: "oklch(0.92 0 0)",
  avatarBorderColor: "oklch(0.92 0 0)",
  breadcrumbsItemBorderColor: "oklch(0.92 0 0)",
  buttonGroupBorderColor: "oklch(0.92 0 0)",
  calendarBorderColor: "oklch(0.92 0 0)",
  checkboxBorderColor: "oklch(0.85 0 0)",
  checkboxGroupBorderColor: "oklch(0.92 0 0)",
  colorPickerBorderColor: "oklch(0.92 0 0)",
  comboBoxBorderColor: "oklch(0.92 0 0)",
  datePickerBorderColor: "oklch(0.92 0 0)",

  // Small radius, thin borders, no shadows at all
  btnRadius: "6px",
  btnBorderTop: "1px",
  btnBorderRight: "1px",
  btnBorderBottom: "1px",
  btnBorderLeft: "1px",
  btnShadow: "none",
  btnFontWeight: "500",
  btnLetterSpacing: "0em",
  btnTransitionDuration: "150ms",

  inputRadius: "6px",
  inputBorderTop: "1px",
  inputBorderRight: "1px",
  inputBorderBottom: "1px",
  inputBorderLeft: "1px",
  inputShadow: "none",

  cardRadius: "6px",
  cardBorderTop: "1px",
  cardBorderRight: "1px",
  cardBorderBottom: "1px",
  cardBorderLeft: "1px",
  cardShadow: "none",

  badgeRadius: "6px",
  badgeBorderTop: "1px",
  badgeBorderRight: "1px",
  badgeBorderBottom: "1px",
  badgeBorderLeft: "1px",

  accordionRadius: "6px",
  accordionBorderWidth: "1px",
  accordionShadow: "none",

  alertRadius: "6px",
  alertBorderWidth: "1px",
  alertShadow: "none",

  alertDialogRadius: "6px",
  alertDialogShadow: "none",
  alertDialogBackdropBlur: "0px",
  alertDialogBackdropColor: "oklch(0 0 0 / 0.35)",

  autocompletePopoverRadius: "6px",
  autocompletePopoverShadow: "none",
  autocompletePopoverBorderTop: "1px",
  autocompletePopoverBorderRight: "1px",
  autocompletePopoverBorderBottom: "1px",
  autocompletePopoverBorderLeft: "1px",
  autocompleteItemRadius: "4px",

  calendarRadius: "6px",
  calendarShadow: "none",

  colorPickerPopoverRadius: "6px",
  colorPickerPopoverShadow: "none",
  colorPickerPopoverBorderWidth: "1px",
  colorPickerAreaRadius: "4px",
  colorPickerSwatchRadius: "4px",

  comboBoxPopoverRadius: "6px",
  comboBoxPopoverShadow: "none",
  comboBoxPopoverBorderWidth: "1px",
  comboBoxTriggerRadius: "6px",
  comboBoxItemRadius: "4px",

  datePickerTriggerRadius: "6px",
  datePickerTriggerShadow: "none",
  datePickerPopoverRadius: "6px",
  datePickerPopoverShadow: "none",

  skeletonRadius: "6px",
  selectRadius: "6px",
  modalRadius: "6px",

  tabsListRadius: "8px",
  tabsTabRadius: "6px",

  checkboxRadius: "3px",

  sliderThumbShadow: "none",
};
