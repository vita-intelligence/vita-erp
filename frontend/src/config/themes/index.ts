/**
 * @/config/themes — public API for the Vita ERP theme system.
 *
 * All consumers import from this barrel. Internal modules are not
 * part of the public surface and may change without notice.
 */

export { applyTokens, CSS_VAR_MAP } from "./css-vars";
export { BRAND_COLOR_META, SURFACE_COLOR_META } from "./meta";
export { corporateTheme } from "./presets/corporate";
export { darkTheme } from "./presets/dark";
export { forestTheme } from "./presets/forest";
export { lightTheme } from "./presets/light";
export { midnightTheme } from "./presets/midnight";
export { minimalTheme } from "./presets/minimal";
export { oceanTheme } from "./presets/ocean";
export { sunsetTheme } from "./presets/sunset";
export type { ThemeTokens } from "./types";
export { deriveNeutralScale, deriveVariants, parseOklchTint } from "./utils";

import { corporateTheme } from "./presets/corporate";
import { darkTheme } from "./presets/dark";
import { forestTheme } from "./presets/forest";
import { lightTheme } from "./presets/light";
import { midnightTheme } from "./presets/midnight";
import { minimalTheme } from "./presets/minimal";
import { oceanTheme } from "./presets/ocean";
import { sunsetTheme } from "./presets/sunset";

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  midnight: midnightTheme,
  minimal: minimalTheme,
  corporate: corporateTheme,
} as const;

export type ThemeName = keyof typeof themes;
