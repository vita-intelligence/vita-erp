const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
// HELPERS
// ============================================================================

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
    });

    if (response.status === 204) return undefined as T;

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
    }

    return data;
};

// ============================================================================
// API
// ============================================================================

export const accessAPI = {
    // --- Roles ---

    getRole: (companyId: number, roleId: number): Promise<RoleDetail> =>
        request(`/api/access/companies/${companyId}/roles/${roleId}/`),

    getCompanyRoles: (companyId: number): Promise<Role[]> =>
        request(`/api/access/companies/${companyId}/roles/`),

    createRole: (companyId: number, data: CreateRoleData): Promise<RoleDetail> =>
        request(`/api/access/companies/${companyId}/roles/create/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateRole: (companyId: number, roleId: number, data: UpdateRoleData): Promise<RoleDetail> =>
        request(`/api/access/companies/${companyId}/roles/${roleId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    deleteRole: (companyId: number, roleId: number): Promise<void> =>
        request(`/api/access/companies/${companyId}/roles/${roleId}/`, {
            method: 'DELETE',
        }),

    // --- Permissions ---

    getPermissionCatalog: (companyId: number): Promise<Permission[]> =>
        request(`/api/access/companies/${companyId}/permissions/`),

    getMyPermissions: (companyId: number): Promise<MyPermissionsResponse> =>
        request(`/api/access/companies/${companyId}/my-permissions/`),

    // --- Team ---

    getTeamMembers: (companyId: number, page: number = 1): Promise<TeamListResponse> =>
        request(`/api/access/companies/${companyId}/team/?page=${page}`),

    changeMemberRole: (companyId: number, membershipId: number, roleId: number): Promise<TeamMember> =>
        request(`/api/access/companies/${companyId}/team/${membershipId}/role/`, {
            method: 'POST',
            body: JSON.stringify({ role_id: roleId }),
        }),

    removeMember: (companyId: number, membershipId: number): Promise<void> =>
        request(`/api/access/companies/${companyId}/team/${membershipId}/`, {
            method: 'DELETE',
        }),
};