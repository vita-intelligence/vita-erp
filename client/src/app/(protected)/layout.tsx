'use client';

import ProtectedNavDesktop from "@/components/navs/protected/ProtectedNavDesktop";
import ProtectedNavMobile from "@/components/navs/protected/ProtectedNavMobile";
import { AuthGuard } from "@/components/pages/auth/AuthGuard";

// Toggle this to skip auth during development
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === 'true';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Development mode - skip authentication
    if (DEV_MODE) {
        console.log('🔓 DEV MODE: Authentication skipped');
        return (
            <>
                <ProtectedNavDesktop />
                <ProtectedNavMobile />
                {children}
            </>
        );
    }

    // Production mode - require authentication
    return (
        <AuthGuard>
            <ProtectedNavDesktop />
            <ProtectedNavMobile />
            {children}
        </AuthGuard>
    );
}