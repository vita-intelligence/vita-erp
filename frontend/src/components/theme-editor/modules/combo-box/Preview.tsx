"use client";

/**
 * Live combo-box preview — simulated trigger + open dropdown with items.
 */

import { ChevronDown, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

const ITEMS = [
  { id: "1", nameKey: "steelRod" },
  { id: "2", nameKey: "aluminumSheet" },
  { id: "3", nameKey: "copperWire" },
  { id: "4", nameKey: "brassFitting" },
  { id: "5", nameKey: "stainlessBolt" },
];

export function Preview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const getName = (key: string) => t(`preview.comboBox.${key}`);

  const filtered = query
    ? ITEMS.filter((item) =>
        getName(item.nameKey).toLowerCase().includes(query.toLowerCase()),
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
        {t("preview.livePreview")}
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
        {t("preview.comboBox.materialLabel")}
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
          placeholder={t("preview.comboBox.searchMaterials")}
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
            {t("preview.noResults")}
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
                    setQuery(getName(item.nameKey));
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
                  setQuery(getName(item.nameKey));
                }}
              >
                <span>{getName(item.nameKey)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
