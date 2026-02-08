import { authAPI, LoginCredentials, RegisterData, User } from '@/lib/api/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * useLogin - Login mutation hook
 */
export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
        onSuccess: (data) => {
            console.log('Login successful:', data);
            
            // Store user in cache
            queryClient.setQueryData(['user'], data.user);
            
            // Show success toast
            toast.success('Welcome back!', `Logged in as ${data.user.username}`);
            
            // Delay navigation to let toast display
            setTimeout(() => {
                router.push('/home');
            }, 1500);
        },
        onError: (error: Error) => {
            console.error('Login failed:', error.message);
            toast.error('Login failed', error.message);
        },
    });
}

/**
 * useRegister - Registration mutation hook
 */
export function useRegister() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: RegisterData) => authAPI.register(data),
        onSuccess: (data) => {
            console.log('Registration successful:', data);
            
            // Store user in cache
            queryClient.setQueryData(['user'], data.user);
            
            // Show success toast
            toast.success('Account created!', `Welcome, ${data.user.username}!`);
            
            // Delay navigation to let toast display
            setTimeout(() => {
                router.push('/home');
            }, 1500);
        },
        onError: (error: Error) => {
            console.error('Registration failed:', error.message);
            toast.error('Registration failed', error.message);
        },
    });
}

/**
 * useLogout - Logout mutation hook
 */
export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: () => authAPI.logout(),
        onSuccess: () => {
            console.log('Logout successful');
            
            // Clear user from cache
            queryClient.setQueryData(['user'], null);
            
            // Show info toast
            toast.info('Logged out', 'See you next time!');
            
            // Delay navigation to let toast display
            setTimeout(() => {
                router.push('/auth');
            }, 1500);
        },
        onError: (error: Error) => {
            console.error('Logout failed:', error.message);
            toast.error('Logout failed', error.message);
        },
    });
}

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * useCurrentUser - Get current authenticated user
 */
export function useCurrentUser() {
    return useQuery<User | null>({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                return await authAPI.getCurrentUser();
            } catch (error) {
                return null;
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

/**
 * useRefreshToken - Refresh access token
 */
export function useRefreshToken() {
    const toast = useToast();

    return useMutation({
        mutationFn: () => authAPI.refreshToken(),
        onSuccess: () => {
            console.log('Token refreshed');
            toast.success('Session refreshed');
        },
        onError: (error: Error) => {
            console.error('Token refresh failed:', error.message);
            toast.error('Session expired', 'Please log in again');
        },
    });
}