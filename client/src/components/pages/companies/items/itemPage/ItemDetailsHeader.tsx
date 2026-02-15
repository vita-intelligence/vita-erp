'use client';

import React, { useState } from 'react';
import { Input, Select, SelectItem, Button, Switch } from '@heroui/react';
import { FlaskConical, Layers, Pencil, X, Check, Trash2 } from 'lucide-react';
import { ItemDetail, Category, UnitOfMeasure } from '@/lib/api/items';
import { useUpdateItem, useDeleteItem } from '@/hooks/api/useItems';
import { useRouter } from 'next/navigation';

interface ItemDetailHeaderProps {
    item: ItemDetail;
    companyId: number;
    categories: Category[];
    uoms: UnitOfMeasure[];
    canEdit: boolean;
    canDelete: boolean;
}

export function ItemDetailHeader({
    item,
    companyId,
    categories,
    uoms,
    canEdit,
    canDelete,
}: ItemDetailHeaderProps) {
    const router = useRouter();
    const update = useUpdateItem(companyId, item.id);
    const destroy = useDeleteItem(companyId);

    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Local edit state — mirrors item fields
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [uomId, setUomId] = useState(String(item.unit_of_measurement));
    const [categoryId, setCategoryId] = useState(item.category ? String(item.category) : '');
    const [isActive, setIsActive] = useState(item.is_active);

    const handleSave = () => {
        update.mutate(
            {
                name,
                description,
                unit_of_measurement: Number(uomId),
                category: categoryId ? Number(categoryId) : null,
                is_active: isActive,
            },
            { onSuccess: () => setEditing(false) }
        );
    };

    const handleCancel = () => {
        // Reset local state to current item values
        setName(item.name);
        setDescription(item.description);
        setUomId(String(item.unit_of_measurement));
        setCategoryId(item.category ? String(item.category) : '');
        setIsActive(item.is_active);
        setEditing(false);
    };

    const handleDelete = () => {
        destroy.mutate(item.id, {
            onSuccess: () => router.push(`/companies/${companyId}/items`),
        });
    };

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
        input: "text-black",
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">

            {/* Top row — type icon + name + actions */}
            <div className="flex items-start gap-4">

                {/* Type icon */}
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center flex-shrink-0
                    ${item.item_type === 'bom' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                >
                    {item.item_type === 'bom' ? <Layers size={20} /> : <FlaskConical size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                    {editing ? (
                        <Input
                            value={name}
                            onValueChange={setName}
                            variant="bordered"
                            radius="none"
                            size="lg"
                            classNames={{
                                ...inputClass,
                                input: "text-black text-2xl font-bold",
                                inputWrapper: `${inputClass.inputWrapper} h-12`,
                            }}
                        />
                    ) : (
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold text-black">{item.name}</h1>
                            {!item.is_active && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-300 px-2 py-0.5">
                                    Inactive
                                </span>
                            )}
                        </div>
                    )}

                    {/* Type + UOM + category badges */}
                    {!editing && (
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-2
                                ${item.item_type === 'bom' ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}
                            >
                                {item.item_type === 'bom' ? 'BOM Item' : 'Raw Material'}
                            </span>
                            <span className="text-xs font-mono text-gray-500 border border-gray-200 px-2 py-0.5">
                                {item.uom}
                            </span>
                            {item.category_name && (
                                <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5">
                                    {item.category_name}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {!editing && item.description && (
                        <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {editing ? (
                        <>
                            <Button
                                size="sm"
                                radius="none"
                                isLoading={update.isPending}
                                onPress={handleSave}
                                startContent={!update.isPending && <Check size={15} />}
                                className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                radius="none"
                                onPress={handleCancel}
                                isDisabled={update.isPending}
                                startContent={<X size={15} />}
                                className="bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            {canEdit && (
                                <Button
                                    size="sm"
                                    radius="none"
                                    onPress={() => setEditing(true)}
                                    startContent={<Pencil size={15} />}
                                    className="bg-white text-black font-bold border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                >
                                    Edit
                                </Button>
                            )}
                            {canDelete && (
                                confirmDelete ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-red-600 font-semibold">Delete?</span>
                                        <Button
                                            size="sm"
                                            radius="none"
                                            isLoading={destroy.isPending}
                                            onPress={handleDelete}
                                            className="bg-red-600 text-white font-bold border-2 border-red-600 hover:bg-red-700 transition-all text-xs"
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            size="sm"
                                            radius="none"
                                            onPress={() => setConfirmDelete(false)}
                                            className="bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-all text-xs"
                                        >
                                            No
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        size="sm"
                                        radius="none"
                                        isIconOnly
                                        onPress={() => setConfirmDelete(true)}
                                        className="bg-white text-black border-2 border-black hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                    >
                                        <Trash2 size={15} />
                                    </Button>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Edit fields */}
            {editing && (
                <div className="mt-5 space-y-4">

                    {/* Description */}
                    <Input
                        value={description}
                        onValueChange={setDescription}
                        label="Description"
                        placeholder="Optional description..."
                        variant="bordered"
                        radius="none"
                        classNames={inputClass}
                    />

                    {/* UOM + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Unit of Measurement"
                            selectedKeys={uomId ? [uomId] : []}
                            onSelectionChange={(keys) => setUomId(Array.from(keys)[0] as string)}
                            variant="bordered"
                            radius="none"
                            classNames={{ trigger: "border-2 border-black shadow-none" }}
                        >
                            {uoms.map(u => (
                                <SelectItem key={String(u.id)} textValue={`${u.name} (${u.abbreviation})`}>
                                    <span className="font-medium">{u.name}</span>
                                    <span className="text-gray-400 font-mono text-xs ml-2">{u.abbreviation}</span>
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Category (Optional)"
                            selectedKeys={categoryId ? [categoryId] : []}
                            onSelectionChange={(keys) => {
                                const val = Array.from(keys)[0];
                                setCategoryId(val ? String(val) : '');
                            }}
                            variant="bordered"
                            radius="none"
                            classNames={{ trigger: "border-2 border-black shadow-none" }}
                        >
                            {categories.map(c => (
                                <SelectItem key={String(c.id)}>{c.name}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 pt-1">
                        <Switch
                            isSelected={isActive}
                            onValueChange={setIsActive}
                            size="sm"
                            classNames={{
                                thumb: "bg-white",
                                wrapper: "bg-gray-300 group-data-[selected=true]:bg-black",
                            }}
                        />
                        <span className="text-sm font-medium text-black">
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}