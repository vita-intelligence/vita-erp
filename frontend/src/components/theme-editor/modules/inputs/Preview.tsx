"use client";

/**
 * Live input preview — a realistic mini-form inside a card container.
 * Demonstrates normal, focused, placeholder, and error states.
 */

import { useState } from "react";

import { useThemeStore } from "@/stores/theme";
import { Chip } from "../_shared";

// ── Types ─────────────────────────────────────────────────────────────────────

type LabelPlacement = "above" | "left" | "inside";

// ── Field data ────────────────────────────────────────────────────────────────

const FIELDS = [
  { id: "order-id", label: "Order ID", value: "ORD-00842", mono: true },
  { id: "product", label: "Product", value: "Steel Frame A-14" },
  { id: "quantity", label: "Quantity", value: "3,891", mono: true },
  {
    id: "notes",
    label: "Notes",
    value: "",
    placeholder: "Add a note…",
  },
  {
    id: "date",
    label: "Due date",
    value: "2026-13-45",
    error: true,
    errorMsg: "Invalid date format",
    mono: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Preview() {
  const { tokens } = useThemeStore();
  const [placement, setPlacement] = useState<LabelPlacement>("above");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── Shared styles derived from tokens ───────────────────────────────────

  const wrapperBase: React.CSSProperties = {
    borderTopWidth: tokens.inputBorderTop ?? "1px",
    borderRightWidth: tokens.inputBorderRight ?? "1px",
    borderBottomWidth: tokens.inputBorderBottom ?? "1px",
    borderLeftWidth: tokens.inputBorderLeft ?? "1px",
    borderStyle: (tokens.inputBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-300)",
    borderRadius: tokens.inputRadius ?? "0px",
    background: "var(--vita-surface)",
    boxShadow: tokens.inputShadow ?? "none",
    boxSizing: "border-box" as const,
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    paddingLeft: tokens.inputPaddingX ?? "12px",
    paddingRight: tokens.inputPaddingX ?? "12px",
    paddingTop: tokens.inputPaddingY ?? "8px",
    paddingBottom: tokens.inputPaddingY ?? "8px",
    transition: `border-color ${tokens.inputTransitionDuration ?? "150ms"} ease, outline ${tokens.inputTransitionDuration ?? "150ms"} ease`,
  };

  function getWrapperStyle(
    focused: boolean,
    error = false,
  ): React.CSSProperties {
    const ringW = tokens.inputFocusRingWidth ?? "2px";
    const ringO = tokens.inputFocusRingOffset ?? "0px";
    const hasRing = parseFloat(ringW) > 0;
    return {
      ...wrapperBase,
      borderColor: error
        ? "var(--vita-error)"
        : focused
          ? "var(--vita-primary)"
          : "var(--vita-neutral-300)",
      ...(focused && hasRing
        ? {
            outlineStyle: "solid" as const,
            outlineWidth: ringW,
            outlineOffset: ringO,
            outlineColor: error ? "var(--vita-error)" : "var(--vita-primary)",
          }
        : {}),
    };
  }

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: tokens.inputFontSize ?? "14px",
    color: "var(--vita-text-primary)",
    textAlign: (tokens.inputTextAlign ??
      "left") as React.CSSProperties["textAlign"],
    border: "none",
    padding: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: (tokens.inputLabelWeight ??
      "500") as React.CSSProperties["fontWeight"],
    fontSize: tokens.inputLabelSize ?? "12px",
    color: "var(--vita-text-secondary)",
    display: "block",
    lineHeight: 1.3,
  };

  const placeholderOpacity = parseFloat(
    tokens.inputPlaceholderOpacity ?? "0.45",
  );

  // ── Field renderer (shared across placements) ───────────────────────────

  function renderField(f: (typeof FIELDS)[number]) {
    const focused = focusedField === f.id;
    const error = "error" in f && f.error;

    const fieldInputStyle =
      "mono" in f && f.mono
        ? { ...inputStyle, fontFamily: "var(--vita-font-mono)" }
        : inputStyle;

    const input = (
      <input
        className="vita-field"
        style={fieldInputStyle}
        defaultValue={f.value}
        placeholder={"placeholder" in f ? f.placeholder : undefined}
        onFocus={() => setFocusedField(f.id)}
        onBlur={() => setFocusedField(null)}
        readOnly
      />
    );

    const errorHint = error && "errorMsg" in f && (
      <p
        style={{
          fontSize: "0.6875rem",
          marginTop: "0.15rem",
          color: "var(--vita-error)",
        }}
      >
        {f.errorMsg}
      </p>
    );

    const errorLabelColor = error ? { color: "var(--vita-error)" } : {};

    if (placement === "left") {
      return (
        <div key={f.id}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                ...labelStyle,
                width: "4.5rem",
                flexShrink: 0,
                textAlign: "right",
                ...errorLabelColor,
              }}
            >
              {f.label}
            </span>
            <div style={{ flex: 1 }}>
              <div style={getWrapperStyle(focused, !!error)}>{input}</div>
              {errorHint}
            </div>
          </div>
        </div>
      );
    }

    if (placement === "inside") {
      return (
        <div key={f.id}>
          <div style={getWrapperStyle(focused, !!error)}>
            <span
              style={{
                fontWeight: labelStyle.fontWeight,
                fontSize: `calc(${tokens.inputLabelSize ?? "12px"} * 0.85)`,
                color: error ? "var(--vita-error)" : "var(--vita-text-muted)",
                display: "block",
                lineHeight: 1.2,
                marginBottom: "0.1rem",
              }}
            >
              {f.label}
            </span>
            {input}
          </div>
          {errorHint}
        </div>
      );
    }

    // "above" (default)
    return (
      <div key={f.id}>
        <span
          style={{ ...labelStyle, marginBottom: "0.25rem", ...errorLabelColor }}
        >
          {f.label}
        </span>
        <div style={getWrapperStyle(focused, !!error)}>{input}</div>
        {errorHint}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--vita-text-muted)" }}
        >
          Live preview
        </p>
        <div className="flex items-center gap-1">
          {(["above", "left", "inside"] as LabelPlacement[]).map((p) => (
            <Chip
              key={p}
              active={placement === p}
              onClick={() => setPlacement(p)}
            >
              {p}
            </Chip>
          ))}
        </div>
      </div>

      {/* Scoped placeholder style */}
      <style>{`.vita-input-preview .vita-field::placeholder { opacity: ${placeholderOpacity}; color: var(--vita-text-muted); }`}</style>

      {/* Card-wrapped form */}
      <div
        className="vita-input-preview overflow-hidden"
        style={{
          background: "var(--vita-surface)",
          borderRadius: "var(--vita-card-radius)",
          borderWidth: "var(--vita-card-border-width)",
          borderStyle: "solid",
          borderColor: "var(--vita-neutral-200)",
          boxShadow: "var(--vita-card-shadow)",
        }}
      >
        {/* Form header */}
        <div
          style={{
            padding: "0.625rem 0.875rem",
            borderBottom: "1px solid var(--vita-neutral-200)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--vita-text-primary)",
              fontFamily: "var(--vita-font-heading)",
            }}
          >
            New Production Order
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--vita-text-muted)",
            }}
          >
            Click fields to focus
          </span>
        </div>

        {/* Form body */}
        <div style={{ padding: "0.75rem 0.875rem" }} className="space-y-2.5">
          {FIELDS.map(renderField)}
        </div>

        {/* Form footer */}
        <div
          style={{
            padding: "0.5rem 0.875rem",
            borderTop: "1px solid var(--vita-neutral-200)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.375rem",
          }}
        >
          {["Cancel", "Create Order"].map((label, i) => (
            <button
              key={label}
              type="button"
              style={{
                borderRadius: "var(--vita-btn-radius)",
                fontWeight:
                  "var(--vita-btn-font-weight)" as React.CSSProperties["fontWeight"],
                fontSize: "0.6875rem",
                padding: "0.3rem 0.625rem",
                borderStyle: "solid",
                borderWidth: "1px",
                cursor: "default",
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
