"use client";

/**
 * DropZone — a droppable area between elements in the form editor.
 *
 * - `hidden` — zones adjacent to the dragged element are hidden
 * - `isLast` — the final zone gets extra bottom padding so it's reachable
 * - Info color highlight on hover with plus icon
 */

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

type DropZoneProps = {
  id: string;
  isDragActive: boolean;
  /** Hide this zone (adjacent to dragged element's current position) */
  hidden?: boolean;
  /** Last zone in a container — gets extra padding so pointer can reach it */
  isLast?: boolean;
};

export function DropZone({
  id,
  isDragActive,
  hidden = false,
  isLast = false,
}: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  if (!isDragActive) {
    return <div style={{ height: 2 }} />;
  }

  if (hidden) {
    // Still register as droppable but visually invisible
    return <div ref={setNodeRef} style={{ height: 4 }} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        height: isOver ? 56 : 36,
        borderRadius: 8,
        border: isOver
          ? "2px solid var(--vita-info)"
          : "2px dashed var(--vita-neutral-300)",
        background: isOver
          ? "var(--vita-info-light, oklch(0.93 0.03 240))"
          : "transparent",
        transition: "all 100ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "default",
        // Last zone gets extra bottom margin so there's space to hover into it
        marginBottom: isLast ? 40 : 0,
      }}
    >
      <Plus
        size={isOver ? 16 : 14}
        style={{
          color: isOver
            ? "var(--vita-info-dark, #1d4ed8)"
            : "var(--vita-neutral-400)",
          transition: "all 100ms ease",
        }}
      />
      {isOver && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--vita-info-dark, #1d4ed8)",
          }}
        >
          Drop here
        </span>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function parseDropZoneId(id: string): {
  container: string;
  index: number;
} | null {
  if (!id.startsWith("drop:")) return null;
  const parts = id.split(":");
  if (parts.length !== 3) return null;
  return { container: parts[1], index: Number.parseInt(parts[2], 10) };
}
