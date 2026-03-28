"use client";

/**
 * ConditionsTab — conditional visibility settings for a field.
 *
 * Supports multiple rules combined with AND or OR logic.
 * Each rule: show/hide based on another field's value using operators
 * like equals, not_equals, contains, is_empty, is_not_empty.
 */

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Key } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";
import { ListBox, Select } from "@/components/ui/select";

import { collectFields } from "../../shared/schema-utils";
import type {
  CompoundVisibility,
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

const VALUE_HIDDEN_OPERATORS: VisibilityOperator[] = [
  "is_empty",
  "is_not_empty",
];

/** Normalize any visibility config to compound format for editing. */
function toCompound(
  v: VisibilityRule | CompoundVisibility | undefined,
): CompoundVisibility {
  if (!v) return { logic: "and", rules: [] };
  if ("logic" in v && "rules" in v) return v;
  // Single rule → wrap
  return { logic: "and", rules: [v as VisibilityRule] };
}

export function ConditionsTab({
  field,
  onUpdate,
  allElements,
}: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  const compound = toCompound(field.visibility);
  const hasRules = compound.rules.length > 0;

  const availableFields = collectFields(allElements).filter(
    (f) => f.id !== field.id,
  );

  function save(next: CompoundVisibility) {
    if (next.rules.length === 0) {
      onUpdate({ visibility: undefined });
    } else if (next.rules.length === 1) {
      // Single rule → save as simple VisibilityRule for backward compat
      onUpdate({ visibility: next.rules[0] });
    } else {
      onUpdate({ visibility: next });
    }
  }

  function addRule() {
    const rule: VisibilityRule = {
      fieldId: availableFields[0]?.id ?? "",
      operator: "equals",
      value: "",
    };
    save({ ...compound, rules: [...compound.rules, rule] });
  }

  function removeRule(index: number) {
    save({ ...compound, rules: compound.rules.filter((_, i) => i !== index) });
  }

  function updateRule(index: number, patch: Partial<VisibilityRule>) {
    const rules = compound.rules.map((r, i) => {
      if (i !== index) return r;
      const next = { ...r, ...patch };
      if (patch.operator && VALUE_HIDDEN_OPERATORS.includes(patch.operator)) {
        next.value = undefined;
      }
      return next;
    });
    save({ ...compound, rules });
  }

  function setLogic(logic: "and" | "or") {
    save({ ...compound, logic });
  }

  // ── No rules ──────────────────────────────────────────────────────────────

  if (!hasRules) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t("config.conditions.noRule")}
        </p>
        <Button variant="outline" size="sm" onPress={addRule}>
          {t("config.conditions.addCondition")}
        </Button>
      </div>
    );
  }

  // ── Rules editor ──────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
        {t("config.conditions.description")}
      </p>

      {/* Logic toggle (only shown when 2+ rules) */}
      {compound.rules.length > 1 && (
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--vita-text-secondary)" }}
          >
            {t("config.conditions.combineWith")}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-vita-sm px-3 py-1 text-xs font-semibold transition-colors"
              style={{
                background:
                  compound.logic === "and"
                    ? "var(--vita-primary)"
                    : "var(--vita-neutral-100)",
                color:
                  compound.logic === "and"
                    ? "var(--vita-text-on-primary, #fff)"
                    : "var(--vita-text-muted)",
              }}
              onClick={() => setLogic("and")}
            >
              AND
            </button>
            <button
              type="button"
              className="rounded-vita-sm px-3 py-1 text-xs font-semibold transition-colors"
              style={{
                background:
                  compound.logic === "or"
                    ? "var(--vita-primary)"
                    : "var(--vita-neutral-100)",
                color:
                  compound.logic === "or"
                    ? "var(--vita-text-on-primary, #fff)"
                    : "var(--vita-text-muted)",
              }}
              onClick={() => setLogic("or")}
            >
              OR
            </button>
          </div>
        </div>
      )}

      {/* Rule list */}
      {compound.rules.map((rule, index) => {
        const showValueInput = !VALUE_HIDDEN_OPERATORS.includes(rule.operator);
        const ruleKey = `${rule.fieldId}-${rule.operator}-${index}`;

        return (
          <div
            key={ruleKey}
            className="flex flex-col gap-3 rounded-vita-md p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            {/* Rule header */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--vita-text-secondary)" }}
              >
                {t("config.conditions.ruleNumber", { number: index + 1 })}
              </span>
              <button
                type="button"
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--vita-error)" }}
                onClick={() => removeRule(index)}
              >
                <Minus size={10} />
                {t("config.conditions.removeCondition")}
              </button>
            </div>

            {/* Field picker */}
            <Select
              selectedKey={rule.fieldId || null}
              onSelectionChange={(key: Key | null) => {
                if (key) updateRule(index, { fieldId: String(key) });
              }}
              placeholder={
                availableFields.length === 0
                  ? t("config.conditions.noFieldsAvailable")
                  : undefined
              }
              isDisabled={availableFields.length === 0}
            >
              <Label>{t("config.conditions.field")}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {availableFields.map((f) => (
                    <ListBox.Item
                      key={f.id}
                      id={f.id}
                      textValue={f.label || f.id}
                    >
                      {f.label || f.id}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Operator picker */}
            <Select
              selectedKey={rule.operator}
              onSelectionChange={(key: Key | null) => {
                if (key)
                  updateRule(index, { operator: key as VisibilityOperator });
              }}
            >
              <Label>{t("config.conditions.operator")}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {OPERATORS.map((op) => (
                    <ListBox.Item
                      key={op}
                      id={op}
                      textValue={t(`config.conditions.operators.${op}`)}
                    >
                      {t(`config.conditions.operators.${op}`)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Value input */}
            {showValueInput && (
              <TextField>
                <Label>{t("config.conditions.value")}</Label>
                <Input
                  value={rule.value ?? ""}
                  onChange={(e) => updateRule(index, { value: e.target.value })}
                  placeholder={t("config.conditions.valuePlaceholder")}
                />
              </TextField>
            )}
          </div>
        );
      })}

      {/* Add another rule */}
      <Button
        variant="outline"
        size="sm"
        onPress={addRule}
        className="self-start"
      >
        <Plus size={12} />
        {t("config.conditions.addAnotherRule")}
      </Button>
    </div>
  );
}
