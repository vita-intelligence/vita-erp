/**
 * Calendar — Vita ERP wrapper for HeroUI Calendar.
 *
 * Applies theme tokens as inline styles on the Root sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * Includes 3D rotation (static + hover) via CSS custom properties
 * that are read from inline styles but composed in CSS for :hover.
 */

"use client";

import {
  type CalendarRootProps,
  Calendar as HeroCalendar,
  CalendarCell as HeroCalendarCell,
  CalendarCellIndicator as HeroCalendarCellIndicator,
  CalendarGrid as HeroCalendarGrid,
  CalendarGridBody as HeroCalendarGridBody,
  CalendarGridHeader as HeroCalendarGridHeader,
  CalendarHeader as HeroCalendarHeader,
  CalendarHeaderCell as HeroCalendarHeaderCell,
  CalendarHeading as HeroCalendarHeading,
  CalendarNavButton as HeroCalendarNavButton,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type CalendarCellIndicatorProps,
  type CalendarCellProps,
  type CalendarGridBodyProps,
  type CalendarGridHeaderProps,
  type CalendarGridProps,
  type CalendarHeaderCellProps,
  type CalendarHeaderProps,
  type CalendarHeadingProps,
  type CalendarNavButtonProps,
  type CalendarProps,
  type CalendarRootProps,
  type CalendarVariants,
  calendarVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
} from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedRoot({ children, style, ...props }: CalendarRootProps) {
  return (
    <HeroCalendar
      {...props}
      style={{
        borderRadius: "var(--vita-calendar-radius, 0px)",
        borderTopWidth: "var(--vita-calendar-border-top, 1px)",
        borderRightWidth: "var(--vita-calendar-border-right, 1px)",
        borderBottomWidth: "var(--vita-calendar-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-calendar-border-left, 1px)",
        borderStyle: "var(--vita-calendar-border-style, solid)",
        boxShadow: "var(--vita-calendar-shadow, none)",
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
    >
      {children}
    </HeroCalendar>
  );
}

// ── Named Exports (for direct imports) ───────────────────────────────────────

export { ThemedRoot as CalendarRoot };
export {
  HeroCalendarHeader as CalendarHeader,
  HeroCalendarHeading as CalendarHeading,
  HeroCalendarNavButton as CalendarNavButton,
  HeroCalendarGrid as CalendarGrid,
  HeroCalendarGridHeader as CalendarGridHeader,
  HeroCalendarGridBody as CalendarGridBody,
  HeroCalendarHeaderCell as CalendarHeaderCell,
  HeroCalendarCell as CalendarCell,
  HeroCalendarCellIndicator as CalendarCellIndicator,
};

// ── Compound Export ──────────────────────────────────────────────────────────

export const Calendar = Object.assign(ThemedRoot, {
  Root: ThemedRoot,
  Header: HeroCalendarHeader,
  Heading: HeroCalendarHeading,
  NavButton: HeroCalendarNavButton,
  Grid: HeroCalendarGrid,
  GridHeader: HeroCalendarGridHeader,
  GridBody: HeroCalendarGridBody,
  HeaderCell: HeroCalendarHeaderCell,
  Cell: HeroCalendarCell,
  CellIndicator: HeroCalendarCellIndicator,
});
