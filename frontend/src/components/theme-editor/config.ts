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
import { ButtonsModule } from "./modules/buttons";
import { Preview as ButtonsPreview } from "./modules/buttons/Preview";
import { CardsModule } from "./modules/cards";
import { Preview as CardsPreview } from "./modules/cards/Preview";
import { ColorsModule } from "./modules/colors";
import { InputsModule } from "./modules/inputs";
import { Preview as InputsPreview } from "./modules/inputs/Preview";
import { SpacingModule } from "./modules/spacing";
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
    description:
      "Size, shape, border, ring, and group overlap for user avatars",
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
      "avatarRingWidth",
      "avatarRingOffset",
      "avatarShadow",
      "avatarGroupSpacing",
    ],
  },
];
