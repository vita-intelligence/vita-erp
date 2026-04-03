/**
 * Light theme preset — Brutalist black.
 *
 * Primary actions use near-black. The neutral scale runs light → dark
 * (neutral-50 = near-white, neutral-950 = near-black).
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const lightTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.09 0 0)",
  primaryLight: "oklch(0.32 0 0)",
  primaryDark: "oklch(0 0 0)",
  secondary: "oklch(0.44 0 0)",
  secondaryLight: "oklch(0.62 0 0)",
  secondaryDark: "oklch(0.28 0 0)",

  // ── Status ──────────────────────────────────────────────────────────────
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

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.09 0 0)",
  textSecondary: "oklch(0.38 0 0)",
  textMuted: "oklch(0.56 0 0)",
  textOnPrimary: "oklch(1 0 0)",
  textOnPrimaryMuted: "oklch(1 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(1 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(1 0 0)",
  surface: "oklch(1 0 0)",

  // ── Neutral scale (light → dark) ────────────────────────────────────────
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

  // ── Component tokens (shared brutalist defaults) ─────────────────────────
  ...componentDefaults,

  // ── Border colors (mode-dependent) ────────────────────────────────────────
  btnBorderColor: "oklch(0.90 0 0)",
  inputBorderColor: "oklch(0.90 0 0)",
  cardBorderColor: "oklch(0.90 0 0)",
  accordionBorderColor: "oklch(0.90 0 0)",
  autocompleteBorderColor: "oklch(0.90 0 0)",
  avatarBorderColor: "oklch(0.90 0 0)",
  breadcrumbsItemBorderColor: "oklch(0.90 0 0)",
  buttonGroupBorderColor: "oklch(0.90 0 0)",
  calendarBorderColor: "oklch(0.90 0 0)",
  checkboxBorderColor: "oklch(0.82 0 0)",
  checkboxGroupBorderColor: "oklch(0.90 0 0)",
  colorPickerBorderColor: "oklch(0.90 0 0)",
  comboBoxBorderColor: "oklch(0.90 0 0)",
  datePickerBorderColor: "oklch(0.90 0 0)",
};
