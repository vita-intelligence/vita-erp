/**
 * CSS_VAR_MAP — single source of truth for the JS ↔ CSS coupling.
 *
 * Maps each ThemeTokens key to the CSS custom property written onto :root.
 * The theme store calls applyTokens() to push values into the DOM at runtime.
 */
import type { ThemeTokens } from "./types";

export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  // Typography
  fontBody: "--vita-font-body",
  fontHeading: "--vita-font-heading",
  fontMono: "--vita-font-mono",
  fontSizeBase: "--vita-font-size-base",
  lineHeight: "--vita-line-height",
  fontWeightBody: "--vita-font-weight-body",
  spacing: "--vita-spacing",

  // Brand
  primary: "--vita-primary",
  primaryLight: "--vita-primary-light",
  primaryDark: "--vita-primary-dark",
  secondary: "--vita-secondary",
  secondaryLight: "--vita-secondary-light",
  secondaryDark: "--vita-secondary-dark",

  // Status
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

  // Text
  textPrimary: "--vita-text-primary",
  textSecondary: "--vita-text-secondary",
  textMuted: "--vita-text-muted",
  textOnPrimary: "--vita-text-on-primary",
  textOnPrimaryMuted: "--vita-text-on-primary-muted",
  textOnWarning: "--vita-text-on-warning",
  textOnDanger: "--vita-text-on-danger",

  // Surfaces
  background: "--vita-background",
  surface: "--vita-surface",

  // Neutral scale
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

  // Button
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

  // Input
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

  // Card
  cardRadius: "--vita-card-radius",
  cardBorderWidth: "--vita-card-border-width",
  cardShadow: "--vita-card-shadow",

  // Badge
  badgeRadius: "--vita-badge-radius",
  badgeFontWeight: "--vita-badge-font-weight",

  // Select
  selectRadius: "--vita-select-radius",
  selectBorderWidth: "--vita-select-border-width",

  // Modal
  modalRadius: "--vita-modal-radius",
};

/** Write a full or partial token set onto document.documentElement. */
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
