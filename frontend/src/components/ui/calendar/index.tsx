/**
 * Calendar — Vita ERP calendar built on React Aria.
 *
 * Fully accessible with keyboard navigation (Arrow keys, Page Up/Down),
 * locale-aware formatting, and screen reader support.
 *
 * All visual properties driven by --vita-calendar-* CSS custom properties.
 *
 * Usage:
 *   <Calendar value={date} onChange={setDate}>
 *     <CalendarHeader>
 *       <CalendarNavButton slot="previous" />
 *       <CalendarHeading />
 *       <CalendarNavButton slot="next" />
 *     </CalendarHeader>
 *     <CalendarGrid>
 *       <CalendarGridHeader>
 *         {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
 *       </CalendarGridHeader>
 *       <CalendarGridBody>
 *         {(date) => <CalendarCell date={date} />}
 *       </CalendarGridBody>
 *     </CalendarGrid>
 *   </Calendar>
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  type CalendarCellProps as AriaCalendarCellProps,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  type CalendarProps as AriaCalendarProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  type DateValue,
} from "react-aria-components";

// ── Calendar Root ───────────────────────────────────────────────────────────

export interface CalendarRootProps<T extends DateValue = DateValue>
  extends Omit<AriaCalendarProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  onMouseMove?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}

function CalendarRootInner<T extends DateValue = DateValue>(
  {
    className,
    style,
    onMouseMove,
    onMouseLeave,
    children,
    ...ariaProps
  }: CalendarRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaCalendar<T>
      {...ariaProps}
      ref={ref}
      data-slot="calendar"
      className={["vita-calendar", className].filter(Boolean).join(" ")}
      style={{
        borderRadius: "var(--vita-calendar-radius, 8px)",
        borderTopWidth: "var(--vita-calendar-border-top, 1px)",
        borderRightWidth: "var(--vita-calendar-border-right, 1px)",
        borderBottomWidth: "var(--vita-calendar-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-calendar-border-left, 1px)",
        borderStyle:
          "var(--vita-calendar-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-neutral-200)",
        boxShadow: "var(--vita-calendar-shadow, none)",
        backgroundColor: "var(--vita-surface)",
        padding: "16px",
        transitionProperty: "transform, box-shadow, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-calendar-transition-duration, 150ms)",
        transform:
          "perspective(800px)" +
          " rotateX(var(--vita-calendar-rotate-x, 0deg))" +
          " rotateY(var(--vita-calendar-rotate-y, 0deg))" +
          " rotateZ(var(--vita-calendar-rotate-z, 0deg))",
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </AriaCalendar>
  );
}

const CalendarWithRef = forwardRef(CalendarRootInner) as <
  T extends DateValue = DateValue,
>(
  props: CalendarRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof CalendarRootInner>;

export { CalendarWithRef as Calendar, CalendarWithRef as CalendarRoot };

// ── Calendar Header ─────────────────────────────────────────────────────────

export interface CalendarHeaderProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export function CalendarHeader({
  className,
  style,
  children,
}: CalendarHeaderProps) {
  return (
    <header
      data-slot="calendar-header"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        marginBottom: "12px",
        ...style,
      }}
    >
      {children}
    </header>
  );
}

// ── Calendar Heading ────────────────────────────────────────────────────────

export interface CalendarHeadingProps
  extends Omit<AriaHeadingProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarHeadingInner(
  { className, style, ...ariaProps }: CalendarHeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <AriaHeading
      {...ariaProps}
      ref={ref}
      data-slot="calendar-heading"
      className={className}
      style={{
        flex: 1,
        textAlign: "center",
        fontSize: "14px",
        fontWeight: 600,
        margin: 0,
        color: "var(--vita-text-primary)",
        ...style,
      }}
    />
  );
}

export const CalendarHeading = forwardRef(CalendarHeadingInner);
CalendarHeading.displayName = "CalendarHeading";

// ── Calendar Nav Button ─────────────────────────────────────────────────────

export interface CalendarNavButtonProps
  extends Omit<AriaButtonProps, "className" | "style" | "children"> {
  slot?: "previous" | "next";
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

function CalendarNavButtonInner(
  { className, style, children, ...ariaProps }: CalendarNavButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const isPrev = ariaProps.slot === "previous";

  return (
    <AriaButton
      {...ariaProps}
      ref={ref}
      data-slot="calendar-nav-button"
      className={className}
      style={{
        appearance: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        color: "var(--vita-text-secondary)",
        outline: "none",
        ...style,
      }}
    >
      {children ?? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isPrev ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
        </svg>
      )}
    </AriaButton>
  );
}

export const CalendarNavButton = forwardRef(CalendarNavButtonInner);
CalendarNavButton.displayName = "CalendarNavButton";

// ── Grid sub-components (thin wrappers for theming) ─────────────────────────

export interface CalendarGridProps
  extends Omit<AriaCalendarGridProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarGridInner(
  { className, style, children, ...ariaProps }: CalendarGridProps,
  ref: ForwardedRef<HTMLTableElement>,
) {
  return (
    <AriaCalendarGrid
      {...ariaProps}
      ref={ref}
      data-slot="calendar-grid"
      className={className}
      style={{ width: "100%", borderSpacing: 0, ...style }}
    >
      {children}
    </AriaCalendarGrid>
  );
}

export const CalendarGrid = forwardRef(CalendarGridInner);
CalendarGrid.displayName = "CalendarGrid";

export interface CalendarGridHeaderProps
  extends Omit<AriaCalendarGridHeaderProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarGridHeaderInner(
  { className, style, children, ...ariaProps }: CalendarGridHeaderProps,
  ref: ForwardedRef<HTMLTableSectionElement>,
) {
  return (
    <AriaCalendarGridHeader
      {...ariaProps}
      ref={ref}
      data-slot="calendar-grid-header"
      className={className}
      style={style}
    >
      {children}
    </AriaCalendarGridHeader>
  );
}

export const CalendarGridHeader = forwardRef(CalendarGridHeaderInner);
CalendarGridHeader.displayName = "CalendarGridHeader";

export interface CalendarGridBodyProps
  extends Omit<AriaCalendarGridBodyProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarGridBodyInner(
  { className, style, children, ...ariaProps }: CalendarGridBodyProps,
  ref: ForwardedRef<HTMLTableSectionElement>,
) {
  return (
    <AriaCalendarGridBody
      {...ariaProps}
      ref={ref}
      data-slot="calendar-grid-body"
      className={className}
      style={style}
    >
      {children}
    </AriaCalendarGridBody>
  );
}

export const CalendarGridBody = forwardRef(CalendarGridBodyInner);
CalendarGridBody.displayName = "CalendarGridBody";

export interface CalendarHeaderCellProps
  extends Omit<AriaCalendarHeaderCellProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarHeaderCellInner(
  { className, style, children, ...ariaProps }: CalendarHeaderCellProps,
  ref: ForwardedRef<HTMLTableCellElement>,
) {
  return (
    <AriaCalendarHeaderCell
      {...ariaProps}
      ref={ref}
      data-slot="calendar-header-cell"
      className={className}
      style={{
        fontSize: "12px",
        fontWeight: 500,
        color: "var(--vita-text-muted)",
        padding: "4px 0",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </AriaCalendarHeaderCell>
  );
}

export const CalendarHeaderCell = forwardRef(CalendarHeaderCellInner);
CalendarHeaderCell.displayName = "CalendarHeaderCell";

export interface CalendarCellProps
  extends Omit<AriaCalendarCellProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function CalendarCellInner(
  { className, style, ...ariaProps }: CalendarCellProps,
  ref: ForwardedRef<HTMLTableCellElement>,
) {
  return (
    <AriaCalendarCell
      {...ariaProps}
      ref={ref}
      data-slot="calendar-cell"
      className={["vita-calendar-cell", className].filter(Boolean).join(" ")}
      style={{
        width: "calc(100% / 7)",
        aspectRatio: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        borderRadius: "9999px",
        cursor: "pointer",
        outline: "none",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    />
  );
}

export const CalendarCell = forwardRef(CalendarCellInner);
CalendarCell.displayName = "CalendarCell";

// Re-export DateValue for consumer convenience
export type { DateValue };
