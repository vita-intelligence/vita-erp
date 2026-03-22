"use client";

/**
 * DropZone — a droppable area between elements in the form editor.
 *
 * When a drag is active, ALL drop zones are visible (thin dashed line).
 * When the pointer hovers over a specific zone, it expands and highlights
 * to show this is where the element will land.
 * When no drag is active, drop zones collapse to invisible.
 *
 * ID format: "drop:{containerId}:{index}"
 *   - containerId = "root" for top-level, or a group ID for inside a group
 *   - index = insertion position (0 = before first, N = after last)
 */

import { useDroppable } from "@dnd-kit/core";

type DropZoneProps = {
  /** Unique droppable ID in the format "drop:{container}:{index}" */
  id: string;
  /** Whether a drag is currently happening */
  isDragActive: boolean;
};

export function DropZone({ id, isDragActive }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  if (!isDragActive) {
    return <div style={{ height: 2 }} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        height: isOver ? 44 : 24,
        borderRadius: 6,
        border: isOver
          ? "2px dashed var(--vita-primary)"
          : "1px dashed var(--vita-neutral-300)",
        background: isOver
          ? "var(--vita-primary-light, oklch(0.95 0.02 250))"
          : "var(--vita-neutral-50, #f9fafb)",
        transition: "all 120ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: isOver ? "var(--vita-primary)" : "var(--vita-neutral-400)",
          fontWeight: 500,
          opacity: isOver ? 1 : 0.6,
        }}
      >
        {isOver ? "↓ Drop here" : "—"}
      </span>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a drop zone ID into container and index. */
export function parseDropZoneId(id: string): {
  container: string;
  index: number;
} | null {
  if (!id.startsWith("drop:")) return null;
  const parts = id.split(":");
  if (parts.length !== 3) return null;
  return { container: parts[1], index: Number.parseInt(parts[2], 10) };
}
