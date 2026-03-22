"use client";

/**
 * Live avatar preview — sizes, fallback initials, ring, group overlap.
 */

import { useThemeStore } from "@/stores/theme";

// ── Sample data ──────────────────────────────────────────────────────────────

const USERS = [
  { initials: "MK", color: "var(--vita-primary)" },
  { initials: "AL", color: "var(--vita-success)" },
  { initials: "JS", color: "var(--vita-warning)" },
  { initials: "RD", color: "var(--vita-error)" },
  { initials: "TP", color: "var(--vita-info)" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function Preview() {
  const { tokens } = useThemeStore();

  const baseStyle = (size: string, bg: string): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: tokens.avatarRadius ?? "9999px",
    borderTopWidth: tokens.avatarBorderTop ?? "0px",
    borderRightWidth: tokens.avatarBorderRight ?? "0px",
    borderBottomWidth: tokens.avatarBorderBottom ?? "0px",
    borderLeftWidth: tokens.avatarBorderLeft ?? "0px",
    borderStyle: (tokens.avatarBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-200)",
    boxShadow: tokens.avatarShadow ?? "none",
    outlineWidth: tokens.avatarRingWidth ?? "0px",
    outlineOffset: tokens.avatarRingOffset ?? "2px",
    outlineStyle: "solid",
    outlineColor: "var(--vita-primary)",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: (tokens.avatarFallbackFontWeight ??
      "600") as React.CSSProperties["fontWeight"],
    fontSize: tokens.avatarFallbackFontSize ?? "14px",
    color: "var(--vita-text-on-primary)",
    overflow: "hidden",
    flexShrink: 0,
  });

  const smSize = tokens.avatarSizeSm ?? "32px";
  const mdSize = tokens.avatarSizeMd ?? "40px";
  const lgSize = tokens.avatarSizeLg ?? "48px";
  const groupSpacing = tokens.avatarGroupSpacing ?? "-8px";

  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>

      {/* Sizes */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Sizes</p>
        <div className="flex items-end gap-3">
          <div className="flex flex-col items-center gap-1">
            <div style={baseStyle(smSize, "var(--vita-primary)")}>
              <span
                style={{
                  fontSize: `calc(${tokens.avatarFallbackFontSize ?? "14px"} * 0.75)`,
                }}
              >
                SM
              </span>
            </div>
            <span className="text-xs font-vita-mono text-vita-text-muted">
              {smSize}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div style={baseStyle(mdSize, "var(--vita-secondary)")}>MD</div>
            <span className="text-xs font-vita-mono text-vita-text-muted">
              {mdSize}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div style={baseStyle(lgSize, "var(--vita-info)")}>LG</div>
            <span className="text-xs font-vita-mono text-vita-text-muted">
              {lgSize}
            </span>
          </div>
        </div>
      </div>

      {/* Status colors */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Fallback colors</p>
        <div className="flex items-center gap-2">
          {USERS.map((u) => (
            <div key={u.initials} style={baseStyle(mdSize, u.color)}>
              {u.initials}
            </div>
          ))}
        </div>
      </div>

      {/* Group (overlapping) */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Group overlap</p>
        <div className="flex items-center">
          {USERS.slice(0, 4).map((u, i) => (
            <div
              key={u.initials}
              style={{
                ...baseStyle(mdSize, u.color),
                marginLeft: i === 0 ? 0 : groupSpacing,
                zIndex: USERS.length - i,
                borderColor: "var(--vita-surface)",
                borderTopWidth: "2px",
                borderRightWidth: "2px",
                borderBottomWidth: "2px",
                borderLeftWidth: "2px",
              }}
            >
              {u.initials}
            </div>
          ))}
          <div
            style={{
              ...baseStyle(mdSize, "var(--vita-neutral-200)"),
              marginLeft: groupSpacing,
              zIndex: 0,
              color: "var(--vita-text-secondary)",
              borderColor: "var(--vita-surface)",
              borderTopWidth: "2px",
              borderRightWidth: "2px",
              borderBottomWidth: "2px",
              borderLeftWidth: "2px",
              fontSize: "0.6875rem",
            }}
          >
            +12
          </div>
        </div>
      </div>

      {/* In context — mini user card */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">In context</p>
        <div
          className="flex items-center gap-3 rounded-vita-md p-3"
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
          }}
        >
          <div style={baseStyle(lgSize, "var(--vita-primary)")}>JJ</div>
          <div>
            <p
              className="text-sm font-vita-heading"
              style={{
                fontWeight: 600,
                color: "var(--vita-text-primary)",
              }}
            >
              Jessica Jay
            </p>
            <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
              Production Manager · Line 4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
