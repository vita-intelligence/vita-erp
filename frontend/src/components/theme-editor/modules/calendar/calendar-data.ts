/**
 * Calendar preview data — March 2026 grid.
 */

export type CellState = "default" | "today" | "selected" | "other-month";

export type CalendarCell = {
  day: number;
  state: CellState;
};

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** March 2026 starts on Sunday. Grid shows Mon-Sun layout. */
export const MARCH_2026: CalendarCell[] = [
  // Previous month padding (Feb 23-28)
  { day: 23, state: "other-month" },
  { day: 24, state: "other-month" },
  { day: 25, state: "other-month" },
  { day: 26, state: "other-month" },
  { day: 27, state: "other-month" },
  { day: 28, state: "other-month" },
  // March starts on Sunday → column 7
  { day: 1, state: "default" },
  { day: 2, state: "default" },
  { day: 3, state: "default" },
  { day: 4, state: "default" },
  { day: 5, state: "default" },
  { day: 6, state: "default" },
  { day: 7, state: "default" },
  { day: 8, state: "default" },
  { day: 9, state: "default" },
  { day: 10, state: "default" },
  { day: 11, state: "default" },
  { day: 12, state: "default" },
  { day: 13, state: "selected" },
  { day: 14, state: "default" },
  { day: 15, state: "default" },
  { day: 16, state: "default" },
  { day: 17, state: "default" },
  { day: 18, state: "default" },
  { day: 19, state: "default" },
  { day: 20, state: "default" },
  { day: 21, state: "default" },
  { day: 22, state: "today" },
  { day: 23, state: "default" },
  { day: 24, state: "default" },
  { day: 25, state: "default" },
  { day: 26, state: "default" },
  { day: 27, state: "default" },
  { day: 28, state: "default" },
  { day: 29, state: "default" },
  { day: 30, state: "default" },
  { day: 31, state: "default" },
  // Next month padding (Apr 1-5)
  { day: 1, state: "other-month" },
  { day: 2, state: "other-month" },
  { day: 3, state: "other-month" },
  { day: 4, state: "other-month" },
  { day: 5, state: "other-month" },
];
