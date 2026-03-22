"use client";

/**
 * Neutral scale controls — hue/chroma tint sliders.
 *
 * Adjusting either slider auto-derives 16 connected tokens:
 * 11 neutral stops + 2 surfaces + 3 body text colors.
 */

import { RotateCcw } from "lucide-react";
import { useMemo } from "react";

import { deriveNeutralScale, parseOklchTint } from "@/config";
import { useThemeStore } from "@/stores/theme";

import { NEUTRAL_KEYS, NeutralPreview } from "./NeutralPreview";

// ── Reset keys — neutrals + derived surfaces/text ───────────────────────────

const NEUTRAL_DERIVED_KEYS = [
  ...NEUTRAL_KEYS,
  "textPrimary",
  "textSecondary",
  "textMuted",
] as const;

// ── Component ────────────────────────────────────────────────────────────────

export function NeutralControls() {
  const { mode, tokens, setTokens, resetColor } = useThemeStore();
  const isDark = mode === "dark";

  const currentTint = useMemo(
    () => parseOklchTint(tokens.neutral500),
    [tokens.neutral500],
  );

  function applyNeutralTint(hue: number, chroma: number) {
    const derived = deriveNeutralScale(hue, chroma, isDark);
    setTokens(derived);
  }

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
          Neutrals
        </h3>
        <p className="text-xs text-vita-text-muted">
          Controls all grays, surfaces, borders, and body text. Adjust the tint
          to warm or cool the entire interface.
        </p>
      </div>

      <NeutralPreview />

      {/* Hue slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-vita-text-secondary">Tint hue</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
              {Math.round(currentTint.hue)}°
            </span>
            <button
              type="button"
              title="Reset neutrals"
              className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
              onClick={() => resetColor([...NEUTRAL_DERIVED_KEYS])}
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={currentTint.hue}
          className="w-full"
          style={{
            accentColor: `oklch(0.7 0.15 ${currentTint.hue})`,
            background: `linear-gradient(to right,
              oklch(0.7 0.12 0),
              oklch(0.7 0.12 60),
              oklch(0.7 0.12 120),
              oklch(0.7 0.12 180),
              oklch(0.7 0.12 240),
              oklch(0.7 0.12 300),
              oklch(0.7 0.12 360)
            )`,
            borderRadius: "9999px",
            height: "6px",
            WebkitAppearance: "none",
            appearance: "none",
          }}
          onChange={(e) =>
            applyNeutralTint(Number(e.target.value), currentTint.chroma)
          }
        />
        <div className="flex justify-between text-xs text-vita-text-muted">
          <span>Red</span>
          <span>Green</span>
          <span>Blue</span>
          <span>Red</span>
        </div>
      </div>

      {/* Chroma slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-vita-text-secondary">
            Tint strength
          </span>
          <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
            {currentTint.chroma === 0
              ? "None"
              : (currentTint.chroma * 100).toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={0.04}
          step={0.001}
          value={currentTint.chroma}
          className="w-full accent-vita-primary"
          onChange={(e) =>
            applyNeutralTint(currentTint.hue, Number(e.target.value))
          }
        />
        <div className="flex justify-between text-xs text-vita-text-muted">
          <span>Pure gray</span>
          <span>Strong tint</span>
        </div>
      </div>
    </section>
  );
}
