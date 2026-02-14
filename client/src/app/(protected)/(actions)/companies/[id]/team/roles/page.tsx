'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Skeleton } from '@heroui/react';
import { Shield, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useCompanyRoles, useMyPermissions } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { RoleCard } from '@/components/pages/companies/team/roles/RoleCard';


export default function RolesPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const { data: roles, isLoading } = useCompanyRoles(companyId);
    const { can } = useMyPermissions(companyId);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const headerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const list = listRef.current;
        if (!header || !list) return;

        gsap.set([header, list], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
            .to(list, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    }, []);

    const systemRoles = roles?.filter(r => r.is_system) ?? [];
    const customRoles = roles?.filter(r => !r.is_system) ?? [];

    const breadcrumbItems = [
        { label: 'Team', href: `/companies/${companyId}/team` },
        { label: 'Roles', href: '#' },
    ];

    const showSkeleton = !mounted || isLoading;

    return (
        <div className="space-y-6">
            <BrutalistBreadcrumbs items={breadcrumbItems} />

            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Roles</h1>
                    {/* Always render <p> — avoids skeleton/text mismatch on hydration */}
                    <p className="text-gray-600 min-h-[1.5rem]">
                        {!showSkeleton && `${roles?.length ?? 0} roles defined`}
                    </p>
                </div>

                {mounted && can('roles.create') && (
                    <Button
                        radius="none"
                        onPress={() => router.push(`/companies/${companyId}/team/roles/add`)}
                        startContent={<Plus size={18} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        New Role
                    </Button>
                )}
            </div>

            {/* List */}
            <div ref={listRef} className="space-y-4">
                {showSkeleton ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border-2 border-black p-5">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-none flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/4 rounded-none" />
                                    <Skeleton className="h-3 w-1/3 rounded-none" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {/* Custom roles */}
                        {customRoles.map(role => (
                            <RoleCard
                                key={role.id}
                                role={role}
                                companyId={companyId}
                                canEdit={can('roles.edit')}
                                canDelete={can('roles.delete')}
                            />
                        ))}

                        {/* System roles */}
                        {systemRoles.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-2">
                                    System Roles
                                </p>
                                {systemRoles.map(role => (
                                    <RoleCard
                                        key={role.id}
                                        role={role}
                                        companyId={companyId}
                                        canEdit={false}
                                        canDelete={false}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {customRoles.length === 0 && (
                            <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                                    <Shield className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-2">No custom roles yet</h3>
                                <p className="text-gray-600 mb-6">Create roles to control what your team members can do</p>
                                {can('roles.create') && (
                                    <Button
                                        radius="none"
                                        onPress={() => router.push(`/companies/${companyId}/team/roles/add`)}
                                        startContent={<Plus size={16} />}
                                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                    >
                                        New Role
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}