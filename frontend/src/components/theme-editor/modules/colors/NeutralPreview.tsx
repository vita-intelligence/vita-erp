"use client";

/**
 * Neutral scale preview — 11-stop color strip and readability demo.
 */

import { useTranslations } from "next-intl";

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
  const t = useTranslations("themeEditor.modules.colors");
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
          {t("primaryText")}
        </p>
        <p className="text-xs" style={{ color: tokens.textSecondary }}>
          {t("secondaryText")}
        </p>
        <p className="text-xs" style={{ color: tokens.textMuted }}>
          {t("mutedText")}
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
            {t("surfaceCard")}
          </div>
          <div
            className="rounded-vita-sm px-2 py-1 text-xs"
            style={{
              background: tokens.neutral100,
              color: tokens.textMuted,
              border: `1px solid ${tokens.neutral200}`,
            }}
          >
            {t("subtleElement")}
          </div>
        </div>
      </div>
    </div>
  );
}
