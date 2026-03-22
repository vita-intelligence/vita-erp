"use client";

/**
 * Live calendar preview — uses real HeroUI Calendar so CSS tokens
 * from calendar.css apply automatically via `.calendar` BEM classes.
 *
 * When cursor tracking is enabled, the calendar tilts with the cursor.
 */

import { getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeaderCell,
  CalendarHeading,
  CalendarNavButton,
} from "@/components/ui/calendar";
import { useThemeStore } from "@/stores/theme";

import { useCursorTrack } from "../_shared/useCursorTrack";

export function Preview() {
  const todayDate = today(getLocalTimeZone());
  const [value, setValue] = useState(todayDate);
  const { tokens } = useThemeStore();

  const trackIntensity = parseFloat(tokens.calendarCursorTrack ?? "0");
  const trackRestore = parseFloat(tokens.calendarCursorTrackRestore ?? "300");
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "calendar",
    trackIntensity,
    trackRestore,
  );

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
        {trackIntensity > 0 && (
          <span className="ml-2 normal-case opacity-60">
            — move cursor over calendar
          </span>
        )}
      </p>

      <Calendar
        value={value}
        onChange={setValue}
        aria-label="Calendar preview"
        onMouseMove={trackIntensity > 0 ? onMouseMove : undefined}
        onMouseLeave={trackIntensity > 0 ? onMouseLeave : undefined}
      >
        <CalendarHeader>
          <CalendarNavButton slot="previous" />
          <CalendarHeading />
          <CalendarNavButton slot="next" />
        </CalendarHeader>
        <CalendarGrid>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </div>
  );
}
