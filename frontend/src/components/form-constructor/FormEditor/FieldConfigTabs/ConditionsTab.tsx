"use client";

/**
 * ConditionsTab — conditional visibility settings for a field.
 *
 * Allows configuring a single visibility rule: show/hide this field
 * based on another field's value using operators like equals, not_equals,
 * contains, is_empty, is_not_empty.
 *
 * Uses collectFields to get a flat list of all available fields
 * for the field picker dropdown.
 */

import { useTranslations } from "next-intl";
import { collectFields } from "../../shared/schema-utils";
import type {
  ConfigTabProps,
  VisibilityOperator,
  VisibilityRule,
} from "../../types";

const OPERATORS: VisibilityOperator[] = [
  "equals",
  "not_equals",
  "contains",
  "is_empty",
  "is_not_empty",
];

/** Operators that do not require a comparison value. */
const VALUE_HIDDEN_OPERATORS: VisibilityOperator[] = [
  "is_empty",
  "is_not_empty",
];

export function ConditionsTab({
  field,
  onUpdate,
  allElements,
}: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  const hasRule = field.visibility !== undefined;

  // All fields except the current one (cannot reference itself)
  const availableFields = collectFields(allElements).filter(
    (f) => f.id !== field.id,
  );

  function addCondition() {
    const rule: VisibilityRule = {
      fieldId: availableFields[0]?.id ?? "",
      operator: "equals",
      value: "",
    };
    onUpdate({ visibility: rule });
  }

  function removeCondition() {
    onUpdate({ visibility: undefined });
  }

  function updateRule(patch: Partial<VisibilityRule>) {
    if (!field.visibility) return;
    const next = { ...field.visibility, ...patch };

    // Clear value when switching to value-less operators
    if (patch.operator && VALUE_HIDDEN_OPERATORS.includes(patch.operator)) {
      next.value = undefined;
    }

    onUpdate({ visibility: next });
  }

  if (!hasRule) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t("config.conditions.noRule")}
        </p>
        <button
          type="button"
          className="rounded-vita-md px-4 py-2 text-xs font-medium transition-colors"
          style={{
            color: "var(--vita-primary)",
            border: "1px solid var(--vita-neutral-200)",
          }}
          onClick={addCondition}
        >
          {t("config.conditions.addCondition")}
        </button>
      </div>
    );
  }

  // biome-ignore lint/style/noNonNullAssertion: visibility is checked above
  const rule = field.visibility!;
  const showValueInput = !VALUE_HIDDEN_OPERATORS.includes(rule.operator);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
        {t("config.conditions.description")}
      </p>

      {/* Field picker */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.conditions.field")}
        </span>
        <select
          value={rule.fieldId}
          onChange={(e) => updateRule({ fieldId: e.target.value })}
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        >
          {availableFields.length === 0 && (
            <option value="" disabled>
              {t("config.conditions.noFieldsAvailable")}
            </option>
          )}
          {availableFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label || f.id}
            </option>
          ))}
        </select>
      </label>

      {/* Operator picker */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.conditions.operator")}
        </span>
        <select
          value={rule.operator}
          onChange={(e) =>
            updateRule({ operator: e.target.value as VisibilityOperator })
          }
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        >
          {OPERATORS.map((op) => (
            <option key={op} value={op}>
              {t(`config.conditions.operators.${op}`)}
            </option>
          ))}
        </select>
      </label>

      {/* Value input — hidden for is_empty / is_not_empty */}
      {showValueInput && (
        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--vita-text-secondary)" }}
          >
            {t("config.conditions.value")}
          </span>
          <input
            type="text"
            value={rule.value ?? ""}
            onChange={(e) => updateRule({ value: e.target.value })}
            placeholder={t("config.conditions.valuePlaceholder")}
            className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
            style={{
              background: "var(--vita-background)",
              border: "1px solid var(--vita-neutral-200)",
              color: "var(--vita-text-primary)",
            }}
          />
        </label>
      )}

      {/* Remove link */}
      <button
        type="button"
        className="self-start text-xs font-medium transition-colors"
        style={{ color: "var(--vita-error)" }}
        onClick={removeCondition}
      >
        {t("config.conditions.removeCondition")}
      </button>
    </div>
  );
}
