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
  | "cardBorderWidth"
  | "cardShadow"
  | "badgeRadius"
  | "badgeFontWeight"
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
  cardBorderWidth: "1px",
  cardShadow: "none",

  // Badge
  badgeRadius: "0px",
  badgeFontWeight: "600",

  // Select
  selectRadius: "0px",
  selectBorderWidth: "1px",

  // Modal
  modalRadius: "0px",
};
