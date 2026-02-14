'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Textarea } from '@heroui/react';
import { Shield, Building2, Users, Lock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
    usePermissionCatalog,
    useUpdateRole,
    useCompanyRoles,
    useRole,
} from '@/hooks/api/useAccess';
import { Permission } from '@/lib/api/access';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';


// ============================================================================
// PERMISSION GROUPS
// ============================================================================

const PERMISSION_GROUPS = [
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
            <button
                type="button"
                onClick={toggleAll}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border-b-2 border-black"
            >
                <div className="flex items-center gap-2 font-bold text-black">
                    {icon}
                    {label}
                </div>

                <div className={`w-5 h-5 border-2 border-black flex items-center justify-center
                    ${allSelected ? 'bg-black' : someSelected ? 'bg-gray-400' : 'bg-white'}`}
                >
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

            <div className="divide-y divide-gray-100">
                {permissions.map(permission => (
                    <label
                        key={permission.id}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-semibold text-black">{permission.description}</p>
                            <p className="text-xs text-gray-400 font-mono">{permission.key}</p>
                        </div>

                        <div
                            onClick={() => onToggle(permission.id)}
                            className={`w-5 h-5 border-2 border-black flex items-center justify-center
                                ${selectedIds.has(permission.id) ? 'bg-black' : 'bg-white'}`}
                        >
                            {selectedIds.has(permission.id) && (
                                <svg width="10" height="8" viewBox="0 0 10 8">
                                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" />
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

export default function EditRolePage() {
    const params = useParams();
    const router = useRouter();

    const companyId = Number(params.id);
    const roleId = Number(params.roleId);

    const { data: catalog, isLoading: catalogLoading } = usePermissionCatalog(companyId);
    const updateRole = useUpdateRole(companyId);

    const { data: role, isLoading: roleLoading } = useRole(companyId, roleId);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [initialized, setInitialized] = useState(false);

    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ================= ANIMATION =================
    useEffect(() => {
        const breadcrumb = breadcrumbRef.current;
        const header = headerRef.current;
        const container = containerRef.current;
        if (!breadcrumb || !header || !container) return;

        gsap.set([breadcrumb, header, container], { opacity: 0, y: 20 });
        gsap.timeline()
            .to(breadcrumb, { opacity: 1, y: 0, duration: 0.4 })
            .to(header, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
            .to(container, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    }, []);

    // ================= LOAD ROLE =================
    useEffect(() => {
        if (!role || initialized) return;
        setName(role.name);
        setDescription(role.description);
        setSelectedIds(new Set(role.permissions.map(p => p.id)));
        setInitialized(true);
    }, [role, initialized]);

    // ================= TOGGLE =================
    const togglePermission = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = () => {
        if (!name.trim()) return;

        updateRole.mutate(
            {
                roleId,
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    permission_ids: Array.from(selectedIds),
                },
            },
            {
                onSuccess: () =>
                    router.push(`/companies/${companyId}/team/roles`),
            }
        );
    };

    if (roleLoading) return <div className="p-6">Loading role...</div>;
    if (!role) return <div className="p-6 text-red-500">Role not found</div>;

    const groupedPermissions = PERMISSION_GROUPS.map(group => ({
        ...group,
        permissions: (catalog ?? []).filter(p => p.key.startsWith(`${group.key}.`)),
    }));

    const breadcrumbItems = [
        { label: 'Team', href: `/companies/${companyId}/team` },
        { label: 'Roles', href: `/companies/${companyId}/team/roles` },
        { label: 'Edit Role', href: '#' },
    ];

    return (
        <div className="space-y-6">
            <div ref={breadcrumbRef}>
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Header */}
            <div ref={headerRef} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <Shield className="text-white" size={22} />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black">Edit Role</h1>
                    <p className="text-gray-600 text-sm mt-0.5">Update role permissions and details</p>
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
                        variant="bordered"
                        radius="none"
                        isRequired
                        classNames={{
                            label: "text-black font-semibold",
                            inputWrapper: "border-2 border-black shadow-none",
                        }}
                    />
                    <Textarea
                        value={description}
                        onValueChange={setDescription}
                        label="Description"
                        variant="bordered"
                        radius="none"
                        minRows={3}
                        classNames={{
                            label: "text-black font-semibold",
                            inputWrapper: "border-2 border-black shadow-none",
                        }}
                    />
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                    <div className="flex justify-between">
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
                        isDisabled={updateRole.isPending}
                        className="w-full sm:flex-1 bg-white text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Cancel
                    </Button>

                    <Button
                        size="lg"
                        radius="none"
                        onPress={handleSubmit}
                        isLoading={updateRole.isPending}
                        isDisabled={!name.trim()}
                        className="w-full sm:flex-1 bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}