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

import { ColorsModule } from "./modules/ColorsModule";
import { SpacingModule } from "./modules/SpacingModule";
import { TypographyModule } from "./modules/TypographyModule";

export type ThemeModule = {
  id: string;
  label: string;
  description: string;
  component: ComponentType;
};

export const THEME_EDITOR_MODULES: ThemeModule[] = [
  {
    id: "colors",
    label: "Colors",
    description: "Brand colors, status indicators, and surface tints",
    component: ColorsModule,
  },
  {
    id: "typography",
    label: "Typography",
    description: "Fonts, sizes, line height, and body weight",
    component: TypographyModule,
  },
  {
    id: "spacing",
    label: "Spacing",
    description: "Interface density — scales all padding and gaps",
    component: SpacingModule,
  },
];
