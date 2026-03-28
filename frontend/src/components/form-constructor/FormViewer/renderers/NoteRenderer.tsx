"use client";

import { RichText } from "../../shared/RichText";
import type { FieldRendererProps } from "../../types";

export function NoteRenderer({ field }: FieldRendererProps) {
  return (
    <div
      className="rounded-vita-lg px-4 py-3"
      style={{
        background: "var(--vita-info-light, var(--vita-background))",
        border: "1px solid var(--vita-neutral-200)",
        color: "var(--vita-text-secondary)",
      }}
    >
      <RichText
        as="p"
        text={field.description || field.label}
        className="text-sm leading-relaxed"
      />
    </div>
  );
}
