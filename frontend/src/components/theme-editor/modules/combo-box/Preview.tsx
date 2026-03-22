"use client";

/**
 * Live combo-box preview — simulated trigger + open dropdown with items.
 */

import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

const ITEMS = [
  { id: "1", name: "Steel Rod — 12mm" },
  { id: "2", name: "Aluminum Sheet — 2mm" },
  { id: "3", name: "Copper Wire — 0.5mm" },
  { id: "4", name: "Brass Fitting — M8" },
  { id: "5", name: "Stainless Bolt — M10" },
];

export function Preview() {
  const { tokens } = useThemeStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = query
    ? ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : ITEMS;

  // ── Trigger ─────────────────────────────────────────────────────────────

  const triggerStyle: React.CSSProperties = {
    borderWidth: tokens.comboBoxTriggerBorderWidth ?? "1px",
    borderStyle: "solid",
    borderColor: "var(--vita-neutral-300)",
    borderRadius: tokens.comboBoxTriggerRadius ?? "0px",
    background: "var(--vita-surface)",
    paddingLeft: "12px",
    paddingRight: "12px",
    paddingTop: "8px",
    paddingBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    transition: tokens.comboBoxTransitionDuration
      ? `all ${tokens.comboBoxTransitionDuration}`
      : undefined,
  };

  // ── Popover ─────────────────────────────────────────────────────────────

  const popoverStyle: React.CSSProperties = {
    borderRadius: tokens.comboBoxPopoverRadius ?? "0px",
    borderWidth: tokens.comboBoxPopoverBorderWidth ?? "1px",
    borderStyle: (tokens.comboBoxPopoverBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-200)",
    boxShadow: tokens.comboBoxPopoverShadow ?? "none",
    padding: tokens.comboBoxPopoverPadding ?? "4px",
    background: "var(--vita-surface)",
    maxHeight: "256px",
    overflowY: "auto" as const,
    marginTop: "4px",
    transition: tokens.comboBoxTransitionDuration
      ? `all ${tokens.comboBoxTransitionDuration}`
      : undefined,
  };

  // ── Item ────────────────────────────────────────────────────────────────

  const itemBase: React.CSSProperties = {
    paddingLeft: tokens.comboBoxItemPaddingX ?? "12px",
    paddingRight: tokens.comboBoxItemPaddingX ?? "12px",
    paddingTop: tokens.comboBoxItemPaddingY ?? "8px",
    paddingBottom: tokens.comboBoxItemPaddingY ?? "8px",
    fontSize: tokens.comboBoxItemFontSize ?? "14px",
    borderRadius: tokens.comboBoxItemRadius ?? "0px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: tokens.comboBoxTransitionDuration
      ? `all ${tokens.comboBoxTransitionDuration}`
      : undefined,
  };

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      {/* Label */}
      <span
        style={{
          fontWeight: 500,
          fontSize: "12px",
          color: "var(--vita-text-secondary)",
          display: "block",
        }}
      >
        Material
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
          placeholder="Search materials…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "14px",
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
          filtered.map((item) => {
            const isSelected = selected === item.id;
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelected(item.id);
                    setQuery(item.name);
                  }
                }}
                style={{
                  ...itemBase,
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
                  setSelected(item.id);
                  setQuery(item.name);
                }}
              >
                <span>{item.name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
