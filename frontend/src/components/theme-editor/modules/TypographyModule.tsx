"use client";

import { RotateCcw } from "lucide-react";
import {
  HEADING_FONT_OPTIONS,
  loadGoogleFont,
  MONO_FONT_OPTIONS,
  SANS_FONT_OPTIONS,
} from "@/config";
import { useThemeStore } from "@/stores/theme";

const WEIGHT_OPTIONS = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
] as const;

export function TypographyModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Non-Latin scripts (Arabic, Hindi, Chinese, Japanese, Korean) fall back
        to your device system font automatically.
      </p>

      {/* Interface size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
            Interface size
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-vita-neutral-600">
              {tokens.fontSizeBase}
            </span>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["fontSizeBase"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={12}
          max={20}
          step={0.1}
          value={parseFloat(tokens.fontSizeBase)}
          className="w-full accent-vita-primary"
          onChange={(e) => setTokens({ fontSizeBase: `${e.target.value}px` })}
        />
        <div className="flex justify-between text-xs text-vita-neutral-400">
          <span>12px — compact</span>
          <span>20px — large</span>
        </div>
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
            Line height
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-vita-neutral-600">
              {parseFloat(tokens.lineHeight).toFixed(2)}
            </span>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["lineHeight"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={1.0}
          max={3.0}
          step={0.01}
          value={parseFloat(tokens.lineHeight)}
          className="w-full accent-vita-primary"
          onChange={(e) => setTokens({ lineHeight: e.target.value })}
        />
        <div className="flex justify-between text-xs text-vita-neutral-400">
          <span>1.00 — tight</span>
          <span>3.00 — spacious</span>
        </div>
      </div>

      {/* Body weight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
            Body weight
          </p>
          <button
            type="button"
            title="Reset"
            className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
            onClick={() => resetColor(["fontWeightBody"])}
          >
            <RotateCcw size={12} />
          </button>
        </div>
        <div className="flex gap-1.5">
          {WEIGHT_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className="flex-1 rounded-vita-md border py-1.5 text-xs transition-colors"
              style={
                tokens.fontWeightBody === value
                  ? {
                      borderColor: "var(--vita-primary)",
                      background: "var(--vita-primary)",
                      color: "var(--vita-text-on-primary)",
                      fontWeight: value,
                    }
                  : {
                      borderColor: "var(--vita-neutral-200)",
                      background: "var(--vita-surface)",
                      color: "var(--vita-neutral-700)",
                      fontWeight: value,
                    }
              }
              onClick={() => setTokens({ fontWeightBody: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Font selectors */}
      <div className="space-y-4">
        {/* Body font */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Body font
            </p>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["fontBody"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
          <select
            className="w-full rounded-vita-md border border-vita-neutral-200 bg-vita-surface px-3 py-2 text-sm text-vita-neutral-800 focus:outline-none"
            value={tokens.fontBody}
            onChange={(e) => {
              const opt = SANS_FONT_OPTIONS.find(
                (o) => o.value === e.target.value,
              );
              if (opt?.googleFamily) loadGoogleFont(opt.googleFamily);
              setTokens({ fontBody: e.target.value });
            }}
          >
            {SANS_FONT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} — {o.scripts}
              </option>
            ))}
          </select>
          <p
            className="text-xs text-vita-neutral-500"
            style={{ fontFamily: tokens.fontBody }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Heading font */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Heading font
            </p>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["fontHeading"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
          <select
            className="w-full rounded-vita-md border border-vita-neutral-200 bg-vita-surface px-3 py-2 text-sm text-vita-neutral-800 focus:outline-none"
            value={tokens.fontHeading}
            onChange={(e) => {
              const opt = HEADING_FONT_OPTIONS.find(
                (o) => o.value === e.target.value,
              );
              if (opt?.googleFamily) loadGoogleFont(opt.googleFamily);
              setTokens({ fontHeading: e.target.value });
            }}
          >
            {HEADING_FONT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} — {o.scripts}
              </option>
            ))}
          </select>
          <p
            className="text-sm font-semibold text-vita-neutral-700"
            style={{ fontFamily: tokens.fontHeading }}
          >
            Manufacturing Dashboard
          </p>
        </div>

        {/* Mono font */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Numbers & codes
            </p>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["fontMono"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
          <select
            className="w-full rounded-vita-md border border-vita-neutral-200 bg-vita-surface px-3 py-2 text-sm text-vita-neutral-800 focus:outline-none"
            value={tokens.fontMono}
            onChange={(e) => {
              const opt = MONO_FONT_OPTIONS.find(
                (o) => o.value === e.target.value,
              );
              if (opt?.googleFamily) loadGoogleFont(opt.googleFamily);
              setTokens({ fontMono: e.target.value });
            }}
          >
            {MONO_FONT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} — {o.scripts}
              </option>
            ))}
          </select>
          <p
            className="text-xs text-vita-neutral-500"
            style={{ fontFamily: tokens.fontMono }}
          >
            ORD-00842 · $12,400.00 · 3,891 units
          </p>
        </div>
      </div>
    </div>
  );
}
