"use client";

import { useThemeStore } from "@/stores/theme";

export function ModeSwitcher() {
  const { mode, setMode } = useThemeStore();
  return (
    <div className="flex overflow-hidden rounded-vita-sm border border-vita-neutral-200">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          type="button"
          className="px-2.5 py-1 text-xs font-medium capitalize transition-colors"
          style={
            mode === m
              ? {
                  background: "var(--vita-primary)",
                  color: "var(--vita-text-on-primary)",
                }
              : {
                  background: "var(--vita-surface)",
                  color: "var(--vita-neutral-600)",
                }
          }
          onClick={() => setMode(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
