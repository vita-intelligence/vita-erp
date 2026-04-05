/**
 * RBAC service — fetches the caller's effective permissions in the
 * currently-active organization.
 *
 * Backend reference: apps/rbac/views/permissions.py::MePermissionsView
 * Response shape:
 *   {
 *     is_owner: boolean,                       // Owner short-circuits all checks
 *     permissions: { [module: string]: action[] }
 *   }
 */

import { ENDPOINTS } from "@/config";
import api from "@/lib/api";

export type PermissionsResponse = {
  is_owner: boolean;
  permissions: Record<string, string[]>;
};

export async function fetchMyPermissions(): Promise<PermissionsResponse> {
  const { data } = await api.get<PermissionsResponse>(
    ENDPOINTS.rbac.mePermissions,
  );
  return data;
}
