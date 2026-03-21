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
  {
    label: "Lexend",
    value: '"Lexend", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Lexend:wght@400;500;600;700",
    scripts: "Latin — designed for readability",
  },
  {
    label: "Manrope",
    value: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Manrope:wght@400;500;600;700",
    scripts: "Latin, Cyrillic, Greek",
  },
  {
    label: "Urbanist",
    value: '"Urbanist", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Urbanist:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Sora",
    value: '"Sora", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Sora:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Red Hat Display",
    value: '"Red Hat Display", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Red+Hat+Display:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Albert Sans",
    value: '"Albert Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Albert+Sans:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Quicksand",
    value: '"Quicksand", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Quicksand:wght@400;500;600;700",
    scripts: "Latin — geometric rounded",
  },
  {
    label: "Comfortaa",
    value: '"Comfortaa", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Comfortaa:wght@400;500;600;700",
    scripts: "Latin, Cyrillic — rounded",
  },
  {
    label: "Cabin",
    value: '"Cabin", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Cabin:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Rubik",
    value: '"Rubik", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Rubik:wght@400;500;600;700",
    scripts: "Latin, Cyrillic, Hebrew",
  },
  {
    label: "Josefin Sans",
    value: '"Josefin Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Josefin+Sans:wght@400;500;600;700",
    scripts: "Latin — elegant geometric",
  },
  {
    label: "Noto Sans",
    value: '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Noto+Sans:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic — widest coverage",
  },
  {
    label: "IBM Plex Sans",
    value: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "IBM+Plex+Sans:wght@400;500;600;700",
    scripts: "Latin, Cyrillic, Greek",
  },
  {
    label: "Mukta",
    value: '"Mukta", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Mukta:wght@400;500;600;700",
    scripts: "Latin, Devanagari",
  },
  {
    label: "Exo 2",
    value: '"Exo 2", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Exo+2:wght@400;500;600;700",
    scripts: "Latin, Cyrillic — tech/futuristic",
  },
  {
    label: "Overpass",
    value: '"Overpass", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Overpass:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Assistant",
    value: '"Assistant", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Assistant:wght@400;500;600;700",
    scripts: "Latin, Hebrew",
  },
  {
    label: "Signika",
    value: '"Signika", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Signika:wght@400;500;600;700",
    scripts: "Latin — soft signage-style",
  },
  {
    label: "Questrial",
    value: '"Questrial", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Questrial:wght@400",
    scripts: "Latin",
  },
  {
    label: "Catamaran",
    value: '"Catamaran", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Catamaran:wght@400;500;600;700",
    scripts: "Latin, Tamil",
  },
  {
    label: "Archivo",
    value: '"Archivo", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Archivo:wght@400;500;600;700",
    scripts: "Latin — grotesque",
  },
  {
    label: "Nunito Sans",
    value: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Nunito+Sans:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Libre Franklin",
    value: '"Libre Franklin", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Libre+Franklin:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Atkinson Hyperlegible",
    value: '"Atkinson Hyperlegible Next", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Atkinson+Hyperlegible+Next:wght@400;500;600;700",
    scripts: "Latin — optimized for low vision",
  },
  {
    label: "Jost",
    value: '"Jost", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Jost:wght@400;500;600;700",
    scripts: "Latin, Cyrillic — Futura-inspired",
  },
  {
    label: "Geologica",
    value: '"Geologica", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Geologica:wght@400;500;600;700",
    scripts: "Latin, Cyrillic, Greek",
  },
  {
    label: "Wix Madefor Display",
    value: '"Wix Madefor Display", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Wix+Madefor+Display:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Schibsted Grotesk",
    value: '"Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Schibsted+Grotesk:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Onest",
    value: '"Onest", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Onest:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Instrument Sans",
    value: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Instrument+Sans:wght@400;500;600;700",
    scripts: "Latin",
  },
];

