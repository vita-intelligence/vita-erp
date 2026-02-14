import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface Permission {
    id: number;
    key: string;
    description: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    is_system: boolean;
}

export interface RoleDetail extends Role {
    permissions: Permission[];
}

export interface MyPermissionsResponse {
    permissions: string[];
}

export interface TeamMember {
    id: number;
    user_id: number;
    username: string;
    email: string;
    is_active: boolean;
    joined_at: string;
    roles: Role[];
}

export interface TeamListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: TeamMember[];
}

export interface CreateRoleData {
    name: string;
    description?: string;
    permission_ids?: number[];
}

export interface UpdateRoleData {
    name?: string;
    description?: string;
    permission_ids?: number[];
}

// ============================================================================
// API
// ============================================================================

export const accessAPI = {
    // --- Roles ---

    getRole: (companyId: number, roleId: number): Promise<RoleDetail> =>
        apiRequest(`/api/access/companies/${companyId}/roles/${roleId}/`),

    getCompanyRoles: (companyId: number): Promise<Role[]> =>
        apiRequest(`/api/access/companies/${companyId}/roles/`),

    createRole: (companyId: number, data: CreateRoleData): Promise<RoleDetail> =>
        apiRequest(`/api/access/companies/${companyId}/roles/create/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateRole: (companyId: number, roleId: number, data: UpdateRoleData): Promise<RoleDetail> =>
        apiRequest(`/api/access/companies/${companyId}/roles/${roleId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deleteRole: (companyId: number, roleId: number): Promise<void> =>
        apiRequest(`/api/access/companies/${companyId}/roles/${roleId}/`, {
            method: 'DELETE',
        }),

    // --- Permissions ---

    getPermissionCatalog: (companyId: number): Promise<Permission[]> =>
        apiRequest(`/api/access/companies/${companyId}/permissions/`),

    getMyPermissions: (companyId: number): Promise<MyPermissionsResponse> =>
        apiRequest(`/api/access/companies/${companyId}/my-permissions/`),

    // --- Team ---

    getTeamMembers: (companyId: number, page: number = 1): Promise<TeamListResponse> =>
        apiRequest(`/api/access/companies/${companyId}/team/?page=${page}`),

    changeMemberRole: (companyId: number, membershipId: number, roleId: number): Promise<TeamMember> =>
        apiRequest(`/api/access/companies/${companyId}/team/${membershipId}/role/`, {
            method: 'POST',
            body: JSON.stringify({ role_id: roleId }),
        }),

    removeMember: (companyId: number, membershipId: number): Promise<void> =>
        apiRequest(`/api/access/companies/${companyId}/team/${membershipId}/`, {
            method: 'DELETE',
        }),
};