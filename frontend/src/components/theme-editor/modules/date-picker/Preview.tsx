"use client";

/**
 * Live date picker preview — simulated trigger + popover with a calendar
 * so CSS tokens from date-picker.css apply visually.
 *
 * Since HeroUI does not ship a DatePicker component in this project,
 * the preview is built with styled divs that reflect the current token values.
 */

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ── Preview ──────────────────────────────────────────────────────────────────

export function Preview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();
  const [selectedDate] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(true);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const indicatorSize = tokens.datePickerIndicatorSize ?? "18px";

  // ── Trigger styles ─────────────────────────────────────────────────────

  const triggerStyle: React.CSSProperties = {
    borderRadius: tokens.datePickerTriggerRadius ?? "0px",
    borderWidth: tokens.datePickerTriggerBorderWidth ?? "1px",
    borderStyle: (tokens.datePickerTriggerBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-300)",
    paddingLeft: tokens.datePickerTriggerPaddingX ?? "12px",
    paddingRight: tokens.datePickerTriggerPaddingX ?? "12px",
    paddingTop: tokens.datePickerTriggerPaddingY ?? "8px",
    paddingBottom: tokens.datePickerTriggerPaddingY ?? "8px",
    boxShadow: tokens.datePickerTriggerShadow ?? "none",
    transitionDuration: tokens.datePickerTransitionDuration ?? "150ms",
    transitionProperty: "border-color, box-shadow",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    width: "100%",
    background: "var(--vita-surface)",
    cursor: "pointer",
  };

  // ── Popover styles ─────────────────────────────────────────────────────

  const popoverStyle: React.CSSProperties = {
    borderRadius: tokens.datePickerPopoverRadius ?? "0px",
    boxShadow: tokens.datePickerPopoverShadow ?? "none",
    padding: tokens.datePickerPopoverPadding ?? "12px",
    border: "1px solid var(--vita-neutral-200)",
    background: "var(--vita-surface)",
    marginTop: "4px",
  };

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      {/* Label */}
      <span
        style={{
          fontWeight: 500,
          fontSize: "12px",
          color: "var(--vita-text-secondary)",
          display: "block",
        }}
      >
        Due date
      </span>

      {/* Trigger */}
      <button
        type="button"
        style={triggerStyle}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span
          style={{
            fontSize: "14px",
            color: "var(--vita-text-primary)",
          }}
        >
          {formatDate(selectedDate)}
        </span>
        <CalendarDays
          style={{
            width: indicatorSize,
            height: indicatorSize,
            color: "var(--vita-text-muted)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Popover (always shown for preview) */}
      {isOpen && (
        <div style={popoverStyle}>
          {/* Month header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--vita-text-primary)",
              }}
            >
              {now.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Weekday headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              textAlign: "center",
              marginBottom: "4px",
            }}
          >
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--vita-text-muted)",
                  padding: "2px 0",
                }}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Day cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              textAlign: "center",
            }}
          >
            {/* Leading empty cells */}
            {["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
              .slice(0, firstDay)
              .map((day) => (
                <span key={`pad-${day}`} />
              ))}

            {/* Day numbers */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === todayDate;
              return (
                <span
                  key={day}
                  style={{
                    fontSize: "12px",
                    padding: "4px 2px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: isToday ? 700 : 400,
                    background: isToday ? "var(--vita-primary)" : "transparent",
                    color: isToday
                      ? "var(--vita-text-on-primary)"
                      : "var(--vita-text-primary)",
                  }}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
