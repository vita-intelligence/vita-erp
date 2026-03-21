/**
 * @/config/themes — public API for the Vita ERP theme system.
 *
 * All consumers import from this barrel. Internal modules are not
 * part of the public surface and may change without notice.
 */

export { applyTokens, CSS_VAR_MAP } from "./css-vars";
export { BRAND_COLOR_META, SURFACE_COLOR_META } from "./meta";
export { darkTheme } from "./presets/dark";
export { lightTheme } from "./presets/light";
export type { ThemeTokens } from "./types";
export { deriveNeutralScale, deriveVariants, parseOklchTint } from "./utils";

import { darkTheme } from "./presets/dark";
import { lightTheme } from "./presets/light";

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;
