/**
 * Static structural design constants — Vita ERP
 *
 * Use these in TypeScript/JS when you need token values programmatically:
 * - GSAP animations: gsap.to(el, { borderRadius: THEME.radii.lg })
 * - Dynamic z-index logic: style={{ zIndex: THEME.zIndex.modal }}
 * - Inline styles for structural properties (not colors)
 *
 * For COLORS at runtime, read the live CSS variable instead:
 *   getComputedStyle(document.documentElement).getPropertyValue('--vita-accent')
 * Or use the theme store: useThemeStore.getState().tokens.accent
 *
 * For static Tailwind classes, use generated utilities directly:
 *   bg-vita-accent, shadow-vita-md, rounded-vita-lg, z-vita-modal, etc.
 */

export const THEME = {
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
