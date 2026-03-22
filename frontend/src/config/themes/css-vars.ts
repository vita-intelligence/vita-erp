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
  cardBorderTop: "--vita-card-border-top",
  cardBorderRight: "--vita-card-border-right",
  cardBorderBottom: "--vita-card-border-bottom",
  cardBorderLeft: "--vita-card-border-left",
  cardBorderStyle: "--vita-card-border-style",
  cardShadow: "--vita-card-shadow",

  // Badge
  badgeRadius: "--vita-badge-radius",
  badgeBorderTop: "--vita-badge-border-top",
  badgeBorderRight: "--vita-badge-border-right",
  badgeBorderBottom: "--vita-badge-border-bottom",
  badgeBorderLeft: "--vita-badge-border-left",
  badgeBorderStyle: "--vita-badge-border-style",
  badgeFontWeight: "--vita-badge-font-weight",
  badgeFontSize: "--vita-badge-font-size",
  badgeLetterSpacing: "--vita-badge-letter-spacing",
  badgeTextTransform: "--vita-badge-text-transform",
  badgePaddingX: "--vita-badge-padding-x",
  badgePaddingY: "--vita-badge-padding-y",

  // Accordion
  accordionRadius: "--vita-accordion-radius",
  accordionBorderWidth: "--vita-accordion-border-width",
  accordionBorderStyle: "--vita-accordion-border-style",
  accordionSeparatorHeight: "--vita-accordion-separator-height",
  accordionTriggerPaddingX: "--vita-accordion-trigger-padding-x",
  accordionTriggerPaddingY: "--vita-accordion-trigger-padding-y",
  accordionTriggerFontWeight: "--vita-accordion-trigger-font-weight",
  accordionTriggerFontSize: "--vita-accordion-trigger-font-size",
  accordionContentPaddingX: "--vita-accordion-content-padding-x",
  accordionContentPaddingY: "--vita-accordion-content-padding-y",
  accordionShadow: "--vita-accordion-shadow",

  // Alert
  alertRadius: "--vita-alert-radius",
  alertBorderWidth: "--vita-alert-border-width",
  alertBorderStyle: "--vita-alert-border-style",
  alertPaddingX: "--vita-alert-padding-x",
  alertPaddingY: "--vita-alert-padding-y",
  alertTitleFontWeight: "--vita-alert-title-font-weight",
  alertTitleFontSize: "--vita-alert-title-font-size",
  alertDescriptionFontSize: "--vita-alert-description-font-size",
  alertIconSize: "--vita-alert-icon-size",
  alertShadow: "--vita-alert-shadow",

  // Alert Dialog
  alertDialogRadius: "--vita-alert-dialog-radius",
  alertDialogPaddingX: "--vita-alert-dialog-padding-x",
  alertDialogPaddingY: "--vita-alert-dialog-padding-y",
  alertDialogShadow: "--vita-alert-dialog-shadow",
  alertDialogBackdropBlur: "--vita-alert-dialog-backdrop-blur",
  alertDialogBackdropColor: "--vita-alert-dialog-backdrop-color",
  alertDialogBackdropOpacity: "--vita-alert-dialog-backdrop-opacity",

  // Autocomplete
  autocompletePopoverRadius: "--vita-autocomplete-popover-radius",
  autocompletePopoverBorderTop: "--vita-autocomplete-popover-border-top",
  autocompletePopoverBorderRight: "--vita-autocomplete-popover-border-right",
  autocompletePopoverBorderBottom: "--vita-autocomplete-popover-border-bottom",
  autocompletePopoverBorderLeft: "--vita-autocomplete-popover-border-left",
  autocompletePopoverBorderStyle: "--vita-autocomplete-popover-border-style",
  autocompletePopoverShadow: "--vita-autocomplete-popover-shadow",
  autocompletePopoverPadding: "--vita-autocomplete-popover-padding",
  autocompleteItemPaddingX: "--vita-autocomplete-item-padding-x",
  autocompleteItemPaddingY: "--vita-autocomplete-item-padding-y",
  autocompleteItemFontSize: "--vita-autocomplete-item-font-size",
  autocompleteItemRadius: "--vita-autocomplete-item-radius",
  autocompleteItemDivider: "--vita-autocomplete-item-divider",
  autocompleteMaxHeight: "--vita-autocomplete-max-height",

  // Avatar
  avatarRadius: "--vita-avatar-radius",
  avatarBorderTop: "--vita-avatar-border-top",
  avatarBorderRight: "--vita-avatar-border-right",
  avatarBorderBottom: "--vita-avatar-border-bottom",
  avatarBorderLeft: "--vita-avatar-border-left",
  avatarBorderStyle: "--vita-avatar-border-style",
  avatarSizeSm: "--vita-avatar-size-sm",
  avatarSizeMd: "--vita-avatar-size-md",
  avatarSizeLg: "--vita-avatar-size-lg",
  avatarFallbackFontWeight: "--vita-avatar-fallback-font-weight",
  avatarFallbackFontSize: "--vita-avatar-fallback-font-size",
  avatarRingWidth: "--vita-avatar-ring-width",
  avatarRingOffset: "--vita-avatar-ring-offset",
  avatarShadow: "--vita-avatar-shadow",
  avatarGroupSpacing: "--vita-avatar-group-spacing",

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
