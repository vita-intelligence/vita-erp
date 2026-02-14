import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accessAPI, CreateRoleData, UpdateRoleData } from '@/lib/api/access';
import { useToast } from '../ui/useToast';

// ============================================================================
// ROLES
// ============================================================================

export function useCompanyRoles(companyId: number) {
    return useQuery({
        queryKey: ['roles', companyId],
        queryFn: () => accessAPI.getCompanyRoles(companyId),
        staleTime: 5 * 60 * 1000,
        enabled: !!companyId,
    });
}

export function useCreateRole(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateRoleData) => accessAPI.createRole(companyId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
            toast.success('Role created', `"${data.name}" has been created`);
        },
        onError: (error: Error) => {
            toast.error('Failed to create role', error.message);
        },
    });
}

export function useUpdateRole(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ roleId, data }: { roleId: number; data: UpdateRoleData }) =>
            accessAPI.updateRole(companyId, roleId, data),
        onSuccess: (data) => {
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
            // Invalidate + update single role cache immediately
            queryClient.setQueryData(['role', companyId, data.id], data);
            toast.success('Role updated', `"${data.name}" has been updated`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update role', error.message);
        },
    });
}

export function useDeleteRole(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (roleId: number) => accessAPI.deleteRole(companyId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles', companyId] });
            toast.success('Role deleted');
        },
        onError: (error: Error) => {
            toast.error('Failed to delete role', error.message);
        },
    });
}

// ============================================================================
// PERMISSIONS
// ============================================================================

export function usePermissionCatalog(companyId: number) {
    return useQuery({
        queryKey: ['permission-catalog', companyId],
        queryFn: () => accessAPI.getPermissionCatalog(companyId),
        staleTime: Infinity, // catalog never changes at runtime
        enabled: !!companyId,
    });
}

export function useRole(companyId: number, roleId: number) {
    return useQuery({
        queryKey: ['role', companyId, roleId],
        queryFn: () => accessAPI.getRole(companyId, roleId),
        staleTime: 5 * 60 * 1000,
        enabled: !!companyId && !!roleId,
    });
}

/**
 * useMyPermissions - Get current user's permissions for a company
 *
 * Usage:
 * const { can } = useMyPermissions(companyId);
 * can('roles.create') // → true/false
 */
export function useMyPermissions(companyId: number) {
    const query = useQuery({
        queryKey: ['permissions', companyId],
        queryFn: () => accessAPI.getMyPermissions(companyId),
        staleTime: 10 * 60 * 1000,
        enabled: !!companyId,
    });

    const can = (permissionKey: string): boolean => {
        if (!query.data) return false;
        return query.data.permissions.includes(permissionKey);
    };

    return { ...query, can };
}

// ============================================================================
// TEAM
// ============================================================================

export function useTeamMembers(companyId: number, page: number = 1) {
    return useQuery({
        queryKey: ['team', companyId, page],
        queryFn: () => accessAPI.getTeamMembers(companyId, page),
        staleTime: 2 * 60 * 1000,
        enabled: !!companyId,
    });
}

export function useChangeMemberRole(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ membershipId, roleId }: { membershipId: number; roleId: number }) =>
            accessAPI.changeMemberRole(companyId, membershipId, roleId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['team', companyId] });
            toast.success('Role updated', `Role changed to ${data.roles[0]?.name}`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update role', error.message);
        },
    });
}

export function useRemoveMember(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (membershipId: number) => accessAPI.removeMember(companyId, membershipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', companyId] });
            toast.success('Member removed', 'The member has been removed from the company');
        },
        onError: (error: Error) => {
            toast.error('Failed to remove member', error.message);
        },
    });
}