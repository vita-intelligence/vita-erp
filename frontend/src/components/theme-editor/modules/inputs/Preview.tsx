"use client";

/**
 * Live input preview — a realistic mini-form inside a card container.
 * Demonstrates normal, focused, placeholder, and error states.
 */

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";
import { Chip } from "../_shared";

import { type FieldData, FieldRenderer } from "./FieldRenderer";
import {
  buildInputStyle,
  buildLabelStyle,
  buildWrapperBase,
} from "./input-styles";

// ── Field data ────────────────────────────────────────────────────────────────

type LabelPlacement = "above" | "left" | "inside";

const FIELDS: FieldData[] = [
  { id: "order-id", label: "Order ID", value: "ORD-00842", mono: true },
  { id: "product", label: "Product", value: "Steel Frame A-14" },
  { id: "quantity", label: "Quantity", value: "3,891", mono: true },
  { id: "notes", label: "Notes", value: "", placeholder: "Add a note…" },
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
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();
  const [placement, setPlacement] = useState<LabelPlacement>("above");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const wrapperBase = buildWrapperBase(tokens);
  const inputStyle = buildInputStyle(tokens);
  const labelStyle = buildLabelStyle(tokens);
  const placeholderOpacity = parseFloat(
    tokens.inputPlaceholderOpacity ?? "0.45",
  );

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {t("preview.livePreview")}
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
          borderTopWidth: "var(--vita-card-border-top)",
          borderRightWidth: "var(--vita-card-border-right)",
          borderBottomWidth: "var(--vita-card-border-bottom)",
          borderLeftWidth: "var(--vita-card-border-left)",
          borderStyle:
            "var(--vita-card-border-style)" as React.CSSProperties["borderStyle"],
          borderColor: "var(--vita-neutral-200)",
          boxShadow: "var(--vita-card-shadow)",
        }}
      >
        {/* Header */}
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
            style={{ fontSize: "0.6875rem", color: "var(--vita-text-muted)" }}
          >
            {t("preview.clickFieldsToFocus")}
          </span>
        </div>

        {/* Fields */}
        <div style={{ padding: "0.75rem 0.875rem" }} className="space-y-2.5">
          {FIELDS.map((f) => (
            <FieldRenderer
              key={f.id}
              field={f}
              placement={placement}
              focused={focusedField === f.id}
              tokens={tokens}
              wrapperBase={wrapperBase}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              onFocus={setFocusedField}
              onBlur={() => setFocusedField(null)}
            />
          ))}
        </div>

        {/* Footer */}
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
