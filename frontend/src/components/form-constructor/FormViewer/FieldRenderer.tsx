"use client";

/**
 * FieldRenderer — routes a FieldElement to its type-specific renderer.
 *
 * Wraps each renderer with label, description, required indicator,
 * and error/warning message display.
 */

import { useTranslations } from "next-intl";

import type { FieldRendererProps, FieldType } from "../types";
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

// ── Component ───────────────────────────────────────────────────────────────

export function FieldRenderer(props: FieldRendererProps) {
  const t = useTranslations("formConstructor");
  const { field, error, warning } = props;
  const Renderer = RENDERER_MAP[field.type];

  if (!Renderer) return null;

  // Note and calculate don't need the full label wrapper
  const isNonInput = field.type === "note" || field.type === "calculate";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-baseline gap-1">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--vita-text-primary)" }}
          htmlFor={field.id}
        >
          {field.label}
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
      {field.description && !isNonInput && (
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {field.description}
        </p>
      )}

      {/* Renderer */}
      <Renderer {...props} />

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
