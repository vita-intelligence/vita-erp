"use client";

import type { FieldRendererProps } from "../../types";

/**
 * MetadataRenderer — displays auto-captured metadata values
 * (start_timestamp, end_timestamp, username).
 * These are typically hidden but can be made visible for debugging.
 */
export function MetadataRenderer({ value }: FieldRendererProps) {
  const display = value !== undefined && value !== null ? String(value) : "—";

  return (
    <div
      className="rounded-vita-lg px-4 py-3 font-mono text-sm"
      style={{
        background: "var(--vita-background)",
        border: "1px solid var(--vita-neutral-200)",
        color: "var(--vita-text-muted)",
      }}
    >
      {display}
    </div>
  );
}
