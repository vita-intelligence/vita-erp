import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyTokens,
  type ThemeName,
  type ThemeTokens,
  themes,
} from "@/config/themes";

type ThemeState = {
  /** Active preset name — "light" | "dark" */
  mode: ThemeName;
  /** Live token values — may differ from preset if user customised individual tokens */
  tokens: ThemeTokens;

  /** Switch to a built-in preset and apply it immediately */
  setMode: (mode: ThemeName) => void;
  /** Merge a partial token override into the current theme and apply */
  setTokens: (overrides: Partial<ThemeTokens>) => void;
  /** Re-apply the current tokens to the DOM (called on mount after hydration) */
  applyTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      tokens: themes.light,

      setMode(mode) {
        const tokens = themes[mode];
        set({ mode, tokens });
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", mode === "dark");
      },

      setTokens(overrides) {
        const tokens = { ...get().tokens, ...overrides };
        set({ tokens });
        applyTokens(overrides);
      },

      applyTheme() {
        const { tokens, mode } = get();
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", mode === "dark");
      },
    }),
    {
      name: "vita-theme",
      // Persist only data, not the functions
      partialize: ({ mode, tokens }) => ({ mode, tokens }),
    },
  ),
);
