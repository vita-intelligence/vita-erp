/**
 * Forest Green theme preset — earthy greens with warm brown accents.
 *
 * A light theme inspired by old-growth forests. Uses warm cream backgrounds,
 * forest green primary, medium radius (8px), 2px borders, and a serif
 * heading font (Playfair Display) for an organic, editorial feel.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const forestTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Playfair Display", ui-serif, Georgia, serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.55",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.50 0.14 155)",
  primaryLight: "oklch(0.62 0.11 155)",
  primaryDark: "oklch(0.38 0.15 155)",
  secondary: "oklch(0.48 0.08 55)",
  secondaryLight: "oklch(0.62 0.06 55)",
  secondaryDark: "oklch(0.36 0.10 55)",

  // ── Status ──────────────────────────────────────────────────────────────
  success: "oklch(0.56 0.16 148)",
  successLight: "oklch(0.72 0.12 148)",
  successDark: "oklch(0.42 0.18 148)",
  warning: "oklch(0.74 0.16 68)",
  warningLight: "oklch(0.86 0.12 68)",
  warningDark: "oklch(0.60 0.18 68)",
  error: "oklch(0.58 0.20 27)",
  errorLight: "oklch(0.72 0.14 27)",
  errorDark: "oklch(0.44 0.22 27)",
  info: "oklch(0.56 0.10 200)",
  infoLight: "oklch(0.72 0.07 200)",
  infoDark: "oklch(0.44 0.12 200)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.18 0.02 55)",
  textSecondary: "oklch(0.38 0.02 55)",
  textMuted: "oklch(0.55 0.02 90)",
  textOnPrimary: "oklch(0.98 0.005 90)",
  textOnPrimaryMuted: "oklch(0.98 0.005 90 / 0.65)",
  textOnWarning: "oklch(0.18 0 0)",
  textOnDanger: "oklch(0.98 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.97 0.01 90)",
  surface: "oklch(0.99 0.005 90)",

  // ── Neutral scale (light → dark) ───────────────────────────────────────
  neutral50: "oklch(0.97 0.008 90)",
  neutral100: "oklch(0.94 0.008 85)",
  neutral200: "oklch(0.89 0.008 80)",
  neutral300: "oklch(0.81 0.008 75)",
  neutral400: "oklch(0.69 0.007 70)",
  neutral500: "oklch(0.56 0.006 65)",
  neutral600: "oklch(0.44 0.006 60)",
  neutral700: "oklch(0.34 0.006 55)",
  neutral800: "oklch(0.24 0.005 55)",
  neutral900: "oklch(0.16 0.005 55)",
  neutral950: "oklch(0.12 0.005 55)",

  // ── Component tokens (defaults + forest overrides) ─────────────────────
  ...componentDefaults,

  // Medium radius, 2px borders, warm feel
  btnRadius: "8px",
  btnBorderTop: "2px",
  btnBorderRight: "2px",
  btnBorderBottom: "2px",
  btnBorderLeft: "2px",
  btnTransitionDuration: "200ms",

  inputRadius: "8px",
  inputBorderTop: "2px",
  inputBorderRight: "2px",
  inputBorderBottom: "2px",
  inputBorderLeft: "2px",

  cardRadius: "8px",
  cardBorderTop: "2px",
  cardBorderRight: "2px",
  cardBorderBottom: "2px",
  cardBorderLeft: "2px",
  cardShadow: "0 2px 8px oklch(0.30 0.04 55 / 0.1)",

  badgeRadius: "8px",
  badgeBorderTop: "2px",
  badgeBorderRight: "2px",
  badgeBorderBottom: "2px",
  badgeBorderLeft: "2px",

  accordionRadius: "8px",
  accordionBorderWidth: "2px",

  alertRadius: "8px",
  alertBorderWidth: "2px",

  alertDialogRadius: "8px",
  alertDialogBackdropColor: "oklch(0.20 0.04 55 / 0.4)",

  autocompletePopoverRadius: "8px",
  autocompletePopoverBorderTop: "2px",
  autocompletePopoverBorderRight: "2px",
  autocompletePopoverBorderBottom: "2px",
  autocompletePopoverBorderLeft: "2px",
  autocompleteItemRadius: "6px",

  calendarRadius: "8px",
  calendarBorderTop: "2px",
  calendarBorderRight: "2px",
  calendarBorderBottom: "2px",
  calendarBorderLeft: "2px",

  checkboxBorderWidth: "2px",
  checkboxRadius: "4px",

  colorPickerPopoverRadius: "8px",
  colorPickerPopoverBorderWidth: "2px",

  comboBoxPopoverRadius: "8px",
  comboBoxPopoverBorderWidth: "2px",
  comboBoxTriggerRadius: "8px",
  comboBoxTriggerBorderWidth: "2px",
  comboBoxItemRadius: "6px",

  datePickerTriggerRadius: "8px",
  datePickerTriggerBorderWidth: "2px",
  datePickerPopoverRadius: "8px",

  skeletonRadius: "8px",
  selectRadius: "8px",
  selectBorderWidth: "2px",
  modalRadius: "8px",

  tabsListRadius: "10px",
  tabsTabRadius: "6px",
};
