'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Textarea } from '@heroui/react';
import { Shield, Building2, Users, Lock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useCreateRole, usePermissionCatalog } from '@/hooks/api/useAccess';
import { Permission } from '@/lib/api/access';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';

// ============================================================================
// PERMISSION GROUPS
// Mirrors PERMISSION_CATALOG in Python — used to group flat permissions from API
// ============================================================================

const PERMISSION_GROUPS: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'companies', label: 'Company Management', icon: <Building2 size={16} /> },
    { key: 'members', label: 'Member Management', icon: <Users size={16} /> },
    { key: 'roles', label: 'Role & Access Control', icon: <Lock size={16} /> },
];

// ============================================================================
// PERMISSION GROUP COMPONENT
// ============================================================================

interface PermissionGroupProps {
    label: string;
    icon: React.ReactNode;
    permissions: Permission[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
}

function PermissionGroup({ label, icon, permissions, selectedIds, onToggle }: PermissionGroupProps) {
    const allSelected = permissions.every(p => selectedIds.has(p.id));
    const someSelected = permissions.some(p => selectedIds.has(p.id));

    const toggleAll = () => {
        if (allSelected) {
            permissions.forEach(p => selectedIds.has(p.id) && onToggle(p.id));
        } else {
            permissions.forEach(p => !selectedIds.has(p.id) && onToggle(p.id));
        }
    };

    return (
        <div className="border-2 border-black">
            {/* Group header — click to select/deselect all */}
            <button
                type="button"
                onClick={toggleAll}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-b-2 border-black"
            >
                <div className="flex items-center gap-2 font-bold text-black">
                    {icon}
                    {label}
                </div>
                <div className={`w-5 h-5 border-2 border-black flex items-center justify-center flex-shrink-0 ${allSelected ? 'bg-black' : someSelected ? 'bg-gray-400' : 'bg-white'}`}>
                    {(allSelected || someSelected) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                                d={allSelected ? "M1 4L4 7L9 1" : "M1 4H9"}
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </button>

            {/* Individual permissions */}
            <div className="divide-y divide-gray-100">
                {permissions.map(permission => (
                    <label
                        key={permission.id}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-semibold text-black">{permission.description}</p>
                            <p className="text-xs text-gray-400 font-mono">{permission.key}</p>
                        </div>
                        <div
                            onClick={() => onToggle(permission.id)}
                            className={`w-5 h-5 border-2 border-black flex items-center justify-center flex-shrink-0 transition-colors ${selectedIds.has(permission.id) ? 'bg-black' : 'bg-white'}`}
                        >
                            {selectedIds.has(permission.id) && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// PAGE
// ============================================================================

export default function AddRolePage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const { data: catalog, isLoading: catalogLoading } = usePermissionCatalog(companyId);
    const createRole = useCreateRole(companyId);

    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const breadcrumb = breadcrumbRef.current;
        const header = headerRef.current;
        const container = containerRef.current;
        if (!breadcrumb || !header || !container) return;

        gsap.set([breadcrumb, header, container], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(breadcrumb, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(header, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
            .to(container, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    }, []);

    const togglePermission = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        createRole.mutate(
            {
                name: name.trim(),
                description: description.trim(),
                permission_ids: Array.from(selectedIds),
            },
            {
                onSuccess: () => router.push(`/companies/${companyId}/team/roles`),
            }
        );
    };

    // Group flat permissions from API by their key prefix
    const groupedPermissions = PERMISSION_GROUPS.map(group => ({
        ...group,
        permissions: (catalog ?? []).filter(p => p.key.startsWith(`${group.key}.`)),
    }));

    const breadcrumbItems = [
        { label: 'Team', href: `/companies/${companyId}/team` },
        { label: 'Roles', href: `/companies/${companyId}/team/roles` },
        { label: 'New Role', href: '#' },
    ];

    return (
        <div className="space-y-6">
            <div ref={breadcrumbRef}>
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Header */}
            <div ref={headerRef} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={22} />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black">New Role</h1>
                    <p className="text-gray-600 text-sm mt-0.5">Define a role and assign its permissions</p>
                </div>
            </div>

            {/* Form */}
            <div ref={containerRef} className="space-y-6">

                {/* Name + Description */}
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
                    <Input
                        value={name}
                        onValueChange={setName}
                        label="Role Name"
                        placeholder="e.g. Manager"
                        variant="bordered"
                        radius="none"
                        isRequired
                        classNames={{
                            label: "text-black font-semibold",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                    />
                    <Textarea
                        value={description}
                        onValueChange={setDescription}
                        label="Description (Optional)"
                        placeholder="What is this role responsible for?"
                        variant="bordered"
                        radius="none"
                        minRows={3}
                        classNames={{
                            label: "text-black font-semibold",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                    />
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-black">Permissions</h2>
                        <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
                    </div>

                    {catalogLoading ? (
                        <div className="border-2 border-black p-8 text-center text-gray-400">
                            Loading permissions...
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {groupedPermissions.map(group =>
                                group.permissions.length > 0 && (
                                    <PermissionGroup
                                        key={group.key}
                                        label={group.label}
                                        icon={group.icon}
                                        permissions={group.permissions}
                                        selectedIds={selectedIds}
                                        onToggle={togglePermission}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pb-6">
                    <Button
                        size="lg"
                        radius="none"
                        onPress={() => router.back()}
                        isDisabled={createRole.isPending}
                        className="w-full sm:flex-1 bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        radius="none"
                        onPress={handleSubmit}
                        isLoading={createRole.isPending}
                        isDisabled={!name.trim()}
                        className="w-full sm:flex-1 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Create Role
                    </Button>
                </div>
            </div>
        </div>
    );
}