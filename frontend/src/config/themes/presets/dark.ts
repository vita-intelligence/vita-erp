/**
 * Dark theme preset — Brutalist white.
 *
 * Primary actions use near-white. The neutral scale is INVERTED:
 * neutral-50 = near-black (darkest), neutral-950 = near-white (lightest).
 * This inversion is documented in heroui.css and globals.css.
 */

import type { ThemeTokens } from "../types";
import { componentDefaults } from "./component-defaults";

export const darkTheme: ThemeTokens = {
  // ── Typography ──────────────────────────────────────────────────────────
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',
  fontSizeBase: "15px",
  lineHeight: "1.5",
  fontWeightBody: "400",
  spacing: "0.25rem",

  // ── Brand ───────────────────────────────────────────────────────────────
  primary: "oklch(0.96 0 0)",
  primaryLight: "oklch(1 0 0)",
  primaryDark: "oklch(0.80 0 0)",
  secondary: "oklch(0.62 0 0)",
  secondaryLight: "oklch(0.76 0 0)",
  secondaryDark: "oklch(0.46 0 0)",

  // ── Status ──────────────────────────────────────────────────────────────
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

  // ── Text ────────────────────────────────────────────────────────────────
  textPrimary: "oklch(0.96 0 0)",
  textSecondary: "oklch(0.72 0 0)",
  textMuted: "oklch(0.54 0 0)",
  textOnPrimary: "oklch(0.09 0 0)",
  textOnPrimaryMuted: "oklch(0.09 0 0 / 0.65)",
  textOnWarning: "oklch(0.15 0 0)",
  textOnDanger: "oklch(0.96 0 0)",

  // ── Surfaces ────────────────────────────────────────────────────────────
  background: "oklch(0.09 0 0)",
  surface: "oklch(0.14 0 0)",

  // ── Neutral scale (INVERTED: dark → light) ───────────────────────────────
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

  // ── Component tokens (shared brutalist defaults) ─────────────────────────
  ...componentDefaults,

  // ── Border colors (mode-dependent) ────────────────────────────────────────
  btnBorderColor: "oklch(0.22 0 0)",
  inputBorderColor: "oklch(0.22 0 0)",
  cardBorderColor: "oklch(0.22 0 0)",
  accordionBorderColor: "oklch(0.22 0 0)",
  autocompleteBorderColor: "oklch(0.22 0 0)",
  avatarBorderColor: "oklch(0.22 0 0)",
  breadcrumbsItemBorderColor: "oklch(0.22 0 0)",
  buttonGroupBorderColor: "oklch(0.22 0 0)",
  calendarBorderColor: "oklch(0.22 0 0)",
  checkboxBorderColor: "oklch(0.32 0 0)",
  checkboxGroupBorderColor: "oklch(0.22 0 0)",
  colorPickerBorderColor: "oklch(0.22 0 0)",
  comboBoxBorderColor: "oklch(0.22 0 0)",
  datePickerBorderColor: "oklch(0.22 0 0)",
};
