import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface Invite {
    id: number;
    inviter_name: string;
    company_name: string;
    company: number;
    invitee_email: string;
    role_name: string;
    role: number;
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
    message: string;
    created_at: string;
    expires_at: string;
    responded_at: string | null;
    is_expired: boolean;
}

export interface InviteDetail {
    id: number;
    inviter: {
        id: number;
        username: string;
        email: string;
    };
    company: {
        id: number;
        name: string;
        description: string;
    };
    invitee_email: string;
    role: {
        id: number;
        name: string;
        description: string;
    };
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
    message: string;
    created_at: string;
    expires_at: string;
    responded_at: string | null;
    is_expired: boolean;
}

export interface CreateInviteData {
    invitee_email: string;
    role: number;
    message?: string;
}

export interface InviteListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Invite[];
}

// ============================================================================
// API
// ============================================================================

export const inviteAPI = {
    create: (companyId: number, data: CreateInviteData): Promise<InviteDetail> =>
        apiRequest(`/api/invites/companies/${companyId}/create/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getSentInvites: (companyId: number, page: number = 1): Promise<InviteListResponse> =>
        apiRequest(`/api/invites/companies/${companyId}/sent/?page=${page}`),

    getReceivedInvites: (page: number = 1): Promise<InviteListResponse> =>
        apiRequest(`/api/invites/received/?page=${page}`),

    accept: (inviteId: number): Promise<{ detail: string; company: { id: number; name: string } }> =>
        apiRequest(`/api/invites/${inviteId}/accept/`, { method: 'POST' }),

    decline: (inviteId: number): Promise<{ detail: string }> =>
        apiRequest(`/api/invites/${inviteId}/decline/`, { method: 'POST' }),

    cancel: (inviteId: number): Promise<{ detail: string }> =>
        apiRequest(`/api/invites/${inviteId}/cancel/`, { method: 'POST' }),
};