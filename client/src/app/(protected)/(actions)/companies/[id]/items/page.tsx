'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { Package, Plus, Lock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';

import { useItems, useCategories } from '@/hooks/api/useItems';
import { useMyPermissions } from '@/hooks/api/useAccess';
import { Item, ItemFilters } from '@/lib/api/items';

import { EMPTY_FILTERS, ItemsFilters, ItemsFiltersState } from '@/components/pages/companies/items/ItemsFilters';
import { ItemCardSkeleton } from '@/components/pages/companies/items/ItemCardSkeleton';
import { ItemCard } from '@/components/pages/companies/items/ItemCard';

// How many items to load per page
const PAGE_SIZE = 20;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Derives API-ready ItemFilters from the local UI filter state.
 * Separates UI concerns (empty string = "no filter") from API concerns.
 */
function toApiFilters(state: ItemsFiltersState): ItemFilters {
    const filters: ItemFilters = {};
    if (state.type) filters.type = state.type;
    if (state.category !== '') filters.category = state.category as number;
    if (state.active !== '') filters.active = state.active as boolean;
    return filters;
}

// ============================================================================
// PAGE
// ============================================================================

export default function ItemsPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    // ── Filters & pagination state ────────────────────────────────────────────
    const [filters, setFilters] = useState<ItemsFiltersState>(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    // Accumulated items across pages — reset when filters change
    const [allItems, setAllItems] = useState<Item[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // ── Refs ──────────────────────────────────────────────────────────────────
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    // Sentinel element at the bottom of the list — triggers next page load
    const sentinelRef = useRef<HTMLDivElement>(null);

    // ── Permissions ───────────────────────────────────────────────────────────
    const { can, isLoading: permsLoading } = useMyPermissions(companyId);

    // ── Data ──────────────────────────────────────────────────────────────────
    const apiFilters = useMemo(() => toApiFilters(filters), [filters]);

    const { data: categories = [] } = useCategories(companyId);

    // We pass page + PAGE_SIZE through filters for the paginated endpoint.
    // Since our backend returns a flat array (not paginated envelope), we
    // simulate pagination by slicing: fetch page * PAGE_SIZE items and compare.
    const { data: pageData, isFetching } = useItems(companyId, {
        ...apiFilters,
        // Backend supports offset-based filtering via query params if you add it later.
        // For now we fetch all and handle accumulation client-side.
    });

    // ── Client-side pagination + search ───────────────────────────────────────

    /**
     * Filtered + searched items from the full dataset.
     * We do client-side search here since the backend doesn't support it yet —
     * swap this out for a server-side search param when ready.
     */
    const filteredItems = useMemo(() => {
        if (!pageData) return [];
        const q = filters.search.trim().toLowerCase();
        if (!q) return pageData;
        return pageData.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.category_name?.toLowerCase().includes(q)
        );
    }, [pageData, filters.search]);

    // Slice filtered items into pages for infinite scroll
    const visibleItems = useMemo(
        () => filteredItems.slice(0, page * PAGE_SIZE),
        [filteredItems, page]
    );

    // Keep hasMore in sync — no more pages if we've shown all filtered items
    useEffect(() => {
        setHasMore(visibleItems.length < filteredItems.length);
    }, [visibleItems.length, filteredItems.length]);

    // ── Reset page when filters change ────────────────────────────────────────
    useEffect(() => {
        setPage(1);
    }, [filters]);

    // ── Entrance animation ────────────────────────────────────────────────────
    useEffect(() => {
        const header = headerRef.current;
        const content = contentRef.current;
        if (!header || !content) return;

        gsap.set([header, content], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(content, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    }, []);

    // ── Infinite scroll via IntersectionObserver ──────────────────────────────
    const loadMore = useCallback(() => {
        if (!isFetching && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Fire when the sentinel enters the viewport
                if (entries[0].isIntersecting) loadMore();
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    // ── Permission guard ──────────────────────────────────────────────────────
    if (permsLoading) return null;

    if (!can('items.view')) {
        return (
            <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                    <Lock className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Access Denied</h3>
                <p className="text-gray-600">You don't have permission to view items.</p>
            </div>
        );
    }

    // ── Derived state for UI ──────────────────────────────────────────────────
    const isInitialLoading = isFetching && visibleItems.length === 0;
    const isEmpty = !isFetching && filteredItems.length === 0;
    const hasFiltersActive = filters.search !== '' || filters.type !== '' ||
        filters.category !== '' || filters.active !== '';

    return (
        <div className="space-y-6">

            {/* Header actions */}
            <div className="flex items-center gap-2">
                {can('items.create') && (
                    <Button
                        radius="none"
                        onPress={() => router.push(`/companies/${companyId}/items/categories`)}
                        className="bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Categories
                    </Button>
                )}
                {can('items.create') && (
                    <Button
                        radius="none"
                        onPress={() => router.push(`/companies/${companyId}/items/create`)}
                        startContent={<Plus size={18} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        New Item
                    </Button>
                )}
            </div>

            <div ref={contentRef} className="space-y-4">

                {/* Filters */}
                <ItemsFilters
                    filters={filters}
                    categories={categories}
                    onChange={setFilters}
                />

                {/* List */}
                <div className="space-y-2">
                    {isInitialLoading ? (
                        // Initial skeleton — 5 placeholders while first page loads
                        [1, 2, 3, 4, 5].map(i => <ItemCardSkeleton key={i} />)

                    ) : isEmpty ? (
                        // Empty state — differentiate between no items vs no results
                        <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                                <Package className="text-gray-400" size={32} />
                            </div>
                            {hasFiltersActive ? (
                                <>
                                    <h3 className="text-xl font-bold text-black mb-2">No items match</h3>
                                    <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                                    <Button
                                        radius="none"
                                        onPress={() => setFilters(EMPTY_FILTERS)}
                                        className="bg-white text-black font-bold border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                    >
                                        Clear Filters
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-black mb-2">No items yet</h3>
                                    <p className="text-gray-600 mb-6">Start by registering your first raw material or BOM item</p>
                                    {can('items.create') && (
                                        <Button
                                            radius="none"
                                            onPress={() => router.push(`/companies/${companyId}/items/create`)}
                                            startContent={<Plus size={16} />}
                                            className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                        >
                                            New Item
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                    ) : (
                        <>
                            {visibleItems.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    companyId={companyId}
                                />
                            ))}

                            {/* Loading skeleton for next page */}
                            {isFetching && [1, 2].map(i => <ItemCardSkeleton key={`loading-${i}`} />)}

                            {/* Sentinel — observed by IntersectionObserver to trigger next page */}
                            <div ref={sentinelRef} className="h-4" aria-hidden />

                            {/* End of list indicator */}
                            {!hasMore && filteredItems.length > PAGE_SIZE && (
                                <p className="text-center text-xs text-gray-400 py-4 font-mono">
                                    — {filteredItems.length} items loaded —
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}