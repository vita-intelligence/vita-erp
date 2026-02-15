'use client';

import React, { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { Plus, Pencil, Trash2, Check, X, SlidersHorizontal } from 'lucide-react';
import { ItemAttribute } from '@/lib/api/items';
import {
    useCreateItemAttribute,
    useUpdateItemAttribute,
    useDeleteItemAttribute,
} from '@/hooks/api/useItems';

// ============================================================================
// ATTRIBUTE ROW
// ============================================================================

interface AttributeRowProps {
    attr: ItemAttribute;
    companyId: number;
    itemId: number;
    canEdit: boolean;
}

function AttributeRow({ attr, companyId, itemId, canEdit }: AttributeRowProps) {
    const update = useUpdateItemAttribute(companyId, itemId);
    const destroy = useDeleteItemAttribute(companyId, itemId);

    const [editing, setEditing] = useState(false);
    const [key, setKey] = useState(attr.key);
    const [value, setValue] = useState(attr.value);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = () => {
        if (!key.trim() || !value.trim()) return;
        if (key.trim() === attr.key && value.trim() === attr.value) {
            setEditing(false);
            return;
        }
        update.mutate(
            { attrId: attr.id, data: { key: key.trim(), value: value.trim() } },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleCancel = () => {
        setKey(attr.key);
        setValue(attr.value);
        setEditing(false);
    };

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9",
        input: "text-black text-sm",
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">

            {editing ? (
                <>
                    <Input
                        value={key}
                        onValueChange={setKey}
                        placeholder="Key"
                        variant="bordered"
                        radius="none"
                        size="sm"
                        classNames={inputClass}
                        className="w-36 flex-shrink-0"
                    />
                    <span className="text-gray-300 flex-shrink-0">:</span>
                    <Input
                        value={value}
                        onValueChange={setValue}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        placeholder="Value"
                        variant="bordered"
                        radius="none"
                        size="sm"
                        classNames={inputClass}
                        className="flex-1"
                        autoFocus
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button isIconOnly size="sm" radius="none"
                            isLoading={update.isPending}
                            isDisabled={!key.trim() || !value.trim()}
                            onPress={handleSave}
                            className="bg-black text-white border-2 border-black w-8 h-8 min-w-0 disabled:opacity-40">
                            {!update.isPending && <Check size={13} />}
                        </Button>
                        <Button isIconOnly size="sm" radius="none"
                            onPress={handleCancel}
                            className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100">
                            <X size={13} />
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider w-36 flex-shrink-0 truncate">
                        {attr.key}
                    </span>
                    <span className="text-gray-300 flex-shrink-0">:</span>
                    <span className="flex-1 text-sm text-black truncate">{attr.value}</span>

                    {canEdit && (
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {confirmDelete ? (
                                <>
                                    <span className="text-xs text-red-600 font-semibold">Delete?</span>
                                    <Button size="sm" radius="none"
                                        isLoading={destroy.isPending}
                                        onPress={() => destroy.mutate(attr.id)}
                                        className="bg-red-600 text-white border-2 border-red-600 h-7 text-xs font-bold min-w-0 px-2">
                                        Yes
                                    </Button>
                                    <Button size="sm" radius="none"
                                        onPress={() => setConfirmDelete(false)}
                                        className="bg-white text-black border-2 border-black h-7 text-xs font-bold min-w-0 px-2 hover:bg-gray-100">
                                        No
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button isIconOnly size="sm" radius="none"
                                        onPress={() => setEditing(true)}
                                        className="bg-white text-gray-400 border-2 border-transparent w-7 h-7 min-w-0 hover:border-black hover:text-black transition-all">
                                        <Pencil size={12} />
                                    </Button>
                                    <Button isIconOnly size="sm" radius="none"
                                        onPress={() => setConfirmDelete(true)}
                                        className="bg-white text-gray-400 border-2 border-transparent w-7 h-7 min-w-0 hover:border-red-500 hover:text-red-500 transition-all">
                                        <Trash2 size={12} />
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ============================================================================
// ADD ROW
// ============================================================================

interface AddAttributeRowProps {
    companyId: number;
    itemId: number;
    onDone: () => void;
}

function AddAttributeRow({ companyId, itemId, onDone }: AddAttributeRowProps) {
    const create = useCreateItemAttribute(companyId, itemId);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const handleCreate = () => {
        if (!key.trim() || !value.trim()) return;
        create.mutate(
            { key: key.trim(), value: value.trim() },
            {
                onSuccess: () => {
                    setKey('');
                    setValue('');
                    // Keep row open for rapid entry of multiple attributes
                },
            }
        );
    };

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9 bg-white",
        input: "text-black text-sm",
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black border-dashed">
            <Input
                value={key}
                onValueChange={setKey}
                placeholder="Key  e.g. Color"
                variant="bordered"
                radius="none"
                size="sm"
                classNames={inputClass}
                className="w-36 flex-shrink-0"
                autoFocus
            />
            <span className="text-gray-300 flex-shrink-0">:</span>
            <Input
                value={value}
                onValueChange={setValue}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') onDone();
                }}
                placeholder="Value  e.g. Red"
                variant="bordered"
                radius="none"
                size="sm"
                classNames={inputClass}
                className="flex-1"
            />
            <div className="flex items-center gap-1 flex-shrink-0">
                <Button isIconOnly size="sm" radius="none"
                    isLoading={create.isPending}
                    isDisabled={!key.trim() || !value.trim()}
                    onPress={handleCreate}
                    className="bg-black text-white border-2 border-black w-8 h-8 min-w-0 disabled:opacity-40">
                    {!create.isPending && <Check size={13} />}
                </Button>
                <Button isIconOnly size="sm" radius="none"
                    onPress={onDone}
                    className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100">
                    <X size={13} />
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// ATTRIBUTES SECTION
// ============================================================================

interface AttributesSectionProps {
    attributes: ItemAttribute[];
    companyId: number;
    itemId: number;
    canEdit: boolean;
}

export function AttributesSection({ attributes, companyId, itemId, canEdit }: AttributesSectionProps) {
    const [adding, setAdding] = useState(false);

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-black" />
                    <h2 className="font-bold text-black text-sm">Attributes</h2>
                    {attributes.length > 0 && (
                        <span className="text-xs font-bold bg-black text-white px-1.5 py-0.5">
                            {attributes.length}
                        </span>
                    )}
                </div>
                {canEdit && !adding && (
                    <Button
                        size="sm"
                        radius="none"
                        onPress={() => setAdding(true)}
                        startContent={<Plus size={14} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none h-8 text-xs"
                    >
                        Add
                    </Button>
                )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
                {adding && (
                    <AddAttributeRow
                        companyId={companyId}
                        itemId={itemId}
                        onDone={() => setAdding(false)}
                    />
                )}

                {attributes.length === 0 && !adding ? (
                    <div className="text-center py-6">
                        <SlidersHorizontal size={28} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No attributes yet</p>
                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => setAdding(true)}
                                className="mt-3 text-xs font-bold text-black underline underline-offset-2 hover:no-underline"
                            >
                                Add first attribute
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {attributes.map(attr => (
                            <AttributeRow
                                key={attr.id}
                                attr={attr}
                                companyId={companyId}
                                itemId={itemId}
                                canEdit={canEdit}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}