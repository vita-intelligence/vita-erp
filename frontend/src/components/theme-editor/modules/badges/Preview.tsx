"use client";

/**
 * Live badge preview — solid, soft/outlined, and in-context styles.
 */

// ── Types & helpers ──────────────────────────────────────────────────────────

type BadgeEntry = { label: string; bg: string; color: string; border?: string };

function badgeStyle(
  bg: string,
  color: string,
  border?: string,
): React.CSSProperties {
  return {
    borderRadius: "var(--vita-badge-radius)",
    fontWeight:
      "var(--vita-badge-font-weight)" as React.CSSProperties["fontWeight"],
    fontSize: "0.6875rem",
    padding: "0.2rem 0.55rem",
    background: bg,
    color,
    border: border ? `1px solid ${border}` : "1px solid transparent",
    display: "inline-block",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  };
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SOLID_BADGES: BadgeEntry[] = [
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
    color: "var(--vita-neutral-700)",
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

const SOFT_BADGES: BadgeEntry[] = [
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
    color: "var(--vita-neutral-600)",
    border: "var(--vita-neutral-300)",
  },
  {
    label: "Info",
    bg: "var(--vita-info-light)",
    color: "var(--vita-info-dark)",
    border: "var(--vita-info)",
  },
];

const CONTEXT_ORDERS = [
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
    color: "var(--vita-neutral-700)",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function Preview() {
  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-neutral-400">
        Live preview
      </p>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">Solid</p>
        <div className="flex flex-wrap gap-2">
          {SOLID_BADGES.map(({ label, bg, color }) => (
            <span key={label} style={badgeStyle(bg, color)}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">Soft / outlined</p>
        <div className="flex flex-wrap gap-2">
          {SOFT_BADGES.map(({ label, bg, color, border }) => (
            <span key={label} style={badgeStyle(bg, color, border)}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">In context</p>
        <div
          style={{
            background: "var(--vita-surface)",
            borderRadius: "var(--vita-card-radius)",
            border: `var(--vita-card-border-width) solid var(--vita-neutral-200)`,
            overflow: "hidden",
          }}
        >
          {CONTEXT_ORDERS.map(({ name, status, bg, color }) => (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.875rem",
                borderBottom: "1px solid var(--vita-neutral-100)",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--vita-text-primary)",
                }}
              >
                {name}
              </span>
              <span style={badgeStyle(bg, color)}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
