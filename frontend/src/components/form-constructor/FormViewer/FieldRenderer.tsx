"use client";

/**
 * FieldRenderer — routes a FieldElement to its type-specific renderer.
 *
 * Wraps each renderer with label, description, required indicator,
 * and error/warning message display.
 */

import { useTranslations } from "next-intl";

import { interpolateText } from "../shared/interpolate";
import type { FieldElement, FieldRendererProps, FieldType } from "../types";
import { CalculateRenderer } from "./renderers/CalculateRenderer";
import { DateTimeRenderer } from "./renderers/DateTimeRenderer";
import { FileRenderer } from "./renderers/FileRenderer";
import { NoteRenderer } from "./renderers/NoteRenderer";
import { NumberRenderer } from "./renderers/NumberRenderer";
import { SelectMultipleRenderer } from "./renderers/SelectMultipleRenderer";
import { SelectOneRenderer } from "./renderers/SelectOneRenderer";
import { SignatureRenderer } from "./renderers/SignatureRenderer";
import { TextRenderer } from "./renderers/TextRenderer";

// ── Renderer Map ────────────────────────────────────────────────────────────

const RENDERER_MAP: Record<
  FieldType,
  React.ComponentType<FieldRendererProps>
> = {
  text: TextRenderer,
  integer: NumberRenderer,
  decimal: NumberRenderer,
  select_one: SelectOneRenderer,
  select_multiple: SelectMultipleRenderer,
  date: DateTimeRenderer,
  datetime: DateTimeRenderer,
  time: DateTimeRenderer,
  file: FileRenderer,
  image: FileRenderer,
  signature: SignatureRenderer,
  note: NoteRenderer,
  calculate: CalculateRenderer,
};

// ── Extended Props ───────────────────────────────────────────────────────────

type FieldRendererWrapperProps = FieldRendererProps & {
  /** Live form values for ${field_id} interpolation in labels/descriptions */
  formValues?: Record<string, unknown>;
  /** All field definitions for resolving select option labels in interpolation */
  allFields?: FieldElement[];
};

// ── Component ───────────────────────────────────────────────────────────────

export function FieldRenderer(props: FieldRendererWrapperProps) {
  const t = useTranslations("formConstructor");
  const { field, error, warning, formValues, allFields } = props;
  const Renderer = RENDERER_MAP[field.type];

  if (!Renderer) return null;

  // Note and calculate don't need the full label wrapper
  const isNonInput = field.type === "note" || field.type === "calculate";

  // Interpolate ${field_id} references in label and description
  const label =
    formValues && field.label
      ? interpolateText(field.label, formValues, allFields)
      : field.label;
  const description =
    formValues && field.description
      ? interpolateText(field.description, formValues, allFields)
      : field.description;

  // Pass interpolated field to all renderers so placeholders/content resolve
  const rendererProps = formValues
    ? { ...props, field: { ...field, label, description } }
    : props;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-baseline gap-1">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--vita-text-primary)" }}
          htmlFor={field.id}
        >
          {label}
        </label>
        {field.required && !isNonInput && (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--vita-error)" }}
          >
            *
          </span>
        )}
      </div>

      {/* Description (for input fields — notes handle their own) */}
      {description && !isNonInput && (
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {description}
        </p>
      )}

      {/* Renderer */}
      <Renderer {...rendererProps} />

      {/* Error message */}
      {error && (
        <p
          className="text-xs font-medium"
          style={{ color: "var(--vita-error)" }}
        >
          {error === "Required" ? t("viewer.required") : error}
        </p>
      )}

      {/* Warning message (soft regex) */}
      {warning && !error && (
        <p
          className="text-xs font-medium"
          style={{ color: "var(--vita-warning)" }}
        >
          {warning}
        </p>
      )}
    </div>
  );
}
