"use client";

/**
 * TranslationsTab — per-locale label and description translations.
 *
 * Allows form creators to define translated text for each supported locale.
 * The base label/description (in the General tab) serves as the default.
 */

import { Globe, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";
import { I18N } from "@/config";

import type { ConfigTabProps, FieldTranslation } from "../../types";

/** Human-readable locale names */
const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  zh: "Chinese",
  es: "Spanish",
  hi: "Hindi",
  ar: "Arabic",
  fr: "French",
  pt: "Portuguese",
  ru: "Russian",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  it: "Italian",
  tr: "Turkish",
  id: "Indonesian",
};

export function TranslationsTab({ field, onUpdate }: ConfigTabProps) {
  const t = useTranslations("formConstructor");
  const translations = field.translations ?? {};
  const translatedLocales = Object.keys(translations);

  // Locales that don't have a translation yet (excluding default "en")
  const availableLocales = I18N.locales.filter(
    (loc) => loc !== I18N.defaultLocale && !translatedLocales.includes(loc),
  );

  const [addLocale, setAddLocale] = useState(availableLocales[0] ?? "");

  function updateTranslation(locale: string, patch: Partial<FieldTranslation>) {
    const existing = translations[locale] ?? {};
    onUpdate({
      translations: {
        ...translations,
        [locale]: { ...existing, ...patch },
      },
    });
  }

  function removeTranslation(locale: string) {
    const next = { ...translations };
    delete next[locale];
    onUpdate({
      translations: Object.keys(next).length > 0 ? next : undefined,
    });
  }

  function addTranslation() {
    if (!addLocale) return;
    updateTranslation(addLocale, { label: "", description: "" });
    // Move to next available locale
    const nextAvailable = availableLocales.filter((l) => l !== addLocale);
    setAddLocale(nextAvailable[0] ?? "");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Description */}
      <div className="flex items-center gap-2">
        <Globe
          size={14}
          style={{ color: "var(--vita-primary)", flexShrink: 0 }}
        />
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t("config.translations.description")}
        </p>
      </div>

      {/* Base (default) language — read-only reference */}
      <div
        className="flex flex-col gap-2 rounded-vita-md p-3"
        style={{
          border: "1px solid var(--vita-neutral-200)",
          background: "var(--vita-neutral-50)",
        }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {LOCALE_NAMES[I18N.defaultLocale]} ({t("config.translations.default")}
          )
        </span>
        <p className="text-xs" style={{ color: "var(--vita-text-secondary)" }}>
          {field.label || "—"}
        </p>
        {field.description && (
          <p
            className="text-[11px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {field.description}
          </p>
        )}
      </div>

      {/* Translation entries */}
      {translatedLocales.map((locale) => {
        const entry = translations[locale] ?? {};
        return (
          <div
            key={locale}
            className="flex flex-col gap-2 rounded-vita-md p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {LOCALE_NAMES[locale] ?? locale} ({locale})
              </span>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px]"
                style={{ color: "var(--vita-error)" }}
                onClick={() => removeTranslation(locale)}
              >
                <Trash2 size={10} />
                {t("config.translations.remove")}
              </button>
            </div>

            <TextField>
              <Label>{t("config.general.label")}</Label>
              <Input
                value={entry.label ?? ""}
                onChange={(e) =>
                  updateTranslation(locale, {
                    label: e.target.value || undefined,
                  })
                }
                placeholder={field.label}
              />
            </TextField>

            <TextField>
              <Label>{t("config.general.description")}</Label>
              <Input
                value={entry.description ?? ""}
                onChange={(e) =>
                  updateTranslation(locale, {
                    description: e.target.value || undefined,
                  })
                }
                placeholder={field.description ?? ""}
              />
            </TextField>
          </div>
        );
      })}

      {/* Add translation */}
      {availableLocales.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="rounded-vita-md border px-2 py-1.5 text-xs"
            style={{
              borderColor: "var(--vita-neutral-200)",
              background: "var(--vita-surface)",
              color: "var(--vita-text-primary)",
            }}
            value={addLocale}
            onChange={(e) => setAddLocale(e.target.value)}
          >
            {availableLocales.map((loc) => (
              <option key={loc} value={loc}>
                {LOCALE_NAMES[loc] ?? loc} ({loc})
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onPress={addTranslation}>
            <Plus size={12} />
            {t("config.translations.add")}
          </Button>
        </div>
      )}

      {translatedLocales.length === 0 && availableLocales.length > 0 && (
        <p
          className="py-2 text-center text-xs"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {t("config.translations.empty")}
        </p>
      )}
    </div>
  );
}
