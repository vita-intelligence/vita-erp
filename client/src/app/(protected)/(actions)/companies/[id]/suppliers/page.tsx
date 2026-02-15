'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Skeleton } from '@heroui/react';
import { Plus, Search, Truck, Lock, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';

import { useSuppliers } from '@/hooks/api/useSuppliers';
import { useMyPermissions } from '@/hooks/api/useAccess';
import { SupplierCard } from '@/components/pages/companies/suppliers/SupplierCard';

export default function SuppliersPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    // ── Local filter state — committed on Search press ────────────────────────
    const [localSearch, setLocalSearch] = useState('');
    const [localActive, setLocalActive] = useState<boolean | ''>('');
    const [committed, setCommitted] = useState({ search: '', active: '' as boolean | '' });

    const { data: suppliers = [], isLoading } = useSuppliers(companyId, {
        search: committed.search || undefined,
        active: committed.active !== '' ? committed.active : undefined,
    });

    const { can, isLoading: permsLoading } = useMyPermissions(companyId);

    // ── Animation ─────────────────────────────────────────────────────────────
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const content = contentRef.current;
        if (!header || !content) return;
        gsap.set([header, content], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(content, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const cards = document.querySelectorAll('.supplier-card');
        gsap.fromTo(cards,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
        );
    }, [suppliers.length, isLoading]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSearch = () => setCommitted({ search: localSearch.trim(), active: localActive });

    const handleClear = () => {
        setLocalSearch('');
        setLocalActive('');
        setCommitted({ search: '', active: '' });
    };

    const hasFilters = committed.search !== '' || committed.active !== '';
    const hasPending = localSearch !== '' || localActive !== '';

    // ── Permission guard ──────────────────────────────────────────────────────
    if (permsLoading) return null;

    if (!can('suppliers.view')) {
        return (
            <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                    <Lock className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Access Denied</h3>
                <p className="text-gray-600">You don't have permission to view suppliers.</p>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1">Suppliers</h1>
                    <p className="text-gray-500 text-sm">
                        {isLoading ? 'Loading...' : `${suppliers.length} supplier${suppliers.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                {can('suppliers.create') && (
                    <Button
                        radius="none"
                        onPress={() => router.push(`/companies/${companyId}/suppliers/create`)}
                        startContent={<Plus size={18} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        New Supplier
                    </Button>
                )}
            </div>

            <div ref={contentRef} className="space-y-4">

                {/* Search + filters */}
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3">
                    <div className="flex gap-2">
                        <Input
                            value={localSearch}
                            onValueChange={setLocalSearch}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search suppliers..."
                            variant="bordered"
                            radius="none"
                            startContent={<Search size={16} className="text-gray-400 flex-shrink-0" />}
                            classNames={{
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-10",
                            }}
                        />
                        <Button
                            radius="none"
                            onPress={handleSearch}
                            className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none h-10 px-4 flex-shrink-0"
                        >
                            Search
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {(['', true, false] as const).map((val) => {
                            const label = val === '' ? 'All' : val ? 'Active' : 'Inactive';
                            const selected = localActive === val;
                            return (
                                <button
                                    key={String(val)}
                                    type="button"
                                    onClick={() => setLocalActive(val)}
                                    className={`text-xs font-bold px-3 py-1.5 border-2 border-black transition-all
                                        ${selected
                                            ? 'bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]'
                                            : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}

                        {hasPending && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors ml-1"
                            >
                                <X size={12} /> Clear
                            </button>
                        )}
                    </div>

                    {hasFilters && (
                        <p className="text-xs text-gray-400">Showing filtered results</p>
                    )}
                </div>

                {/* List */}
                {isLoading ? (
                    [1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white border-2 border-black">
                            <Skeleton className="w-10 h-10 rounded-none flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4 rounded-none" />
                                <Skeleton className="h-3 w-1/3 rounded-none" />
                            </div>
                        </div>
                    ))
                ) : suppliers.length === 0 ? (
                    <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                            <Truck className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                            {hasFilters ? 'No suppliers found' : 'No suppliers yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {hasFilters
                                ? 'Try adjusting your search or filters'
                                : 'Add your first supplier to get started'
                            }
                        </p>
                        {!hasFilters && can('suppliers.create') && (
                            <Button
                                radius="none"
                                onPress={() => router.push(`/companies/${companyId}/suppliers/create`)}
                                startContent={<Plus size={16} />}
                                className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                                New Supplier
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {suppliers.map(supplier => (
                            <div key={supplier.id} className="supplier-card">
                                <SupplierCard
                                    supplier={supplier}
                                    companyId={companyId}
                                    canEdit={can('suppliers.edit')}
                                    canDelete={can('suppliers.delete')}
                                    onClick={() => router.push(`/companies/${companyId}/suppliers/${supplier.id}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}