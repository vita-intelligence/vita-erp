"use client";

/**
 * FormViewer — renders a form from a FormSchema as a fillable (or read-only) form.
 *
 * Responsibilities:
 *   - Builds Zod validation from schema → react-hook-form resolver
 *   - Evaluates visibility conditions → hides/shows fields dynamically
 *   - Computes calculated field values → updates on dependency change
 *   - Validates soft regex rules on blur → shows warnings
 *   - Renders all elements via FieldRenderer / GroupRenderer
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { evaluateExpression } from "../shared/expression-eval";
import { getFieldMeta } from "../shared/field-registry";
import { collectFields } from "../shared/schema-utils";
import { buildZodSchema, validateRegex } from "../shared/validation-utils";
import type {
  FieldElement,
  FormElement,
  FormSchema,
  VisibilityRule,
} from "../types";
import { FieldRenderer } from "./FieldRenderer";
import { GroupRenderer } from "./GroupRenderer";

// ── Props ────────────────────────────────────────────────────────────────────

type FormViewerProps = {
  schema: FormSchema;
  onSubmit?: (data: Record<string, unknown>) => void;
  readOnly?: boolean;
};

// ── Component ────────────────────────────────────────────────────────────────

export function FormViewer({ schema, onSubmit, readOnly }: FormViewerProps) {
  const t = useTranslations("formConstructor");

  // Build Zod schema and default values from form elements
  const zodSchema = useMemo(
    () => buildZodSchema(schema.elements),
    [schema.elements],
  );

  const defaultValues = useMemo(() => {
    const defaults: Record<string, unknown> = {};
    const fields = collectFields(schema.elements);
    for (const field of fields) {
      if (field.hidden) continue;
      const meta = getFieldMeta(field.type);
      if (!meta.isInput) continue;
      defaults[field.id] = field.type === "select_multiple" ? [] : "";
    }
    return defaults;
  }, [schema.elements]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Watch all form values for visibility conditions and calculations
  const watchedValues = useWatch({ control }) as Record<string, unknown>;

  // ── Visibility evaluation ──────────────────────────────────────────────────

  const isFieldVisible = useCallback(
    (field: FieldElement): boolean => {
      if (field.hidden) return false;
      if (!field.visibility) return true;
      return evaluateVisibility(field.visibility, watchedValues);
    },
    [watchedValues],
  );

  // ── Soft regex warnings ────────────────────────────────────────────────────

  const getWarning = useCallback(
    (field: FieldElement): string | undefined => {
      if (!field.regex || field.regex.mode !== "soft") return undefined;
      const val = watchedValues[field.id];
      if (typeof val !== "string" || val === "") return undefined;
      const result = validateRegex(val, field.regex);
      return result.valid ? undefined : result.message;
    },
    [watchedValues],
  );

  // ── Calculated field values ────────────────────────────────────────────────

  const getCalculatedValue = useCallback(
    (field: FieldElement): number | undefined => {
      if (field.type !== "calculate" || !field.calculate) return undefined;
      return evaluateExpression(field.calculate, watchedValues);
    },
    [watchedValues],
  );

  // ── Submit handler ─────────────────────────────────────────────────────────

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit?.(data);
  });

  // ── Render element tree ────────────────────────────────────────────────────

  function renderElement(element: FormElement) {
    if (element.kind === "group") {
      const visibleChildren = element.elements.filter(
        (child) => child.kind !== "field" || isFieldVisible(child),
      );
      if (visibleChildren.length === 0) return null;

      return (
        <GroupRenderer
          key={element.id}
          label={element.label}
          description={element.description}
        >
          {visibleChildren.map(renderElement)}
        </GroupRenderer>
      );
    }

    // Field element
    if (!isFieldVisible(element)) return null;

    const meta = getFieldMeta(element.type);
    const isNonInput = !meta.isInput;
    const fieldError = errors[element.id];
    const errorMessage = fieldError?.message as string | undefined;
    const warning = getWarning(element);

    // Non-input fields (note, calculate) don't need form Controller
    if (isNonInput) {
      const calculatedValue = getCalculatedValue(element);
      return (
        <FieldRenderer
          key={element.id}
          field={element}
          value={calculatedValue}
          onChange={() => {}}
          onBlur={() => {}}
          readOnly={readOnly}
        />
      );
    }

    return (
      <Controller
        key={element.id}
        name={element.id}
        control={control}
        render={({ field: formField }) => (
          <FieldRenderer
            field={element}
            value={formField.value}
            onChange={formField.onChange}
            onBlur={formField.onBlur}
            error={errorMessage}
            warning={warning}
            readOnly={readOnly}
          />
        )}
      />
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────

  const allFields = collectFields(schema.elements);
  const hasVisibleFields = allFields.some((f) => !f.hidden);

  if (!hasVisibleFields) {
    return (
      <div
        className="flex items-center justify-center rounded-vita-lg border py-12"
        style={{
          borderColor: "var(--vita-neutral-200)",
          color: "var(--vita-text-muted)",
        }}
      >
        <p className="text-sm">{t("viewer.noFieldsMessage")}</p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-5 rounded-vita-lg p-5"
      style={{
        background: "var(--vita-background)",
        border: "1px solid var(--vita-neutral-200)",
      }}
    >
      {/* Form title + description */}
      {(schema.name || schema.description) && (
        <div className="flex flex-col gap-1">
          {schema.name && (
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {schema.name}
            </h2>
          )}
          {schema.description && (
            <p className="text-sm" style={{ color: "var(--vita-text-muted)" }}>
              {schema.description}
            </p>
          )}
        </div>
      )}

      {/* Elements */}
      {schema.elements.map(renderElement)}

      {/* Submit button */}
      {!readOnly && (
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary">
            {t("viewer.submit")}
          </Button>
        </div>
      )}
    </form>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function evaluateVisibility(
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
