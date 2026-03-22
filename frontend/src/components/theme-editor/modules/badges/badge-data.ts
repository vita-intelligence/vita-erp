/**
 * Badge preview data — variant samples and in-context order list.
 *
 * Labels use translation keys from `preview.badges.*` in themeEditor.json.
 * The `labelKey` field stores the i18n key suffix; components resolve it
 * via `t(`preview.badges.${entry.labelKey}`)`.
 */

export type BadgeEntry = {
  labelKey: string;
  bg: string;
  color: string;
  border?: string;
};

export const SOLID_BADGES: BadgeEntry[] = [
  {
    labelKey: "completed",
    bg: "var(--vita-success)",
    color: "var(--vita-text-on-primary)",
  },
  {
    labelKey: "inProgress",
    bg: "var(--vita-warning)",
    color: "var(--vita-text-on-warning)",
  },
  {
    labelKey: "failed",
    bg: "var(--vita-error)",
    color: "var(--vita-text-on-danger)",
  },
  {
    labelKey: "draft",
    bg: "var(--vita-neutral-200)",
    color: "var(--vita-text-secondary)",
  },
  {
    labelKey: "active",
    bg: "var(--vita-primary)",
    color: "var(--vita-text-on-primary)",
  },
  {
    labelKey: "info",
    bg: "var(--vita-info)",
    color: "var(--vita-text-on-primary)",
  },
];

export const SOFT_BADGES: BadgeEntry[] = [
  {
    labelKey: "completed",
    bg: "var(--vita-success-light)",
    color: "var(--vita-success-dark)",
    border: "var(--vita-success)",
  },
  {
    labelKey: "warning",
    bg: "var(--vita-warning-light)",
    color: "var(--vita-text-on-warning)",
    border: "var(--vita-warning)",
  },
  {
    labelKey: "error",
    bg: "var(--vita-error-light)",
    color: "var(--vita-error-dark)",
    border: "var(--vita-error)",
  },
  {
    labelKey: "neutral",
    bg: "var(--vita-neutral-50)",
    color: "var(--vita-text-secondary)",
    border: "var(--vita-neutral-300)",
  },
  {
    labelKey: "info",
    bg: "var(--vita-info-light)",
    color: "var(--vita-info-dark)",
    border: "var(--vita-info)",
  },
];

export type ContextOrder = {
  nameKey: string;
  statusKey: string;
  bg: string;
  color: string;
};

export const CONTEXT_ORDERS: ContextOrder[] = [
  {
    nameKey: "orderSteelFrame",
    statusKey: "inProgress",
    bg: "var(--vita-warning)",
    color: "var(--vita-text-on-warning)",
  },
  {
    nameKey: "orderBoltAssembly",
    statusKey: "completed",
    bg: "var(--vita-success)",
    color: "var(--vita-text-on-primary)",
  },
  {
    nameKey: "orderWeldJoint",
    statusKey: "failed",
    bg: "var(--vita-error)",
    color: "var(--vita-text-on-danger)",
  },
  {
    nameKey: "orderCoverPlate",
    statusKey: "draft",
    bg: "var(--vita-neutral-200)",
    color: "var(--vita-text-secondary)",
  },
];
