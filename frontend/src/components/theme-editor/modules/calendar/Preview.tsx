"use client";

/**
 * Live calendar preview — uses real HeroUI Calendar so CSS tokens
 * from calendar.css apply automatically via `.calendar` BEM classes.
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

export function Preview() {
  const todayDate = today(getLocalTimeZone());
  const [value, setValue] = useState(todayDate);

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      <Calendar value={value} onChange={setValue} aria-label="Calendar preview">
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
