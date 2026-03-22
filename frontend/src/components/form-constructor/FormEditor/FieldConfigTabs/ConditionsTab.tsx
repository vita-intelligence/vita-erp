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
import type { Key } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";
import { ListBox, Select } from "@/components/ui/select";

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
        <Button variant="outline" size="sm" onPress={addCondition}>
          {t("config.conditions.addCondition")}
        </Button>
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
      <Select
        selectedKey={rule.fieldId || null}
        onSelectionChange={(key: Key | null) => {
          if (key) updateRule({ fieldId: String(key) });
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
              <ListBox.Item key={f.id} id={f.id} textValue={f.label || f.id}>
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
          if (key) updateRule({ operator: key as VisibilityOperator });
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

      {/* Value input — hidden for is_empty / is_not_empty */}
      {showValueInput && (
        <TextField>
          <Label>{t("config.conditions.value")}</Label>
          <Input
            value={rule.value ?? ""}
            onChange={(e) => updateRule({ value: e.target.value })}
            placeholder={t("config.conditions.valuePlaceholder")}
          />
        </TextField>
      )}

      {/* Remove link */}
      <Button
        variant="ghost"
        size="sm"
        onPress={removeCondition}
        className="self-start text-[var(--vita-error)]"
      >
        {t("config.conditions.removeCondition")}
      </Button>
    </div>
  );
}
