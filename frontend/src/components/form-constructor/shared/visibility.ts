/**
 * Visibility Evaluation — determines whether a field should be shown
 * based on single or compound visibility rules.
 *
 * Supports:
 *   - Single rule: { fieldId, operator, value }
 *   - Compound rules: { logic: "and" | "or", rules: [...] }
 *   - Backward compatible with old single-rule format
 */

import type {
  CompoundVisibility,
  FieldElement,
  VisibilityRule,
} from "../types";

/** Type guard: is this a compound visibility config? */
function isCompound(
  v: VisibilityRule | CompoundVisibility,
): v is CompoundVisibility {
  return "logic" in v && "rules" in v;
}

/** Evaluate a single visibility rule against current form values. */
function evaluateSingleRule(
  rule: VisibilityRule,
  values: Record<string, unknown>,
): boolean {
  const fieldValue = values[rule.fieldId];
  const strValue =
    fieldValue === undefined || fieldValue === null ? "" : String(fieldValue);

  switch (rule.operator) {
    case "equals":
      return strValue === (rule.value ?? "");
    case "not_equals":
      return strValue !== (rule.value ?? "");
    case "contains":
      return strValue.includes(rule.value ?? "");
    case "is_empty":
      return strValue === "";
    case "is_not_empty":
      return strValue !== "";
    default:
      return true;
  }
}

/**
 * Evaluate a field's visibility config (single rule or compound).
 * Returns true if the field should be visible.
 */
export function evaluateVisibility(
  config: VisibilityRule | CompoundVisibility,
  values: Record<string, unknown>,
): boolean {
  if (isCompound(config)) {
    if (config.rules.length === 0) return true;
    return config.logic === "and"
      ? config.rules.every((rule) => evaluateSingleRule(rule, values))
      : config.rules.some((rule) => evaluateSingleRule(rule, values));
  }
  return evaluateSingleRule(config, values);
}

/** Check whether a field is visible given its config and current values. */
export function isFieldVisible(
  field: FieldElement,
  values: Record<string, unknown>,
): boolean {
  if (field.hidden) return false;
  if (!field.visibility) return true;
  return evaluateVisibility(field.visibility, values);
}
