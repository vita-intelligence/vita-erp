"use client";

/**
 * DropZone — a thin droppable area between elements in the form editor.
 *
 * When a drag is active, drop zones expand and highlight to show where
 * the dragged element can be placed. When no drag is active, they
 * collapse to zero height (invisible).
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
    // Invisible spacer when no drag is active
    return <div style={{ height: 2 }} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        height: isOver ? 40 : 8,
        borderRadius: 6,
        border: isOver
          ? "2px dashed var(--vita-primary)"
          : "2px dashed transparent",
        background: isOver
          ? "var(--vita-primary-light, oklch(0.95 0.02 250))"
          : "transparent",
        transition: "all 150ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isOver && (
        <span
          style={{
            fontSize: 11,
            color: "var(--vita-primary)",
            fontWeight: 500,
          }}
        >
          ↓
        </span>
      )}
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
