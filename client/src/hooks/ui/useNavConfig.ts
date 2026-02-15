'use client';

import { COMPANY_MOBILE_PRIMARY_KEYS, COMPANY_NAV_GROUPS } from '@/components/navs/protected/company.nav.config';
import { MOBILE_PRIMARY_KEYS, NAV_GROUPS } from '@/components/navs/protected/nav.config';
import { useMyPermissions } from '@/hooks/api/useAccess';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * useNavConfig
 * ------------
 * Resolves the correct nav groups and mobile keys based on the current route.
 *
 * - Outside a company context → returns the default app nav (NAV_GROUPS)
 * - Inside /companies/:id     → returns company nav with absolute hrefs
 *                               and permission-filtered items
 *
 * Permission filtering happens here so neither nav component (desktop/mobile)
 * needs to know anything about access control — they just render what they get.
 */
export function useNavConfig() {
    const pathname = usePathname();

    // Extract companyId once outside useMemo so we can pass it to the
    // permissions hook unconditionally (hooks must not be called conditionally).
    const companyMatch = pathname?.match(/^\/companies\/(\d+)/);
    const companyId = companyMatch ? Number(companyMatch[1]) : null;

    // No-ops (returns can = () => false) when companyId is null.
    const { can } = useMyPermissions(companyId);

    const config = useMemo(() => {
        if (companyId) {
            const companyBase = `/companies/${companyId}`;

            const transformedGroups = COMPANY_NAV_GROUPS.map(group => ({
                ...group,
                items: group.items
                    // Prefix relative hrefs with the company base path
                    .map(item => ({ ...item, href: `${companyBase}${item.href}` }))
                    // Strip items the current member doesn't have access to.
                    // Items without a permission field are always visible.
                    .filter(item => !item.permission || can(item.permission)),
            }));

            return {
                groups: transformedGroups,
                mobileKeys: COMPANY_MOBILE_PRIMARY_KEYS,
                isCompanyContext: true,
                companyId: String(companyId),
            };
        }

        // Default nav — no permission filtering needed at this level.
        return {
            groups: NAV_GROUPS,
            mobileKeys: MOBILE_PRIMARY_KEYS,
            isCompanyContext: false,
            companyId: null,
        };
    }, [pathname, can, companyId]);

    return config;
}