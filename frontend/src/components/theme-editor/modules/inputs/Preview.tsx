"use client";

/**
 * Live input preview — renders interactive fields with focus ring,
 * label placement variants, and error display modes.
 */

import { useState } from "react";

import { useThemeStore } from "@/stores/theme";
import { Chip } from "../_shared";

// ── Types ─────────────────────────────────────────────────────────────────────

type LabelPlacement = "above" | "left" | "inside";
type ErrorDisplay = "text" | "ring-only";
type ErrorPosition = "below" | "right";

// ── Component ─────────────────────────────────────────────────────────────────

export function Preview() {
  const { tokens } = useThemeStore();
  const [placement, setPlacement] = useState<LabelPlacement>("above");
  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay>("text");
  const [errorPosition, setErrorPosition] = useState<ErrorPosition>("below");
  // Default one field to focused so the ring is visible immediately
  const [focusedField, setFocusedField] = useState<string | null>("notes");

  // Use actual token values (not CSS var strings) so React re-renders apply them immediately
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
    transition: `border-color ${tokens.inputTransitionDuration ?? "150ms"} ease, box-shadow ${tokens.inputTransitionDuration ?? "150ms"} ease, outline ${tokens.inputTransitionDuration ?? "150ms"} ease`,
  };

  function getWrapperStyle(
    focused: boolean,
    error = false,
  ): React.CSSProperties {
    const focusRingW = tokens.inputFocusRingWidth ?? "2px";
    const focusRingO = tokens.inputFocusRingOffset ?? "0px";
    const hasFocusRing = parseFloat(focusRingW) > 0;
    return {
      ...wrapperBase,
      borderColor: error
        ? "var(--vita-error)"
        : focused
          ? "var(--vita-primary)"
          : "var(--vita-neutral-300)",
      ...(focused && hasFocusRing
        ? {
            outlineStyle: "solid" as const,
            outlineWidth: focusRingW,
            outlineOffset: focusRingO,
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
    color: "var(--vita-neutral-600)",
    display: "block",
    marginBottom: "0.2rem",
    lineHeight: 1.3,
  };

  const hintStyle: React.CSSProperties = {
    fontSize: "0.6875rem",
    marginTop: "0.2rem",
    color: "var(--vita-neutral-400)",
  };

  const hintErrorStyle: React.CSSProperties = {
    ...hintStyle,
    color: "var(--vita-error)",
  };

  const placeholderOpacity = parseFloat(
    tokens.inputPlaceholderOpacity ?? "0.45",
  );

  const leftFields = [
    {
      id: "order-id",
      label: "Order ID",
      value: "ORD-00842",
      placeholder: undefined as string | undefined,
      error: false,
    },
    {
      id: "quantity",
      label: "Quantity",
      value: "3,891 units",
      placeholder: undefined as string | undefined,
      error: false,
    },
    {
      id: "date",
      label: "Due date",
      value: "2026-13-45",
      placeholder: undefined as string | undefined,
      error: true,
    },
    {
      id: "search",
      label: "Notes",
      value: "",
      placeholder: "Add a note…",
      error: false,
    },
  ];

  return (
    <div className="space-y-3 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "var(--vita-neutral-400)" }}
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

        {/* Error display controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span
              className="text-xs"
              style={{ color: "var(--vita-neutral-400)" }}
            >
              Error:
            </span>
            {(
              [
                { label: "Text + ring", value: "text" },
                { label: "Ring only", value: "ring-only" },
              ] as { label: string; value: ErrorDisplay }[]
            ).map((o) => (
              <Chip
                key={o.value}
                active={errorDisplay === o.value}
                onClick={() => setErrorDisplay(o.value)}
              >
                {o.label}
              </Chip>
            ))}
          </div>
          {errorDisplay === "text" && placement === "left" && (
            <div className="flex items-center gap-1">
              <span
                className="text-xs"
                style={{ color: "var(--vita-neutral-400)" }}
              >
                Position:
              </span>
              {(["below", "right"] as ErrorPosition[]).map((v) => (
                <Chip
                  key={v}
                  active={errorPosition === v}
                  onClick={() => setErrorPosition(v)}
                >
                  {v}
                </Chip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scoped placeholder style */}
      <style>{`.vita-input-preview .vita-field::placeholder { opacity: ${placeholderOpacity}; color: var(--vita-neutral-500); }`}</style>

      <div className="vita-input-preview space-y-3">
        {/* ── Above ── */}
        {placement === "above" && (
          <>
            <div>
              <label htmlFor="prev-order-id" style={labelStyle}>
                Order ID
              </label>
              <div style={getWrapperStyle(focusedField === "order-id")}>
                <input
                  id="prev-order-id"
                  className="vita-field"
                  style={inputStyle}
                  defaultValue="ORD-00842"
                  onFocus={() => setFocusedField("order-id")}
                  onBlur={() => setFocusedField(null)}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label htmlFor="prev-notes" style={labelStyle}>
                Notes
              </label>
              <div style={getWrapperStyle(focusedField === "notes")}>
                <input
                  id="prev-notes"
                  className="vita-field"
                  style={inputStyle}
                  defaultValue="Rush order — priority lane"
                  onFocus={() => setFocusedField("notes")}
                  onBlur={() => setFocusedField(null)}
                  readOnly
                />
              </div>
              {focusedField === "notes" && (
                <p style={hintStyle}>Focus ring active</p>
              )}
            </div>
            <div>
              <label htmlFor="prev-search" style={labelStyle}>
                Search
              </label>
              <div style={getWrapperStyle(focusedField === "search")}>
                <input
                  id="prev-search"
                  className="vita-field"
                  style={inputStyle}
                  placeholder="Search production orders…"
                  onFocus={() => setFocusedField("search")}
                  onBlur={() => setFocusedField(null)}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="prev-date"
                style={{
                  ...labelStyle,
                  ...(errorDisplay === "text"
                    ? { color: "var(--vita-error)" }
                    : {}),
                }}
              >
                Due date
              </label>
              <div style={getWrapperStyle(focusedField === "date", true)}>
                <input
                  id="prev-date"
                  className="vita-field"
                  style={inputStyle}
                  defaultValue="2026-13-45"
                  onFocus={() => setFocusedField("date")}
                  onBlur={() => setFocusedField(null)}
                  readOnly
                />
              </div>
              {errorDisplay === "text" && (
                <p style={hintErrorStyle}>Invalid date format</p>
              )}
            </div>
          </>
        )}

        {/* ── Left ── */}
        {placement === "left" && (
          <div className="space-y-2">
            {leftFields.map(({ id, label, value, placeholder, error }) => (
              <div key={id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      ...labelStyle,
                      marginBottom: 0,
                      width: "5.5rem",
                      flexShrink: 0,
                      textAlign: "right",
                      ...(error && errorDisplay === "text"
                        ? { color: "var(--vita-error)" }
                        : {}),
                    }}
                  >
                    {label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={getWrapperStyle(focusedField === id, error)}>
                      <input
                        className="vita-field"
                        style={inputStyle}
                        defaultValue={value}
                        placeholder={placeholder}
                        onFocus={() => setFocusedField(id)}
                        onBlur={() => setFocusedField(null)}
                        readOnly
                      />
                    </div>
                    {error &&
                      errorDisplay === "text" &&
                      errorPosition === "below" && (
                        <p style={hintErrorStyle}>Invalid date format</p>
                      )}
                  </div>
                  {error &&
                    errorDisplay === "text" &&
                    errorPosition === "right" && (
                      <p
                        style={{
                          ...hintErrorStyle,
                          marginTop: 0,
                          flexShrink: 0,
                        }}
                      >
                        Invalid date format
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Inside ── */}
        {placement === "inside" && (
          <div className="space-y-2">
            {[
              {
                id: "order-id",
                label: "Production order ID",
                value: "ORD-00842",
                placeholder: undefined as string | undefined,
                error: false,
              },
              {
                id: "notes",
                label: "Notes",
                value: "",
                placeholder: "Add a note…",
                error: false,
              },
              {
                id: "date",
                label: "Due date",
                value: "2026-13-45",
                placeholder: undefined as string | undefined,
                error: true,
              },
            ].map(({ id, label, value, placeholder, error }) => (
              <div key={id}>
                <div style={getWrapperStyle(focusedField === id, error)}>
                  <span
                    style={{
                      fontWeight: (tokens.inputLabelWeight ??
                        "500") as React.CSSProperties["fontWeight"],
                      fontSize: `calc(${tokens.inputLabelSize ?? "12px"} * 0.85)`,
                      color:
                        error && errorDisplay === "text"
                          ? "var(--vita-error)"
                          : "var(--vita-neutral-500)",
                      display: "block",
                      lineHeight: 1.2,
                      marginBottom: "0.1rem",
                    }}
                  >
                    {label}
                  </span>
                  <input
                    className="vita-field"
                    style={inputStyle}
                    defaultValue={value}
                    placeholder={placeholder}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField(null)}
                    readOnly
                  />
                </div>
                {error && errorDisplay === "text" && (
                  <p style={hintErrorStyle}>Invalid date format</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