/** Serif options — for headings and body */
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
  {
    label: "Libre Baskerville",
    value: '"Libre Baskerville", ui-serif, Georgia, serif',
    googleFamily: "Libre+Baskerville:wght@400;700",
    scripts: "Latin",
  },
  {
    label: "Bitter",
    value: '"Bitter", ui-serif, Georgia, serif',
    googleFamily: "Bitter:wght@400;500;600;700",
    scripts: "Latin, Cyrillic",
  },
  {
    label: "Crimson Text",
    value: '"Crimson Text", ui-serif, Georgia, serif',
    googleFamily: "Crimson+Text:wght@400;600;700",
    scripts: "Latin",
  },
  {
    label: "Source Serif 4",
    value: '"Source Serif 4", ui-serif, Georgia, serif',
    googleFamily: "Source+Serif+4:wght@400;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
];

/** Slab serif options — bold structural feel */
export const SLAB_FONT_OPTIONS: FontOption[] = [
  {
    label: "Roboto Slab",
    value: '"Roboto Slab", ui-serif, Georgia, serif',
    googleFamily: "Roboto+Slab:wght@400;500;600;700",
    scripts: "Latin, Greek, Cyrillic",
  },
  {
    label: "Zilla Slab",
    value: '"Zilla Slab", ui-serif, Georgia, serif',
    googleFamily: "Zilla+Slab:wght@400;500;600;700",
    scripts: "Latin",
  },
  {
    label: "Arvo",
    value: '"Arvo", ui-serif, Georgia, serif',
    googleFamily: "Arvo:wght@400;700",
    scripts: "Latin",
  },
  {
    label: "Crete Round",
    value: '"Crete Round", ui-serif, Georgia, serif',
    googleFamily: "Crete+Round:wght@400",
    scripts: "Latin",
  },
  {
    label: "Alfa Slab One",
    value: '"Alfa Slab One", ui-serif, Georgia, serif',
    googleFamily: "Alfa+Slab+One:wght@400",
    scripts: "Latin — heavy display slab",
  },
];

/** Display fonts — bold, expressive, for headings only */
export const DISPLAY_FONT_OPTIONS: FontOption[] = [
  {
    label: "Bebas Neue",
    value: '"Bebas Neue", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Bebas+Neue:wght@400",
    scripts: "Latin — condensed all-caps display",
  },
  {
    label: "Anton",
    value: '"Anton", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Anton:wght@400",
    scripts: "Latin — impact-style display",
  },
  {
    label: "Oswald",
    value: '"Oswald", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Oswald:wght@400;500;600;700",
    scripts: "Latin, Cyrillic — condensed display",
  },
  {
    label: "Righteous",
    value: '"Righteous", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Righteous:wght@400",
    scripts: "Latin — rounded retro display",
  },
  {
    label: "Archivo Black",
    value: '"Archivo Black", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Archivo+Black:wght@400",
    scripts: "Latin — heavy grotesque display",
  },
  {
    label: "Bungee",
    value: '"Bungee", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Bungee:wght@400",
    scripts: "Latin — chromatic display",
  },
  {
    label: "Fredoka",
    value: '"Fredoka", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Fredoka:wght@400;500;600;700",
    scripts: "Latin — friendly rounded display",
  },
  {
    label: "Lilita One",
    value: '"Lilita One", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Lilita+One:wght@400",
    scripts: "Latin — bold playful display",
  },
  {
    label: "Abril Fatface",
    value: '"Abril Fatface", ui-serif, Georgia, serif',
    googleFamily: "Abril+Fatface:wght@400",
    scripts: "Latin — elegant display serif",
  },
  {
    label: "Lobster",
    value: '"Lobster", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Lobster:wght@400",
    scripts: "Latin, Cyrillic — retro script display",
  },
  {
    label: "Secular One",
    value: '"Secular One", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Secular+One:wght@400",
    scripts: "Latin, Hebrew — geometric display",
  },
  {
    label: "Protest Guerrilla",
    value: '"Protest Guerrilla", ui-sans-serif, system-ui, sans-serif',
    googleFamily: "Protest+Guerrilla:wght@400",
    scripts: "Latin — graffiti-inspired display",
  },
];

