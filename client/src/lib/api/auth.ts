import { apiFetch } from '@/lib/api/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ============================================================================
// TYPES
// ============================================================================

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    date_joined: string;
}

export interface AuthResponse {
    user: User;
    message: string;
}

// ============================================================================
// AUTH API
// login/register/logout/refresh use raw fetch — no interceptor needed.
// getCurrentUser uses apiFetch so a stale token auto-refreshes on app load.
// ============================================================================

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || data.email?.[0] || data.password?.[0] || 'Login failed'
            );
        }

        return data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.email?.[0] ||
                responseData.username?.[0] ||
                responseData.password?.[0] ||
                responseData.detail ||
                'Registration failed'
            );
        }

        return responseData;
    },

    logout: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Logout failed');
        }

        return data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiFetch('/api/auth/user/');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to get user');
        }

        return data;
    },

    refreshToken: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Token refresh failed');
        }

        return data;
    },
};