"use client";

import { RotateCcw } from "lucide-react";
import { useThemeStore } from "@/stores/theme";
import { Chip, Row, Section, ShadowBuilder } from "./_shared";

// ── Preview ───────────────────────────────────────────────────────────────────

const PREVIEW_ROWS = [
  { label: "Product", value: "Steel Frame A-14" },
  { label: "Quantity", value: "3,891 units" },
  { label: "Status", value: "In Progress" },
  { label: "Due date", value: "Mar 28, 2026" },
  { label: "Assigned to", value: "Line 4 — Shift B" },
];

function Preview() {
  const card: React.CSSProperties = {
    borderRadius: "var(--vita-card-radius)",
    borderWidth: "var(--vita-card-border-width)",
    borderStyle: "solid",
    borderColor: "var(--vita-neutral-200)",
    boxShadow: "var(--vita-card-shadow)",
    background: "var(--vita-surface)",
    overflow: "hidden",
  };

  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
        Live preview
      </p>
      <div style={card}>
        <div
          style={{
            padding: "0.75rem 1rem",
            borderBottom: `var(--vita-card-border-width) solid var(--vita-neutral-200)`,
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
              }}
            >
              Production Order
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--vita-text-muted)" }}>
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
              fontSize: "0.6875rem",
              padding: "0.2rem 0.5rem",
            }}
          >
            In Progress
          </span>
        </div>
        <div style={{ padding: "0 1rem" }}>
          {PREVIEW_ROWS.map(({ label, value }) => (
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
            borderTop: `var(--vita-card-border-width) solid var(--vita-neutral-200)`,
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
                    : "var(--vita-neutral-700)",
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

// ── Module ────────────────────────────────────────────────────────────────────

export function CardsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const radiusPx = parseFloat(tokens.cardRadius);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Controls the appearance of all cards and panels — the primary content
        containers across the ERP interface.
      </p>

      <Preview />

      {/* ── Shape ── */}
      <Section title="Shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vita-neutral-600">Corner radius</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-vita-neutral-600">
                {radiusPx}px
              </span>
              <button
                type="button"
                title="Reset"
                className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
                onClick={() => resetColor(["cardRadius"])}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={radiusPx}
            className="w-full accent-vita-primary"
            onChange={(e) => setTokens({ cardRadius: `${e.target.value}px` })}
          />
          <div className="flex justify-between text-xs text-vita-neutral-400">
            <span>0 — sharp</span>
            <span>24px — rounded</span>
          </div>
        </div>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <Row label="Width" onReset={() => resetColor(["cardBorderWidth"])}>
          {["1px", "2px", "3px"].map((v) => (
            <Chip
              key={v}
              active={tokens.cardBorderWidth === v}
              onClick={() => setTokens({ cardBorderWidth: v })}
            >
              {v}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.cardShadow}
          onChange={(v) => setTokens({ cardShadow: v })}
          onReset={() => resetColor(["cardShadow"])}
          defaults={{ y: 6, blur: 10, opacity: 8 }}
        />
      </Section>
    </div>
  );
}
