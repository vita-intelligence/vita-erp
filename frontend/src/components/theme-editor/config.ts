/**
 * Theme Editor Module Registry — Vita ERP
 *
 * Each entry in THEME_EDITOR_MODULES defines one tab in the theme editor.
 * To add a new customization area, add a new entry here — no other changes needed.
 *
 * Fields:
 *   id          — unique key, used for tab routing and aria attributes
 *   label       — displayed tab label
 *   description — subtitle shown inside the panel header
 *   component   — React component rendered when the tab is active
 */

import type { ComponentType } from "react";

import type { ThemeTokens } from "@/config/themes";
import { AccordionModule } from "./modules/accordion";
import { Preview as AccordionPreview } from "./modules/accordion/Preview";
import { AlertsModule } from "./modules/alerts";
import { Preview as AlertsPreview } from "./modules/alerts/Preview";
import { AutocompleteModule } from "./modules/autocomplete";
import { Preview as AutocompletePreview } from "./modules/autocomplete/Preview";
import { AvatarModule } from "./modules/avatar";
import { Preview as AvatarPreview } from "./modules/avatar/Preview";
import { BadgesModule } from "./modules/badges";
import { Preview as BadgesPreview } from "./modules/badges/Preview";
import { BreadcrumbsModule } from "./modules/breadcrumbs";
import { Preview as BreadcrumbsPreview } from "./modules/breadcrumbs/Preview";
import { ButtonGroupModule } from "./modules/button-group";
import { Preview as ButtonGroupPreview } from "./modules/button-group/Preview";
import { ButtonsModule } from "./modules/buttons";
import { Preview as ButtonsPreview } from "./modules/buttons/Preview";
import { CalendarModule } from "./modules/calendar";
import { Preview as CalendarPreview } from "./modules/calendar/Preview";
import { CardsModule } from "./modules/cards";
import { Preview as CardsPreview } from "./modules/cards/Preview";
import { CheckboxModule } from "./modules/checkbox";
import { Preview as CheckboxPreview } from "./modules/checkbox/Preview";
import { CheckboxGroupModule } from "./modules/checkbox-group";
import { Preview as CheckboxGroupPreview } from "./modules/checkbox-group/Preview";
import { ColorPickerModule } from "./modules/color-picker";
import { Preview as ColorPickerPreview } from "./modules/color-picker/Preview";
import { ColorsModule } from "./modules/colors";
import { ComboBoxModule } from "./modules/combo-box";
import { Preview as ComboBoxPreview } from "./modules/combo-box/Preview";
import { DatePickerModule } from "./modules/date-picker";
import { Preview as DatePickerPreview } from "./modules/date-picker/Preview";
import { InputsModule } from "./modules/inputs";
import { Preview as InputsPreview } from "./modules/inputs/Preview";
import { SeparatorModule } from "./modules/separator";
import { Preview as SeparatorPreview } from "./modules/separator/Preview";
import { SkeletonModule } from "./modules/skeleton";
import { Preview as SkeletonPreview } from "./modules/skeleton/Preview";
import { SliderModule } from "./modules/slider";
import { Preview as SliderPreview } from "./modules/slider/Preview";
import { SpacingModule } from "./modules/spacing";
import { SpinnerModule } from "./modules/spinner";
import { Preview as SpinnerPreview } from "./modules/spinner/Preview";
import { SwitchModule } from "./modules/switch";
import { Preview as SwitchPreview } from "./modules/switch/Preview";
import { TabsModule } from "./modules/tabs";
import { Preview as TabsPreview } from "./modules/tabs/Preview";
import { ToastModule } from "./modules/toast";
import { Preview as ToastPreview } from "./modules/toast/Preview";
import { TypographyModule } from "./modules/typography";

export type ThemeModule = {
  id: string;
  label: string;
  description: string;
  component: ComponentType;
  /** Standalone preview — rendered in a sticky side pane on large screens. */
  preview?: ComponentType;
  /** Sidebar group label — modules sharing the same group are rendered together. */
  group: string;
  /** Token keys owned by this module — used to reset only this section. */
  resetKeys: (keyof ThemeTokens)[];
};

