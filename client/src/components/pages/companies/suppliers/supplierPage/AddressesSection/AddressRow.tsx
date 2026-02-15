'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { MapPin, Pencil, Trash2, Star, Navigation } from 'lucide-react';
import { SupplierAddress, UpdateSupplierAddressData } from '@/lib/api/suppliers';
import { useUpdateSupplierAddress, useDeleteSupplierAddress } from '@/hooks/api/useSuppliers';
import { AddressForm, AddressFormData } from './AddressForm';
import { ADDRESS_TYPES } from './TypeSelector';

interface AddressRowProps {
    address: SupplierAddress;
    companyId: number;
    supplierId: number;
    canEdit: boolean;
}

export function AddressRow({ address, companyId, supplierId, canEdit }: AddressRowProps) {
    const update = useUpdateSupplierAddress(companyId, supplierId);
    const destroy = useDeleteSupplierAddress(companyId, supplierId);

    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const formInitial: AddressFormData = {
        label: address.label,
        address_type: address.address_type,
        street: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        latitude: address.latitude ? parseFloat(address.latitude) : null,
        longitude: address.longitude ? parseFloat(address.longitude) : null,
        is_primary: address.is_primary,
    };

    const handleSave = (data: AddressFormData) => {
        update.mutate(
            { addressId: address.id, data: data as UpdateSupplierAddressData },
            { onSuccess: () => setEditing(false) }
        );
    };

    const typeLabel = ADDRESS_TYPES.find(t => t.key === address.address_type)?.label ?? address.address_type;

    if (editing) {
        return (
            <AddressForm
                initial={formInitial}
                isPending={update.isPending}
                submitLabel="Save Address"
                onSubmit={handleSave}
                onCancel={() => setEditing(false)}
            />
        );
    }

    const addressLines = [
        address.street,
        [address.city, address.state, address.postal_code].filter(Boolean).join(', '),
        address.country,
    ].filter(Boolean);

    return (
        <div className="flex items-start gap-3 p-4 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">

            {/* Icon */}
            <div className="w-8 h-8 border-2 border-black bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={14} className="text-black" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5">
                        {typeLabel}
                    </span>
                    {address.label && (
                        <span className="text-xs font-semibold text-gray-600">{address.label}</span>
                    )}
                    {address.is_primary && (
                        <span className="flex items-center gap-1 text-xs font-bold text-black">
                            <Star size={11} fill="currentColor" /> Primary
                        </span>
                    )}
                </div>

                {addressLines.length > 0 ? (
                    <div className="text-sm text-gray-700 space-y-0.5">
                        {addressLines.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No address details</p>
                )}

                {address.latitude && address.longitude && (
                    <div className="flex items-center gap-1 mt-2">
                        <Navigation size={11} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-400">
                            {address.latitude}, {address.longitude}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions — hover revealed */}
            {canEdit && (
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {confirmDelete ? (
                        <>
                            <span className="text-xs text-red-600 font-semibold">Delete?</span>
                            <Button size="sm" radius="none"
                                isLoading={destroy.isPending}
                                onPress={() => destroy.mutate(address.id)}
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
        </div>
    );
}