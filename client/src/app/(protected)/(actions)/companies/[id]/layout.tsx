'use client';

import { useParams } from 'next/navigation';
import { useMyPermissions } from '@/hooks/api/useAccess';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const companyId = Number(params.id);

    // Prefetch permissions once for all child pages
    useMyPermissions(companyId);

    return <>{children}</>;
}