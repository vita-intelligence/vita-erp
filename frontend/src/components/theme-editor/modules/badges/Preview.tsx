"use client";

/**
 * Live badge preview — uses real HeroUI Chip components so CSS tokens
 * from badge.css apply automatically via the `.chip` class.
 */

import { Chip } from "@/components/ui/chip";

import { CONTEXT_ORDERS } from "./badge-data";

// ── Solid badge mappings ────────────────────────────────────────────────────

const SOLID_CHIPS = [
  {
    label: "Completed",
    bg: "var(--vita-success)",
    fg: "var(--vita-text-on-primary)",
  },
  {
    label: "In Progress",
    bg: "var(--vita-warning)",
    fg: "var(--vita-text-on-warning)",
  },
  {
    label: "Failed",
    bg: "var(--vita-error)",
    fg: "var(--vita-text-on-danger)",
  },
  {
    label: "Draft",
    bg: "var(--vita-neutral-200)",
    fg: "var(--vita-text-secondary)",
  },
  {
    label: "Active",
    bg: "var(--vita-primary)",
    fg: "var(--vita-text-on-primary)",
  },
  { label: "Info", bg: "var(--vita-info)", fg: "var(--vita-text-on-primary)" },
] as const;

// ── Soft / outlined badge mappings ──────────────────────────────────────────

const SOFT_CHIPS = [
  {
    label: "Completed",
    bg: "var(--vita-success-light)",
    fg: "var(--vita-success-dark)",
    border: "var(--vita-success)",
  },
  {
    label: "Warning",
    bg: "var(--vita-warning-light)",
    fg: "var(--vita-text-on-warning)",
    border: "var(--vita-warning)",
  },
  {
    label: "Error",
    bg: "var(--vita-error-light)",
    fg: "var(--vita-error-dark)",
    border: "var(--vita-error)",
  },
  {
    label: "Neutral",
    bg: "var(--vita-neutral-50)",
    fg: "var(--vita-text-secondary)",
    border: "var(--vita-neutral-300)",
  },
  {
    label: "Info",
    bg: "var(--vita-info-light)",
    fg: "var(--vita-info-dark)",
    border: "var(--vita-info)",
  },
] as const;

// ── Component ───────────────────────────────────────────────────────────────

export function Preview() {
  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      {/* Solid badges */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Solid</p>
        <div className="flex flex-wrap gap-2">
          {SOLID_CHIPS.map(({ label, bg, fg }) => (
            <Chip key={label} style={{ background: bg, color: fg }}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Soft / outlined badges */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Soft / outlined</p>
        <div className="flex flex-wrap gap-2">
          {SOFT_CHIPS.map(({ label, bg, fg, border }) => (
            <Chip
              key={label}
              style={{ background: bg, color: fg, borderColor: border }}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* In context — order list */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">In context</p>
        <div
          style={{
            background: "var(--vita-surface)",
            borderRadius: "var(--vita-card-radius)",
            border: "var(--vita-card-border-top) solid var(--vita-neutral-200)",
            overflow: "hidden",
          }}
        >
          {CONTEXT_ORDERS.map(({ name, status, bg, color }) => {
            const [orderId, ...rest] = name.split(" · ");
            return (
              <div
                key={name}
                className="flex items-center justify-between"
                style={{
                  padding: "0.5rem 0.875rem",
                  borderBottom: "1px solid var(--vita-neutral-100)",
                }}
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--vita-text-primary)" }}
                >
                  <span className="font-vita-mono">{orderId}</span>
                  {rest.length > 0 && ` · ${rest.join(" · ")}`}
                </span>
                <Chip style={{ background: bg, color }}>{status}</Chip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
