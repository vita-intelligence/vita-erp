"use client";

/**
 * Neutral scale controls — hue/chroma tint sliders and readability preview.
 *
 * Adjusting either slider auto-derives 16 connected tokens:
 * 11 neutral stops + 2 surfaces + 3 body text colors.
 */

import { RotateCcw } from "lucide-react";
import { useMemo } from "react";

import { deriveNeutralScale, parseOklchTint } from "@/config";
import { useThemeStore } from "@/stores/theme";

// ── Constants ────────────────────────────────────────────────────────────────

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

const NEUTRAL_DERIVED_KEYS = [
  ...NEUTRAL_KEYS,
  "background",
  "surface",
  "textPrimary",
  "textSecondary",
  "textMuted",
] as const;

// ── Preview ──────────────────────────────────────────────────────────────────

function NeutralPreview() {
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

// ── Controls ─────────────────────────────────────────────────────────────────

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
