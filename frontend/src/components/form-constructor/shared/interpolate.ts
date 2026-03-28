/**
 * Text Interpolation — replaces ${field_id} references in labels,
 * descriptions, and note content with live field values.
 *
 * For select fields, resolves the raw value to its human-readable
 * option label. For empty/missing values, shows a placeholder.
 *
 * Usage:
 *   interpolateText("You ordered ${quantity} items", values, fields)
 *   // → "You ordered 42 items"
 *
 *   interpolateText("Status: ${status}", values, fields)
 *   // → "Status: Approved"  (resolves select option label)
 */

import type { FieldElement } from "../types";

/**
 * Replace `${field_id}` tokens in text with live field values.
 *
 * @param text       — the string containing `${field_id}` references
 * @param values     — current form values keyed by field ID
 * @param fields     — all field definitions (used to resolve select option labels)
 * @returns          — text with references replaced by values
 */
export function interpolateText(
  text: string,
  values: Record<string, unknown>,
  fields?: FieldElement[],
): string {
  return text.replace(/\$\{([^}]+)\}/g, (_match, fieldId: string) => {
    const rawValue = values[fieldId];

    // No value → show empty
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return "";
    }

    // For select fields, resolve the value to its option label
    if (fields) {
      const fieldDef = fields.find((f) => f.id === fieldId);

      if (fieldDef?.options && fieldDef.options.length > 0) {
        // select_one → single value lookup
        if (typeof rawValue === "string") {
          const opt = fieldDef.options.find((o) => o.value === rawValue);
          return opt ? opt.label : String(rawValue);
        }

        // select_multiple → array of values → join labels
        if (Array.isArray(rawValue)) {
          const labels = rawValue
            .map((v) => {
              const opt = fieldDef.options?.find((o) => o.value === v);
              return opt ? opt.label : String(v);
            })
            .filter(Boolean);
          return labels.join(", ");
        }
      }
    }

    return String(rawValue);
  });
}

/** Check whether a string contains any `${...}` references. */
export function hasInterpolation(text: string): boolean {
  return /\$\{[^}]+\}/.test(text);
}
