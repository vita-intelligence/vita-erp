'use client';

import { useCurrentUser } from '@/hooks/api/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenLoader3D } from '@/components/ui/loaders/FullScreenLoader3D';

/**
 * AuthGuard - Protects routes from unauthenticated access.
 *
 * We check `isLoading` alone is not enough — on the very first render React
 * Query may not have initiated the fetch yet, leaving isLoading=false and
 * data=undefined simultaneously. Using `status` instead gives us three
 * explicit states: 'pending' (query not yet settled), 'success', 'error',
 * which eliminates the false-negative redirect on cold mount.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: user, status } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        // Only redirect once the query has definitively failed —
        // never on the intermediate pending state
        if (status === 'error') {
            router.push('/auth');
        }
    }, [status, router]);

    // Query hasn't settled yet — show loader instead of flashing a redirect
    if (status === 'pending') return <FullScreenLoader3D />;

    // Query failed — redirect is in flight, render nothing in the meantime
    if (status === 'error') return null;

    // status === 'success' — user is confirmed, render children
    return <>{children}</>;
}