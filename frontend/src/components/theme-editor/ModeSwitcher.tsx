"use client";

import { type ThemeName, themes } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

/** Preview color swatches for each theme preset. */
const THEME_SWATCHES: Record<string, { bg: string; fg: string }> = {
  light: { bg: "#ffffff", fg: "#171717" },
  dark: { bg: "#171717", fg: "#f5f5f5" },
  ocean: { bg: "#1a2332", fg: "#60a5fa" },
  forest: { bg: "#f7f4ef", fg: "#2d6a4f" },
  sunset: { bg: "#fef3e2", fg: "#e86c2c" },
  midnight: { bg: "#1a1025", fg: "#a855f6" },
  minimal: { bg: "#ffffff", fg: "#737373" },
  corporate: { bg: "#ffffff", fg: "#2563eb" },
};

const THEME_NAMES = Object.keys(themes) as ThemeName[];

export function ModeSwitcher() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="flex items-center gap-1">
      {THEME_NAMES.map((m) => {
        const swatch = THEME_SWATCHES[m] ?? { bg: "#808080", fg: "#fff" };
        const isActive = mode === m;
        return (
          <button
            key={m}
            type="button"
            title={m.charAt(0).toUpperCase() + m.slice(1)}
            className="flex h-6 w-6 items-center justify-center rounded-full transition-transform"
            style={{
              background: swatch.bg,
              border: isActive
                ? `2px solid ${swatch.fg}`
                : "1px solid var(--vita-neutral-300)",
              transform: isActive ? "scale(1.15)" : "scale(1)",
            }}
            onClick={() => setMode(m)}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: swatch.fg }}
            />
          </button>
        );
      })}
    </div>
  );
}
