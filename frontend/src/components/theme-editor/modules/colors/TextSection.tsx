"use client";

/**
 * Text color pickers — body text (auto-linked to neutrals) and
 * contextual "on" text colors for primary/warning/danger backgrounds.
 */

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";

import { ColorInput } from "./ColorInput";

// ── Data ─────────────────────────────────────────────────────────────────────

const TEXT_COLOR_META = [
  { key: "textPrimary" as const, tKey: "textPrimary" },
  { key: "textSecondary" as const, tKey: "textSecondary" },
  { key: "textMuted" as const, tKey: "textMuted" },
  {
    key: "textOnPrimary" as const,
    tKey: "textOnPrimary",
    previewBg: "var(--vita-primary)",
  },
  {
    key: "textOnPrimaryMuted" as const,
    tKey: "textOnPrimaryMuted",
    previewBg: "var(--vita-primary)",
  },
  {
    key: "textOnWarning" as const,
    tKey: "textOnWarning",
    previewBg: "var(--vita-warning)",
  },
  {
    key: "textOnDanger" as const,
    tKey: "textOnDanger",
    previewBg: "var(--vita-error)",
  },
] as {
  key: keyof ReturnType<typeof useThemeStore.getState>["tokens"];
  tKey: string;
  previewBg?: string;
}[];

// ── Component ────────────────────────────────────────────────────────────────

export function TextSection() {
  const t = useTranslations("themeEditor.modules.colors");
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
          {t("text")}
        </h3>
        <p className="text-xs text-vita-text-muted">{t("textDescription")}</p>
      </div>
      <div className="space-y-2">
        {TEXT_COLOR_META.map(({ key, tKey, previewBg }) => {
          const label = t(tKey);
          const description = t(`${tKey}Description`);

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface px-3 py-2.5"
            >
              {/* Live text preview */}
              <div
                className="min-w-0 flex-1 rounded-vita-md px-2 py-1.5"
                style={previewBg ? { background: previewBg } : undefined}
              >
                <p
                  className="text-sm font-medium"
                  style={{
                    color: `var(--vita-${key.replace(/([A-Z])/g, "-$1").toLowerCase()})`,
                  }}
                >
                  {t("previewLabel", { label })}
                </p>
                <p
                  className="text-xs leading-tight"
                  style={{
                    color: previewBg
                      ? `var(--vita-${key.replace(/([A-Z])/g, "-$1").toLowerCase()})`
                      : "var(--vita-text-muted)",
                  }}
                >
                  {description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title={t("resetText", { label })}
                  className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
                  onClick={() => resetColor([key])}
                >
                  <RotateCcw size={12} />
                </button>
                <ColorInput
                  value={cssColorToHex(tokens[key])}
                  title={t("changeText", { label })}
                  onChange={(hex) =>
                    setTokens({ [key]: hex } as Parameters<typeof setTokens>[0])
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
