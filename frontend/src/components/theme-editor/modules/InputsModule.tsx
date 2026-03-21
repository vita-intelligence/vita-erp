"use client";

import { RotateCcw, Unlink } from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "@/stores/theme";
import { Chip, Row, Section, ShadowBuilder, SliderRow } from "./_shared";

// ── Types ─────────────────────────────────────────────────────────────────────

type LabelPlacement = "above" | "left" | "inside";
type ErrorDisplay = "text" | "ring-only";
type ErrorPosition = "below" | "right";

// ── Border controls ────────────────────────────────────────────────────────────

function InputBorderControls() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const [individual, setIndividual] = useState(false);

  const allVal = parseFloat(tokens.inputBorderTop ?? "1");

  function setAll(v: number) {
    const px = `${v}px`;
    setTokens({
      inputBorderTop: px,
      inputBorderRight: px,
      inputBorderBottom: px,
      inputBorderLeft: px,
    });
  }

  const sides = [
    { label: "Top", key: "inputBorderTop" as const },
    { label: "Right", key: "inputBorderRight" as const },
    { label: "Bottom", key: "inputBorderBottom" as const },
    { label: "Left", key: "inputBorderLeft" as const },
  ] as const;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--vita-neutral-600)" }}>
          Width
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={individual ? "Sync all sides" : "Set sides individually"}
            className="p-0.5 transition-colors"
            style={{
              color: individual
                ? "var(--vita-primary)"
                : "var(--vita-neutral-300)",
            }}
            onClick={() => setIndividual((v) => !v)}
          >
            <Unlink size={11} />
          </button>
          <button
            type="button"
            title="Reset borders"
            className="p-0.5 transition-colors"
            style={{ color: "var(--vita-neutral-300)" }}
            onClick={() =>
              resetColor([
                "inputBorderTop",
                "inputBorderRight",
                "inputBorderBottom",
                "inputBorderLeft",
              ])
            }
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {!individual ? (
        <SliderRow
          label={`All — ${allVal}px`}
          min={0}
          max={6}
          step={0.5}
          value={allVal}
          onChange={setAll}
          hint={["0 none", "6px heavy"]}
        />
      ) : (
        <div className="space-y-2">
          {sides.map(({ label, key }) => (
            <SliderRow
              key={key}
              label={`${label} — ${parseFloat(tokens[key] ?? "1")}px`}
              min={0}
              max={6}
              step={0.5}
              value={parseFloat(tokens[key] ?? "1")}
              onChange={(v) => setTokens({ [key]: `${v}px` })}
              hint={["0", "6px"]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Preview ───────────────────────────────────────────────────────────────────

function Preview() {
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
            Live preview — click any field to focus
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

// ── Module ────────────────────────────────────────────────────────────────────

export function InputsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const radiusPx = parseFloat(tokens.inputRadius ?? "0");
  const paddingXPx = parseFloat(tokens.inputPaddingX ?? "12");
  const paddingYPx = parseFloat(tokens.inputPaddingY ?? "8");
  const fontSizePx = parseFloat(tokens.inputFontSize ?? "14");
  const labelSizePx = parseFloat(tokens.inputLabelSize ?? "12");
  const placeholderPct = Math.round(
    parseFloat(tokens.inputPlaceholderOpacity ?? "0.45") * 100,
  );
  const focusRingPx = parseFloat(tokens.inputFocusRingWidth ?? "2");
  const focusOffsetPx = parseFloat(tokens.inputFocusRingOffset ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs" style={{ color: "var(--vita-neutral-500)" }}>
        Click any field in the preview to see the focus ring live. Use the label
        placement and error controls to explore layout options.
      </p>

      <Preview />

      {/* ── Shape ── */}
      <Section title="Shape">
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={20}
          step={0.5}
          value={radiusPx}
          onChange={(v) => setTokens({ inputRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["inputRadius"])}
        />
        <SliderRow
          label={`Padding X — ${paddingXPx}px`}
          min={4}
          max={32}
          step={1}
          value={paddingXPx}
          onChange={(v) => setTokens({ inputPaddingX: `${v}px` })}
          hint={["4px tight", "32px spacious"]}
          onReset={() => resetColor(["inputPaddingX"])}
        />
        <SliderRow
          label={`Padding Y — ${paddingYPx}px`}
          min={2}
          max={20}
          step={1}
          value={paddingYPx}
          onChange={(v) => setTokens({ inputPaddingY: `${v}px` })}
          hint={["2px compact", "20px tall"]}
          onReset={() => resetColor(["inputPaddingY"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <InputBorderControls />
        <Row label="Style" onReset={() => resetColor(["inputBorderStyle"])}>
          {[
            { label: "— Solid", value: "solid" },
            { label: "- - Dashed", value: "dashed" },
            { label: "··· Dotted", value: "dotted" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputBorderStyle === o.value}
              onClick={() => setTokens({ inputBorderStyle: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.inputShadow ?? "none"}
          onChange={(v) => setTokens({ inputShadow: v })}
          onReset={() => resetColor(["inputShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 8 }}
        />
      </Section>

      {/* ── Focus ring ── */}
      <Section title="Focus ring">
        <SliderRow
          label={`Ring width — ${focusRingPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusRingPx}
          onChange={(v) => setTokens({ inputFocusRingWidth: `${v}px` })}
          hint={["0 none", "6px bold"]}
          onReset={() => resetColor(["inputFocusRingWidth"])}
        />
        <SliderRow
          label={`Ring offset — ${focusOffsetPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusOffsetPx}
          onChange={(v) => setTokens({ inputFocusRingOffset: `${v}px` })}
          hint={["0 flush", "6px gap"]}
          onReset={() => resetColor(["inputFocusRingOffset"])}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label={`Input text — ${fontSizePx}px`}
          min={10}
          max={20}
          step={0.5}
          value={fontSizePx}
          onChange={(v) => setTokens({ inputFontSize: `${v}px` })}
          hint={["10px small", "20px large"]}
          onReset={() => resetColor(["inputFontSize"])}
        />
        <SliderRow
          label={`Label size — ${labelSizePx}px`}
          min={9}
          max={16}
          step={0.5}
          value={labelSizePx}
          onChange={(v) => setTokens({ inputLabelSize: `${v}px` })}
          hint={["9px tiny", "16px prominent"]}
          onReset={() => resetColor(["inputLabelSize"])}
        />
        <Row
          label="Label weight"
          onReset={() => resetColor(["inputLabelWeight"])}
        >
          {[
            { label: "Regular", value: "400" },
            { label: "Medium", value: "500" },
            { label: "Semibold", value: "600" },
            { label: "Bold", value: "700" },
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
        <Row label="Text align" onReset={() => resetColor(["inputTextAlign"])}>
          {[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputTextAlign === o.value}
              onClick={() => setTokens({ inputTextAlign: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`Placeholder — ${placeholderPct}%`}
          min={10}
          max={90}
          step={5}
          value={placeholderPct}
          onChange={(v) =>
            setTokens({ inputPlaceholderOpacity: (v / 100).toFixed(2) })
          }
          hint={["10% faded", "90% visible"]}
          onReset={() => resetColor(["inputPlaceholderOpacity"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        <Row
          label="Transition"
          onReset={() => resetColor(["inputTransitionDuration"])}
        >
          {[
            { label: "Instant", value: "0ms" },
            { label: "Fast", value: "100ms" },
            { label: "Normal", value: "150ms" },
            { label: "Smooth", value: "250ms" },
            { label: "Slow", value: "400ms" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputTransitionDuration === o.value}
              onClick={() => setTokens({ inputTransitionDuration: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>
    </div>
  );
}
