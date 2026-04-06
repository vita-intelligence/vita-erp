import type { Node } from "@xyflow/react";

// ── API response types ─────────────────────────────────────────────────────

export type RoleSummary = {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
  member_count: number;
  created_at: string;
};

export type RolePermissionEntry = {
  module_code: string;
  action: string;
};

export type RoleMember = {
  user_id: string;
  email: string;
  assigned_at: string;
};

export type RoleDetail = RoleSummary & {
  permissions: RolePermissionEntry[];
  members: RoleMember[];
  updated_at: string;
};

export type OrgMember = {
  user_id: string;
  email: string;
  roles: { id: string; name: string }[];
};

export type OrganogramLayout = {
  nodes_layout: Record<string, { x: number; y: number }>;
  edges: { source: string; target: string }[];
  updated_at: string;
};

// ── ReactFlow node data ────────────────────────────────────────────────────

export type RoleNodeData = {
  role: RoleSummary;
  isReadOnly: boolean;
};

export type RoleNode = Node<RoleNodeData, "roleNode">;
