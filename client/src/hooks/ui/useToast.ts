import { addToast } from '@heroui/toast';

/**
 * Custom toast hook with pre-styled variants
 * 
 * Usage:
 * const { success, error, info, warning } = useToast();
 * success('Login successful!');
 * error('Invalid credentials');
 */
export function useToast() {
    return {
        success: (message: string, description?: string) => {
            addToast({
                title: message,
                description,
                color: 'success',
                variant: 'flat',
                timeout: 3000,
            });
        },

        error: (message: string, description?: string) => {
            addToast({
                title: message,
                description,
                color: 'danger',
                variant: 'flat',
                timeout: 4000,
            });
        },

        info: (message: string, description?: string) => {
            addToast({
                title: message,
                description,
                color: 'primary',
                variant: 'flat',
                timeout: 3000,
            });
        },

        warning: (message: string, description?: string) => {
            addToast({
                title: message,
                description,
                color: 'warning',
                variant: 'flat',
                timeout: 3500,
            });
        },

        // Custom toast with full control
        custom: (options: {
            title: string;
            description?: string;
            color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
            variant?: 'solid' | 'bordered' | 'flat';
            timeout?: number;
        }) => {
            addToast({
                variant: 'flat',
                timeout: 3000,
                ...options,
            });
        },
    };
}