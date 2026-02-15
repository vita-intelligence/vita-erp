'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { MapPin, Plus } from 'lucide-react';
import { SupplierAddress, CreateSupplierAddressData } from '@/lib/api/suppliers';
import { useCreateSupplierAddress } from '@/hooks/api/useSuppliers';
import { AddressForm, AddressFormData, EMPTY_FORM } from './AddressForm';
import { AddressRow } from './AddressRow';

interface AddressesSectionProps {
    addresses: SupplierAddress[];
    companyId: number;
    supplierId: number;
    canEdit: boolean;
}

export function AddressesSection({ addresses, companyId, supplierId, canEdit }: AddressesSectionProps) {
    const create = useCreateSupplierAddress(companyId, supplierId);
    const [adding, setAdding] = useState(false);

    const handleCreate = (data: AddressFormData) => {
        create.mutate(data as CreateSupplierAddressData, {
            onSuccess: () => setAdding(false),
        });
    };

    // Primary first, then alphabetically by type
    const sorted = [...addresses].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.address_type.localeCompare(b.address_type);
    });

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black">
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-black" />
                    <h2 className="font-bold text-black text-sm">Addresses</h2>
                    {addresses.length > 0 && (
                        <span className="text-xs font-bold bg-black text-white px-1.5 py-0.5">
                            {addresses.length}
                        </span>
                    )}
                </div>
                {canEdit && !adding && (
                    <Button size="sm" radius="none"
                        onPress={() => setAdding(true)}
                        startContent={<Plus size={14} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none h-8 text-xs">
                        Add
                    </Button>
                )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">

                {adding && (
                    <AddressForm
                        initial={EMPTY_FORM}
                        isPending={create.isPending}
                        submitLabel="Add Address"
                        onSubmit={handleCreate}
                        onCancel={() => setAdding(false)}
                    />
                )}

                {sorted.length === 0 && !adding ? (
                    <div className="text-center py-6">
                        <MapPin size={28} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No addresses yet</p>
                        {canEdit && (
                            <button type="button" onClick={() => setAdding(true)}
                                className="mt-3 text-xs font-bold text-black underline underline-offset-2 hover:no-underline">
                                Add first address
                            </button>
                        )}
                    </div>
                ) : (
                    sorted.map(address => (
                        <AddressRow
                            key={address.id}
                            address={address}
                            companyId={companyId}
                            supplierId={supplierId}
                            canEdit={canEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
}