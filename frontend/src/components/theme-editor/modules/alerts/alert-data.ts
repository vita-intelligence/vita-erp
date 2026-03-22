/**
 * Alert preview sample data — status variants with semantic colors.
 */

export const ALERT_VARIANTS = [
  {
    status: "success",
    title: "Order completed",
    description: "Production order #00842 has been fulfilled and shipped.",
    bg: "var(--vita-success-light)",
    border: "var(--vita-success)",
    iconColor: "var(--vita-success-dark)",
    titleColor: "var(--vita-success-dark)",
  },
  {
    status: "warning",
    title: "Low stock alert",
    description: "Steel Frame A-14 inventory is below reorder threshold.",
    bg: "var(--vita-warning-light)",
    border: "var(--vita-warning)",
    iconColor: "var(--vita-warning-dark)",
    titleColor: "var(--vita-text-on-warning)",
  },
  {
    status: "danger",
    title: "Machine offline",
    description:
      "CNC Mill #3 reported a fault — maintenance has been notified.",
    bg: "var(--vita-error-light)",
    border: "var(--vita-error)",
    iconColor: "var(--vita-error-dark)",
    titleColor: "var(--vita-error-dark)",
  },
  {
    status: "info",
    title: "Scheduled maintenance",
    description: "System will be unavailable Saturday 02:00–04:00 UTC.",
    bg: "var(--vita-info-light)",
    border: "var(--vita-info)",
    iconColor: "var(--vita-info-dark)",
    titleColor: "var(--vita-info-dark)",
  },
] as const;
