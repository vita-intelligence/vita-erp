/**
 * Company settings store — app-wide source of truth for
 * display/behaviour settings (separators, precisions, date format,
 * etc.) that the organization has customized.
 *
 * Loaded once per org via useOrgStore.selectOrganization(). Consumed
 * by the formatter utilities (lib/formatters.ts) and any future
 * business UI that renders numbers/dates/currency.
 *
 * Settings page updates go through updateLocal() after a successful
 * PATCH so every subscribed component re-renders with the new values
 * without waiting for another fetch.
 */

import { create } from "zustand";

import type { CompanySettingsResponse } from "@/app/[locale]/(app)/(org)/settings/_types/company-settings";
import { getCompanySettings } from "@/services/company-settings";

type CompanySettingsState = {
  /** The org's settings row, or null when nothing is loaded yet. */
  settings: CompanySettingsResponse | null;
  isLoading: boolean;

  /** Fetch the current org's settings from the server and cache them. */
  loadFromServer: () => Promise<void>;
  /** Optimistic merge after a successful PATCH, so consumers re-render immediately. */
  updateLocal: (patch: Partial<CompanySettingsResponse>) => void;
  /** Reset the store (on logout or org switch). */
  clear: () => void;
};

export const useCompanySettingsStore = create<CompanySettingsState>()(
  (set, get) => ({
    settings: null,
    isLoading: false,

    async loadFromServer() {
      set({ isLoading: true });
      try {
        const settings = await getCompanySettings();
        set({ settings, isLoading: false });
      } catch {
        // Non-fatal: formatters fall back to String(value) when settings is null.
        set({ settings: null, isLoading: false });
      }
    },

    updateLocal(patch) {
      const current = get().settings;
      if (!current) return;
      set({ settings: { ...current, ...patch } });
    },

    clear() {
      set({ settings: null, isLoading: false });
    },
  }),
);
