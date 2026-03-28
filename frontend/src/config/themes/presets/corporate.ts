/**
 * Corporate Blue theme preset — classic professional blue, clean and trustworthy.
 *
 * A light theme designed for business environments. Uses a reliable corporate
 * blue primary, clean white backgrounds, Roboto font family, 8px radius,
 * medium shadows, and letter-spacing on buttons for a polished, authoritative
 * look.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const corporateTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.50 0.16 250)",
  primaryLight: "oklch(0.62 0.13 250)",
  primaryDark: "oklch(0.38 0.18 250)",
  secondary: "oklch(0.52 0.08 220)",
  secondaryLight: "oklch(0.66 0.06 220)",
  secondaryDark: "oklch(0.40 0.10 220)",

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
  info: "oklch(0.58 0.14 235)",
  infoLight: "oklch(0.72 0.10 235)",
  infoDark: "oklch(0.44 0.16 235)",

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.14 0.01 250)",
  textSecondary: "oklch(0.38 0.01 250)",
  textMuted: "oklch(0.56 0.01 250)",
  textOnPrimary: "oklch(1 0 0)",
  textOnPrimaryMuted: "oklch(1 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(1 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.99 0.002 250)",
  surface: "oklch(1 0 0)",

  // ── Neutral scale (light → dark) ───────────────────────────────────────
  neutral50: "oklch(0.97 0.003 250)",
  neutral100: "oklch(0.95 0.003 248)",
  neutral200: "oklch(0.90 0.003 246)",
  neutral300: "oklch(0.82 0.004 244)",
  neutral400: "oklch(0.70 0.004 242)",
  neutral500: "oklch(0.56 0.004 240)",
  neutral600: "oklch(0.44 0.005 240)",
  neutral700: "oklch(0.34 0.005 242)",
  neutral800: "oklch(0.24 0.005 244)",
  neutral900: "oklch(0.16 0.005 246)",
  neutral950: "oklch(0.10 0.005 248)",

  // ── Component tokens (defaults + corporate overrides) ──────────────────
  ...componentDefaults,

  // Medium radius, medium shadows, letter-spacing on buttons
  btnRadius: "8px",
  btnFontWeight: "500",
  btnLetterSpacing: "0.04em",
  btnTextTransform: "none",
  btnShadow:
    "0 1px 3px oklch(0.30 0.06 250 / 0.12), 0 1px 2px oklch(0.30 0.06 250 / 0.08)",
  btnTransitionDuration: "200ms",

  inputRadius: "8px",
  inputShadow: "0 1px 2px oklch(0.30 0.04 250 / 0.08)",

  cardRadius: "8px",
  cardShadow:
    "0 1px 3px oklch(0.30 0.04 250 / 0.10), 0 1px 2px oklch(0.30 0.04 250 / 0.06)",

  badgeRadius: "8px",
  badgeLetterSpacing: "0.02em",

  accordionRadius: "8px",
  accordionShadow: "0 1px 3px oklch(0.30 0.04 250 / 0.08)",

  alertRadius: "8px",
  alertShadow: "0 1px 3px oklch(0.30 0.04 250 / 0.08)",

  alertDialogRadius: "8px",
  alertDialogShadow:
    "0 4px 16px oklch(0.20 0.04 250 / 0.15), 0 2px 6px oklch(0.20 0.04 250 / 0.08)",
  alertDialogBackdropBlur: "4px",
  alertDialogBackdropColor: "oklch(0.20 0.03 250 / 0.4)",

  autocompletePopoverRadius: "8px",
  autocompletePopoverShadow: "0 4px 12px oklch(0.30 0.04 250 / 0.12)",
  autocompleteItemRadius: "6px",

  calendarRadius: "8px",
  calendarShadow: "0 2px 8px oklch(0.30 0.04 250 / 0.10)",

  colorPickerPopoverRadius: "8px",
  colorPickerPopoverShadow: "0 4px 12px oklch(0.30 0.04 250 / 0.12)",

  comboBoxPopoverRadius: "8px",
  comboBoxPopoverShadow: "0 4px 12px oklch(0.30 0.04 250 / 0.12)",
  comboBoxTriggerRadius: "8px",
  comboBoxItemRadius: "6px",

  datePickerTriggerRadius: "8px",
  datePickerPopoverRadius: "8px",
  datePickerPopoverShadow: "0 4px 12px oklch(0.30 0.04 250 / 0.12)",

  skeletonRadius: "8px",
  selectRadius: "8px",
  modalRadius: "8px",

  tabsListRadius: "10px",
  tabsTabRadius: "8px",

  checkboxRadius: "4px",
};
