"use client";

/**
 * Live accordion preview — renders a FAQ-style accordion using actual tokens.
 */

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

import { FAQ_ITEMS } from "./accordion-data";

export function Preview() {
  const { tokens } = useThemeStore();
  const [expanded, setExpanded] = useState<string | null>(FAQ_ITEMS[0].id);

  const containerStyle: React.CSSProperties = {
    borderRadius: tokens.accordionRadius ?? "0px",
    borderWidth: tokens.accordionBorderWidth ?? "1px",
    borderStyle: (tokens.accordionBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-200)",
    boxShadow: tokens.accordionShadow ?? "none",
    background: "var(--vita-surface)",
    overflow: "hidden",
  };

  const triggerStyle: React.CSSProperties = {
    paddingLeft: tokens.accordionTriggerPaddingX ?? "16px",
    paddingRight: tokens.accordionTriggerPaddingX ?? "16px",
    paddingTop: tokens.accordionTriggerPaddingY ?? "12px",
    paddingBottom: tokens.accordionTriggerPaddingY ?? "12px",
    fontWeight: (tokens.accordionTriggerFontWeight ??
      "500") as React.CSSProperties["fontWeight"],
    fontSize: tokens.accordionTriggerFontSize ?? "14px",
    color: "var(--vita-text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    width: "100%",
    background: "transparent",
    border: "none",
    textAlign: "left" as const,
    fontFamily: "var(--vita-font-heading)",
  };

  const contentStyle: React.CSSProperties = {
    paddingLeft: tokens.accordionContentPaddingX ?? "16px",
    paddingRight: tokens.accordionContentPaddingX ?? "16px",
    paddingTop: tokens.accordionContentPaddingY ?? "8px",
    paddingBottom: tokens.accordionContentPaddingY ?? "8px",
    fontSize: "0.8125rem",
    lineHeight: 1.6,
    color: "var(--vita-text-secondary)",
  };

  const separatorH = tokens.accordionSeparatorHeight ?? "1px";

  return (
    <div className="space-y-3 rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>

      <div style={containerStyle}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.id}>
            {/* Separator */}
            {i > 0 && (
              <div
                style={{
                  height: separatorH,
                  background: "var(--vita-neutral-200)",
                }}
              />
            )}

            {/* Trigger */}
            <button
              type="button"
              style={triggerStyle}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={14}
                style={{
                  color: "var(--vita-text-muted)",
                  flexShrink: 0,
                  transition: "transform 200ms ease",
                  transform:
                    expanded === item.id ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Content */}
            {expanded === item.id && (
              <div style={contentStyle}>{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
