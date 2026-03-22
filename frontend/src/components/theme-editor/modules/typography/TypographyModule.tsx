"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  HEADING_FONT_OPTIONS,
  MONO_FONT_OPTIONS,
  SANS_FONT_OPTIONS,
} from "@/config";
import { useThemeStore } from "@/stores/theme";

import { FontSelector } from "./FontSelector";

export function TypographyModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();

  const WEIGHT_OPTIONS = [
    { label: t("modules.typography.light"), value: "300" },
    { label: t("controls.regular"), value: "400" },
    { label: t("controls.medium"), value: "500" },
    { label: t("controls.semibold"), value: "600" },
  ] as const;

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.typography.nonLatinNote")}
      </p>

      {/* Interface size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            {t("modules.typography.interfaceSize")}
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
          <span>12px — {t("modules.typography.compact")}</span>
          <span>20px — {t("modules.typography.large")}</span>
        </div>
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            {t("modules.typography.lineHeight")}
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
          <span>1.00 — {t("modules.typography.tight")}</span>
          <span>3.00 — {t("modules.typography.spacious")}</span>
        </div>
      </div>

      {/* Body weight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            {t("modules.typography.bodyWeight")}
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
          label={t("modules.typography.bodyFont")}
          tokenKey="fontBody"
          options={SANS_FONT_OPTIONS}
          preview={t("modules.typography.sampleBody")}
        />
        <FontSelector
          label={t("modules.typography.headingFont")}
          tokenKey="fontHeading"
          options={HEADING_FONT_OPTIONS}
          preview={t("modules.typography.sampleHeading")}
          previewClassName="text-sm font-semibold text-vita-text-secondary"
        />
        <FontSelector
          label={t("modules.typography.numbersCodes")}
          tokenKey="fontMono"
          options={MONO_FONT_OPTIONS}
          preview={t("modules.typography.sampleMono")}
        />
      </div>
    </div>
  );
}
