/**
 * Organogram API service — all backend calls for roles, layout, and members.
 */

import { ENDPOINTS } from "@/config";
import api from "@/lib/api";

import type {
  OrganogramLayout,
  OrgMember,
  RoleDetail,
  RolePermissionEntry,
  RoleSummary,
} from "./types";

// ── Roles ──────────────────────────────────────────────────────────────────

export async function fetchRoles(): Promise<RoleSummary[]> {
  const { data } = await api.get<RoleSummary[]>(ENDPOINTS.rbac.roles);
  return data;
}

export async function fetchRoleDetail(id: string): Promise<RoleDetail> {
  const { data } = await api.get<RoleDetail>(ENDPOINTS.rbac.role(id));
  return data;
}

export async function createRole(payload: {
  name: string;
  description?: string;
}): Promise<RoleSummary> {
  const { data } = await api.post<RoleSummary>(ENDPOINTS.rbac.roles, payload);
  return data;
}

export async function updateRole(
  id: string,
  payload: { name?: string; description?: string },
): Promise<RoleDetail> {
  const { data } = await api.patch<RoleDetail>(
    ENDPOINTS.rbac.role(id),
    payload,
  );
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(ENDPOINTS.rbac.role(id));
}

// ── Role permissions ───────────────────────────────────────────────────────

export async function setRolePermissions(
  roleId: string,
  permissions: RolePermissionEntry[],
): Promise<RolePermissionEntry[]> {
  const { data } = await api.put<RolePermissionEntry[]>(
    ENDPOINTS.rbac.rolePermissions(roleId),
    { permissions },
  );
  return data;
}

// ── Role members ───────────────────────────────────────────────────────────

export async function assignMember(
  roleId: string,
  userId: string,
): Promise<{ user_id: string; assigned_at: string }> {
  const { data } = await api.post<{ user_id: string; assigned_at: string }>(
    ENDPOINTS.rbac.roleMembers(roleId),
    { user_id: userId },
  );
  return data;
}

export async function unassignMember(
  roleId: string,
  userId: string,
): Promise<void> {
  await api.delete(ENDPOINTS.rbac.roleMember(roleId, userId));
}

// ── Organogram layout ──────────────────────────────────────────────────────

export async function fetchOrganogramLayout(): Promise<OrganogramLayout> {
  const { data } = await api.get<OrganogramLayout>(ENDPOINTS.rbac.organogram);
  return data;
}

export async function saveOrganogramLayout(payload: {
  nodes_layout: OrganogramLayout["nodes_layout"];
  edges: OrganogramLayout["edges"];
}): Promise<OrganogramLayout> {
  const { data } = await api.put<OrganogramLayout>(
    ENDPOINTS.rbac.organogram,
    payload,
  );
  return data;
}

// ── Org members ────────────────────────────────────────────────────────────

export async function fetchOrgMembers(): Promise<OrgMember[]> {
  const { data } = await api.get<OrgMember[]>(ENDPOINTS.rbac.orgMembers);
  return data;
}
