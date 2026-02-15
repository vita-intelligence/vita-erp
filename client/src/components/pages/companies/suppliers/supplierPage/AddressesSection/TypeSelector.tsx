'use client';

import React from 'react';
import { AddressType } from '@/lib/api/suppliers';

export const ADDRESS_TYPES: { key: AddressType; label: string }[] = [
    { key: 'headquarters', label: 'Headquarters' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'billing', label: 'Billing' },
    { key: 'other', label: 'Other' },
];

interface TypeSelectorProps {
    value: AddressType;
    onChange: (v: AddressType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-black font-semibold text-xs">Type</label>
            <div className="flex gap-1.5 flex-wrap">
                {ADDRESS_TYPES.map(t => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => onChange(t.key)}
                        className={`text-xs font-bold px-3 h-10 border-2 border-black transition-all
                            ${value === t.key
                                ? 'bg-black text-white shadow-none'
                                : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}