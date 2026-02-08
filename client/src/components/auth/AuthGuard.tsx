'use client';

import { useCurrentUser, useRefreshToken } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { FullScreenLoader3D } from '../loaders/FullScreenLoader3D';

/**
 * AuthGuard - Protects routes and handles automatic token refresh
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useCurrentUser();
    const refreshMutation = useRefreshToken();
    const router = useRouter();
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto refresh token every 14 minutes
    useEffect(() => {
        if (user) {
            refreshIntervalRef.current = setInterval(() => {
                refreshMutation.mutate();
            }, 14 * 60 * 1000); // 14 minutes
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [user, refreshMutation]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
        }
    }, [user, isLoading, router]);

    // Loading state
    if (isLoading) {
        return (
            <FullScreenLoader3D />
        );
    }

    // Not authenticated - will redirect
    if (!user) {
        return null;
    }

    // Authenticated - show content
    return <>{children}</>;
}