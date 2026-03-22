/**
 * ThemeTokens — flat map of every designable value in the Vita ERP system.
 *
 * Each key maps 1-to-1 to a CSS custom property via CSS_VAR_MAP (css-vars.ts).
 * The theme store writes these onto document.documentElement at runtime.
 */
export type ThemeTokens = {
  // ── Typography ─────────────────────────────────────────────────────────────
  fontBody: string; // body text, UI labels, navigation
  fontHeading: string; // headings h1–h6, page titles
  fontMono: string; // numbers in tables, codes, IDs
  fontSizeBase: string; // root font size — scales the entire rem system
  lineHeight: string; // body line height — affects readability in dense tables/forms
  fontWeightBody: string; // body font weight: 300 | 400 | 500 | 600
  spacing: string; // base spacing unit — scales all padding/gap/margin (Tailwind --spacing)

  // ── Brand colors ───────────────────────────────────────────────────────────
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // ── Status colors ──────────────────────────────────────────────────────────
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;

  // ── Text colors ────────────────────────────────────────────────────────────
  // Independent per mode — do not derive from the neutral scale.
  textPrimary: string; // headings, active labels, important content
  textSecondary: string; // body text, descriptions, navigation
  textMuted: string; // hints, timestamps, placeholders
  textOnPrimary: string; // text / icons on a primary-colored background
  textOnPrimaryMuted: string; // secondary text / icons on a primary-colored background
  textOnWarning: string; // text / icons on a warning-colored background
  textOnDanger: string; // text / icons on a danger / error background

  // ── Surfaces ───────────────────────────────────────────────────────────────
  // Independent from the neutral scale so a background tint is possible.
  background: string;
  surface: string;

  // ── Neutral scale ──────────────────────────────────────────────────────────
  // In dark mode the scale is INVERTED: neutral-50 = darkest, neutral-950 = lightest.
  neutral50: string;
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral400: string;
  neutral500: string;
  neutral600: string;
  neutral700: string;
  neutral800: string;
  neutral900: string;
  neutral950: string;

  // ── Component tokens: Button ───────────────────────────────────────────────
  btnRadius: string; // border-radius applied to all button variants
  btnBorderTop: string; // border-top-width
  btnBorderRight: string; // border-right-width
  btnBorderBottom: string; // border-bottom-width
  btnBorderLeft: string; // border-left-width
  btnBorderStyle: string; // border-style: solid | dashed | dotted
  btnFontWeight: string; // font-weight of button label
  btnLetterSpacing: string; // letter-spacing of button label
  btnTextTransform: string; // text-transform: none | uppercase | capitalize
  btnShadow: string; // box-shadow — full CSS value, built by shadow builder
  btnHoverTransform: string; // CSS transform on hover: none | translateY(-2px) | scale(1.03)
  btnHoverFilter: string; // CSS filter on hover: none | drop-shadow(...) | brightness(1.1)
  btnPressScale: string; // scale factor on press: 0.97 (default) | 0.95 (strong) | 1 (none)
  btnTransitionDuration: string; // transition-duration for hover / active states

  // ── Component tokens: Input / Textarea / Search ────────────────────────────
  inputRadius: string; // border-radius of the input wrapper
  inputBorderTop: string; // border-top-width
  inputBorderRight: string; // border-right-width
  inputBorderBottom: string; // border-bottom-width
  inputBorderLeft: string; // border-left-width
  inputBorderStyle: string; // border-style: solid | dashed | dotted
  inputLabelWeight: string; // font-weight of the label
  inputLabelSize: string; // font-size of the label
  inputShadow: string; // box-shadow of the input wrapper
  inputPaddingX: string; // horizontal internal padding
  inputPaddingY: string; // vertical internal padding
  inputFontSize: string; // font-size of the input text
  inputPlaceholderOpacity: string; // opacity of placeholder text (0–1)
  inputFocusRingWidth: string; // outline-width on focus
  inputFocusRingOffset: string; // outline-offset on focus
  inputTransitionDuration: string; // transition-duration for focus / hover
  inputTextAlign: string; // text-align: left | center | right

  // ── Component tokens: Card ─────────────────────────────────────────────────
  cardRadius: string; // border-radius of card panels
  cardBorderTop: string; // border-top-width
  cardBorderRight: string; // border-right-width
  cardBorderBottom: string; // border-bottom-width
  cardBorderLeft: string; // border-left-width
  cardBorderStyle: string; // border-style: solid | dashed | dotted
  cardShadow: string; // box-shadow of card panels

  // ── Component tokens: Badge / Chip / Tag ──────────────────────────────────
  badgeRadius: string; // border-radius: 0 = square tag, 9999px = pill
  badgeBorderTop: string; // border-top-width
  badgeBorderRight: string; // border-right-width
  badgeBorderBottom: string; // border-bottom-width
  badgeBorderLeft: string; // border-left-width
  badgeBorderStyle: string; // border-style: solid | dashed | dotted
  badgeFontWeight: string; // font-weight of badge / chip text
  badgeFontSize: string; // font-size of badge text
  badgeLetterSpacing: string; // letter-spacing of badge text
  badgeTextTransform: string; // text-transform: none | uppercase | capitalize
  badgePaddingX: string; // horizontal padding
  badgePaddingY: string; // vertical padding

  // ── Component tokens: Accordion ───────────────────────────────────────────
  accordionRadius: string; // border-radius of accordion container
  accordionBorderWidth: string; // border-width of container
  accordionBorderStyle: string; // border-style: solid | dashed | dotted
  accordionSeparatorHeight: string; // separator thickness between items (0 = hidden)
  accordionTriggerPaddingX: string; // horizontal padding of trigger
  accordionTriggerPaddingY: string; // vertical padding of trigger
  accordionTriggerFontWeight: string; // font-weight of trigger text
  accordionTriggerFontSize: string; // font-size of trigger text
  accordionContentPaddingX: string; // horizontal padding of content body
  accordionContentPaddingY: string; // vertical padding of content body
  accordionShadow: string; // box-shadow on the container

  // ── Component tokens: Select / Dropdown ───────────────────────────────────
  selectRadius: string; // border-radius of select trigger
  selectBorderWidth: string; // border-width of select trigger

  // ── Component tokens: Modal / Drawer / Popover ────────────────────────────
  modalRadius: string; // border-radius of overlay panels
};
