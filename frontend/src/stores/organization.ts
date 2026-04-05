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
import { fetchMyPermissions, type PermissionsResponse } from "@/services/rbac";
import { useCompanySettingsStore } from "@/stores/companySettings";
import { useThemeStore } from "@/stores/theme";
import type { OrganizationDetail } from "@/types/api";

type OrgState = {
  currentOrg: OrganizationDetail | null;
  isLoading: boolean;

  /** RBAC permissions for the current user in the active org.
   * Null = not loaded yet. Owner short-circuits all checks. */
  permissions: PermissionsResponse | null;

  /** Select an org — calls backend to get org-scoped JWT cookies and
   * loads the caller's permissions for that org. */
  selectOrganization: (orgId: string) => Promise<boolean>;

  /** Refresh permissions for the current org (e.g. after role change). */
  loadPermissions: () => Promise<void>;

  /** Clear org state (on logout or org switch). */
  clearOrganization: () => void;
};

export const useOrgStore = create<OrgState>()((set) => ({
  currentOrg: null,
  isLoading: false,
  permissions: null,

  async selectOrganization(orgId: string) {
    set({ isLoading: true });
    try {
      const org = await selectOrgApi(orgId);
      // Load permissions after the org_id cookie is set so the
      // /rbac/me/permissions/ request carries the new org context.
      let permissions: PermissionsResponse | null = null;
      try {
        permissions = await fetchMyPermissions();
      } catch {
        // Permissions endpoint failed — leave null so UI can react
        // (usually means no access to the org's tenant DB).
      }
      // Load org-scoped theme and apply it. loadFromServer handles its
      // own failures so a missing theme row doesn't block org selection.
      await useThemeStore.getState().loadFromServer();
      // Load org-scoped company settings so formatters app-wide reflect
      // the new org's display preferences immediately.
      await useCompanySettingsStore.getState().loadFromServer();
      set({ currentOrg: org, permissions, isLoading: false });
      return true;
    } catch {
      set({ currentOrg: null, permissions: null, isLoading: false });
      return false;
    }
  },

  async loadPermissions() {
    try {
      const permissions = await fetchMyPermissions();
      set({ permissions });
    } catch {
      set({ permissions: null });
    }
  },

  clearOrganization() {
    useCompanySettingsStore.getState().clear();
    set({ currentOrg: null, permissions: null, isLoading: false });
  },
}));
