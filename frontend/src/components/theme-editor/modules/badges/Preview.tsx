"use client";

/**
 * Live badge preview — uses real HeroUI Chip components so CSS tokens
 * from badge.css apply automatically via the `.chip` class.
 */

import { useTranslations } from "next-intl";

import { Chip } from "@/components/ui/chip";
import { useThemeStore } from "@/stores/theme";

import { useCursorTrack } from "../_shared/useCursorTrack";
import { CONTEXT_ORDERS, SOFT_BADGES, SOLID_BADGES } from "./badge-data";

// ── Component ───────────────────────────────────────────────────────────────

export function Preview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();
  const trackIntensity = parseFloat(tokens.badgeCursorTrack ?? "0");
  const trackRestore = parseFloat(tokens.badgeCursorTrackRestore ?? "300");
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "badge",
    trackIntensity,
    trackRestore,
  );
  const trackProps = trackIntensity > 0 ? { onMouseMove, onMouseLeave } : {};

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      {/* Solid badges */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.solid")}</p>
        <div className="flex flex-wrap gap-2">
          {SOLID_BADGES.map(({ labelKey, bg, color: fg }) => (
            <Chip
              key={labelKey}
              style={{ background: bg, color: fg }}
              {...trackProps}
            >
              {t(`preview.badges.${labelKey}`)}
            </Chip>
          ))}
        </div>
      </div>

      {/* Soft / outlined badges */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.softOutlined")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SOFT_BADGES.map(({ labelKey, bg, color: fg, border }) => (
            <Chip
              key={labelKey}
              style={{ background: bg, color: fg, borderColor: border }}
              {...trackProps}
            >
              {t(`preview.badges.${labelKey}`)}
            </Chip>
          ))}
        </div>
      </div>

      {/* In context — order list */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.inContext")}</p>
        <div
          style={{
            background: "var(--vita-surface)",
            borderRadius: "var(--vita-card-radius)",
            border: "var(--vita-card-border-top) solid var(--vita-neutral-200)",
            overflow: "hidden",
          }}
        >
          {CONTEXT_ORDERS.map(({ nameKey, statusKey, bg, color }) => (
            <div
              key={nameKey}
              className="flex items-center justify-between"
              style={{
                padding: "0.5rem 0.875rem",
                borderBottom: "1px solid var(--vita-neutral-100)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t(`preview.badges.${nameKey}`)}
              </span>
              <Chip style={{ background: bg, color }}>
                {t(`preview.badges.${statusKey}`)}
              </Chip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
