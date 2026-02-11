// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
// API FUNCTIONS
// ============================================================================

export const inviteAPI = {
    /**
     * Create a new invitation for a company
     * POST /api/invites/companies/{company_id}/create/
     */
    create: async (companyId: number, data: CreateInviteData): Promise<InviteDetail> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/companies/${companyId}/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.invitee_email?.[0] ||
                                responseData.role?.[0] ||
                                responseData.message?.[0] ||
                                responseData.detail ||
                                'Failed to create invitation';
            throw new Error(errorMessage);
        }

        return responseData;
    },

    /**
     * Get sent invitations for a company (paginated)
     * GET /api/invites/companies/{company_id}/sent/
     */
    getSentInvites: async (companyId: number, page: number = 1): Promise<InviteListResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/companies/${companyId}/sent/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch sent invitations');
        }

        return data;
    },

    /**
     * Get received invitations for current user (paginated)
     * GET /api/invites/received/
     */
    getReceivedInvites: async (page: number = 1): Promise<InviteListResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/received/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch received invitations');
        }

        return data;
    },

    /**
     * Accept an invitation
     * POST /api/invites/{invite_id}/accept/
     */
    accept: async (inviteId: number): Promise<{ detail: string; company: { id: number; name: string } }> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/${inviteId}/accept/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to accept invitation');
        }

        return data;
    },

    /**
     * Decline an invitation
     * POST /api/invites/{invite_id}/decline/
     */
    decline: async (inviteId: number): Promise<{ detail: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/${inviteId}/decline/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to decline invitation');
        }

        return data;
    },

    /**
     * Cancel an invitation
     * POST /api/invites/{invite_id}/cancel/
     */
    cancel: async (inviteId: number): Promise<{ detail: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/invites/${inviteId}/cancel/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to cancel invitation');
        }

        return data;
    },
};