/** Handwriting & script fonts — personality-driven, for headings only */
export const HANDWRITING_FONT_OPTIONS: FontOption[] = [
  {
    label: "Caveat",
    value: '"Caveat", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Caveat:wght@400;500;600;700",
    scripts: "Latin, Cyrillic — casual handwriting",
  },
  {
    label: "Dancing Script",
    value: '"Dancing Script", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Dancing+Script:wght@400;500;600;700",
    scripts: "Latin — elegant cursive",
  },
  {
    label: "Pacifico",
    value: '"Pacifico", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Pacifico:wght@400",
    scripts: "Latin, Cyrillic — retro script",
  },
  {
    label: "Satisfy",
    value: '"Satisfy", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Satisfy:wght@400",
    scripts: "Latin — flowing script",
  },
  {
    label: "Kalam",
    value: '"Kalam", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Kalam:wght@400;700",
    scripts: "Latin, Devanagari — natural handwriting",
  },
  {
    label: "Indie Flower",
    value: '"Indie Flower", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Indie+Flower:wght@400",
    scripts: "Latin — casual hand-drawn",
  },
  {
    label: "Patrick Hand",
    value: '"Patrick Hand", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Patrick+Hand:wght@400",
    scripts: "Latin — natural handwriting",
  },
  {
    label: "Permanent Marker",
    value: '"Permanent Marker", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Permanent+Marker:wght@400",
    scripts: "Latin — marker style",
  },
  {
    label: "Shadows Into Light",
    value: '"Shadows Into Light", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Shadows+Into+Light:wght@400",
    scripts: "Latin — light handwriting",
  },
  {
    label: "Architects Daughter",
    value: '"Architects Daughter", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Architects+Daughter:wght@400",
    scripts: "Latin — architect's handwriting",
  },
  {
    label: "Sacramento",
    value: '"Sacramento", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Sacramento:wght@400",
    scripts: "Latin — elegant calligraphy",
  },
  {
    label: "Great Vibes",
    value: '"Great Vibes", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Great+Vibes:wght@400",
    scripts: "Latin — formal calligraphy",
  },
  {
    label: "Amatic SC",
    value: '"Amatic SC", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Amatic+SC:wght@400;700",
    scripts: "Latin, Cyrillic, Hebrew — condensed handwriting",
  },
  {
    label: "Yellowtail",
    value: '"Yellowtail", cursive, ui-sans-serif, sans-serif',
    googleFamily: "Yellowtail:wght@400",
    scripts: "Latin — vintage script",
  },
];

/** All heading options = sans + serif + slab + display + handwriting */
export const HEADING_FONT_OPTIONS: FontOption[] = [
  ...SANS_FONT_OPTIONS,
  ...SERIF_FONT_OPTIONS,
  ...SLAB_FONT_OPTIONS,
  ...DISPLAY_FONT_OPTIONS,
  ...HANDWRITING_FONT_OPTIONS,
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
  {
    label: "Red Hat Mono",
    value: '"Red Hat Mono", ui-monospace, monospace',
    googleFamily: "Red+Hat+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Ubuntu Mono",
    value: '"Ubuntu Mono", ui-monospace, monospace',
    googleFamily: "Ubuntu+Mono:wght@400;700",
    scripts: "Latin, Cyrillic, Greek",
  },
  {
    label: "Overpass Mono",
    value: '"Overpass Mono", ui-monospace, monospace',
    googleFamily: "Overpass+Mono:wght@400;500",
    scripts: "Latin",
  },
  {
    label: "Victor Mono",
    value: '"Victor Mono", ui-monospace, monospace',
    googleFamily: "Victor+Mono:wght@400;500",
    scripts: "Latin — cursive italic variant",
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
