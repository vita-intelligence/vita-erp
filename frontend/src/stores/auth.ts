/**
 * Auth store — manages current user state.
 *
 * Hydrated on app mount via /auth/me/ call.
 * If 401 → user is not logged in → redirect to login.
 * Does NOT persist to localStorage — always fetches fresh from API.
 */

import { create } from "zustand";

import api from "@/lib/api";
import type { OrganizationSummary } from "@/types/api";

type User = {
  id: string;
  email: string;
  is_verified: boolean;
  date_joined: string;
  organizations: OrganizationSummary[];
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  /** Fetch current user from API. Called on app mount. */
  fetchUser: () => Promise<void>;

  /** Clear user state (after logout). */
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  async fetchUser() {
    try {
      const { data } = await api.get<User>("/auth/me/");
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearUser() {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
