/**
 * Color utilities for the theme system.
 */

import type { ThemeTokens } from "./types";

// ── Brand variant derivation ─────────────────────────────────────────────────

/**
 * Auto-derive light and dark variants from a base color using CSS color-mix().
 * Supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+).
 *
 * When a user picks e.g. primary = "#3b82f6", call deriveVariants() to get
 * primaryLight and primaryDark without requiring a color library.
 */
export function deriveVariants(base: string): { light: string; dark: string } {
  return {
    light: `color-mix(in oklch, ${base} 65%, white)`,
    dark: `color-mix(in oklch, ${base} 75%, black)`,
  };
}

// ── Neutral scale derivation ─────────────────────────────────────────────────

/**
 * Ordered token keys for the 11-stop neutral scale.
 */
const NEUTRAL_KEYS: (keyof ThemeTokens)[] = [
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
];

/**
 * Lightness stops for the neutral scale.
 * In dark mode the array is reversed so neutral-50 = darkest, neutral-950 = lightest.
 */
const LIGHTNESS_STOPS = [
  0.98, 0.95, 0.9, 0.82, 0.7, 0.56, 0.44, 0.32, 0.22, 0.14, 0.09,
];

/**
 * Derive the full neutral scale, surfaces, and body text colors from a
 * hue + chroma tint. This is the "connected color" engine — one adjustment
 * ripples through 16 tokens.
 *
 * @param hue    Oklch hue angle (0–360). 0 = neutral gray when chroma is 0.
 * @param chroma Oklch chroma (0–0.04). 0 = pure achromatic gray.
 * @param isDark Whether the current mode is dark (inverts lightness order).
 */
export function deriveNeutralScale(
  hue: number,
  chroma: number,
  isDark: boolean,
): Partial<ThemeTokens> {
  const stops = isDark ? [...LIGHTNESS_STOPS].reverse() : LIGHTNESS_STOPS;

  const neutrals: Partial<ThemeTokens> = {};
  for (let i = 0; i < NEUTRAL_KEYS.length; i++) {
    neutrals[NEUTRAL_KEYS[i]] = `oklch(${stops[i]} ${chroma} ${hue})`;
  }

  // Surfaces — derived from the extreme ends of the scale
  const bgL = isDark ? 0.09 : 1;
  const surfL = isDark ? 0.14 : 1;
  // Surfaces use reduced chroma to keep them subtle
  const surfChroma = chroma * 0.5;

  // Body text — derived from the scale with minimal chroma for readability
  const textChroma = chroma * 0.3;
  const textPrimaryL = isDark ? 0.96 : 0.09;
  const textSecondaryL = isDark ? 0.72 : 0.38;
  const textMutedL = isDark ? 0.54 : 0.56;

  return {
    ...neutrals,
    background: `oklch(${bgL} ${surfChroma} ${hue})`,
    surface: `oklch(${surfL} ${surfChroma} ${hue})`,
    textPrimary: `oklch(${textPrimaryL} ${textChroma} ${hue})`,
    textSecondary: `oklch(${textSecondaryL} ${textChroma} ${hue})`,
    textMuted: `oklch(${textMutedL} ${textChroma} ${hue})`,
  };
}

/**
 * Extract hue and chroma from an oklch() CSS string.
 * Returns { hue: 0, chroma: 0 } if the value can't be parsed.
 */
export function parseOklchTint(value: string): { hue: number; chroma: number } {
  const match = value.match(/oklch\(\s*[\d.]+\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return { hue: 0, chroma: 0 };
  return { hue: Number(match[2]), chroma: Number(match[1]) };
}
