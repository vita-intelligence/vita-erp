"use client";

import type { FieldRendererProps } from "../../types";

/**
 * CalculateRenderer — displays the computed result of a calculation expression.
 * The actual computation is done in FormViewer and passed as `value`.
 */
export function CalculateRenderer({ value }: FieldRendererProps) {
  const display =
    value === undefined || value === null || Number.isNaN(value)
      ? "—"
      : String(value);

  return (
    <div
      className="rounded-vita-lg px-4 py-3 font-mono text-sm"
      style={{
        background: "var(--vita-background)",
        border: "1px solid var(--vita-neutral-200)",
        color: "var(--vita-text-primary)",
      }}
    >
      {display}
    </div>
  );
}
