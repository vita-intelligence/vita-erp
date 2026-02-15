'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Skeleton } from '@heroui/react';
import { Tag, Plus, Pencil, Trash2, Check, X, Lock, FolderOpen } from 'lucide-react';
import { useParams } from 'next/navigation';
import gsap from 'gsap';

import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/hooks/api/useItems';
import { useMyPermissions } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { Category } from '@/lib/api/items';

// ============================================================================
// CATEGORY ROW
// ============================================================================

interface CategoryRowProps {
    category: Category;
    companyId: number;
    canEdit: boolean;
    canDelete: boolean;
}

function CategoryRow({ category, companyId, canEdit, canDelete }: CategoryRowProps) {
    const update = useUpdateCategory(companyId, category.id);
    const destroy = useDeleteCategory(companyId);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = () => {
        if (!name.trim() || name.trim() === category.name) {
            setEditing(false);
            setName(category.name);
            return;
        }
        update.mutate(
            { name: name.trim() },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleCancel = () => {
        setName(category.name);
        setEditing(false);
    };

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9",
        input: "text-black text-sm font-medium",
    };

    return (
        <div className="flex items-center gap-3 p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group">

            {/* Icon */}
            <div className="w-8 h-8 border-2 border-black bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Tag size={14} className="text-black" />
            </div>

            {/* Name / edit input */}
            {editing ? (
                <Input
                    value={name}
                    onValueChange={setName}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') handleCancel();
                    }}
                    autoFocus
                    variant="bordered"
                    radius="none"
                    size="sm"
                    classNames={inputClass}
                    className="flex-1"
                />
            ) : (
                <span className="flex-1 text-sm font-medium text-black">{category.name}</span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {editing ? (
                    <>
                        <Button
                            isIconOnly size="sm" radius="none"
                            isLoading={update.isPending}
                            onPress={handleSave}
                            className="bg-black text-white border-2 border-black w-8 h-8 min-w-0"
                        >
                            {!update.isPending && <Check size={13} />}
                        </Button>
                        <Button
                            isIconOnly size="sm" radius="none"
                            onPress={handleCancel}
                            className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100"
                        >
                            <X size={13} />
                        </Button>
                    </>
                ) : (
                    <>
                        {canEdit && (
                            <Button
                                isIconOnly size="sm" radius="none"
                                onPress={() => setEditing(true)}
                                className="bg-white text-gray-300 border-2 border-transparent w-8 h-8 min-w-0 hover:border-black hover:text-black transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Pencil size={13} />
                            </Button>
                        )}
                        {canDelete && (
                            confirmDelete ? (
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-red-600 font-semibold">Delete?</span>
                                    <Button
                                        size="sm" radius="none"
                                        isLoading={destroy.isPending}
                                        onPress={() => destroy.mutate(category.id)}
                                        className="bg-red-600 text-white border-2 border-red-600 h-8 text-xs font-bold min-w-0 px-2"
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        size="sm" radius="none"
                                        onPress={() => setConfirmDelete(false)}
                                        className="bg-white text-black border-2 border-black h-8 text-xs font-bold min-w-0 px-2 hover:bg-gray-100"
                                    >
                                        No
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    isIconOnly size="sm" radius="none"
                                    onPress={() => setConfirmDelete(true)}
                                    className="bg-white text-gray-300 border-2 border-transparent w-8 h-8 min-w-0 hover:border-red-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={13} />
                                </Button>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// ADD ROW
// ============================================================================

interface AddCategoryRowProps {
    companyId: number;
    onDone: () => void;
}

function AddCategoryRow({ companyId, onDone }: AddCategoryRowProps) {
    const create = useCreateCategory(companyId);
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus when the row mounts
        inputRef.current?.focus();
    }, []);

    const handleCreate = () => {
        if (!name.trim()) return;
        create.mutate(
            { name: name.trim() },
            {
                onSuccess: () => {
                    setName('');
                    // Keep the row open so user can add more in quick succession
                },
            }
        );
    };

    return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-black border-dashed">
            <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center flex-shrink-0">
                <Plus size={14} className="text-black" />
            </div>

            <Input
                value={name}
                onValueChange={setName}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') onDone();
                }}
                placeholder="Category name..."
                variant="bordered"
                radius="none"
                size="sm"
                classNames={{
                    inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9 bg-white",
                    input: "text-black text-sm",
                }}
                className="flex-1"
            />

            <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                    isIconOnly size="sm" radius="none"
                    isLoading={create.isPending}
                    onPress={handleCreate}
                    className="bg-black text-white border-2 border-black w-8 h-8 min-w-0"
                >
                    {!create.isPending && <Check size={13} />}
                </Button>
                <Button
                    isIconOnly size="sm" radius="none"
                    onPress={onDone}
                    className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100"
                >
                    <X size={13} />
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// PAGE
// ============================================================================

export default function CategoriesPage() {
    const params = useParams();
    const companyId = Number(params.id);

    const { data: categories = [], isLoading } = useCategories(companyId);
    const { can, isLoading: permsLoading } = useMyPermissions(companyId);

    const [adding, setAdding] = useState(false);

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

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    const breadcrumbItems = [
        { label: 'Items', href: `/companies/${companyId}/items` },
        { label: 'Categories' },
    ];

    // ── Permission guard ──────────────────────────────────────────────────────
    if (permsLoading) return null;

    if (!can('items.view')) {
        return (
            <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                    <Lock className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Access Denied</h3>
                <p className="text-gray-600">You don't have permission to view categories.</p>
            </div>
        );
    }

    return (
        <>
            {/* Breadcrumbs */}
            <div className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-1">Categories</h1>
                    <p className="text-gray-500 text-sm">
                        {isLoading ? 'Loading...' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
                    </p>
                </div>

                {can('items.create') && !adding && (
                    <Button
                        radius="none"
                        onPress={() => setAdding(true)}
                        startContent={<Plus size={18} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                        New Category
                    </Button>
                )}
            </div>

            {/* List */}
            <div ref={contentRef} className="space-y-2">

                {/* Add row — appears at the top when active */}
                {adding && (
                    <AddCategoryRow
                        companyId={companyId}
                        onDone={() => setAdding(false)}
                    />
                )}

                {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white border-2 border-black">
                            <Skeleton className="w-8 h-8 rounded-none flex-shrink-0" />
                            <Skeleton className="h-4 flex-1 rounded-none" />
                        </div>
                    ))
                ) : categories.length === 0 && !adding ? (
                    <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                            <FolderOpen className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">No categories yet</h3>
                        <p className="text-gray-600 mb-6">Organise your items by creating categories</p>
                        {can('items.create') && (
                            <Button
                                radius="none"
                                onPress={() => setAdding(true)}
                                startContent={<Plus size={16} />}
                                className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                                New Category
                            </Button>
                        )}
                    </div>
                ) : (
                    categories.map(category => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                            companyId={companyId}
                            canEdit={can('items.edit')}
                            canDelete={can('items.delete')}
                        />
                    ))
                )}
            </div>
        </>
    );
}