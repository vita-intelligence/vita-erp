export const I18N = {
  defaultLocale: "en",
  locales: [
    "en",
    "zh",
    "es",
    "hi",
    "ar",
    "fr",
    "pt",
    "ru",
    "de",
    "ja",
    "ko",
    "it",
    "tr",
    "id",
  ],
  namespaces: ["common", "auth", "themeEditor"],
} as const;

export type Locale = (typeof I18N.locales)[number];
export type Namespace = (typeof I18N.namespaces)[number];
