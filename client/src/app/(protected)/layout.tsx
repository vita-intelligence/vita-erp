'use client';

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
        return <>{children}</>;
    }

    // Production mode - require authentication
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}