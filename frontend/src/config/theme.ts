/**
 * Design token constants — TypeScript mirror of src/styles/tokens.css
 *
 * Use these when you need token values in JavaScript/TypeScript:
 * - GSAP animations (gsap.to(el, { backgroundColor: THEME.colors.accent }))
 * - Inline styles
 * - Dynamic className logic
 *
 * For static Tailwind classes, use the generated utilities directly:
 * bg-vita-accent, text-vita-success, shadow-vita-md, etc.
 *
 * Keep in sync with tokens.css.
 */

export const THEME = {
  colors: {
    accent: "oklch(0.58 0.22 265)",
    accentLight: "oklch(0.72 0.18 265)",
    accentDark: "oklch(0.44 0.24 265)",

    success: "oklch(0.64 0.16 155)",
    successLight: "oklch(0.78 0.12 155)",
    successDark: "oklch(0.50 0.18 155)",

    warning: "oklch(0.74 0.18 65)",
    warningLight: "oklch(0.86 0.13 65)",
    warningDark: "oklch(0.60 0.20 65)",

    danger: "oklch(0.62 0.22 28)",
    dangerLight: "oklch(0.76 0.16 28)",
    dangerDark: "oklch(0.48 0.24 28)",

    info: "oklch(0.64 0.14 220)",
    infoLight: "oklch(0.78 0.10 220)",
    infoDark: "oklch(0.50 0.16 220)",

    neutral: {
      50: "oklch(0.98 0 0)",
      100: "oklch(0.95 0 0)",
      200: "oklch(0.90 0 0)",
      300: "oklch(0.82 0 0)",
      400: "oklch(0.70 0 0)",
      500: "oklch(0.56 0 0)",
      600: "oklch(0.44 0 0)",
      700: "oklch(0.32 0 0)",
      800: "oklch(0.22 0 0)",
      900: "oklch(0.14 0 0)",
      950: "oklch(0.09 0 0)",
    },
  },

  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "Cascadia Code", monospace',
  },

  radii: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  shadows: {
    xs: "0 1px 2px 0 oklch(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 oklch(0 0 0 / 0.10), 0 1px 2px -1px oklch(0 0 0 / 0.10)",
    md: "0 4px 6px -1px oklch(0 0 0 / 0.10), 0 2px 4px -2px oklch(0 0 0 / 0.10)",
    lg: "0 10px 15px -3px oklch(0 0 0 / 0.10), 0 4px 6px -4px oklch(0 0 0 / 0.10)",
    xl: "0 20px 25px -5px oklch(0 0 0 / 0.10), 0 8px 10px -6px oklch(0 0 0 / 0.10)",
  },

  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    toast: 1300,
    tooltip: 1400,
  },

  duration: {
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
    slower: "600ms",
  },
} as const;

export type ThemeColor = keyof Omit<typeof THEME.colors, "neutral">;
