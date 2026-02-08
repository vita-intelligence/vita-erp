// API Configuration
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
// API FUNCTIONS
// ============================================================================

export const authAPI = {
    /**
     * Login user
     * POST /api/auth/login/
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important: Send cookies
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle Django error format
            const errorMessage = data.detail || 
                                data.email?.[0] || 
                                data.password?.[0] || 
                                'Login failed';
            throw new Error(errorMessage);
        }

        return data;
    },

    /**
     * Register new user
     * POST /api/auth/register/
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important: Send cookies
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Handle Django validation errors
            const errorMessage = responseData.email?.[0] || 
                                responseData.username?.[0] || 
                                responseData.password?.[0] || 
                                responseData.detail ||
                                'Registration failed';
            throw new Error(errorMessage);
        }

        return responseData;
    },

    /**
     * Logout user
     * POST /api/auth/logout/
     */
    logout: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Logout failed');
        }

        return data;
    },

    /**
     * Get current user
     * GET /api/auth/user/
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to get user');
        }

        return data;
    },

    /**
     * Refresh access token
     * POST /api/auth/refresh/
     */
    refreshToken: async (): Promise<{ message: string }> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Token refresh failed');
        }

        return data;
    },
};