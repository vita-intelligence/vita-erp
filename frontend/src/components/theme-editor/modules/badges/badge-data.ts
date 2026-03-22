/**
 * Badge preview data — variant samples and in-context order list.
 */

export type BadgeEntry = {
  label: string;
  bg: string;
  color: string;
  border?: string;
};

export const SOLID_BADGES: BadgeEntry[] = [
  {
    label: "Completed",
    bg: "var(--vita-success)",
    color: "var(--vita-text-on-primary)",
  },
  {
    label: "In Progress",
    bg: "var(--vita-warning)",
    color: "var(--vita-text-on-warning)",
  },
  {
    label: "Failed",
    bg: "var(--vita-error)",
    color: "var(--vita-text-on-danger)",
  },
  {
    label: "Draft",
    bg: "var(--vita-neutral-200)",
    color: "var(--vita-text-secondary)",
  },
  {
    label: "Active",
    bg: "var(--vita-primary)",
    color: "var(--vita-text-on-primary)",
  },
  {
    label: "Info",
    bg: "var(--vita-info)",
    color: "var(--vita-text-on-primary)",
  },
];

export const SOFT_BADGES: BadgeEntry[] = [
  {
    label: "Completed",
    bg: "var(--vita-success-light)",
    color: "var(--vita-success-dark)",
    border: "var(--vita-success)",
  },
  {
    label: "Warning",
    bg: "var(--vita-warning-light)",
    color: "var(--vita-text-on-warning)",
    border: "var(--vita-warning)",
  },
  {
    label: "Error",
    bg: "var(--vita-error-light)",
    color: "var(--vita-error-dark)",
    border: "var(--vita-error)",
  },
  {
    label: "Neutral",
    bg: "var(--vita-neutral-50)",
    color: "var(--vita-text-secondary)",
    border: "var(--vita-neutral-300)",
  },
  {
    label: "Info",
    bg: "var(--vita-info-light)",
    color: "var(--vita-info-dark)",
    border: "var(--vita-info)",
  },
];

export const CONTEXT_ORDERS = [
  {
    name: "ORD-00842 · Steel Frame A-14",
    status: "In Progress",
    bg: "var(--vita-warning)",
    color: "var(--vita-text-on-warning)",
  },
  {
    name: "ORD-00841 · Bolt Assembly B2",
    status: "Completed",
    bg: "var(--vita-success)",
    color: "var(--vita-text-on-primary)",
  },
  {
    name: "ORD-00840 · Weld Joint C6",
    status: "Failed",
    bg: "var(--vita-error)",
    color: "var(--vita-text-on-danger)",
  },
  {
    name: "ORD-00839 · Cover Plate D1",
    status: "Draft",
    bg: "var(--vita-neutral-200)",
    color: "var(--vita-text-secondary)",
  },
];
