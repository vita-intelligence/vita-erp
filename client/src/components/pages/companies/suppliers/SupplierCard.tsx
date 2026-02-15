'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { Truck, Trash2, ChevronRight } from 'lucide-react';
import { Supplier } from '@/lib/api/suppliers';
import { useDeleteSupplier } from '@/hooks/api/useSuppliers';

interface SupplierCardProps {
    supplier: Supplier;
    companyId: number;
    canEdit: boolean;
    canDelete: boolean;
    onClick: () => void;
}

export function SupplierCard({ supplier, companyId, canDelete, onClick }: SupplierCardProps) {
    const destroy = useDeleteSupplier(companyId);
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all group">
            <div className="flex items-center gap-4 p-4">

                {/* Icon */}
                <div className="w-10 h-10 border-2 border-black bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-black" />
                </div>

                {/* Info — full row clickable */}
                <button type="button" onClick={onClick} className="flex-1 min-w-0 text-left cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-black text-sm">{supplier.name}</span>
                        {!supplier.is_active && (
                            <span className="text-[10px] font-bold uppercase tracking-wider border-2 border-gray-300 text-gray-400 px-1.5 py-0.5">
                                Inactive
                            </span>
                        )}
                    </div>
                    {supplier.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{supplier.description}</p>
                    )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {canDelete && (
                        confirmDelete ? (
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-red-600 font-semibold">Delete?</span>
                                <Button size="sm" radius="none"
                                    isLoading={destroy.isPending}
                                    onPress={() => destroy.mutate(supplier.id)}
                                    className="bg-red-600 text-white border-2 border-red-600 h-8 text-xs font-bold min-w-0 px-2">
                                    Yes
                                </Button>
                                <Button size="sm" radius="none"
                                    onPress={() => setConfirmDelete(false)}
                                    className="bg-white text-black border-2 border-black h-8 text-xs font-bold min-w-0 px-2 hover:bg-gray-100">
                                    No
                                </Button>
                            </div>
                        ) : (
                            <Button isIconOnly size="sm" radius="none"
                                onPress={() => setConfirmDelete(true)}
                                className="bg-white text-gray-300 border-2 border-transparent w-8 h-8 min-w-0 hover:border-red-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={13} />
                            </Button>
                        )
                    )}

                    {/* Navigate arrow */}
                    <button type="button" onClick={onClick}
                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}