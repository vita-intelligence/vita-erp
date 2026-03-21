import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyTokens,
  type ThemeName,
  type ThemeTokens,
  themes,
} from "@/config/themes";

type ThemeState = {
  /** Active preset name */
  mode: ThemeName;
  /** Per-mode token storage — each mode keeps its own customised colors */
  tokensByMode: Record<ThemeName, ThemeTokens>;

  /** Convenience getter — tokens for the active mode */
  readonly tokens: ThemeTokens;

  /** Switch mode and apply its tokens immediately */
  setMode: (mode: ThemeName) => void;
  /** Merge token overrides into the CURRENT mode and apply */
  setTokens: (overrides: Partial<ThemeTokens>) => void;
  /** Re-apply current mode tokens to the DOM (called on mount after hydration) */
  applyTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      tokensByMode: {
        light: themes.light,
        dark: themes.dark,
      },

      get tokens() {
        const { mode, tokensByMode } = get();
        return tokensByMode[mode];
      },

      setMode(mode) {
        set({ mode });
        const tokens = get().tokensByMode[mode];
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", mode === "dark");
      },

      setTokens(overrides) {
        const { mode, tokensByMode } = get();
        const updated = { ...tokensByMode[mode], ...overrides };
        set({ tokensByMode: { ...tokensByMode, [mode]: updated } });
        applyTokens(overrides);
      },

      applyTheme() {
        const { mode, tokensByMode } = get();
        applyTokens(tokensByMode[mode]);
        document.documentElement.classList.toggle("dark", mode === "dark");
      },
    }),
    {
      name: "vita-theme",
      partialize: ({ mode, tokensByMode }) => ({ mode, tokensByMode }),
    },
  ),
);
