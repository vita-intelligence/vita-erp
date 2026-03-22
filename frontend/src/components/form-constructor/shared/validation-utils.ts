/**
 * Validation Utilities — builds zod schemas from field definitions
 * and evaluates regex rules with hard/soft mode distinction.
 */

import { z } from "zod";

import type { FormElement, RegexRule } from "../types";
import { collectFields } from "./schema-utils";

// ── Regex Validation ─────────────────────────────────────────────────────────

export type RegexResult = {
  /** Whether the value passes the regex test */
  valid: boolean;
  /** Error message (hard mode) or warning message (soft mode) */
  message?: string;
  /** Whether this is a blocking error or just a warning */
  isError: boolean;
};

/** Test a value against a field's regex rule. */
export function validateRegex(value: string, rule: RegexRule): RegexResult {
  try {
    const re = new RegExp(rule.pattern);
    const valid = re.test(value);
    if (valid) return { valid: true, isError: false };
    return {
      valid: false,
      message: rule.message,
      isError: rule.mode === "hard",
    };
  } catch {
    // Invalid regex pattern — treat as passing to avoid blocking
    return { valid: true, isError: false };
  }
}

// ── Zod Schema Builder ───────────────────────────────────────────────────────

/**
 * Build a zod validation schema from form elements.
 *
 * Each FieldElement produces a zod field:
 * - Required fields use z.string().min(1)
 * - Hard regex adds z.regex()
 * - Number types use z.coerce.number()
 * - Non-input fields (note, calculate) are excluded
 */
export function buildZodSchema(
  elements: FormElement[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  const fields = collectFields(elements);

  for (const field of fields) {
    if (field.hidden) continue;

    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "integer":
        schema = field.required
          ? z.coerce.number().int({ message: "Required" })
          : z.coerce.number().int().optional();
        break;

      case "decimal":
        schema = field.required
          ? z.coerce.number({ message: "Required" })
          : z.coerce.number().optional();
        break;

      case "select_multiple":
        schema = field.required
          ? z.array(z.string()).min(1, "Required")
          : z.array(z.string()).optional();
        break;

      case "note":
      case "calculate":
        // Non-input fields don't produce form values
        continue;

      default: {
        // String-based fields (text, email, phone, date, time, select_one, etc.)
        let s = z.string();
        if (field.required) s = s.min(1, "Required");

        // Hard regex validation
        if (field.regex?.mode === "hard" && field.regex.pattern) {
          try {
            s = s.regex(new RegExp(field.regex.pattern), field.regex.message);
          } catch {
            // Invalid regex — skip
          }
        }

        schema = field.required ? s : s.optional();
        break;
      }
    }

    shape[field.id] = schema;
  }

  return z.object(shape);
}
