"use client";

/**
 * RepeatGroupRenderer — renders a repeating group with add/remove controls.
 *
 * Uses react-hook-form's useFieldArray to manage dynamic instances.
 * Supports two modes:
 *   - Open-ended: user adds/removes instances manually
 *   - Fixed-count: number of instances determined by another field's value
 */

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import {
  type Control,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { evaluateExpression } from "../shared/expression-eval";
import { getFieldMeta } from "../shared/field-registry";
import { interpolateText } from "../shared/interpolate";
import { collectFields } from "../shared/schema-utils";
import { evaluateConstraint, validateRegex } from "../shared/validation-utils";
import { evaluateVisibility } from "../shared/visibility";
import type { FieldElement, GroupElement } from "../types";
import { FieldRenderer } from "./FieldRenderer";

// ── Props ────────────────────────────────────────────────────────────────────

type RepeatGroupRendererProps = {
  group: GroupElement;
  control: Control;
  errors: Record<string, unknown>;
  readOnly?: boolean;
  /** All form values for visibility/calculation evaluation */
  allValues: Record<string, unknown>;
};

// ── Component ────────────────────────────────────────────────────────────────

export function RepeatGroupRenderer({
  group,
  control,
  errors,
  readOnly,
  allValues,
}: RepeatGroupRendererProps) {
  const t = useTranslations("formConstructor");
  const repeat = group.repeat as NonNullable<typeof group.repeat>;

  // Build empty instance shape from child fields (memoized to avoid re-render loops)
  const emptyInstance = useMemo(() => {
    const shape: Record<string, unknown> = {};
    for (const child of group.elements) {
      if (child.kind === "field") {
        const meta = getFieldMeta(child.type);
        if (!meta.isInput) continue;
        shape[child.id] = child.type === "select_multiple" ? [] : "";
      }
    }
    return shape;
  }, [group.elements]);

  // All fields (for interpolation label resolution)
  const childFields = useMemo(
    () => collectFields(group.elements),
    [group.elements],
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: group.id,
  });

  // Fixed-count mode: sync instance count with referenced field value
  const countFieldId = repeat.countFieldId;
  const countValue = useWatch({
    control,
    name: countFieldId ?? "__noop__",
  });

  useEffect(() => {
    if (!countFieldId) return;
    const targetCount = Math.max(0, Number(countValue) || 0);
    const currentCount = fields.length;

    if (targetCount > currentCount) {
      for (let i = 0; i < targetCount - currentCount; i++) {
        append({ ...emptyInstance }, { shouldFocus: false });
      }
    } else if (targetCount < currentCount) {
      for (let i = currentCount - 1; i >= targetCount; i--) {
        remove(i);
      }
    }
  }, [countValue, countFieldId, append, remove, fields.length, emptyInstance]);

  // Watch all values within this repeat group for visibility/calculations
  const repeatValues = useWatch({ control, name: group.id }) as
    | Record<string, unknown>[]
    | undefined;

  const isOpenEnded = !countFieldId;
  const min = repeat.min ?? 1;
  const max = repeat.max;
  const canAdd = isOpenEnded && (!max || fields.length < max);
  const canRemove = isOpenEnded && fields.length > min;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <fieldset
      className="flex flex-col gap-3 rounded-vita-lg p-4"
      style={{
        border: "1px solid var(--vita-neutral-200)",
        background: "var(--vita-background)",
      }}
    >
      <legend
        className="px-2 text-sm font-semibold"
        style={{ color: "var(--vita-text-primary)" }}
      >
        {interpolateText(group.label, allValues, childFields)}
      </legend>
      {group.description && (
        <p
          className="-mt-2 text-xs"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {interpolateText(group.description, allValues, childFields)}
        </p>
      )}

      {fields.length === 0 && (
        <p
          className="py-4 text-center text-sm"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {t("repeat.emptyRepeat")}
        </p>
      )}

      {fields.map((rhfField, instanceIndex) => {
        const instanceValues = repeatValues?.[instanceIndex] ?? {};
        // Merge instance values into allValues for visibility/calc evaluation
        const mergedValues = { ...allValues, ...instanceValues };

        return (
          <div
            key={rhfField.id}
            className="flex flex-col gap-3 rounded-vita-md p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-surface)",
            }}
          >
            {/* Instance header */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--vita-text-secondary)" }}
              >
                {group.label} #{instanceIndex + 1}
              </span>
              {canRemove && !readOnly && (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => remove(instanceIndex)}
                  className="text-xs"
                >
                  <Minus size={12} />
                  {t("repeat.removeInstance")}
                </Button>
              )}
            </div>

            {/* Child fields */}
            {group.elements.map((child) => {
              if (child.kind !== "field") return null;
              if (child.hidden) return null;

              // Evaluate visibility within instance context
              if (
                child.visibility &&
                !evaluateVisibility(child.visibility, mergedValues)
              ) {
                return null;
              }

              const meta = getFieldMeta(child.type);
              const fieldName = `${group.id}.${instanceIndex}.${child.id}`;

              // Errors for this specific instance field
              const groupErrors = errors[group.id] as
                | Array<Record<string, { message?: string }>>
                | undefined;
              const fieldError = groupErrors?.[instanceIndex]?.[child.id];
              const errorMessage = fieldError?.message;

              // Soft regex warning
              const warning = getWarningForField(child, mergedValues);

              // Non-input fields
              if (!meta.isInput) {
                const calculatedValue =
                  child.type === "calculate" && child.calculate
                    ? evaluateExpression(child.calculate, mergedValues)
                    : undefined;
                return (
                  <FieldRenderer
                    key={child.id}
                    field={child}
                    value={calculatedValue}
                    onChange={() => {}}
                    onBlur={() => {}}
                    readOnly={readOnly}
                    formValues={mergedValues}
                    allFields={childFields}
                  />
                );
              }

              return (
                <Controller
                  key={child.id}
                  name={fieldName}
                  control={control}
                  render={({ field: formField }) => (
                    <FieldRenderer
                      field={child}
                      value={formField.value}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      error={errorMessage}
                      warning={warning}
                      readOnly={readOnly}
                      formValues={mergedValues}
                      allFields={childFields}
                    />
                  )}
                />
              );
            })}
          </div>
        );
      })}

      {/* Add button (open-ended only) */}
      {canAdd && !readOnly && (
        <Button
          size="sm"
          variant="outline"
          className="self-start text-xs"
          onPress={() => append({ ...emptyInstance })}
        >
          <Plus size={12} />
          {t("repeat.addInstance")}
        </Button>
      )}
    </fieldset>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getWarningForField(
  field: FieldElement,
  values: Record<string, unknown>,
): string | undefined {
  const val = values[field.id];

  // Soft regex
  if (field.regex?.mode === "soft") {
    if (typeof val === "string" && val !== "") {
      const result = validateRegex(val, field.regex);
      if (!result.valid) return result.message;
    }
  }

  // Soft custom constraint
  const rule = field.constraints?.customRule;
  if (
    rule?.mode === "soft" &&
    rule.expression &&
    val !== "" &&
    val !== undefined
  ) {
    const result = evaluateConstraint(val, rule.expression, values);
    if (result === 0) return rule.message;
  }

  return undefined;
}
