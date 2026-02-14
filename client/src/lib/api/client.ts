const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ============================================================================
// INTERCEPTOR
// ============================================================================

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

const drainQueue = (success: boolean) => {
    refreshQueue.forEach(resolve => resolve(success));
    refreshQueue = [];
};

const tryRefreshToken = async (): Promise<boolean> => {
    if (isRefreshing) {
        return new Promise(resolve => refreshQueue.push(resolve));
    }

    isRefreshing = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            credentials: 'include',
        });
        const success = response.ok;
        drainQueue(success);
        return success;
    } catch {
        drainQueue(false);
        return false;
    } finally {
        isRefreshing = false;
    }
};

export const apiFetch = async (url: string, options?: RequestInit): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
    });

    if (response.status === 401) {
        const refreshed = await tryRefreshToken();

        if (refreshed) {
            return fetch(`${API_BASE_URL}${url}`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                ...options,
            });
        }

        window.location.href = '/auth';
    }

    return response;
};

export const apiRequest = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await apiFetch(url, options);

    if (response.status === 204) return undefined as T;

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
    }

    return data;
};