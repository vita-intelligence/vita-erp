"use client";

/**
 * Live badge preview — solid, soft/outlined, and in-context styles.
 */

import { CONTEXT_ORDERS, SOFT_BADGES, SOLID_BADGES } from "./badge-data";
import { badgeStyle } from "./badge-style";

export function Preview() {
  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Solid</p>
        <div className="flex flex-wrap gap-2">
          {SOLID_BADGES.map(({ label, bg, color }) => (
            <span key={label} style={badgeStyle(bg, color)}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Soft / outlined</p>
        <div className="flex flex-wrap gap-2">
          {SOFT_BADGES.map(({ label, bg, color, border }) => (
            <span key={label} style={badgeStyle(bg, color, border)}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">In context</p>
        <div
          style={{
            background: "var(--vita-surface)",
            borderRadius: "var(--vita-card-radius)",
            border: `var(--vita-card-border-top) solid var(--vita-neutral-200)`,
            overflow: "hidden",
          }}
        >
          {CONTEXT_ORDERS.map(({ name, status, bg, color }) => {
            const [orderId, ...rest] = name.split(" · ");
            return (
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
                  <span style={{ fontFamily: "var(--vita-font-mono)" }}>
                    {orderId}
                  </span>
                  {rest.length > 0 && ` · ${rest.join(" · ")}`}
                </span>
                <span style={badgeStyle(bg, color)}>{status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
