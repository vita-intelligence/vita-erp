/**
 * Font options — Vita ERP theme constructor
 *
 * MULTILINGUAL NOTE:
 * No single web font covers all 14 supported languages. The approach used here
 * (and by every major SaaS product) is:
 *
 *   - User picks a font for the Latin-script UI
 *   - Arabic, Hindi, Chinese, Japanese, Korean text automatically falls through
 *     to the user's system font via the fallback stack in each font-family value
 *
 * RTL layout (Arabic) is handled separately by next-intl — this file only
 * controls the visual font, not the text direction.
 *
 * Script coverage per language:
 *   Latin     → en, es, fr, pt, de, it, id, tr  (covered by all options below)
 *   Cyrillic  → ru                               (covered by options marked ✓ Cyrillic)
 *   Arabic    → ar                               (system font fallback)
 *   Devanagari→ hi                               (system font fallback)
 *   CJK       → zh, ja, ko                       (system font fallback)
 */

export type FontOption = {
  label: string;
  /** CSS font-family string — injected directly into the CSS variable */
  value: string;
  /**
   * Google Fonts family query string for runtime loading.
   * null = system font, no loading needed.
   * Format: "Family+Name:wght@400;500;600;700"
   */
  googleFamily: string | null;
  /** Script coverage shown to users */
  scripts: string;
};

/** Sans-serif options — used for both heading and body selectors */
export const SANS_FONT_OPTIONS: FontOption[] = [
  {
    label: "System Default",
    value:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    googleFamily: null,
    scripts: "All scripts — uses your device font",
  },
  {
    label: "Inter",
    value: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Inter:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Roboto",
    value: '"Roboto", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Roboto:wght@400;500;700",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Open Sans",
    value: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Open+Sans:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Lato",
    value: '"Lato", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Lato:wght@400;700",
    scripts: "Latin, Extended Latin",
  },
  {
    label: "Montserrat",
    value: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Montserrat:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Poppins",
    value: '"Poppins", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Poppins:wght@400;500;600;700",
    scripts: "Latin, Devanagari",
  },
  {
    label: "DM Sans",
    value: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "DM+Sans:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Nunito",
    value: '"Nunito", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Nunito:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Source Sans 3",
    value: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Source+Sans+3:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Plus Jakarta Sans",
    value: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Plus+Jakarta+Sans:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Geist",
    value: '"Geist", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Geist:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Space Grotesk",
    value: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Space+Grotesk:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Figtree",
    value: '"Figtree", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Figtree:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Outfit",
    value: '"Outfit", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Outfit:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Work Sans",
    value: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Work+Sans:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Raleway",
    value: '"Raleway", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Raleway:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Barlow",
    value: '"Barlow", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Barlow:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Karla",
    value: '"Karla", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Karla:wght@400;500;600;700",
    scripts: "Latin",
  },
];

/** Serif options — mostly for headings */
export const SERIF_FONT_OPTIONS: FontOption[] = [
  {
    label: "Playfair Display",
    value: '"Playfair Display", ui-serif, Georgia, serif',
    googleFamily: "Playfair+Display:wght@400;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Merriweather",
    value: '"Merriweather", ui-serif, Georgia, serif',
    googleFamily: "Merriweather:wght@400;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Lora",
    value: '"Lora", ui-serif, Georgia, serif',
    googleFamily: "Lora:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Georgia (system)",
    value: "Georgia, ui-serif, serif",
    googleFamily: null,
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "DM Serif Display",
    value: '"DM Serif Display", ui-serif, Georgia, serif',
    googleFamily: "DM+Serif+Display:wght@400",
    scripts: "Latin",
  },
  {
    label: "Cormorant Garamond",
    value: '"Cormorant Garamond", ui-serif, Georgia, serif',
    googleFamily: "Cormorant+Garamond:wght@400;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "EB Garamond",
    value: '"EB Garamond", ui-serif, Georgia, serif',
    googleFamily: "EB+Garamond:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
];

/** All heading options = sans + serif combined */
export const HEADING_FONT_OPTIONS: FontOption[] = [
  ...SANS_FONT_OPTIONS,
  ...SERIF_FONT_OPTIONS,
];

/** Monospace options — for numbers, IDs, codes in tables */
export const MONO_FONT_OPTIONS: FontOption[] = [
  {
    label: "System Mono",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    googleFamily: null,
    scripts: "All scripts",
  },
  {
    label: "JetBrains Mono",
    value: '"JetBrains Mono", ui-monospace, monospace',
    googleFamily: "JetBrains+Mono:wght@400;500",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Fira Code",
    value: '"Fira Code", ui-monospace, monospace',
    googleFamily: "Fira+Code:wght@400;500",
    scripts: "Latin, Cyrillic, Greek",
  },
  {
    label: "Source Code Pro",
    value: '"Source Code Pro", ui-monospace, monospace',
    googleFamily: "Source+Code+Pro:wght@400;500",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", ui-monospace, monospace',
    googleFamily: "IBM+Plex+Mono:wght@400;500",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Roboto Mono",
    value: '"Roboto Mono", ui-monospace, monospace',
    googleFamily: "Roboto+Mono:wght@400;500",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Space Mono",
    value: '"Space Mono", ui-monospace, monospace',
    googleFamily: "Space+Mono:wght@400;700",
    scripts: "Latin",
  },
  {
    label: "Inconsolata",
    value: '"Inconsolata", ui-monospace, monospace',
    googleFamily: "Inconsolata:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Courier Prime",
    value: '"Courier Prime", ui-monospace, monospace',
    googleFamily: "Courier+Prime:wght@400;700",
    scripts: "Latin",
  },
  {
    label: "DM Mono",
    value: '"DM Mono", ui-monospace, monospace',
    googleFamily: "DM+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Geist Mono",
    value: '"Geist Mono", ui-monospace, monospace',
    googleFamily: "Geist+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Martian Mono",
    value: '"Martian Mono", ui-monospace, monospace',
    googleFamily: "Martian+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Azeret Mono",
    value: '"Azeret Mono", ui-monospace, monospace',
    googleFamily: "Azeret+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Noto Sans Mono",
    value: '"Noto Sans Mono", ui-monospace, monospace',
    googleFamily: "Noto+Sans+Mono:wght@400;500",
    scripts: "Latin, Greek, Cyrillic",
  },
];

/** Font size presets — scales the entire rem system via html { font-size } */
export const FONT_SIZE_OPTIONS = [
  { label: "Compact", value: "13px", description: "Fits more on screen" },
  { label: "Default", value: "15px", description: "Standard size" },
  { label: "Large", value: "17px", description: "Easier to read" },
] as const;

export type FontSizeValue = (typeof FONT_SIZE_OPTIONS)[number]["value"];

/**
 * Inject a Google Fonts stylesheet at runtime.
 * Safe to call multiple times — skips if already loaded.
 */
export function loadGoogleFont(googleFamily: string): void {
  if (typeof window === "undefined") return;
  const id = `gfont-${googleFamily.split(":")[0].toLowerCase().replace(/\+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`;
  document.head.appendChild(link);
}
