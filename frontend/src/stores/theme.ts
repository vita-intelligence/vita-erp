import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyTokens,
  type ThemeName,
  type ThemeTokens,
  themes,
} from "@/config/themes";
import {
  type CompanyThemePayload,
  fetchCompanyTheme,
  saveCompanyTheme,
} from "@/services/company-theme";

type TokensByMode = Record<ThemeName, ThemeTokens>;

/** Snapshot of the last server-known state — drives the isDirty check. */
type ThemeSnapshot = {
  mode: ThemeName;
  tokensByMode: TokensByMode;
};

type ThemeState = {
  /** Active preset name */
  mode: ThemeName;
  /** Per-mode token storage — each mode keeps its own customised colors */
  tokensByMode: TokensByMode;
  /** Tokens for the active mode — always = tokensByMode[mode], kept in sync */
  tokens: ThemeTokens;
  /** Last server-known state, set after loadFromServer / saveToServer. Null = never loaded. */
  savedSnapshot: ThemeSnapshot | null;
  /** Whether the floating theme editor window is currently open on screen. */
  isEditorOpen: boolean;
  /** Whether the floating palette trigger is pinned across org pages. */
  isTriggerVisible: boolean;

  /** Switch mode and apply its tokens immediately */
  setMode: (mode: ThemeName) => void;
  /** Merge token overrides into the current mode and apply */
  setTokens: (overrides: Partial<ThemeTokens>) => void;
  /** Reset a single token (or group) back to the built-in preset for the current mode */
  resetColor: (keys: (keyof ThemeTokens)[]) => void;
  /** Reset all tokens for the current mode back to the built-in preset */
  resetAll: () => void;
  /** Re-apply current mode tokens to the DOM (called on mount after hydration) */
  applyTheme: () => void;

  /** Open/close the floating editor window (pass nothing to flip it). */
  toggleEditor: (open?: boolean) => void;
  /** Show/hide the floating palette trigger (pass nothing to flip it). */
  toggleTrigger: (visible?: boolean) => void;
  /** Load the org's theme from the server and apply it. Safe on failure. */
  loadFromServer: () => Promise<void>;
  /** POST current state to the server and update the snapshot. */
  saveToServer: () => Promise<boolean>;
  /** Reset in-memory state back to the last saved snapshot. */
  discardChanges: () => void;
  /** True when current state differs from the saved snapshot. */
  isDirty: () => boolean;
};

// Build initial tokensByMode from all registered themes
const initialTokensByMode = Object.fromEntries(
  Object.entries(themes).map(([key, value]) => [key, value]),
) as TokensByMode;

/** Theme names that should apply the "dark" class to <html>. */
const DARK_MODES = new Set<string>(["dark", "midnight", "ocean"]);

