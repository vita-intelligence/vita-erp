"use client";

/**
 * Live alert preview — renders all status variants using actual tokens.
 */

import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle, Info, TriangleAlert } from "lucide-react";

import { useThemeStore } from "@/stores/theme";

import { ALERT_VARIANTS } from "./alert-data";

const ICON_MAP: Record<string, LucideIcon> = {
  success: CheckCircle,
  warning: TriangleAlert,
  danger: AlertCircle,
  info: Info,
};

export function AlertPreview() {
  const { tokens } = useThemeStore();
  const iconSize = parseFloat(tokens.alertIconSize ?? "20");

  const alertStyle = (bg: string, border: string): React.CSSProperties => ({
    borderRadius: tokens.alertRadius ?? "0px",
    borderWidth: tokens.alertBorderWidth ?? "1px",
    borderStyle: (tokens.alertBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: border,
    paddingLeft: tokens.alertPaddingX ?? "16px",
    paddingRight: tokens.alertPaddingX ?? "16px",
    paddingTop: tokens.alertPaddingY ?? "12px",
    paddingBottom: tokens.alertPaddingY ?? "12px",
    boxShadow: tokens.alertShadow ?? "none",
    background: bg,
    display: "flex",
    gap: "0.625rem",
    alignItems: "flex-start",
  });

  return (
    <div className="space-y-3 rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Alert preview
      </p>
      <div className="space-y-2">
        {ALERT_VARIANTS.map((a) => {
          const Icon = ICON_MAP[a.status];
          return (
            <div key={a.status} style={alertStyle(a.bg, a.border)}>
              <Icon
                size={iconSize}
                style={{ color: a.iconColor, flexShrink: 0, marginTop: "1px" }}
              />
              <div>
                <p
                  style={{
                    fontWeight: (tokens.alertTitleFontWeight ??
                      "600") as React.CSSProperties["fontWeight"],
                    fontSize: tokens.alertTitleFontSize ?? "14px",
                    color: a.titleColor,
                    fontFamily: "var(--vita-font-heading)",
                    lineHeight: 1.3,
                  }}
                >
                  {a.title}
                </p>
                <p
                  style={{
                    fontSize: tokens.alertDescriptionFontSize ?? "13px",
                    color: "var(--vita-text-secondary)",
                    lineHeight: 1.5,
                    marginTop: "0.15rem",
                  }}
                >
                  {a.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
