"use client";

import { RotateCcw } from "lucide-react";
import { useThemeStore } from "@/stores/theme";
import { Chip, Row, Section } from "./_shared";

// ── Preview ───────────────────────────────────────────────────────────────────

function Preview() {
  const wrapper: React.CSSProperties = {
    borderRadius: "var(--vita-input-radius)",
    borderWidth: "var(--vita-input-border-width)",
    borderStyle: "solid",
    borderColor: "var(--vita-neutral-300)",
    background: "var(--vita-surface)",
    padding: "0.5rem 0.75rem",
    width: "100%",
    boxSizing: "border-box",
  };

  const label: React.CSSProperties = {
    fontWeight:
      "var(--vita-input-label-weight)" as React.CSSProperties["fontWeight"],
    fontSize: "0.75rem",
    color: "var(--vita-neutral-600)",
    display: "block",
    marginBottom: "0.25rem",
  };

  const input: React.CSSProperties = {
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: "0.875rem",
    color: "var(--vita-text-primary)",
  };

  const hint: React.CSSProperties = {
    fontSize: "0.6875rem",
    marginTop: "0.25rem",
  };

  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
        Live preview
      </p>
      <div className="space-y-3">
        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: preview-only */}
          <label style={label}>Production order ID</label>
          <div style={wrapper}>
            <input style={input} defaultValue="ORD-00842" readOnly />
          </div>
        </div>

        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: preview-only */}
          <label style={label}>Quantity</label>
          <div style={wrapper}>
            <input style={input} defaultValue="3,891" readOnly />
          </div>
          <p style={{ ...hint, color: "var(--vita-neutral-400)" }}>
            Units to produce in this batch
          </p>
        </div>

        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: preview-only */}
          <label style={label}>Due date</label>
          <div style={{ ...wrapper, borderColor: "var(--vita-error)" }}>
            <input style={input} defaultValue="2026-13-45" readOnly />
          </div>
          <p style={{ ...hint, color: "var(--vita-error)" }}>
            Invalid date format
          </p>
        </div>

        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: preview-only */}
          <label style={label}>Notes</label>
          <div
            style={{
              ...wrapper,
              borderColor: "var(--vita-primary)",
              outline: "2px solid var(--vita-primary)",
              outlineOffset: "-1px",
            }}
          >
            <input
              style={input}
              defaultValue="Rush order — priority lane"
              readOnly
            />
          </div>
          <p style={{ ...hint, color: "var(--vita-neutral-400)" }}>
            Focused state
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Module ────────────────────────────────────────────────────────────────────

export function InputsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const radiusPx = parseFloat(tokens.inputRadius);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Controls the appearance of all text inputs, textareas, and search fields
        across the application.
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
                onClick={() => resetColor(["inputRadius"])}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={16}
            step={1}
            value={radiusPx}
            className="w-full accent-vita-primary"
            onChange={(e) => setTokens({ inputRadius: `${e.target.value}px` })}
          />
          <div className="flex justify-between text-xs text-vita-neutral-400">
            <span>0 — sharp</span>
            <span>16px — rounded</span>
          </div>
        </div>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <Row label="Width" onReset={() => resetColor(["inputBorderWidth"])}>
          {["1px", "2px"].map((v) => (
            <Chip
              key={v}
              active={tokens.inputBorderWidth === v}
              onClick={() => setTokens({ inputBorderWidth: v })}
            >
              {v}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <Row
          label="Label weight"
          onReset={() => resetColor(["inputLabelWeight"])}
        >
          {[
            { label: "Regular", value: "400" },
            { label: "Medium", value: "500" },
            { label: "Semibold", value: "600" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputLabelWeight === o.value}
              onClick={() => setTokens({ inputLabelWeight: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>
    </div>
  );
}
