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
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { evaluateExpression } from "../shared/expression-eval";
import { resolveFieldText } from "../shared/field-i18n";
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
  const locale = useLocale();

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
    trigger,
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

  // Capture form start time once (stable across re-renders)
  const startTime = useMemo(() => new Date().toISOString(), []);

  const watchedValues = useMemo(() => {
    const merged = { ...rawValues };
    for (const field of allFields) {
      if (field.type === "calculate" && field.calculate) {
        merged[field.id] = evaluateExpression(field.calculate, merged);
      } else if (field.type === "start_timestamp") {
        merged[field.id] = startTime;
      } else if (field.type === "end_timestamp") {
        merged[field.id] = new Date().toISOString();
      } else if (field.type === "username") {
        merged[field.id] = "current_user"; // placeholder until auth is wired
      }
    }
    return merged;
  }, [rawValues, allFields, startTime]);

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
      // Resolve per-locale translations for group
      const groupText = resolveFieldText(element, locale);

      // Repeat groups get their own renderer
      if (element.repeat?.enabled) {
        const translatedGroup = { ...element, ...groupText };
        return (
          <RepeatGroupRenderer
            key={element.id}
            group={translatedGroup}
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
          label={interpolateText(groupText.label, watchedValues, allFields)}
          description={
            groupText.description
              ? interpolateText(groupText.description, watchedValues, allFields)
              : undefined
          }
        >
          {visibleChildren.map(renderElement)}
        </GroupRenderer>
      );
    }

    // Field element
    if (!checkFieldVisible(element)) return null;

    // Resolve per-locale translations
    const fieldText = resolveFieldText(element, locale);
    const translatedField = { ...element, ...fieldText };

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
          field={translatedField}
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
            field={translatedField}
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

  // ── Settings / Pagination ──────────────────────────────────────────────────

  const settings = schema.settings;
  const layout = settings?.layout ?? "single-page";
  const fs = settings?.styling;
  const submitText = settings?.submitButtonText || t("viewer.submit");

  // Build pages for paginated modes
  const pages = useMemo(() => {
    if (layout === "page-per-group") {
      // Each top-level element is a page (groups become pages, loose fields = 1 page)
      const result: FormElement[][] = [];
      let currentLoose: FormElement[] = [];
      for (const el of schema.elements) {
        if (el.kind === "group") {
          if (currentLoose.length > 0) {
            result.push(currentLoose);
            currentLoose = [];
          }
          result.push([el]);
        } else {
          currentLoose.push(el);
        }
      }
      if (currentLoose.length > 0) result.push(currentLoose);
      return result;
    }
    if (layout === "page-per-field") {
      return schema.elements.map((el) => [el]);
    }
    return [schema.elements]; // single-page
  }, [schema.elements, layout]);

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;
  const isLastPage = currentPage >= totalPages - 1;

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

  // ── Form-level styles ─────────────────────────────────────────────────────

  const formStyle: React.CSSProperties = {
    background: fs?.backgroundColor || "var(--vita-background)",
    border: "1px solid var(--vita-neutral-200)",
    borderRadius: fs?.borderRadius ?? "var(--vita-radius-lg, 12px)",
    padding: fs?.padding ?? "20px",
    maxWidth: fs?.maxWidth || undefined,
    fontFamily: fs?.fontFamily || undefined,
    color: fs?.textColor || undefined,
    margin: fs?.maxWidth ? "0 auto" : undefined,
    width: "100%",
  };

  // ── Main render ────────────────────────────────────────────────────────────

  const elementsToRender =
    layout === "single-page" ? schema.elements : (pages[currentPage] ?? []);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-5"
      style={formStyle}
    >
      {/* Form title + description */}
      {(schema.name || schema.description) && (
        <div className="flex flex-col gap-1">
          {schema.name && (
            <h2
              className="text-lg font-semibold"
              style={{ color: fs?.textColor || "var(--vita-text-primary)" }}
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

      {/* Progress bar */}
      {settings?.showProgressBar && totalPages > 1 && (
        <div className="flex flex-col gap-1">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--vita-neutral-200)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((currentPage + 1) / totalPages) * 100}%`,
                background: "var(--vita-primary)",
              }}
            />
          </div>
          <p
            className="text-right text-[11px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {currentPage + 1} / {totalPages}
          </p>
        </div>
      )}

      {/* Elements (current page or all) */}
      {elementsToRender.map((el, i) => {
        const rendered = renderElement(el);
        if (!rendered) return null;
        // Field numbering
        if (settings?.showFieldNumbers && el.kind === "field") {
          return (
            <div key={el.id} className="flex gap-3">
              <span
                className="mt-0.5 shrink-0 text-sm font-semibold"
                style={{ color: "var(--vita-text-muted)", minWidth: "24px" }}
              >
                {i + 1}.
              </span>
              <div className="flex-1">{rendered}</div>
            </div>
          );
        }
        return rendered;
      })}

      {/* Navigation / Submit */}
      {!readOnly && (
        <div className="flex items-center justify-between pt-2">
          {/* Previous button (paginated modes) */}
          {layout !== "single-page" && currentPage > 0 ? (
            <Button
              type="button"
              variant="outline"
              onPress={() => setCurrentPage((p) => p - 1)}
            >
              {t("viewer.previous")}
            </Button>
          ) : (
            <div />
          )}

          {/* Next or Submit */}
          {layout !== "single-page" && !isLastPage ? (
            <Button
              type="button"
              variant="primary"
              onPress={async () => {
                // Collect field IDs on current page for validation
                const pageFieldIds: string[] = [];
                for (const el of elementsToRender) {
                  if (el.kind === "field" && !el.hidden) {
                    const meta = getFieldMeta(el.type);
                    if (meta.isInput) pageFieldIds.push(el.id);
                  } else if (el.kind === "group" && !el.repeat?.enabled) {
                    for (const child of el.elements) {
                      if (child.kind === "field" && !child.hidden) {
                        const meta = getFieldMeta(child.type);
                        if (meta.isInput) pageFieldIds.push(child.id);
                      }
                    }
                  }
                  // Repeat groups use nested paths — skip per-field validation for now
                }
                const valid = await trigger(pageFieldIds);
                if (valid) setCurrentPage((p) => p + 1);
              }}
            >
              {t("viewer.next")}
            </Button>
          ) : (
            <Button type="submit" variant="primary">
              {submitText}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
