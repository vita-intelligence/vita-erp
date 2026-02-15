'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Textarea, Skeleton, Switch } from '@heroui/react';
import { Truck, Pencil, Trash2, Check, X, Lock, Building2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';

import { useSupplier, useUpdateSupplier, useDeleteSupplier } from '@/hooks/api/useSuppliers';
import { useMyPermissions } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { AddressesSection } from '@/components/pages/companies/suppliers/supplierPage/AddressesSection';


export default function SupplierPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);
    const supplierId = Number(params.supplierId);

    const { data: supplier, isLoading } = useSupplier(companyId, supplierId);
    const update = useUpdateSupplier(companyId, supplierId);
    const destroy = useDeleteSupplier(companyId);

    const { can, isLoading: permsLoading } = useMyPermissions(companyId);

    // ── Edit state ────────────────────────────────────────────────────────────
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Sync local state when supplier loads or updates
    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            setDescription(supplier.description ?? '');
            setIsActive(supplier.is_active);
        }
    }, [supplier]);

    // ── Animation ─────────────────────────────────────────────────────────────
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const page = pageRef.current;
        if (!page || isLoading) return;
        gsap.set(page.children, { opacity: 0, y: 20 });
        gsap.to(page.children, {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        });
    }, [isLoading]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSave = () => {
        if (!name.trim()) return;
        update.mutate(
            { name: name.trim(), description: description.trim(), is_active: isActive },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleCancel = () => {
        if (supplier) {
            setName(supplier.name);
            setDescription(supplier.description ?? '');
            setIsActive(supplier.is_active);
        }
        setEditing(false);
    };

    const handleDelete = () => {
        destroy.mutate(supplierId, {
            onSuccess: () => router.push(`/companies/${companyId}/suppliers`),
        });
    };

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    const breadcrumbItems = [
        { label: 'Suppliers', href: `/companies/${companyId}/suppliers` },
        { label: isLoading ? '...' : (supplier?.name ?? 'Supplier') },
    ];

    const inputClass = {
        label: "text-black font-semibold text-sm",
        input: "text-black text-sm",
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
    };

    // ── Guards ────────────────────────────────────────────────────────────────
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

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <>
                <div className="mb-6">
                    <Skeleton className="h-5 w-48 rounded-none" />
                </div>
                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-none flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-1/3 rounded-none" />
                            <Skeleton className="h-4 w-1/2 rounded-none" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!supplier) return null;

    return (
        <>
            {/* Breadcrumbs */}
            <div className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            <div ref={pageRef} className="space-y-6">

                {/* Main card */}
                <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

                    {/* Card header */}
                    <div className="flex items-center gap-4 p-6 border-b-2 border-black">
                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                            <Truck className="text-white" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            {editing ? (
                                <Input
                                    value={name}
                                    onValueChange={setName}
                                    variant="bordered"
                                    radius="none"
                                    classNames={inputClass}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-black">
                                            {supplier.name}
                                        </h1>
                                        {!supplier.is_active && (
                                            <span className="text-xs font-bold uppercase tracking-wider border-2 border-gray-300 text-gray-400 px-2 py-0.5">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Added {new Date(supplier.date_added).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {can('items.edit') && (
                                editing ? (
                                    <>
                                        <Button size="sm" radius="none"
                                            onPress={handleCancel}
                                            className="bg-white text-black border-2 border-black font-bold hover:bg-gray-100 h-9 px-4">
                                            <X size={14} className="mr-1" /> Cancel
                                        </Button>
                                        <Button size="sm" radius="none"
                                            isLoading={update.isPending}
                                            isDisabled={!name.trim()}
                                            onPress={handleSave}
                                            className="bg-black text-white border-2 border-black font-bold hover:bg-white hover:text-black transition-all h-9 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-40">
                                            {!update.isPending && <Check size={14} className="mr-1" />} Save
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="sm" radius="none"
                                        onPress={() => setEditing(true)}
                                        startContent={<Pencil size={14} />}
                                        className="bg-white text-black border-2 border-black font-bold hover:bg-black hover:text-white transition-all h-9 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                                        Edit
                                    </Button>
                                )
                            )}

                            {can('suppliers.delete') && !editing && (
                                confirmDelete ? (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-red-600 font-semibold">Delete?</span>
                                        <Button size="sm" radius="none"
                                            isLoading={destroy.isPending}
                                            onPress={handleDelete}
                                            className="bg-red-600 text-white border-2 border-red-600 h-9 text-xs font-bold px-3">
                                            Yes
                                        </Button>
                                        <Button size="sm" radius="none"
                                            onPress={() => setConfirmDelete(false)}
                                            className="bg-white text-black border-2 border-black h-9 text-xs font-bold px-3 hover:bg-gray-100">
                                            No
                                        </Button>
                                    </div>
                                ) : (
                                    <Button isIconOnly size="sm" radius="none"
                                        onPress={() => setConfirmDelete(true)}
                                        className="bg-white text-gray-400 border-2 border-black w-9 h-9 min-w-0 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                                        <Trash2 size={14} />
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-6">

                        {/* Description */}
                        {editing ? (
                            <div className="space-y-1">
                                <Textarea
                                    value={description}
                                    onValueChange={setDescription}
                                    label="Description (Optional)"
                                    placeholder="Notes about this supplier..."
                                    variant="bordered"
                                    radius="none"
                                    minRows={3}
                                    classNames={inputClass}
                                />
                            </div>
                        ) : (
                            supplier.description ? (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                                    <p className="text-sm text-black">{supplier.description}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No description added.</p>
                            )
                        )}

                        {/* Active toggle — only in edit mode */}
                        {editing && (
                            <div className="flex items-center gap-3 pt-2 border-t-2 border-gray-100">
                                <Switch
                                    isSelected={isActive}
                                    onValueChange={setIsActive}
                                    size="sm"
                                    classNames={{
                                        thumb: "bg-white",
                                        wrapper: "bg-gray-300 group-data-[selected=true]:bg-black",
                                    }}
                                />
                                <span className="text-sm font-semibold text-black">
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    Inactive suppliers won't appear in purchase order dropdowns
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <AddressesSection
                    addresses={supplier.addresses}
                    companyId={companyId}
                    supplierId={supplierId}
                    canEdit={can('suppliers.edit')}
                />
            </div>
        </>
    );
}