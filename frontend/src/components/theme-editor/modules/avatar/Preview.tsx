"use client";

/**
 * Live avatar preview — uses real HeroUI Avatar so CSS tokens
 * from avatar.css apply automatically via `.avatar` BEM classes.
 *
 * Colors use HeroUI's built-in `color` prop where possible, and
 * inline styles with !important for custom brand colors on fallbacks.
 */

import { Avatar } from "@/components/ui/avatar";

import { useThemeStore } from "@/stores/theme";

// ── Sample data ─────────────────────────────────────────────────────────────

const USERS = [
  {
    initials: "MK",
    bg: "var(--vita-primary)",
    fg: "var(--vita-text-on-primary)",
  },
  {
    initials: "AL",
    bg: "var(--vita-success)",
    fg: "var(--vita-text-on-primary)",
  },
  {
    initials: "JS",
    bg: "var(--vita-warning)",
    fg: "var(--vita-text-on-warning)",
  },
  { initials: "RD", bg: "var(--vita-error)", fg: "var(--vita-text-on-danger)" },
  { initials: "TP", bg: "var(--vita-info)", fg: "var(--vita-text-on-primary)" },
];

// ── Colored avatar wrapper ──────────────────────────────────────────────────

function ColoredAvatar({
  initials,
  bg,
  fg,
  size = "md" as "sm" | "md" | "lg",
  style,
}: {
  initials: string;
  bg: string;
  fg: string;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...style,
        background: bg,
        borderRadius: "var(--vita-avatar-radius)",
        display: "inline-flex",
        overflow: "hidden",
      }}
    >
      <Avatar size={size} className="!bg-transparent">
        <Avatar.Fallback style={{ color: fg }} className="!bg-transparent">
          {initials}
        </Avatar.Fallback>
      </Avatar>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────────────

export function Preview() {
  const { tokens } = useThemeStore();
  const groupSpacing = tokens.avatarGroupSpacing ?? "-8px";

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>

      {/* Sizes */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Sizes</p>
        <div className="flex flex-wrap items-end gap-3">
          {(["sm", "md", "lg"] as const).map((size) => {
            const tokenKey =
              `avatarSize${size.charAt(0).toUpperCase()}${size.slice(1)}` as keyof typeof tokens;
            return (
              <div key={size} className="flex flex-col items-center gap-1">
                <ColoredAvatar
                  initials={size.toUpperCase()}
                  bg="var(--vita-primary)"
                  fg="var(--vita-text-on-primary)"
                  size={size}
                />
                <span className="text-xs font-vita-mono text-vita-text-muted">
                  {tokens[tokenKey] ?? size}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fallback colors */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Fallback colors</p>
        <div className="flex flex-wrap items-center gap-2">
          {USERS.map((u) => (
            <ColoredAvatar
              key={u.initials}
              initials={u.initials}
              bg={u.bg}
              fg={u.fg}
            />
          ))}
        </div>
      </div>

      {/* Group overlap */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Group overlap</p>
        <div className="flex items-center">
          {USERS.slice(0, 4).map((u, i) => (
            <ColoredAvatar
              key={u.initials}
              initials={u.initials}
              bg={u.bg}
              fg={u.fg}
              style={{
                marginLeft: i === 0 ? 0 : groupSpacing,
                zIndex: USERS.length - i,
                borderColor: "var(--vita-surface)",
                borderWidth: "2px",
                borderStyle: "solid",
              }}
            />
          ))}
          <div
            style={{
              marginLeft: groupSpacing,
              zIndex: 0,
              borderColor: "var(--vita-surface)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "var(--vita-avatar-radius)",
              display: "inline-flex",
              overflow: "hidden",
              background: "var(--vita-neutral-200)",
            }}
          >
            <Avatar size="md" className="!bg-transparent">
              <Avatar.Fallback
                className="!bg-transparent"
                style={{
                  color: "var(--vita-text-secondary)",
                  fontSize: "0.6875rem",
                }}
              >
                +12
              </Avatar.Fallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* In context */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">In context</p>
        <div
          className="flex items-center gap-3 rounded-vita-md p-3"
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
          }}
        >
          <ColoredAvatar
            initials="JJ"
            bg="var(--vita-primary)"
            fg="var(--vita-text-on-primary)"
            size="lg"
          />
          <div>
            <p
              className="text-sm font-vita-heading"
              style={{ fontWeight: 600, color: "var(--vita-text-primary)" }}
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
