"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

export function ModeSwitcher() {
  const { mode, setMode } = useThemeStore();
  const t = useTranslations("themeEditor");
  return (
    <div className="flex h-8 overflow-hidden rounded-vita-sm border border-vita-neutral-200">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          type="button"
          className="px-2.5 text-xs font-medium capitalize transition-colors"
          style={
            mode === m
              ? {
                  background: "var(--vita-primary)",
                  color: "var(--vita-text-on-primary)",
                }
              : {
                  background: "var(--vita-surface)",
                  color: "var(--vita-text-secondary)",
                }
          }
          onClick={() => setMode(m)}
        >
          {t(`modes.${m}`)}
        </button>
      ))}
    </div>
  );
}
