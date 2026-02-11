'use client';

import { COMPANY_MOBILE_PRIMARY_KEYS, COMPANY_NAV_GROUPS } from '@/components/navs/protected/company.nav.config';
import { MOBILE_PRIMARY_KEYS, NAV_GROUPS } from '@/components/navs/protected/nav.config';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * useNavConfig
 * ------------
 * Automatically switches between default nav and company nav
 * based on current route
 */
export function useNavConfig() {
    const pathname = usePathname();

    const config = useMemo(() => {
        // Check if we're inside a company context
        const companyMatch = pathname?.match(/^\/companies\/(\d+)/);
        
        if (companyMatch) {
            const companyId = companyMatch[1];
            const companyBase = `/companies/${companyId}`;

            // Transform company nav items to have full paths
            const transformedGroups = COMPANY_NAV_GROUPS.map(group => ({
                ...group,
                items: group.items.map(item => ({
                    ...item,
                    href: `${companyBase}${item.href}`,
                })),
            }));

            return {
                groups: transformedGroups,
                mobileKeys: COMPANY_MOBILE_PRIMARY_KEYS,
                isCompanyContext: true,
                companyId,
            };
        }

        // Default nav
        return {
            groups: NAV_GROUPS,
            mobileKeys: MOBILE_PRIMARY_KEYS,
            isCompanyContext: false,
            companyId: null,
        };
    }, [pathname]);

    return config;
}