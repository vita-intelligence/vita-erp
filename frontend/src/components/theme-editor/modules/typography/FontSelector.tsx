"use client";

/**
 * Reusable font family selector with live preview text.
 */

import { RotateCcw } from "lucide-react";

import { loadGoogleFont } from "@/config";
import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

type FontOption = {
  value: string;
  label: string;
  scripts: string;
  googleFamily?: string | null;
};

export type FontSelectorProps = {
  label: string;
  tokenKey: keyof ThemeTokens;
  options: readonly FontOption[];
  /** Preview text rendered in the selected font. */
  preview: string;
  /** Additional className for the preview text. */
  previewClassName?: string;
};

export function FontSelector({
  label,
  tokenKey,
  options,
  preview,
  previewClassName = "text-xs text-vita-text-muted",
}: FontSelectorProps) {
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
          {label}
        </p>
        <button
          type="button"
          title="Reset"
          className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
          onClick={() => resetColor([tokenKey])}
        >
          <RotateCcw size={12} />
        </button>
      </div>
      <select
        className="w-full rounded-vita-md border border-vita-neutral-200 bg-vita-surface px-3 py-2 text-sm text-vita-text-primary focus:outline-none"
        value={tokens[tokenKey]}
        onChange={(e) => {
          const opt = options.find((o) => o.value === e.target.value);
          if (opt?.googleFamily) loadGoogleFont(opt.googleFamily);
          setTokens({ [tokenKey]: e.target.value } as Partial<ThemeTokens>);
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label} — {o.scripts}
          </option>
        ))}
      </select>
      <p className={previewClassName} style={{ fontFamily: tokens[tokenKey] }}>
        {preview}
      </p>
    </div>
  );
}
