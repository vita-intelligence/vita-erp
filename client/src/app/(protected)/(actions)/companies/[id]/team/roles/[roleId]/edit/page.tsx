'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Textarea } from '@heroui/react';
import { Shield } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { usePermissionCatalog, useUpdateRole, useRole } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import PermissionPicker from '@/components/pages/companies/team/roles/PermissionGroup';


export default function EditRolePage() {
    const params = useParams();
    const router = useRouter();

    const companyId = Number(params.id);
    const roleId = Number(params.roleId);

    const { data: catalog, isLoading: catalogLoading } = usePermissionCatalog(companyId);
    const { data: role, isLoading: roleLoading } = useRole(companyId, roleId);
    const updateRole = useUpdateRole(companyId);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [initialized, setInitialized] = useState(false);

    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Animation ────────────────────────────────────────────────────────────
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

    // ── Populate form once role loads ─────────────────────────────────────────
    useEffect(() => {
        if (!role || initialized) return;
        setName(role.name);
        setDescription(role.description);
        setSelectedIds(new Set(role.permissions.map(p => p.id)));
        setInitialized(true);
    }, [role, initialized]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const togglePermission = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

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
                onSuccess: () => router.push(`/companies/${companyId}/team/roles`),
            }
        );
    };

    if (roleLoading) return <div className="p-6">Loading role...</div>;
    if (!role) return <div className="p-6 text-red-500">Role not found</div>;

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
                <PermissionPicker
                    catalog={catalog}
                    isLoading={catalogLoading}
                    selectedIds={selectedIds}
                    onToggle={togglePermission}
                />

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