"use client";

/**
 * Live calendar preview — March 2026 mini calendar with token-driven styles.
 */

import { useThemeStore } from "@/stores/theme";

import type { CellState } from "./calendar-data";
import { MARCH_2026, WEEKDAYS } from "./calendar-data";

// ── Helpers ──────────────────────────────────────────────────────────────────

function cellColors(state: CellState): {
  bg: string;
  color: string;
  fontWeight: React.CSSProperties["fontWeight"];
} {
  switch (state) {
    case "today":
      return {
        bg: "var(--vita-primary)",
        color: "var(--vita-text-on-primary)",
        fontWeight: 700,
      };
    case "selected":
      return {
        bg: "var(--vita-primary-light)",
        color: "var(--vita-text-primary)",
        fontWeight: 600,
      };
    case "other-month":
      return {
        bg: "transparent",
        color: "var(--vita-text-muted)",
        fontWeight: 400,
      };
    default:
      return {
        bg: "transparent",
        color: "var(--vita-text-secondary)",
        fontWeight: 400,
      };
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function Preview() {
  const { tokens } = useThemeStore();

  const radius = tokens.calendarRadius ?? "0px";
  const borderTop = tokens.calendarBorderTop ?? "1px";
  const borderRight = tokens.calendarBorderRight ?? "1px";
  const borderBottom = tokens.calendarBorderBottom ?? "1px";
  const borderLeft = tokens.calendarBorderLeft ?? "1px";
  const borderStyle = (tokens.calendarBorderStyle ??
    "solid") as React.CSSProperties["borderStyle"];
  const shadow = tokens.calendarShadow ?? "none";
  const cellSize = tokens.calendarCellSize ?? "36px";
  const cellRadius = tokens.calendarCellRadius ?? "0px";
  const cellFontSize = tokens.calendarCellFontSize ?? "13px";
  const headerFontSize = tokens.calendarHeaderFontSize ?? "15px";
  const headerFontWeight = (tokens.calendarHeaderFontWeight ??
    "600") as React.CSSProperties["fontWeight"];
  const weekdayFontSize = tokens.calendarWeekdayFontSize ?? "11px";
  const padding = tokens.calendarPadding ?? "12px";

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      {/* Calendar panel */}
      <div
        style={{
          borderRadius: radius,
          borderTopWidth: borderTop,
          borderRightWidth: borderRight,
          borderBottomWidth: borderBottom,
          borderLeftWidth: borderLeft,
          borderStyle,
          borderColor: "var(--vita-neutral-200)",
          boxShadow: shadow,
          padding,
          background: "var(--vita-surface)",
          display: "inline-block",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <ChevronBtn direction="left" />
          <span
            className="font-vita-heading"
            style={{
              fontSize: headerFontSize,
              fontWeight: headerFontWeight,
              color: "var(--vita-text-primary)",
            }}
          >
            March 2026
          </span>
          <ChevronBtn direction="right" />
        </div>

        {/* Weekday labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${cellSize})`,
            gap: "2px",
            marginBottom: "4px",
          }}
        >
          {WEEKDAYS.map((wd) => (
            <span
              key={wd}
              style={{
                fontSize: weekdayFontSize,
                fontWeight: 500,
                color: "var(--vita-text-muted)",
                textAlign: "center",
                lineHeight: cellSize,
              }}
            >
              {wd}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${cellSize})`,
            gap: "2px",
          }}
        >
          {MARCH_2026.map((cell, i) => {
            const { bg, color, fontWeight } = cellColors(cell.state);
            return (
              <span
                key={`${cell.state}-${cell.day}-${i}`}
                className="font-vita-mono"
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: cellRadius,
                  fontSize: cellFontSize,
                  fontWeight,
                  background: bg,
                  color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: cell.state === "other-month" ? 0.4 : 1,
                }}
              >
                {cell.day}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Internal chevron button ──────────────────────────────────────────────────

function ChevronBtn({ direction }: { direction: "left" | "right" }) {
  const path = direction === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5";
  return (
    <button
      type="button"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        color: "var(--vita-text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
