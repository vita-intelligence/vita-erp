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
  btnBorderColor: string; // border-color applied to all button variants
  btnFontWeight: string; // font-weight of button label
  btnLetterSpacing: string; // letter-spacing of button label
  btnTextTransform: string; // text-transform: none | uppercase | capitalize
  btnShadow: string; // box-shadow — full CSS value, built by shadow builder
  btnHoverTransform: string; // CSS transform on hover: translateY(-2px) | scale(1.03) | "" (none)
  btnHoverFilter: string; // CSS filter on hover: none | drop-shadow(...) | brightness(1.1)
  btnPressScale: string; // scale factor on press: 0.97 (default) | 0.95 (strong) | 1 (none)
  btnTransitionDuration: string; // transition-duration for hover / active states
  btnRotateX: string; // static 3D rotation around X axis (e.g. "0deg", "5deg")
  btnRotateY: string; // static 3D rotation around Y axis
  btnRotateZ: string; // static 3D rotation around Z axis
  btnHoverRotateX: string; // 3D X rotation on hover (fallback: static value)
  btnHoverRotateY: string; // 3D Y rotation on hover
  btnHoverRotateZ: string; // 3D Z rotation on hover
  btnCursorTrack: string; // cursor-tracking intensity: "0" (off) | degrees (e.g. "10")
  btnCursorTrackRestore: string; // restore speed when cursor leaves

  // ── Component tokens: Input / Textarea / Search ────────────────────────────
  inputRadius: string; // border-radius of the input wrapper
  inputBorderTop: string; // border-top-width
  inputBorderRight: string; // border-right-width
  inputBorderBottom: string; // border-bottom-width
  inputBorderLeft: string; // border-left-width
  inputBorderStyle: string; // border-style: solid | dashed | dotted
  inputBorderColor: string; // border-color of the input wrapper
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
  cardBorderColor: string; // border-color of card panels
  cardShadow: string; // box-shadow of card panels
  cardRotateX: string; // static 3D rotation around X axis
  cardRotateY: string; // static 3D rotation around Y axis
  cardRotateZ: string; // static 3D rotation around Z axis
  cardHoverRotateX: string; // 3D X rotation on hover
  cardHoverRotateY: string; // 3D Y rotation on hover
  cardHoverRotateZ: string; // 3D Z rotation on hover
  cardHoverTranslateY: string; // vertical shift on hover (e.g. "-4px" for lift)
  cardHoverScale: string; // scale factor on hover (e.g. "1.03")
  cardTransitionDuration: string; // transition-duration for hover animations
  cardCursorTrack: string; // cursor-tracking intensity: "0" (off) | degrees per half-width (e.g. "10")
  cardCursorTrackRestore: string; // restore speed when cursor leaves: "300ms" | "500ms" | etc.

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
  badgeRotateX: string; // static 3D rotation around X axis
  badgeRotateY: string; // static 3D rotation around Y axis
  badgeRotateZ: string; // static 3D rotation around Z axis
  badgeHoverRotateX: string; // 3D X rotation on hover
  badgeHoverRotateY: string; // 3D Y rotation on hover
  badgeHoverRotateZ: string; // 3D Z rotation on hover
  badgeHoverTranslateY: string; // vertical shift on hover
  badgeHoverScale: string; // scale factor on hover
  badgeTransitionDuration: string; // transition-duration for hover animations
  badgeCursorTrack: string; // cursor-tracking intensity
  badgeCursorTrackRestore: string; // restore speed when cursor leaves

  // ── Component tokens: Accordion ───────────────────────────────────────────
  accordionRadius: string; // border-radius of accordion container
  accordionBorderWidth: string; // border-width of container
  accordionBorderStyle: string; // border-style: solid | dashed | dotted
  accordionBorderColor: string; // border-color of accordion container and separators
  accordionSeparatorHeight: string; // separator thickness between items (0 = hidden)
  accordionTriggerPaddingX: string; // horizontal padding of trigger
  accordionTriggerPaddingY: string; // vertical padding of trigger
  accordionTriggerFontWeight: string; // font-weight of trigger text
  accordionTriggerFontSize: string; // font-size of trigger text
  accordionContentPaddingX: string; // horizontal padding of content body
  accordionContentPaddingY: string; // vertical padding of content body
  accordionShadow: string; // box-shadow on the container

  // ── Component tokens: Alert (inline banners) ─────────────────────────────
  alertRadius: string; // border-radius
  alertBorderWidth: string; // border-width
  alertBorderStyle: string; // border-style: solid | dashed | dotted
  alertPaddingX: string; // horizontal padding
  alertPaddingY: string; // vertical padding
  alertTitleFontWeight: string; // title font-weight
  alertTitleFontSize: string; // title font-size
  alertDescriptionFontSize: string; // description font-size
  alertIconSize: string; // indicator icon size
  alertShadow: string; // box-shadow

  // ── Component tokens: Alert Dialog (modal confirmation) ─────────────────
  alertDialogRadius: string; // dialog panel border-radius
  alertDialogPaddingX: string; // dialog horizontal padding
  alertDialogPaddingY: string; // dialog vertical padding
  alertDialogShadow: string; // dialog box-shadow
  alertDialogBackdropBlur: string; // backdrop blur amount (0 = opaque, >0 = glass)
  alertDialogBackdropColor: string; // backdrop overlay color (supports solid or rgba/oklch with alpha)
  alertDialogBackdropOpacity: string; // backdrop opacity (0–1)

  // ── Component tokens: Autocomplete / Dropdown ────────────────────────────
  autocompletePopoverRadius: string; // dropdown border-radius
  autocompletePopoverShadow: string; // dropdown box-shadow
  autocompletePopoverPadding: string; // dropdown internal padding
  autocompleteItemPaddingX: string; // list item horizontal padding
  autocompleteItemPaddingY: string; // list item vertical padding
  autocompleteItemFontSize: string; // list item font-size
  autocompleteItemRadius: string; // list item hover/selected border-radius
  autocompleteItemDivider: string; // divider height between items (0 = hidden)
  autocompletePopoverBorderTop: string; // popover border-top-width
  autocompletePopoverBorderRight: string; // popover border-right-width
  autocompletePopoverBorderBottom: string; // popover border-bottom-width
  autocompletePopoverBorderLeft: string; // popover border-left-width
  autocompletePopoverBorderStyle: string; // popover border-style
  autocompleteBorderColor: string; // border-color of popover and input
  autocompleteMaxHeight: string; // max dropdown height

  // ── Component tokens: Avatar ──────────────────────────────────────────────
  avatarRadius: string; // border-radius (0 = square, 9999px = circle)
  avatarBorderTop: string; // border-top-width
  avatarBorderRight: string; // border-right-width
  avatarBorderBottom: string; // border-bottom-width
  avatarBorderLeft: string; // border-left-width
  avatarBorderStyle: string; // border-style: solid | dashed | dotted
  avatarBorderColor: string; // border-color of avatar
  avatarSizeSm: string; // small avatar size (width & height)
  avatarSizeMd: string; // medium avatar size
  avatarSizeLg: string; // large avatar size
  avatarFallbackFontWeight: string; // fallback initials font-weight
  avatarFallbackFontSize: string; // fallback initials font-size
  avatarGroupSpacing: string; // negative margin overlap for avatar groups
  avatarRotateX: string; // static 3D rotation around X axis
  avatarRotateY: string; // static 3D rotation around Y axis
  avatarRotateZ: string; // static 3D rotation around Z axis
  avatarHoverRotateX: string; // 3D X rotation on hover
  avatarHoverRotateY: string; // 3D Y rotation on hover
  avatarHoverRotateZ: string; // 3D Z rotation on hover
  avatarHoverTranslateY: string; // vertical shift on hover
  avatarHoverScale: string; // scale factor on hover
  avatarTransitionDuration: string; // transition-duration for hover animations

  // ── Component tokens: Breadcrumbs ─────────────────────────────────────────
  breadcrumbsFontSize: string; // link font size
  breadcrumbsFontWeight: string; // link font weight
  breadcrumbsActiveFontWeight: string; // current/active item font weight
  breadcrumbsLetterSpacing: string; // letter-spacing
  breadcrumbsTextTransform: string; // text-transform: none | uppercase | capitalize
  breadcrumbsGap: string; // gap between items
  breadcrumbsItemPaddingX: string; // item horizontal padding (0 = plain text, >0 = tag-style)
  breadcrumbsItemPaddingY: string; // item vertical padding
  breadcrumbsItemRadius: string; // item border-radius (for tag/pill-style breadcrumbs)
  breadcrumbsItemBorderWidth: string; // item border-width (0 = no border)
  breadcrumbsItemBorderStyle: string; // item border-style
  breadcrumbsItemBorderColor: string; // item border-color
  breadcrumbsSeparatorIcon: string; // separator icon name: chevron-right | slash | dot | arrow-right | minus
  breadcrumbsSeparatorSize: string; // separator icon size
  breadcrumbsSeparatorOpacity: string; // separator opacity (0–1)
  breadcrumbsUnderline: string; // link underline: none | hover | underline

  // ── Component tokens: ButtonGroup ───────────────────────────────────────
  buttonGroupGap: string; // gap between buttons (0 = connected)
  buttonGroupBorderTop: string; // border-top-width
  buttonGroupBorderRight: string; // border-right-width
  buttonGroupBorderBottom: string; // border-bottom-width
  buttonGroupBorderLeft: string; // border-left-width
  buttonGroupBorderStyle: string; // border-style: solid | dashed | dotted
  buttonGroupBorderColor: string; // border-color of the group container
  buttonGroupShadow: string; // container shadow

  // ── Component tokens: Calendar ──────────────────────────────────────────
  calendarRadius: string; // container border-radius
  calendarBorderTop: string; // border-top-width
  calendarBorderRight: string; // border-right-width
  calendarBorderBottom: string; // border-bottom-width
  calendarBorderLeft: string; // border-left-width
  calendarBorderStyle: string; // border-style: solid | dashed | dotted
  calendarBorderColor: string; // border-color of calendar container
  calendarShadow: string; // container box-shadow
  calendarRotateX: string; // static 3D rotation around X axis
  calendarRotateY: string; // static 3D rotation around Y axis
  calendarRotateZ: string; // static 3D rotation around Z axis
  calendarHoverRotateX: string; // 3D X rotation on hover
  calendarHoverRotateY: string; // 3D Y rotation on hover
  calendarHoverRotateZ: string; // 3D Z rotation on hover
  calendarHoverTranslateY: string; // vertical shift on hover
  calendarHoverScale: string; // scale factor on hover
  calendarTransitionDuration: string; // transition-duration for hover animations
  calendarCursorTrack: string; // cursor-tracking intensity
  calendarCursorTrackRestore: string; // restore speed when cursor leaves

  // ── Component tokens: Checkbox ────────────────────────────────────────────
  checkboxSize: string; // control box width & height (e.g. "20px")
  checkboxRadius: string; // control box border-radius
  checkboxBorderWidth: string; // control box border width
  checkboxBorderStyle: string; // control box border style
  checkboxBorderColor: string; // unchecked control box border-color
  checkboxGap: string; // gap between control and label
  checkboxLabelFontSize: string; // label font-size
  checkboxLabelFontWeight: string; // label font-weight
  checkboxShadow: string; // box-shadow on control
  checkboxCheckedScale: string; // scale on check animation (e.g. "0.95")
  checkboxTransitionDuration: string; // transition duration
  checkboxIndicatorSize: string; // checkmark icon size
  checkboxIndicatorStroke: string; // checkmark stroke-width

  // ── Component tokens: Checkbox Group ────────────────────────────────────
  checkboxGroupGap: string; // gap between checkbox items
  checkboxGroupRadius: string; // container border-radius
  checkboxGroupPaddingX: string; // container horizontal padding
  checkboxGroupPaddingY: string; // container vertical padding
  checkboxGroupBorderWidth: string; // container border width
  checkboxGroupBorderStyle: string; // container border style
  checkboxGroupBorderColor: string; // container border-color
  checkboxGroupShadow: string; // container shadow
  checkboxGroupLabelFontSize: string; // group label font-size
  checkboxGroupLabelFontWeight: string; // group label font-weight
  checkboxGroupLabelGap: string; // gap between label and items

  // ── Component tokens: Color Picker ──────────────────────────────────────
  colorPickerPopoverRadius: string; // popover border-radius
  colorPickerPopoverShadow: string; // popover box-shadow
  colorPickerPopoverPadding: string; // popover internal padding
  colorPickerPopoverBorderWidth: string; // popover border width
  colorPickerPopoverBorderStyle: string; // popover border style
  colorPickerBorderColor: string; // border-color of popover, swatches, and thumbs
  colorPickerSwatchRadius: string; // individual swatch border-radius
  colorPickerSwatchSize: string; // swatch width & height
  colorPickerSwatchGap: string; // gap between swatches
  colorPickerSwatchBorderWidth: string; // swatch border width
  colorPickerSliderRadius: string; // slider track border-radius
  colorPickerSliderHeight: string; // slider track height
  colorPickerThumbSize: string; // draggable thumb size
  colorPickerThumbBorderWidth: string; // thumb border width
  colorPickerAreaRadius: string; // color area border-radius
  colorPickerTransitionDuration: string; // transition speed

  // ── Component tokens: ComboBox ────────────────────────────────────────────
  comboBoxPopoverRadius: string; // dropdown popover border-radius
  comboBoxPopoverShadow: string; // dropdown popover box-shadow
  comboBoxPopoverPadding: string; // dropdown popover padding
  comboBoxPopoverBorderWidth: string; // dropdown popover border width
  comboBoxPopoverBorderStyle: string; // dropdown popover border style
  comboBoxBorderColor: string; // border-color of popover and trigger
  comboBoxTriggerRadius: string; // trigger button border-radius
  comboBoxTriggerBorderWidth: string; // trigger button border width
  comboBoxItemPaddingX: string; // list item horizontal padding
  comboBoxItemPaddingY: string; // list item vertical padding
  comboBoxItemFontSize: string; // list item font-size
  comboBoxItemRadius: string; // list item border-radius
  comboBoxTransitionDuration: string; // transition speed

  // ── Component tokens: DatePicker ────────────────────────────────────────
  datePickerTriggerRadius: string; // trigger border-radius
  datePickerTriggerBorderWidth: string; // trigger border width
  datePickerTriggerBorderStyle: string; // trigger border style
  datePickerBorderColor: string; // border-color of trigger and popover
  datePickerTriggerPaddingX: string; // trigger horizontal padding
  datePickerTriggerPaddingY: string; // trigger vertical padding
  datePickerTriggerShadow: string; // trigger box-shadow
  datePickerPopoverRadius: string; // popover border-radius
  datePickerPopoverShadow: string; // popover box-shadow
  datePickerPopoverPadding: string; // popover padding
  datePickerIndicatorSize: string; // calendar icon size
  datePickerTransitionDuration: string; // transition speed

  // ── Component tokens: Switch ──────────────────────────────────────────────
  switchTrackWidth: string;
  switchTrackHeight: string;
  switchTrackRadius: string;
  switchThumbSize: string;
  switchThumbRadius: string;
  switchGap: string;
  switchTransitionDuration: string;

  // ── Component tokens: Tabs ──────────────────────────────────────────────
  tabsListRadius: string; // tab list container border-radius
  tabsListPadding: string; // tab list internal padding
  tabsListGap: string; // gap between tabs
  tabsTabRadius: string; // individual tab border-radius
  tabsTabPaddingX: string; // tab horizontal padding
  tabsTabPaddingY: string; // tab vertical padding (via height)
  tabsTabFontSize: string; // tab font-size
  tabsTabFontWeight: string; // tab font-weight
  tabsPanelPadding: string; // tab panel content padding
  tabsTransitionDuration: string; // indicator animation speed
  tabsRotateX: string; // static 3D rotation X
  tabsRotateY: string; // static 3D rotation Y
  tabsRotateZ: string; // static 3D rotation Z
  tabsHoverRotateX: string; // hover 3D rotation X
  tabsHoverRotateY: string; // hover 3D rotation Y
  tabsHoverRotateZ: string; // hover 3D rotation Z
  tabsHoverTranslateY: string; // hover vertical shift
  tabsHoverScale: string; // hover scale

  // ── Component tokens: Slider ────────────────────────────────────────────
  sliderTrackHeight: string; // track height
  sliderTrackRadius: string; // track border-radius
  sliderThumbSize: string; // thumb hit-area size
  sliderThumbDotSize: string; // visible thumb dot size (::after)
  sliderThumbRadius: string; // thumb border-radius
  sliderThumbShadow: string; // thumb box-shadow
  sliderTransitionDuration: string; // animation speed
  sliderRotateX: string; // static 3D rotation X
  sliderRotateY: string; // static 3D rotation Y
  sliderRotateZ: string; // static 3D rotation Z
  sliderHoverRotateX: string; // hover 3D rotation X
  sliderHoverRotateY: string; // hover 3D rotation Y
  sliderHoverRotateZ: string; // hover 3D rotation Z
  sliderHoverTranslateY: string; // hover vertical shift
  sliderHoverScale: string; // hover scale

  // ── Component tokens: Spinner ───────────────────────────────────────────
  spinnerSizeSm: string; // small spinner size
  spinnerSizeMd: string; // medium spinner size
  spinnerSizeLg: string; // large spinner size
  spinnerRotateX: string; // static 3D rotation X
  spinnerRotateY: string; // static 3D rotation Y
  spinnerRotateZ: string; // static 3D rotation Z

  // ── Component tokens: Skeleton ──────────────────────────────────────────
  skeletonRadius: string; // border-radius
  skeletonBaseColor: string; // background color of skeleton
  skeletonAnimationDuration: string; // pulse/shimmer speed

  // ── Component tokens: Separator ─────────────────────────────────────────
  separatorThickness: string; // line thickness (height for horizontal)
  separatorRadius: string; // border-radius

  // ── Component tokens: Select / Dropdown ───────────────────────────────────
  selectRadius: string; // border-radius of select trigger
  selectBorderWidth: string; // border-width of select trigger

  // ── Component tokens: Modal / Drawer / Popover ────────────────────────────
  modalRadius: string; // border-radius of overlay panels

  // ── Component tokens: Toast ──────────────────────────────────────────────
  toastPlacement: string; // toast position: "top" | "top start" | "top end" | "bottom" | "bottom start" | "bottom end"
  toastRadius: string; // toast border-radius
  toastBorderWidth: string; // toast border-width
  toastBorderStyle: string; // toast border-style: solid | dashed | dotted
  toastPaddingX: string; // toast horizontal padding
  toastPaddingY: string; // toast vertical padding
  toastShadow: string; // toast box-shadow
  toastGap: string; // gap between stacked toasts
  toastMinWidth: string; // minimum toast width
  toastMaxWidth: string; // maximum toast width
  toastContentGap: string; // gap between title and description
  toastTitleFontWeight: string; // title font-weight
  toastTitleFontSize: string; // title font-size
  toastDescriptionFontSize: string; // description font-size
  toastDescriptionOpacity: string; // description text opacity
  toastIconSize: string; // indicator icon size
  toastActionRadius: string; // action button border-radius
  toastActionFontSize: string; // action button font-size
  toastActionFontWeight: string; // action button font-weight
  toastActionPaddingX: string; // action button horizontal padding
  toastActionPaddingY: string; // action button vertical padding
  toastCloseSize: string; // close button size
  toastCloseRadius: string; // close button border-radius
  toastCloseOpacity: string; // close button opacity
  toastCloseHoverOpacity: string; // close button hover opacity
};
