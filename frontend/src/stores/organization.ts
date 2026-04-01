/**
 * Organization store — manages the currently selected org.
 *
 * After login, the AuthGuard fetches /auth/me/ which includes the
 * user's organizations list. The OrgGuard then:
 * - If no orgs → redirect to /create-organization
 * - If one org → auto-select via selectOrganization()
 * - If multiple → redirect to /select-organization
 *
 * selectOrganization() calls POST /organizations/{id}/select/ which
 * issues new JWT cookies with the org_id claim. All subsequent API
 * calls automatically carry the org context via cookies.
 */

import { create } from "zustand";

import { selectOrganization as selectOrgApi } from "@/services/organization";
import type { OrganizationDetail } from "@/types/api";

type OrgState = {
  currentOrg: OrganizationDetail | null;
  isLoading: boolean;

  /** Select an org — calls backend to get org-scoped JWT cookies. */
  selectOrganization: (orgId: string) => Promise<boolean>;

  /** Clear org state (on logout or org switch). */
  clearOrganization: () => void;
};

export const useOrgStore = create<OrgState>()((set) => ({
  currentOrg: null,
  isLoading: false,

  async selectOrganization(orgId: string) {
    set({ isLoading: true });
    try {
      const org = await selectOrgApi(orgId);
      set({ currentOrg: org, isLoading: false });
      return true;
    } catch {
      set({ currentOrg: null, isLoading: false });
      return false;
    }
  },

  clearOrganization() {
    set({ currentOrg: null, isLoading: false });
  },
}));
