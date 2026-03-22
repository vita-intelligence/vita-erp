"use client";

/**
 * Live autocomplete preview — simulated trigger + open dropdown with items.
 */

import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

import { PRODUCT_OPTIONS } from "./autocomplete-data";

export function Preview() {
  const { tokens } = useThemeStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = query
    ? PRODUCT_OPTIONS.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : PRODUCT_OPTIONS;

  // ── Trigger (reuses input tokens) ─────────────────────────────────────

  const triggerStyle: React.CSSProperties = {
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
    paddingLeft: tokens.inputPaddingX ?? "12px",
    paddingRight: tokens.inputPaddingX ?? "12px",
    paddingTop: tokens.inputPaddingY ?? "8px",
    paddingBottom: tokens.inputPaddingY ?? "8px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
  };

  // ── Popover ───────────────────────────────────────────────────────────

  const popoverStyle: React.CSSProperties = {
    borderRadius: tokens.autocompletePopoverRadius ?? "0px",
    borderTopWidth: tokens.autocompletePopoverBorderTop ?? "1px",
    borderRightWidth: tokens.autocompletePopoverBorderRight ?? "1px",
    borderBottomWidth: tokens.autocompletePopoverBorderBottom ?? "1px",
    borderLeftWidth: tokens.autocompletePopoverBorderLeft ?? "1px",
    borderStyle: (tokens.autocompletePopoverBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-200)",
    boxShadow: tokens.autocompletePopoverShadow ?? "none",
    padding: tokens.autocompletePopoverPadding ?? "4px",
    background: "var(--vita-surface)",
    maxHeight: tokens.autocompleteMaxHeight ?? "256px",
    overflowY: "auto" as const,
    marginTop: "4px",
  };

  const dividerH = tokens.autocompleteItemDivider ?? "0px";

  // ── Item ──────────────────────────────────────────────────────────────

  const itemBase: React.CSSProperties = {
    paddingLeft: tokens.autocompleteItemPaddingX ?? "12px",
    paddingRight: tokens.autocompleteItemPaddingX ?? "12px",
    paddingTop: tokens.autocompleteItemPaddingY ?? "8px",
    paddingBottom: tokens.autocompleteItemPaddingY ?? "8px",
    fontSize: tokens.autocompleteItemFontSize ?? "14px",
    borderRadius: tokens.autocompleteItemRadius ?? "0px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>

      {/* Label */}
      <span
        style={{
          fontWeight: (tokens.inputLabelWeight ??
            "500") as React.CSSProperties["fontWeight"],
          fontSize: tokens.inputLabelSize ?? "12px",
          color: "var(--vita-text-secondary)",
          display: "block",
        }}
      >
        Product
      </span>

      {/* Trigger */}
      <div style={triggerStyle}>
        <Search
          size={14}
          style={{ color: "var(--vita-text-muted)", flexShrink: 0 }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: tokens.inputFontSize ?? "14px",
            color: "var(--vita-text-primary)",
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelected(null);
            }}
            style={{ color: "var(--vita-text-muted)", flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        )}
        <ChevronDown
          size={14}
          style={{ color: "var(--vita-text-muted)", flexShrink: 0 }}
        />
      </div>

      {/* Dropdown */}
      <div style={popoverStyle}>
        {filtered.length === 0 ? (
          <div
            style={{
              ...itemBase,
              color: "var(--vita-text-muted)",
              cursor: "default",
              justifyContent: "center",
            }}
          >
            No results found
          </div>
        ) : (
          filtered.map((option, idx) => {
            const isSelected = selected === option.id;
            const hasDivider = idx > 0 && parseFloat(dividerH) > 0;
            return (
              <div
                key={option.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelected(option.id);
                    setQuery(option.label);
                  }
                }}
                style={{
                  ...itemBase,
                  ...(hasDivider
                    ? {
                        borderTopWidth: dividerH,
                        borderTopStyle: "solid",
                        borderTopColor: "var(--vita-neutral-200)",
                      }
                    : {}),
                  background: isSelected
                    ? "var(--vita-primary)"
                    : "transparent",
                  color: isSelected
                    ? "var(--vita-text-on-primary)"
                    : "var(--vita-text-primary)",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "var(--vita-neutral-100)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                onClick={() => {
                  setSelected(option.id);
                  setQuery(option.label);
                }}
              >
                <span>{option.label}</span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: isSelected
                      ? "var(--vita-text-on-primary-muted)"
                      : "var(--vita-text-muted)",
                  }}
                >
                  {option.category}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
