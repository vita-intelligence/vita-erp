"use client";

/**
 * Text color pickers — body text (auto-linked to neutrals) and
 * contextual "on" text colors for primary/warning/danger backgrounds.
 */

import { RotateCcw } from "lucide-react";

import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";

import { ColorInput } from "./ColorInput";

// ── Data ─────────────────────────────────────────────────────────────────────

const TEXT_COLOR_META = [
  {
    key: "textPrimary" as const,
    label: "Primary",
    description: "Headings, active labels, important content",
  },
  {
    key: "textSecondary" as const,
    label: "Secondary",
    description: "Body text, descriptions, navigation",
  },
  {
    key: "textMuted" as const,
    label: "Muted",
    description: "Hints, timestamps, placeholders",
  },
  {
    key: "textOnPrimary" as const,
    label: "On Primary",
    description: "Text/icons placed on primary-colored backgrounds",
    previewBg: "var(--vita-primary)",
  },
  {
    key: "textOnPrimaryMuted" as const,
    label: "On Primary Muted",
    description: "Secondary text on primary-colored backgrounds",
    previewBg: "var(--vita-primary)",
  },
  {
    key: "textOnWarning" as const,
    label: "On Warning",
    description: "Text/icons placed on warning-colored backgrounds",
    previewBg: "var(--vita-warning)",
  },
  {
    key: "textOnDanger" as const,
    label: "On Danger",
    description: "Text/icons placed on error/danger-colored backgrounds",
    previewBg: "var(--vita-error)",
  },
] as {
  key: keyof ReturnType<typeof useThemeStore.getState>["tokens"];
  label: string;
  description: string;
  previewBg?: string;
}[];

// ── Component ────────────────────────────────────────────────────────────────

export function TextSection() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
          Text
        </h3>
        <p className="text-xs text-vita-text-muted">
          Body text colors are auto-linked to neutrals. Override individually
          with the color pickers below.
        </p>
      </div>
      <div className="space-y-2">
        {TEXT_COLOR_META.map(({ key, label, description, previewBg }) => (
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
                {label} — Manufacturing ERP
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
                title={`Reset ${label} text`}
                className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
                onClick={() => resetColor([key])}
              >
                <RotateCcw size={12} />
              </button>
              <ColorInput
                value={cssColorToHex(tokens[key])}
                title={`Change ${label} text color`}
                onChange={(hex) =>
                  setTokens({ [key]: hex } as Parameters<typeof setTokens>[0])
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