/** Shallow JSON-equality check for comparing snapshots. */
function isSameSnapshot(
  a: ThemeSnapshot,
  b: { mode: ThemeName; tokensByMode: TokensByMode },
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeTokensByMode(
  base: TokensByMode,
  overrides: Record<string, Partial<ThemeTokens>> | undefined,
): TokensByMode {
  if (!overrides) return base;
  const result: TokensByMode = { ...base };
  for (const [mode, tokens] of Object.entries(overrides)) {
    if (mode in themes) {
      const typed = mode as ThemeName;
      result[typed] = { ...base[typed], ...tokens };
    }
  }
  return result;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      tokensByMode: initialTokensByMode,
      tokens: themes.light,
      savedSnapshot: null,
      isEditorOpen: false,
      isTriggerVisible: false,

      setMode(mode) {
        const byMode = get().tokensByMode;
        const tokens = byMode[mode] ?? themes[mode];
        if (!byMode[mode]) {
          set({
            mode,
            tokensByMode: { ...byMode, [mode]: tokens },
            tokens,
          });
        } else {
          set({ mode, tokens });
        }
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", DARK_MODES.has(mode));
      },

      setTokens(overrides) {
        const { mode, tokensByMode } = get();
        const tokens = { ...tokensByMode[mode], ...overrides };
        set({ tokensByMode: { ...tokensByMode, [mode]: tokens }, tokens });
        applyTokens(overrides);
      },

      resetColor(keys) {
        const { mode, tokensByMode } = get();
        const preset = themes[mode];
        const restored = Object.fromEntries(
          keys.map((k) => [k, preset[k]]),
        ) as Partial<ThemeTokens>;
        const tokens = { ...tokensByMode[mode], ...restored };
        set({ tokensByMode: { ...tokensByMode, [mode]: tokens }, tokens });
        applyTokens(restored);
      },

      resetAll() {
        const { mode } = get();
        const tokens = themes[mode];
        set({
          tokensByMode: { ...get().tokensByMode, [mode]: tokens },
          tokens,
        });
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", DARK_MODES.has(mode));
      },

      applyTheme() {
        const { mode, tokensByMode } = get();
        const tokens = tokensByMode[mode] ?? themes[mode];
        set({ tokens });
        applyTokens(tokens);
        document.documentElement.classList.toggle("dark", DARK_MODES.has(mode));
      },

      toggleEditor(open) {
        set((s) => ({ isEditorOpen: open ?? !s.isEditorOpen }));
      },

      toggleTrigger(visible) {
        set((s) => ({ isTriggerVisible: visible ?? !s.isTriggerVisible }));
      },

      async loadFromServer() {
        try {
          const response = await fetchCompanyTheme();
          const serverMode = (
            response.active_mode in themes ? response.active_mode : "light"
          ) as ThemeName;
          const mergedTokensByMode = mergeTokensByMode(
            initialTokensByMode,
            response.tokens_by_mode,
          );
          const tokens = mergedTokensByMode[serverMode];
          set({
            mode: serverMode,
            tokensByMode: mergedTokensByMode,
            tokens,
            savedSnapshot: {
              mode: serverMode,
              tokensByMode: mergedTokensByMode,
            },
          });
          applyTokens(tokens);
          document.documentElement.classList.toggle(
            "dark",
            DARK_MODES.has(serverMode),
          );
        } catch {
          // Server fetch failed (no network, 403, 404) — keep local state.
        }
      },

      async saveToServer() {
        const { mode, tokensByMode } = get();
        // Only send modes with differences from the built-in preset,
        // to keep the payload small.
        const touchedTokensByMode: Record<string, ThemeTokens> = {};
        for (const key of Object.keys(tokensByMode) as ThemeName[]) {
          if (
            JSON.stringify(tokensByMode[key]) !== JSON.stringify(themes[key])
          ) {
            touchedTokensByMode[key] = tokensByMode[key];
          }
        }
        const payload: CompanyThemePayload = {
          active_mode: mode,
          tokens_by_mode: touchedTokensByMode,
        };
        try {
          await saveCompanyTheme(payload);
          set({ savedSnapshot: { mode, tokensByMode } });
          return true;
        } catch {
          return false;
        }
      },

      discardChanges() {
        const snap = get().savedSnapshot;
        if (!snap) return;
        const tokens = snap.tokensByMode[snap.mode];
        set({
          mode: snap.mode,
          tokensByMode: snap.tokensByMode,
          tokens,
        });
        applyTokens(tokens);
        document.documentElement.classList.toggle(
          "dark",
          DARK_MODES.has(snap.mode),
        );
      },

      isDirty() {
        const { savedSnapshot, mode, tokensByMode } = get();
        if (!savedSnapshot) return false;
        return !isSameSnapshot(savedSnapshot, { mode, tokensByMode });
      },
    }),
    {
      name: "vita-theme",
      partialize: ({ mode, tokensByMode, isTriggerVisible }) => ({
        mode,
        tokensByMode,
        isTriggerVisible,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.tokens = state.tokensByMode[state.mode];
        }
      },
    },
  ),
);
