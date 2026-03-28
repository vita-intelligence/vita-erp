/**
 * Field-level i18n — resolves per-field translations based on locale.
 *
 * Falls back to the base label/description when no translation exists.
 */

import type { FieldTranslation } from "../types";

/**
 * Get the translated label and description for a field or group.
 * Returns the translation for the given locale, falling back to base values.
 */
export function resolveFieldText(
  element: {
    label: string;
    description?: string;
    translations?: Record<string, FieldTranslation>;
  },
  locale: string,
): { label: string; description?: string } {
  const t = element.translations?.[locale];
  return {
    label: t?.label || element.label,
    description: t?.description || element.description,
  };
}
