'use client';

import { useCurrentUser } from '@/hooks/api/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenLoader3D } from '@/components/ui/loaders/FullScreenLoader3D';

/**
 * AuthGuard - Protects routes.
 * Token refresh is handled automatically by apiFetch interceptor.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth');
        }
    }, [user, isLoading, router]);

    if (isLoading) return <FullScreenLoader3D />;
    if (!user) return null;

    return <>{children}</>;
}