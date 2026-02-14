import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inviteAPI, CreateInviteData } from '@/lib/api/invite';
import { useToast } from '../ui/useToast';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * useCreateInvite - Create a new invitation
 * 
 * Usage:
 * const createInvite = useCreateInvite(companyId);
 * createInvite.mutate({ invitee_email: 'user@example.com', role: 1 });
 */
export function useCreateInvite(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateInviteData) => inviteAPI.create(companyId, data),
        onSuccess: (data) => {
            console.log('Invitation created:', data);
            
            // Invalidate sent invites cache
            queryClient.invalidateQueries({ queryKey: ['invites', 'sent', companyId] });
            
            // Show success toast
            toast.success(
                'Invitation sent!',
                `Invited ${data.invitee_email} to join as ${data.role.name}`
            );
        },
        onError: (error: Error) => {
            console.error('Invitation failed:', error.message);
            toast.error('Failed to send invitation', error.message);
        },
    });
}

/**
 * useAcceptInvite - Accept an invitation
 */
export function useAcceptInvite() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (inviteId: number) => inviteAPI.accept(inviteId),
        onSuccess: (data) => {
            console.log('Invitation accepted:', data);
            
            // Invalidate received invites and companies list
            queryClient.invalidateQueries({ queryKey: ['invites', 'received'] });
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            
            toast.success(
                'Invitation accepted!',
                `You've joined ${data.company.name}`
            );
        },
        onError: (error: Error) => {
            console.error('Accept failed:', error.message);
            toast.error('Failed to accept invitation', error.message);
        },
    });
}

/**
 * useDeclineInvite - Decline an invitation
 */
export function useDeclineInvite() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (inviteId: number) => inviteAPI.decline(inviteId),
        onSuccess: () => {
            console.log('Invitation declined');
            
            // Invalidate received invites
            queryClient.invalidateQueries({ queryKey: ['invites', 'received'] });
            
            toast.info('Invitation declined');
        },
        onError: (error: Error) => {
            console.error('Decline failed:', error.message);
            toast.error('Failed to decline invitation', error.message);
        },
    });
}

/**
 * useCancelInvite - Cancel an invitation
 */
export function useCancelInvite(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (inviteId: number) => inviteAPI.cancel(inviteId),
        onSuccess: () => {
            console.log('Invitation cancelled');
            
            // Invalidate sent invites
            queryClient.invalidateQueries({ queryKey: ['invites', 'sent', companyId] });
            
            toast.info('Invitation cancelled');
        },
        onError: (error: Error) => {
            console.error('Cancel failed:', error.message);
            toast.error('Failed to cancel invitation', error.message);
        },
    });
}

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * useSentInvites - Get sent invitations for a company
 * 
 * Usage:
 * const { data, isLoading } = useSentInvites(companyId, page);
 */
export function useSentInvites(companyId: number, page: number = 1) {
    return useQuery({
        queryKey: ['invites', 'sent', companyId, page],
        queryFn: () => inviteAPI.getSentInvites(companyId, page),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * useReceivedInvites - Get received invitations for current user
 * 
 * Usage:
 * const { data, isLoading } = useReceivedInvites(page);
 */
export function useReceivedInvites(page: number = 1) {
    return useQuery({
        queryKey: ['invites', 'received', page],
        queryFn: () => inviteAPI.getReceivedInvites(page),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}