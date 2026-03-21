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
import { BadgesModule } from "./modules/BadgesModule";
import { ButtonsModule } from "./modules/ButtonsModule";
import { CardsModule } from "./modules/CardsModule";
import { ColorsModule } from "./modules/ColorsModule";
import { InputsModule } from "./modules/InputsModule";
import { SpacingModule } from "./modules/SpacingModule";
import { TypographyModule } from "./modules/TypographyModule";

export type ThemeModule = {
  id: string;
  label: string;
  description: string;
  component: ComponentType;
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
    group: "Components",
    resetKeys: ["inputRadius", "inputBorderWidth", "inputLabelWeight"],
  },
  {
    id: "cards",
    label: "Cards",
    description: "Shape, border, and shadow of cards and content panels",
    component: CardsModule,
    group: "Components",
    resetKeys: ["cardRadius", "cardBorderWidth", "cardShadow"],
  },
  {
    id: "badges",
    label: "Badges",
    description: "Shape and weight of status badges, chips, and tags",
    component: BadgesModule,
    group: "Components",
    resetKeys: ["badgeRadius", "badgeFontWeight"],
  },
];
