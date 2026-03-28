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
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { evaluateExpression } from "../shared/expression-eval";
import { getFieldMeta } from "../shared/field-registry";
import { interpolateText } from "../shared/interpolate";
import { collectFields } from "../shared/schema-utils";
import {
  buildZodSchema,
  evaluateConstraint,
  validateRegex,
} from "../shared/validation-utils";
import { isFieldVisible } from "../shared/visibility";
import type { FieldElement, FormElement, FormSchema } from "../types";
import { FieldRenderer } from "./FieldRenderer";
import { GroupRenderer } from "./GroupRenderer";
import { RepeatGroupRenderer } from "./RepeatGroupRenderer";

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

    function fieldDefault(f: FieldElement): unknown {
      if (f.defaultValue !== undefined) return f.defaultValue;
      return f.type === "select_multiple" ? [] : "";
    }

    for (const el of schema.elements) {
      if (el.kind === "field") {
        if (el.hidden) continue;
        const meta = getFieldMeta(el.type);
        if (!meta.isInput) continue;
        defaults[el.id] = fieldDefault(el);
      } else if (el.repeat?.enabled) {
        const instanceDefaults: Record<string, unknown> = {};
        for (const child of el.elements) {
          if (child.kind !== "field" || child.hidden) continue;
          const meta = getFieldMeta(child.type);
          if (!meta.isInput) continue;
          instanceDefaults[child.id] = fieldDefault(child);
        }
        const min = el.repeat.min ?? 1;
        const initialCount = el.repeat.countFieldId ? 0 : min;
        defaults[el.id] = Array.from({ length: initialCount }, () => ({
          ...instanceDefaults,
        }));
      } else {
        // Regular group → flatten children
        for (const child of el.elements) {
          if (child.kind !== "field" || child.hidden) continue;
          const meta = getFieldMeta(child.type);
          if (!meta.isInput) continue;
          defaults[child.id] = fieldDefault(child);
        }
      }
    }

    return defaults;
  }, [schema.elements]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Reset form when schema changes (e.g., after import) so defaults re-apply
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // Watch all form values for visibility conditions and calculations
  const rawValues = useWatch({ control }) as Record<string, unknown>;

  // ── All fields (for interpolation select label resolution) ─────────────────

  const allFields = useMemo(
    () => collectFields(schema.elements),
    [schema.elements],
  );

  // ── Calculated field values ────────────────────────────────────────────────
  // Compute ALL calculated fields in order so they can reference each other.
  // The merged `watchedValues` map is used everywhere (visibility, warnings,
  // interpolation, and rendering).

  const watchedValues = useMemo(() => {
    const merged = { ...rawValues };
    for (const field of allFields) {
      if (field.type === "calculate" && field.calculate) {
        merged[field.id] = evaluateExpression(field.calculate, merged);
      }
    }
    return merged;
  }, [rawValues, allFields]);

  // ── Visibility evaluation ──────────────────────────────────────────────────

  const checkFieldVisible = useCallback(
    (field: FieldElement): boolean => isFieldVisible(field, watchedValues),
    [watchedValues],
  );

  // ── Soft warnings (regex + custom constraints) ────────────────────────────

  const getWarning = useCallback(
    (field: FieldElement): string | undefined => {
      const val = watchedValues[field.id];

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
        const result = evaluateConstraint(val, rule.expression, watchedValues);
        if (result === 0) return rule.message;
      }

      return undefined;
    },
    [watchedValues],
  );

  // ── Hard custom constraint errors (evaluated at runtime, not by Zod) ──────

  const getConstraintError = useCallback(
    (field: FieldElement): string | undefined => {
      const rule = field.constraints?.customRule;
      if (!rule || rule.mode !== "hard" || !rule.expression) return undefined;
      const val = watchedValues[field.id];
      if (val === "" || val === undefined) return undefined;
      const result = evaluateConstraint(val, rule.expression, watchedValues);
      return result === 0 ? rule.message : undefined;
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
      // Repeat groups get their own renderer
      if (element.repeat?.enabled) {
        return (
          <RepeatGroupRenderer
            key={element.id}
            group={element}
            control={control}
            errors={errors as Record<string, unknown>}
            readOnly={readOnly}
            allValues={watchedValues}
          />
        );
      }

      // Regular group
      const visibleChildren = element.elements.filter(
        (child) => child.kind !== "field" || checkFieldVisible(child),
      );
      if (visibleChildren.length === 0) return null;

      return (
        <GroupRenderer
          key={element.id}
          label={interpolateText(element.label, watchedValues, allFields)}
          description={
            element.description
              ? interpolateText(element.description, watchedValues, allFields)
              : undefined
          }
        >
          {visibleChildren.map(renderElement)}
        </GroupRenderer>
      );
    }

    // Field element
    if (!checkFieldVisible(element)) return null;

    const meta = getFieldMeta(element.type);
    const isNonInput = !meta.isInput;
    const fieldError = errors[element.id];
    const zodError = fieldError?.message as string | undefined;
    const constraintError = getConstraintError(element);
    const errorMessage = zodError || constraintError;
    const warning = getWarning(element);

    // Non-input fields (note, calculate) don't need form Controller
    if (isNonInput) {
      const calculatedValue = watchedValues[element.id] ?? undefined;
      return (
        <FieldRenderer
          key={element.id}
          field={element}
          value={calculatedValue}
          onChange={() => {}}
          onBlur={() => {}}
          readOnly={readOnly}
          formValues={watchedValues}
          allFields={allFields}
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
            formValues={watchedValues}
            allFields={allFields}
          />
        )}
      />
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────

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
