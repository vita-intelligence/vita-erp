/**
 * Validation Utilities — builds zod schemas from field definitions
 * and evaluates regex rules with hard/soft mode distinction.
 */

import { z } from "zod";

import type { FieldElement, FormElement, RegexRule } from "../types";
import { evaluateExpression } from "./expression-eval";

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

// ── Custom Constraint Evaluation ────────────────────────────────────────────

/**
 * Evaluate a custom constraint expression against a field's value.
 * The special token {.} represents the current field's value.
 * Returns { valid, message, isError } like regex validation.
 */
export function evaluateConstraint(
  fieldValue: unknown,
  expression: string,
  allValues: Record<string, unknown>,
): number {
  // Inject {.} as a virtual field so the expression evaluator
  // handles date/number conversion uniformly via toNumeric()
  const valuesWithSelf = { ...allValues, ".": fieldValue };
  return evaluateExpression(expression, valuesWithSelf);
}

// ── Zod Schema Builder ───────────────────────────────────────────────────────

const emptyToUndefined = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

/**
 * Build a zod field schema for a single FieldElement.
 * Returns undefined for non-input fields (note, calculate).
 */
function buildFieldSchema(field: FieldElement): z.ZodTypeAny | undefined {
  if (field.hidden) return undefined;
  const c = field.constraints;

  switch (field.type) {
    case "integer": {
      let num = z.coerce.number({ message: "Required" }).int();
      if (c?.min !== undefined) num = num.min(c.min, `Min: ${c.min}`);
      if (c?.max !== undefined) num = num.max(c.max, `Max: ${c.max}`);
      return field.required
        ? z.preprocess(emptyToUndefined, num)
        : z.preprocess(emptyToUndefined, num.optional());
    }

    case "decimal": {
      let num = z.coerce.number({ message: "Required" });
      if (c?.min !== undefined) num = num.min(c.min, `Min: ${c.min}`);
      if (c?.max !== undefined) num = num.max(c.max, `Max: ${c.max}`);
      return field.required
        ? z.preprocess(emptyToUndefined, num)
        : z.preprocess(emptyToUndefined, num.optional());
    }

    case "select_multiple":
      return field.required
        ? z.array(z.string()).min(1, "Required")
        : z.array(z.string()).optional();

    case "note":
    case "calculate":
      return undefined;

    default: {
      // String-based fields (text, date, time, select_one, file, etc.)
      let s = z.string();

      if (field.required) s = s.min(1, "Required");

      // Text length constraints
      if (c?.minLength !== undefined)
        s = s.min(c.minLength, `Min length: ${c.minLength}`);
      if (c?.maxLength !== undefined)
        s = s.max(c.maxLength, `Max length: ${c.maxLength}`);

      // Hard regex
      if (field.regex?.mode === "hard" && field.regex.pattern) {
        try {
          s = s.regex(new RegExp(field.regex.pattern), field.regex.message);
        } catch {
          // Invalid regex — skip
        }
      }

      return field.required ? s : s.optional();
    }
  }
}

/**
 * Build a zod validation schema from form elements.
 *
 * Handles flat fields, regular groups (fields merged into parent),
 * and repeat groups (z.array of z.object for child fields).
 */
export function buildZodSchema(
  elements: FormElement[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const el of elements) {
    if (el.kind === "field") {
      const schema = buildFieldSchema(el);
      if (schema) shape[el.id] = schema;
      continue;
    }

    // Group element
    if (el.repeat?.enabled) {
      const childShape: Record<string, z.ZodTypeAny> = {};
      for (const child of el.elements) {
        if (child.kind === "field") {
          const schema = buildFieldSchema(child);
          if (schema) childShape[child.id] = schema;
        }
      }
      if (Object.keys(childShape).length > 0) {
        const min = el.repeat.min ?? 1;
        shape[el.id] = z.array(z.object(childShape)).min(min);
      }
    } else {
      for (const child of el.elements) {
        if (child.kind === "field") {
          const schema = buildFieldSchema(child);
          if (schema) shape[child.id] = schema;
        }
      }
    }
  }

  return z.object(shape);
}
