/**
 * DatePicker — Vita ERP date picker built on React Aria.
 *
 * Accessible date picker with calendar popover, keyboard navigation,
 * and locale-aware formatting.
 * All visual properties driven by --vita-date-picker-* CSS custom properties.
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
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateSegment as AriaDateSegment,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Heading as AriaHeading,
  Popover as AriaPopover,
} from "react-aria-components";

// ── Root ────────────────────────────────────────────────────────────────────

export interface DatePickerRootProps<T extends DateValue = DateValue>
  extends Omit<AriaDatePickerProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function DatePickerRootInner<T extends DateValue = DateValue>(
  { className, style, children, ...ariaProps }: DatePickerRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDatePicker<T>
      {...ariaProps}
      ref={ref}
      data-slot="date-picker"
      className={["vita-date-picker", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </AriaDatePicker>
  );
}

const DatePickerRootWithRef = forwardRef(DatePickerRootInner) as <
  T extends DateValue = DateValue,
>(
  props: DatePickerRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof DatePickerRootInner>;

export { DatePickerRootWithRef as DatePickerRoot };

// ── Trigger ─────────────────────────────────────────────────────────────────

export interface DatePickerTriggerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function DatePickerTriggerInner(
  { className, style, children }: DatePickerTriggerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaGroup
      ref={ref}
      data-slot="date-picker-trigger"
      className={["vita-date-picker-trigger", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius:
          "var(--vita-date-picker-trigger-radius, var(--vita-input-radius, 8px))",
        border: "1px solid var(--vita-input-border-color)",
        backgroundColor: "var(--vita-surface)",
        padding:
          "var(--vita-date-picker-trigger-padding-y, 8px) var(--vita-date-picker-trigger-padding-x, 12px)",
        boxShadow: "var(--vita-date-picker-trigger-shadow, none)",
        transitionDuration:
          "var(--vita-date-picker-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children ?? (
        <>
          <AriaDateInput
            data-slot="date-picker-input"
            style={{ display: "flex", gap: "1px", flex: 1 }}
          >
            {(segment) => (
              <AriaDateSegment
                segment={segment}
                style={{
                  padding: "0 2px",
                  fontSize: "var(--vita-input-font-size, 14px)",
                  color: segment.isPlaceholder
                    ? "var(--vita-text-muted)"
                    : "var(--vita-text-primary)",
                  outline: "none",
                }}
              />
            )}
          </AriaDateInput>
          <AriaButton
            data-slot="date-picker-indicator"
            style={{
              appearance: "none",
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "0 0 0 8px",
              color: "var(--vita-text-muted)",
            }}
          >
            <svg
              width="var(--vita-date-picker-indicator-size, 18px)"
              height="var(--vita-date-picker-indicator-size, 18px)"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </AriaButton>
        </>
      )}
    </AriaGroup>
  );
}

export const DatePickerTrigger = forwardRef(DatePickerTriggerInner);
DatePickerTrigger.displayName = "DatePickerTrigger";

// ── TriggerIndicator (for compatibility) ────────────────────────────────────

export function DatePickerTriggerIndicator({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      data-slot="date-picker-indicator"
      style={{ display: "inline-flex", ...style }}
    >
      {children}
    </span>
  );
}

// ── Popover ─────────────────────────────────────────────────────────────────

export interface DatePickerPopoverProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function DatePickerPopover({
  className,
  style,
  children,
}: DatePickerPopoverProps) {
  return (
    <AriaPopover
      data-slot="date-picker-popover"
      className={["vita-date-picker-popover", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        borderRadius: "var(--vita-date-picker-popover-radius, 8px)",
        boxShadow:
          "var(--vita-date-picker-popover-shadow, 0 4px 16px oklch(0 0 0 / 0.08))",
        border: "1px solid var(--vita-neutral-200)",
        padding: "var(--vita-date-picker-popover-padding, 12px)",
        ...style,
      }}
    >
      <AriaDialog style={{ outline: "none" }}>{children}</AriaDialog>
    </AriaPopover>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const DatePicker = Object.assign(DatePickerRootWithRef, {
  Root: DatePickerRootWithRef,
  Trigger: DatePickerTrigger,
  TriggerIndicator: DatePickerTriggerIndicator,
  Popover: DatePickerPopover,
});

// Re-export calendar building blocks for use inside popover
export {
  AriaCalendar as Calendar,
  AriaCalendarGrid as CalendarGrid,
  AriaCalendarGridHeader as CalendarGridHeader,
  AriaCalendarGridBody as CalendarGridBody,
  AriaCalendarHeaderCell as CalendarHeaderCell,
  AriaCalendarCell as CalendarCell,
  AriaHeading as CalendarHeading,
  AriaButton as CalendarNavButton,
};
