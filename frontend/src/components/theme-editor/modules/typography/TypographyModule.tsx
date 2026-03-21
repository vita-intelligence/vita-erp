"use client";

import { RotateCcw } from "lucide-react";
import {
  HEADING_FONT_OPTIONS,
  MONO_FONT_OPTIONS,
  SANS_FONT_OPTIONS,
} from "@/config";
import { useThemeStore } from "@/stores/theme";

import { FontSelector } from "./FontSelector";

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
      <p className="text-xs text-vita-text-muted">
        Non-Latin scripts (Arabic, Hindi, Chinese, Japanese, Korean) fall back
        to your device system font automatically.
      </p>

      {/* Interface size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            Interface size
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
              {tokens.fontSizeBase}
            </span>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
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
        <div className="flex justify-between text-xs text-vita-text-muted">
          <span>12px — compact</span>
          <span>20px — large</span>
        </div>
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            Line height
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
              {parseFloat(tokens.lineHeight).toFixed(2)}
            </span>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
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
        <div className="flex justify-between text-xs text-vita-text-muted">
          <span>1.00 — tight</span>
          <span>3.00 — spacious</span>
        </div>
      </div>

      {/* Body weight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            Body weight
          </p>
          <button
            type="button"
            title="Reset"
            className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
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
                      color: "var(--vita-text-secondary)",
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
        <FontSelector
          label="Body font"
          tokenKey="fontBody"
          options={SANS_FONT_OPTIONS}
          preview="The quick brown fox jumps over the lazy dog."
        />
        <FontSelector
          label="Heading font"
          tokenKey="fontHeading"
          options={HEADING_FONT_OPTIONS}
          preview="Manufacturing Dashboard"
          previewClassName="text-sm font-semibold text-vita-text-secondary"
        />
        <FontSelector
          label="Numbers & codes"
          tokenKey="fontMono"
          options={MONO_FONT_OPTIONS}
          preview="ORD-00842 · $12,400.00 · 3,891 units"
        />
      </div>
    </div>
  );
}
