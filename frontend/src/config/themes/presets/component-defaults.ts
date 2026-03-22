/**
 * Brutalist component defaults — shared between light and dark presets.
 *
 * These structural values (shape, border, spacing, motion) are mode-agnostic:
 * the same sharp, flat, no-decoration baseline applies in both themes.
 * Color values are defined separately in each preset.
 */
import type { ThemeTokens } from "../types";

export const componentDefaults: Pick<
  ThemeTokens,
  | "btnRadius"
  | "btnBorderTop"
  | "btnBorderRight"
  | "btnBorderBottom"
  | "btnBorderLeft"
  | "btnBorderStyle"
  | "btnFontWeight"
  | "btnLetterSpacing"
  | "btnTextTransform"
  | "btnShadow"
  | "btnHoverTransform"
  | "btnHoverFilter"
  | "btnPressScale"
  | "btnTransitionDuration"
  | "inputRadius"
  | "inputBorderTop"
  | "inputBorderRight"
  | "inputBorderBottom"
  | "inputBorderLeft"
  | "inputBorderStyle"
  | "inputLabelWeight"
  | "inputLabelSize"
  | "inputShadow"
  | "inputPaddingX"
  | "inputPaddingY"
  | "inputFontSize"
  | "inputPlaceholderOpacity"
  | "inputFocusRingWidth"
  | "inputFocusRingOffset"
  | "inputTransitionDuration"
  | "inputTextAlign"
  | "cardRadius"
  | "cardBorderTop"
  | "cardBorderRight"
  | "cardBorderBottom"
  | "cardBorderLeft"
  | "cardBorderStyle"
  | "cardShadow"
  | "badgeRadius"
  | "badgeBorderTop"
  | "badgeBorderRight"
  | "badgeBorderBottom"
  | "badgeBorderLeft"
  | "badgeBorderStyle"
  | "badgeFontWeight"
  | "badgeFontSize"
  | "badgeLetterSpacing"
  | "badgeTextTransform"
  | "badgePaddingX"
  | "badgePaddingY"
  | "accordionRadius"
  | "accordionBorderWidth"
  | "accordionBorderStyle"
  | "accordionSeparatorHeight"
  | "accordionTriggerPaddingX"
  | "accordionTriggerPaddingY"
  | "accordionTriggerFontWeight"
  | "accordionTriggerFontSize"
  | "accordionContentPaddingX"
  | "accordionContentPaddingY"
  | "accordionShadow"
  | "alertRadius"
  | "alertBorderWidth"
  | "alertBorderStyle"
  | "alertPaddingX"
  | "alertPaddingY"
  | "alertTitleFontWeight"
  | "alertTitleFontSize"
  | "alertDescriptionFontSize"
  | "alertIconSize"
  | "alertShadow"
  | "alertDialogRadius"
  | "alertDialogPaddingX"
  | "alertDialogPaddingY"
  | "alertDialogShadow"
  | "alertDialogBackdropBlur"
  | "alertDialogBackdropColor"
  | "alertDialogBackdropOpacity"
  | "autocompletePopoverRadius"
  | "autocompletePopoverBorderTop"
  | "autocompletePopoverBorderRight"
  | "autocompletePopoverBorderBottom"
  | "autocompletePopoverBorderLeft"
  | "autocompletePopoverBorderStyle"
  | "autocompletePopoverShadow"
  | "autocompletePopoverPadding"
  | "autocompleteItemPaddingX"
  | "autocompleteItemPaddingY"
  | "autocompleteItemFontSize"
  | "autocompleteItemRadius"
  | "autocompleteItemDivider"
  | "autocompleteMaxHeight"
  | "selectRadius"
  | "selectBorderWidth"
  | "modalRadius"
> = {
  // Button — sharp, flat, no decorative radius or shadow
  btnRadius: "0px",
  btnBorderTop: "1px",
  btnBorderRight: "1px",
  btnBorderBottom: "1px",
  btnBorderLeft: "1px",
  btnBorderStyle: "solid",
  btnFontWeight: "500",
  btnLetterSpacing: "0.02em",
  btnTextTransform: "none",
  btnShadow: "none",
  btnHoverTransform: "none",
  btnHoverFilter: "none",
  btnPressScale: "0.97",
  btnTransitionDuration: "150ms",

  // Input
  inputRadius: "0px",
  inputBorderTop: "1px",
  inputBorderRight: "1px",
  inputBorderBottom: "1px",
  inputBorderLeft: "1px",
  inputBorderStyle: "solid",
  inputLabelWeight: "500",
  inputLabelSize: "12px",
  inputShadow: "none",
  inputPaddingX: "12px",
  inputPaddingY: "8px",
  inputFontSize: "14px",
  inputPlaceholderOpacity: "0.45",
  inputFocusRingWidth: "2px",
  inputFocusRingOffset: "0px",
  inputTransitionDuration: "150ms",
  inputTextAlign: "left",

  // Card
  cardRadius: "0px",
  cardBorderTop: "1px",
  cardBorderRight: "1px",
  cardBorderBottom: "1px",
  cardBorderLeft: "1px",
  cardBorderStyle: "solid",
  cardShadow: "none",

  // Badge
  badgeRadius: "0px",
  badgeBorderTop: "1px",
  badgeBorderRight: "1px",
  badgeBorderBottom: "1px",
  badgeBorderLeft: "1px",
  badgeBorderStyle: "solid",
  badgeFontWeight: "600",
  badgeFontSize: "0.6875rem",
  badgeLetterSpacing: "0em",
  badgeTextTransform: "none",
  badgePaddingX: "0.55rem",
  badgePaddingY: "0.2rem",

  // Accordion
  accordionRadius: "0px",
  accordionBorderWidth: "1px",
  accordionBorderStyle: "solid",
  accordionSeparatorHeight: "1px",
  accordionTriggerPaddingX: "16px",
  accordionTriggerPaddingY: "12px",
  accordionTriggerFontWeight: "500",
  accordionTriggerFontSize: "14px",
  accordionContentPaddingX: "16px",
  accordionContentPaddingY: "8px",
  accordionShadow: "none",

  // Alert
  alertRadius: "0px",
  alertBorderWidth: "1px",
  alertBorderStyle: "solid",
  alertPaddingX: "16px",
  alertPaddingY: "12px",
  alertTitleFontWeight: "600",
  alertTitleFontSize: "14px",
  alertDescriptionFontSize: "13px",
  alertIconSize: "20px",
  alertShadow: "none",

  // Alert Dialog
  alertDialogRadius: "0px",
  alertDialogPaddingX: "24px",
  alertDialogPaddingY: "20px",
  alertDialogShadow: "none",
  alertDialogBackdropBlur: "0px",
  alertDialogBackdropColor: "oklch(0 0 0 / 0.4)",
  alertDialogBackdropOpacity: "1",

  // Autocomplete
  autocompletePopoverRadius: "0px",
  autocompletePopoverBorderTop: "1px",
  autocompletePopoverBorderRight: "1px",
  autocompletePopoverBorderBottom: "1px",
  autocompletePopoverBorderLeft: "1px",
  autocompletePopoverBorderStyle: "solid",
  autocompletePopoverShadow: "none",
  autocompletePopoverPadding: "4px",
  autocompleteItemPaddingX: "12px",
  autocompleteItemPaddingY: "8px",
  autocompleteItemFontSize: "14px",
  autocompleteItemRadius: "0px",
  autocompleteItemDivider: "0px",
  autocompleteMaxHeight: "256px",

  // Select
  selectRadius: "0px",
  selectBorderWidth: "1px",

  // Modal
  modalRadius: "0px",
};
