"use client";

/**
 * Live card preview — production order card with header, rows, and action buttons.
 */

const PREVIEW_ROWS = [
  { label: "Product", value: "Steel Frame A-14" },
  { label: "Quantity", value: "3,891 units", mono: true },
  { label: "Status", value: "In Progress" },
  { label: "Due date", value: "Mar 28, 2026", mono: true },
  { label: "Assigned to", value: "Line 4 — Shift B" },
];

export function Preview() {
  const card: React.CSSProperties = {
    borderRadius: "var(--vita-card-radius)",
    borderTopWidth: "var(--vita-card-border-top)",
    borderRightWidth: "var(--vita-card-border-right)",
    borderBottomWidth: "var(--vita-card-border-bottom)",
    borderLeftWidth: "var(--vita-card-border-left)",
    borderStyle:
      "var(--vita-card-border-style)" as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-200)",
    boxShadow: "var(--vita-card-shadow)",
    background: "var(--vita-surface)",
    overflow: "hidden",
  };

  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>
      <div style={card}>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: `var(--vita-card-border-top) solid var(--vita-neutral-200)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--vita-text-primary)",
                fontFamily: "var(--vita-font-heading)",
              }}
            >
              Production Order
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--vita-text-muted)",
                fontFamily: "var(--vita-font-mono)",
              }}
            >
              #00842 · Created Mar 21, 2026
            </p>
          </div>
          <span
            style={{
              background: "var(--vita-warning-light)",
              color: "var(--vita-text-on-warning)",
              borderRadius: "var(--vita-badge-radius)",
              fontWeight:
                "var(--vita-badge-font-weight)" as React.CSSProperties["fontWeight"],
              fontSize: "var(--vita-badge-font-size)",
              letterSpacing: "var(--vita-badge-letter-spacing)",
              textTransform:
                "var(--vita-badge-text-transform)" as React.CSSProperties["textTransform"],
              paddingLeft: "var(--vita-badge-padding-x)",
              paddingRight: "var(--vita-badge-padding-x)",
              paddingTop: "var(--vita-badge-padding-y)",
              paddingBottom: "var(--vita-badge-padding-y)",
              borderTopWidth: "var(--vita-badge-border-top)",
              borderRightWidth: "var(--vita-badge-border-right)",
              borderBottomWidth: "var(--vita-badge-border-bottom)",
              borderLeftWidth: "var(--vita-badge-border-left)",
              borderStyle:
                "var(--vita-badge-border-style)" as React.CSSProperties["borderStyle"],
              borderColor: "var(--vita-warning)",
            }}
          >
            In Progress
          </span>
        </div>
        <div style={{ padding: "0 1rem" }}>
          {PREVIEW_ROWS.map(({ label, value, mono }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.6rem 0",
                borderBottom: "1px solid var(--vita-neutral-100)",
              }}
            >
              <span
                style={{ fontSize: "0.75rem", color: "var(--vita-text-muted)" }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--vita-text-primary)",
                  ...(mono ? { fontFamily: "var(--vita-font-mono)" } : {}),
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderTop: `var(--vita-card-border-top) solid var(--vita-neutral-200)`,
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          {["Reject", "Approve"].map((label, i) => (
            <button
              key={label}
              type="button"
              style={{
                borderRadius: "var(--vita-btn-radius)",
                fontWeight:
                  "var(--vita-btn-font-weight)" as React.CSSProperties["fontWeight"],
                letterSpacing: "var(--vita-btn-letter-spacing)",
                borderStyle: "solid",
                borderTopWidth: "var(--vita-btn-border-top)",
                borderRightWidth: "var(--vita-btn-border-right)",
                borderBottomWidth: "var(--vita-btn-border-bottom)",
                borderLeftWidth: "var(--vita-btn-border-left)",
                cursor: "pointer",
                fontSize: "0.75rem",
                padding: "0.35rem 0.75rem",
                background:
                  i === 1 ? "var(--vita-primary)" : "var(--vita-surface)",
                color:
                  i === 1
                    ? "var(--vita-text-on-primary)"
                    : "var(--vita-text-secondary)",
                borderColor:
                  i === 1 ? "var(--vita-primary)" : "var(--vita-neutral-200)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
