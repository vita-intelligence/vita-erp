/**
 * DateRangePicker — Vita ERP date range picker built on React Aria.
 *
 * Accessible date range selection with dual calendar view.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import type { DateValue } from "react-aria-components";
import {
  Button as AriaButton,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  DateSegment as AriaDateSegment,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Popover as AriaPopover,
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components";

export interface DateRangePickerProps<T extends DateValue = DateValue>
  extends Omit<AriaDateRangePickerProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function DateRangePickerInner<T extends DateValue = DateValue>(
  { className, style, children, ...ariaProps }: DateRangePickerProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDateRangePicker<T>
      {...ariaProps}
      ref={ref}
      data-slot="date-range-picker"
      className={["vita-date-range-picker", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children ?? (
        <>
          <AriaGroup
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "var(--vita-input-radius, 8px)",
              border:
                "1px solid var(--vita-date-picker-border-color, var(--vita-input-border-color))",
              backgroundColor: "var(--vita-surface)",
              padding: "8px 12px",
            }}
          >
            <AriaDateInput slot="start" style={{ display: "flex", gap: "1px" }}>
              {(segment) => (
                <AriaDateSegment
                  segment={segment}
                  style={{
                    padding: "0 2px",
                    fontSize: "14px",
                    outline: "none",
                    color: segment.isPlaceholder
                      ? "var(--vita-text-muted)"
                      : "var(--vita-text-primary)",
                  }}
                />
              )}
            </AriaDateInput>
            <span style={{ color: "var(--vita-text-muted)", padding: "0 4px" }}>
              –
            </span>
            <AriaDateInput slot="end" style={{ display: "flex", gap: "1px" }}>
              {(segment) => (
                <AriaDateSegment
                  segment={segment}
                  style={{
                    padding: "0 2px",
                    fontSize: "14px",
                    outline: "none",
                    color: segment.isPlaceholder
                      ? "var(--vita-text-muted)"
                      : "var(--vita-text-primary)",
                  }}
                />
              )}
            </AriaDateInput>
            <AriaButton
              style={{
                appearance: "none",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--vita-text-muted)",
                padding: "0 0 0 8px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </AriaButton>
          </AriaGroup>
          <AriaPopover
            style={{
              backgroundColor: "var(--vita-surface)",
              borderRadius: "8px",
              border:
                "1px solid var(--vita-date-picker-border-color, var(--vita-neutral-200))",
              boxShadow: "0 4px 16px oklch(0 0 0 / 0.08)",
              padding: "12px",
            }}
          >
            <AriaDialog style={{ outline: "none" }}>
              <AriaRangeCalendar />
            </AriaDialog>
          </AriaPopover>
        </>
      )}
    </AriaDateRangePicker>
  );
}

export const DateRangePicker = forwardRef(DateRangePickerInner) as <
  T extends DateValue = DateValue,
>(
  props: DateRangePickerProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof DateRangePickerInner>;

export { AriaRangeCalendar as RangeCalendar };
export type { AriaRangeCalendarProps as RangeCalendarProps };
