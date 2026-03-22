"use client";

/**
 * Neutral scale preview — 11-stop color strip and readability demo.
 */

import { useThemeStore } from "@/stores/theme";

const NEUTRAL_KEYS = [
  "neutral50",
  "neutral100",
  "neutral200",
  "neutral300",
  "neutral400",
  "neutral500",
  "neutral600",
  "neutral700",
  "neutral800",
  "neutral900",
  "neutral950",
] as const;

export { NEUTRAL_KEYS };

export function NeutralPreview() {
  const { tokens } = useThemeStore();

  return (
    <div className="space-y-3">
      {/* Scale strip */}
      <div className="flex h-8 overflow-hidden rounded-vita-md border border-vita-neutral-200">
        {NEUTRAL_KEYS.map((key) => (
          <div
            key={key}
            className="flex-1"
            style={{ background: tokens[key] }}
            title={key}
          />
        ))}
      </div>

      {/* Readability demo */}
      <div
        className="space-y-1.5 rounded-vita-md p-3"
        style={{ background: tokens.background }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: tokens.textPrimary }}
        >
          Primary text — headings and labels
        </p>
        <p className="text-xs" style={{ color: tokens.textSecondary }}>
          Secondary text — body content, descriptions, navigation items
        </p>
        <p className="text-xs" style={{ color: tokens.textMuted }}>
          Muted text — timestamps, hints, placeholder content
        </p>
        <div className="mt-2 flex gap-2">
          <div
            className="rounded-vita-sm px-2 py-1 text-xs"
            style={{
              background: tokens.surface,
              color: tokens.textSecondary,
              border: `1px solid ${tokens.neutral200}`,
            }}
          >
            Surface card
          </div>
          <div
            className="rounded-vita-sm px-2 py-1 text-xs"
            style={{
              background: tokens.neutral100,
              color: tokens.textMuted,
              border: `1px solid ${tokens.neutral200}`,
            }}
          >
            Subtle element
          </div>
        </div>
      </div>
    </div>
  );
}
