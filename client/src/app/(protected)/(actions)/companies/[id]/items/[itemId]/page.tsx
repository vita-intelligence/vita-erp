'use client';

import React, { useEffect, useRef } from 'react';
import { Skeleton } from '@heroui/react';
import { Lock as LockIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import gsap from 'gsap';

import { useItem, useItems, useCategories, useUnitOfMeasures } from '@/hooks/api/useItems';
import { useMyPermissions } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { RecipesSection } from '@/components/pages/companies/items/itemPage/RecipesSection';
import { ItemDetailHeader } from '@/components/pages/companies/items/itemPage/ItemDetailsHeader';



export default function ItemPage() {
    const params = useParams();
    const companyId = Number(params.id);
    const itemId = Number(params.itemId);

    // ── Data ──────────────────────────────────────────────────────────────────
    const { data: item, isLoading: itemLoading } = useItem(companyId, itemId);
    const { data: categories = [] } = useCategories(companyId);
    const { data: uoms = [] } = useUnitOfMeasures();

    // Raw materials from same company — used as available ingredients in recipes
    const { data: rawMaterials = [] } = useItems(companyId, { type: 'raw', active: true });

    // ── Permissions ───────────────────────────────────────────────────────────
    const { can, isLoading: permsLoading } = useMyPermissions(companyId);

    // ── Animation ─────────────────────────────────────────────────────────────
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const page = pageRef.current;
        if (!page || itemLoading) return;

        gsap.set(page.children, { opacity: 0, y: 20 });
        gsap.to(page.children, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
        });
    }, [itemLoading]);

    // ── Guards ────────────────────────────────────────────────────────────────
    if (permsLoading) return null;

    if (!can('items.view')) {
        return (
            <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                    <LockIcon className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Access Denied</h3>
                <p className="text-gray-600">You don't have permission to view items.</p>
            </div>
        );
    }

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    const breadcrumbItems = [
        { label: 'Items', href: `/companies/${companyId}/items` },
        { label: itemLoading ? '...' : (item?.name ?? 'Item') },
    ];

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (itemLoading) {
        return (
            <>
                <div className="mb-6">
                    <Skeleton className="h-5 w-48 rounded-none" />
                </div>
                <div className="space-y-4">
                    <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-12 h-12 rounded-none flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-8 w-1/3 rounded-none" />
                                <Skeleton className="h-4 w-1/4 rounded-none" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full rounded-none" />
                </div>
            </>
        );
    }

    if (!item) return null;

    return (
        <>
            {/* Breadcrumbs */}
            <div className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            <div ref={pageRef} className="space-y-6">

                {/* Item header — info + inline edit */}
                <ItemDetailHeader
                    item={item}
                    companyId={companyId}
                    categories={categories}
                    uoms={uoms}
                    canEdit={can('items.edit')}
                    canDelete={can('items.delete')}
                />

                {/* Recipes section — only for BOM items */}
                {item.item_type === 'bom' && (
                    <RecipesSection
                        companyId={companyId}
                        itemId={item.id}
                        rawMaterials={rawMaterials}
                        canEdit={can('items.edit')}
                    />
                )}

                {/* Info footer for raw materials */}
                {item.item_type === 'raw' && (
                    <div className="bg-gray-50 border-2 border-gray-200 p-4 text-sm text-gray-500">
                        Raw materials are base ingredients. Convert to a BOM item to attach recipes.
                    </div>
                )}
            </div>
        </>
    );
}