/** Returns modules ordered and grouped — preserves insertion order. */
export function groupedModules(): { group: string; items: ThemeModule[] }[] {
  const map = new Map<string, ThemeModule[]>();
  for (const m of THEME_EDITOR_MODULES) {
    const arr = map.get(m.group) ?? [];
    arr.push(m);
    map.set(m.group, arr);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export const THEME_EDITOR_MODULES: ThemeModule[] = [
  {
    id: "colors",
    label: "Colors",
    description: "Brand colors, status indicators, and surface tints",
    component: ColorsModule,
    group: "Foundation",
    resetKeys: [
      "primary",
      "primaryLight",
      "primaryDark",
      "secondary",
      "secondaryLight",
      "secondaryDark",
      "success",
      "successLight",
      "successDark",
      "warning",
      "warningLight",
      "warningDark",
      "error",
      "errorLight",
      "errorDark",
      "info",
      "infoLight",
      "infoDark",
      "textPrimary",
      "textSecondary",
      "textMuted",
      "textOnPrimary",
      "textOnPrimaryMuted",
      "textOnWarning",
      "textOnDanger",
      "background",
      "surface",
      "neutral50",
      "neutral100",
      "neutral200",
      "neutral300",
      "neutral400",
      "neutral500",
      "neutral600",
      "neutral700",
      "neutral800",
      "neutral900",
      "neutral950",
    ],
  },
  {
    id: "typography",
    label: "Typography",
    description: "Fonts, sizes, line height, and body weight",
    component: TypographyModule,
    group: "Foundation",
    resetKeys: [
      "fontBody",
      "fontHeading",
      "fontMono",
      "fontSizeBase",
      "lineHeight",
      "fontWeightBody",
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    description: "Interface density — scales all padding and gaps",
    component: SpacingModule,
    group: "Foundation",
    resetKeys: ["spacing"],
  },
  {
    id: "buttons",
    label: "Buttons",
    description: "Shape, weight, shadow, and border of all button variants",
    component: ButtonsModule,
    preview: ButtonsPreview,
    group: "Components",
    resetKeys: [
      "btnRadius",
      "btnBorderTop",
      "btnBorderRight",
      "btnBorderBottom",
      "btnBorderLeft",
      "btnBorderStyle",
      "btnFontWeight",
      "btnLetterSpacing",
      "btnTextTransform",
      "btnShadow",
      "btnHoverTransform",
      "btnHoverFilter",
      "btnPressScale",
      "btnTransitionDuration",
      "btnRotateX",
      "btnRotateY",
      "btnRotateZ",
      "btnHoverRotateX",
      "btnHoverRotateY",
      "btnHoverRotateZ",
      "btnCursorTrack",
      "btnCursorTrackRestore",
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    description: "Radius, border, and label style of text inputs and fields",
    component: InputsModule,
    preview: InputsPreview,
    group: "Components",
    resetKeys: [
      "inputRadius",
      "inputBorderTop",
      "inputBorderRight",
      "inputBorderBottom",
      "inputBorderLeft",
      "inputBorderStyle",
      "inputLabelWeight",
      "inputLabelSize",
      "inputShadow",
      "inputPaddingX",
      "inputPaddingY",
      "inputFontSize",
      "inputPlaceholderOpacity",
      "inputFocusRingWidth",
      "inputFocusRingOffset",
      "inputTransitionDuration",
      "inputTextAlign",
    ],
  },
  {
    id: "cards",
    label: "Cards",
    description: "Shape, border, and shadow of cards and content panels",
    component: CardsModule,
    preview: CardsPreview,
    group: "Components",
    resetKeys: [
      "cardRadius",
      "cardBorderTop",
      "cardBorderRight",
      "cardBorderBottom",
      "cardBorderLeft",
      "cardBorderStyle",
      "cardShadow",
      "cardRotateX",
      "cardRotateY",
      "cardRotateZ",
      "cardHoverRotateX",
      "cardHoverRotateY",
      "cardHoverRotateZ",
      "cardHoverTranslateY",
      "cardHoverScale",
      "cardTransitionDuration",
      "cardCursorTrack",
      "cardCursorTrackRestore",
    ],
  },
  {
    id: "badges",
    label: "Badges",
    description: "Shape and weight of status badges, chips, and tags",
    component: BadgesModule,
    preview: BadgesPreview,
    group: "Components",
    resetKeys: [
      "badgeRadius",
      "badgeBorderTop",
      "badgeBorderRight",
      "badgeBorderBottom",
      "badgeBorderLeft",
      "badgeBorderStyle",
      "badgeFontWeight",
      "badgeFontSize",
      "badgeLetterSpacing",
      "badgeTextTransform",
      "badgePaddingX",
      "badgePaddingY",
      "badgeRotateX",
      "badgeRotateY",
      "badgeRotateZ",
      "badgeHoverRotateX",
      "badgeHoverRotateY",
      "badgeHoverRotateZ",
      "badgeHoverTranslateY",
      "badgeHoverScale",
      "badgeTransitionDuration",
      "badgeCursorTrack",
      "badgeCursorTrackRestore",
    ],
  },
  {
    id: "accordion",
    label: "Accordion",
    description: "Shape, spacing, and typography of collapsible sections",
    component: AccordionModule,
    preview: AccordionPreview,
    group: "Components",
    resetKeys: [
      "accordionRadius",
      "accordionBorderWidth",
      "accordionBorderStyle",
      "accordionSeparatorHeight",
      "accordionTriggerPaddingX",
      "accordionTriggerPaddingY",
      "accordionTriggerFontWeight",
      "accordionTriggerFontSize",
      "accordionContentPaddingX",
      "accordionContentPaddingY",
      "accordionShadow",
    ],
  },
  {
    id: "alerts",
    label: "Alerts",
    description: "Inline alert banners and modal confirmation dialogs",
    component: AlertsModule,
    preview: AlertsPreview,
    group: "Components",
    resetKeys: [
      "alertRadius",
      "alertBorderWidth",
      "alertBorderStyle",
      "alertPaddingX",
      "alertPaddingY",
      "alertTitleFontWeight",
      "alertTitleFontSize",
      "alertDescriptionFontSize",
      "alertIconSize",
      "alertShadow",
      "alertDialogRadius",
      "alertDialogPaddingX",
      "alertDialogPaddingY",
      "alertDialogShadow",
      "alertDialogBackdropBlur",
      "alertDialogBackdropColor",
      "alertDialogBackdropOpacity",
    ],
  },
  {
    id: "autocomplete",
    label: "Autocomplete",
    description: "Dropdown popover and list items for search and combo fields",
    component: AutocompleteModule,
    preview: AutocompletePreview,
    group: "Components",
    resetKeys: [
      "autocompletePopoverRadius",
      "autocompletePopoverBorderTop",
      "autocompletePopoverBorderRight",
      "autocompletePopoverBorderBottom",
      "autocompletePopoverBorderLeft",
      "autocompletePopoverBorderStyle",
      "autocompletePopoverShadow",
      "autocompletePopoverPadding",
      "autocompleteItemPaddingX",
      "autocompleteItemPaddingY",
      "autocompleteItemFontSize",
      "autocompleteItemRadius",
      "autocompleteItemDivider",
      "autocompleteMaxHeight",
    ],
  },
  {
    id: "avatar",
    label: "Avatar",
    description: "Size, shape, border, and group overlap for user avatars",
    component: AvatarModule,
    preview: AvatarPreview,
    group: "Components",
    resetKeys: [
      "avatarRadius",
      "avatarBorderTop",
      "avatarBorderRight",
      "avatarBorderBottom",
      "avatarBorderLeft",
      "avatarBorderStyle",
      "avatarSizeSm",
      "avatarSizeMd",
      "avatarSizeLg",
      "avatarFallbackFontWeight",
      "avatarFallbackFontSize",
      "avatarGroupSpacing",
      "avatarRotateX",
      "avatarRotateY",
      "avatarRotateZ",
      "avatarHoverRotateX",
      "avatarHoverRotateY",
      "avatarHoverRotateZ",
      "avatarHoverTranslateY",
      "avatarHoverScale",
      "avatarTransitionDuration",
    ],
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    description: "Font, spacing, and separator style of navigation trails",
    component: BreadcrumbsModule,
    preview: BreadcrumbsPreview,
    group: "Components",
    resetKeys: [
      "breadcrumbsFontSize",
      "breadcrumbsFontWeight",
      "breadcrumbsActiveFontWeight",
      "breadcrumbsLetterSpacing",
      "breadcrumbsTextTransform",
      "breadcrumbsGap",
      "breadcrumbsItemPaddingX",
      "breadcrumbsItemPaddingY",
      "breadcrumbsItemRadius",
      "breadcrumbsItemBorderWidth",
      "breadcrumbsItemBorderStyle",
      "breadcrumbsSeparatorIcon",
      "breadcrumbsSeparatorSize",
      "breadcrumbsSeparatorOpacity",
      "breadcrumbsUnderline",
    ],
  },
  {
    id: "button-group",
    label: "Button Group",
    description: "Shape, gap, and border of connected button containers",
    component: ButtonGroupModule,
    preview: ButtonGroupPreview,
    group: "Components",
    resetKeys: [
      "buttonGroupGap",
      "buttonGroupBorderTop",
      "buttonGroupBorderRight",
      "buttonGroupBorderBottom",
      "buttonGroupBorderLeft",
      "buttonGroupBorderStyle",
      "buttonGroupShadow",
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    description:
      "Shape, cell sizing, and typography of calendar panels and date pickers",
    component: CalendarModule,
    preview: CalendarPreview,
    group: "Components",
    resetKeys: [
      "calendarRadius",
      "calendarBorderTop",
      "calendarBorderRight",
      "calendarBorderBottom",
      "calendarBorderLeft",
      "calendarBorderStyle",
      "calendarShadow",
      "calendarRotateX",
      "calendarRotateY",
      "calendarRotateZ",
      "calendarHoverRotateX",
      "calendarHoverRotateY",
      "calendarHoverRotateZ",
      "calendarHoverTranslateY",
      "calendarHoverScale",
      "calendarTransitionDuration",
      "calendarCursorTrack",
      "calendarCursorTrackRestore",
    ],
  },
  {
    id: "checkbox",
    label: "Checkbox",
    description:
      "Size, shape, border, indicator, and label of checkbox controls",
    component: CheckboxModule,
    preview: CheckboxPreview,
    group: "Components",
    resetKeys: [
      "checkboxSize",
      "checkboxRadius",
      "checkboxBorderWidth",
      "checkboxBorderStyle",
      "checkboxGap",
      "checkboxLabelFontSize",
      "checkboxLabelFontWeight",
      "checkboxShadow",
      "checkboxCheckedScale",
      "checkboxTransitionDuration",
      "checkboxIndicatorSize",
      "checkboxIndicatorStroke",
    ],
  },
  {
    id: "checkbox-group",
    label: "Checkbox Group",
    description:
      "Spacing, container shape, and label style of grouped checkboxes",
    component: CheckboxGroupModule,
    preview: CheckboxGroupPreview,
    group: "Components",
    resetKeys: [
      "checkboxGroupGap",
      "checkboxGroupRadius",
      "checkboxGroupPaddingX",
      "checkboxGroupPaddingY",
      "checkboxGroupBorderWidth",
      "checkboxGroupBorderStyle",
      "checkboxGroupShadow",
      "checkboxGroupLabelFontSize",
      "checkboxGroupLabelFontWeight",
      "checkboxGroupLabelGap",
    ],
  },
  {
    id: "color-picker",
    label: "Color Picker",
    description: "Popover, color area, sliders, thumbs, and swatch styling",
    component: ColorPickerModule,
    preview: ColorPickerPreview,
    group: "Components",
    resetKeys: [
      "colorPickerPopoverRadius",
      "colorPickerPopoverShadow",
      "colorPickerPopoverPadding",
      "colorPickerPopoverBorderWidth",
      "colorPickerPopoverBorderStyle",
      "colorPickerSwatchRadius",
      "colorPickerSwatchSize",
      "colorPickerSwatchGap",
      "colorPickerSwatchBorderWidth",
      "colorPickerSliderRadius",
      "colorPickerSliderHeight",
      "colorPickerThumbSize",
      "colorPickerThumbBorderWidth",
      "colorPickerAreaRadius",
      "colorPickerTransitionDuration",
    ],
  },
  {
    id: "combo-box",
    label: "Combo Box",
    description: "Popover shape, trigger button, and list item styling",
    component: ComboBoxModule,
    preview: ComboBoxPreview,
    group: "Components",
    resetKeys: [
      "comboBoxPopoverRadius",
      "comboBoxPopoverShadow",
      "comboBoxPopoverPadding",
      "comboBoxPopoverBorderWidth",
      "comboBoxPopoverBorderStyle",
      "comboBoxTriggerRadius",
      "comboBoxTriggerBorderWidth",
      "comboBoxItemPaddingX",
      "comboBoxItemPaddingY",
      "comboBoxItemFontSize",
      "comboBoxItemRadius",
      "comboBoxTransitionDuration",
    ],
  },
  {
    id: "date-picker",
    label: "Date Picker",
    description: "Trigger, popover, and indicator of date picker fields",
    component: DatePickerModule,
    preview: DatePickerPreview,
    group: "Components",
    resetKeys: [
      "datePickerTriggerRadius",
      "datePickerTriggerBorderWidth",
      "datePickerTriggerBorderStyle",
      "datePickerTriggerPaddingX",
      "datePickerTriggerPaddingY",
      "datePickerTriggerShadow",
      "datePickerPopoverRadius",
      "datePickerPopoverShadow",
      "datePickerPopoverPadding",
      "datePickerIndicatorSize",
      "datePickerTransitionDuration",
    ],
  },
  {
    id: "separator",
    label: "Separator",
    description: "Thickness and shape of divider lines",
    component: SeparatorModule,
    preview: SeparatorPreview,
    group: "Components",
    resetKeys: ["separatorThickness", "separatorRadius"],
  },
  {
    id: "skeleton",
    label: "Skeleton",
    description: "Shape and animation speed of loading skeletons",
    component: SkeletonModule,
    preview: SkeletonPreview,
    group: "Components",
    resetKeys: [
      "skeletonRadius",
      "skeletonBaseColor",
      "skeletonAnimationDuration",
    ],
  },
  {
    id: "slider",
    label: "Slider",
    description: "Track, thumb, and animation of range sliders",
    component: SliderModule,
    preview: SliderPreview,
    group: "Components",
    resetKeys: [
      "sliderTrackHeight",
      "sliderTrackRadius",
      "sliderThumbSize",
      "sliderThumbDotSize",
      "sliderThumbRadius",
      "sliderThumbShadow",
      "sliderTransitionDuration",
      "sliderRotateX",
      "sliderRotateY",
      "sliderRotateZ",
      "sliderHoverRotateX",
      "sliderHoverRotateY",
      "sliderHoverRotateZ",
      "sliderHoverTranslateY",
      "sliderHoverScale",
    ],
  },
  {
    id: "spinner",
    label: "Spinner",
    description: "Size and stroke width of loading spinners",
    component: SpinnerModule,
    preview: SpinnerPreview,
    group: "Components",
    resetKeys: [
      "spinnerSizeSm",
      "spinnerSizeMd",
      "spinnerSizeLg",
      "spinnerRotateX",
      "spinnerRotateY",
      "spinnerRotateZ",
    ],
  },
  {
    id: "switch",
    label: "Switch",
    description: "Track, thumb, and label gap of toggle switches",
    component: SwitchModule,
    preview: SwitchPreview,
    group: "Components",
    resetKeys: [
      "switchTrackWidth",
      "switchTrackHeight",
      "switchTrackRadius",
      "switchThumbSize",
      "switchThumbRadius",
      "switchGap",
      "switchTransitionDuration",
    ],
  },
  {
    id: "tabs",
    label: "Tabs",
    description: "Tab list, items, active indicator, and panel padding",
    component: TabsModule,
    preview: TabsPreview,
    group: "Components",
    resetKeys: [
      "tabsListRadius",
      "tabsListPadding",
      "tabsListGap",
      "tabsTabRadius",
      "tabsTabPaddingX",
      "tabsTabPaddingY",
      "tabsTabFontSize",
      "tabsTabFontWeight",
      "tabsPanelPadding",
      "tabsTransitionDuration",
      "tabsRotateX",
      "tabsRotateY",
      "tabsRotateZ",
      "tabsHoverRotateX",
      "tabsHoverRotateY",
      "tabsHoverRotateZ",
      "tabsHoverTranslateY",
      "tabsHoverScale",
    ],
  },
  {
    id: "toast",
    label: "Toast",
    description:
      "Placement, shape, spacing, and typography of toast notifications",
    component: ToastModule,
    preview: ToastPreview,
    group: "Components",
    resetKeys: [
      "toastPlacement",
      "toastRadius",
      "toastBorderWidth",
      "toastBorderStyle",
      "toastPaddingX",
      "toastPaddingY",
      "toastShadow",
      "toastGap",
      "toastMinWidth",
      "toastMaxWidth",
      "toastContentGap",
      "toastTitleFontWeight",
      "toastTitleFontSize",
      "toastDescriptionFontSize",
      "toastDescriptionOpacity",
      "toastIconSize",
      "toastActionRadius",
      "toastActionFontSize",
      "toastActionFontWeight",
      "toastActionPaddingX",
      "toastActionPaddingY",
      "toastCloseSize",
      "toastCloseRadius",
      "toastCloseOpacity",
      "toastCloseHoverOpacity",
    ],
  },
];
