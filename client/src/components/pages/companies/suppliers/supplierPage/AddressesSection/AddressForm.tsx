'use client';

import React, { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { MapPin, Check, X, Star, Navigation } from 'lucide-react';
import { AddressType } from '@/lib/api/suppliers';
import { CoordinatePicker } from '@/components/ui/maps/CoordinatePicker';
import { TypeSelector } from './TypeSelector';
import { CountrySelector } from './CountrySelector';
import { RegionSelector } from './RegionSelector';
import { CitySelector } from './CitySelector';
import { StreetAutocomplete } from './StreetAutoComplete';

// ============================================================================
// TYPES
// ============================================================================

export interface AddressFormData {
    label: string;
    address_type: AddressType;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    is_primary: boolean;
}

export const EMPTY_FORM: AddressFormData = {
    label: '',
    address_type: 'headquarters',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: null,
    longitude: null,
    is_primary: false,
};

// ============================================================================
// FORM
// ============================================================================

interface AddressFormProps {
    initial: AddressFormData;
    isPending: boolean;
    submitLabel: string;
    onSubmit: (data: AddressFormData) => void;
    onCancel: () => void;
}

export function AddressForm({ initial, isPending, submitLabel, onSubmit, onCancel }: AddressFormProps) {
    const [form, setForm] = useState<AddressFormData>(initial);
    const [showMap, setShowMap] = useState(false);

    const set = (key: keyof AddressFormData, value: any) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const hasCoords = form.latitude !== null && form.longitude !== null;

    const inputClass = {
        label: "text-black font-semibold text-xs",
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-10",
        input: "text-black text-sm",
    };

    return (
        <>
            <div className="p-4 space-y-6 bg-gray-50 border-2 border-black border-dashed">

                {/* Row 1 — type + label */}
                <div className="grid grid-cols-2 gap-4">
                    <TypeSelector
                        value={form.address_type}
                        onChange={(v) => set('address_type', v)}
                    />
                    <Input
                        value={form.label}
                        onValueChange={(v) => set('label', v)}
                        label="Label (optional)"
                        placeholder="e.g. Main Warehouse"
                        labelPlacement="outside"
                        variant="bordered"
                        radius="none"
                        classNames={inputClass}
                        autoFocus
                    />
                </div>

                {/* Row 2 — country (always first) */}
                <CountrySelector
                    value={form.country}
                    onChange={(v) => {
                        // Clearing country cascades down
                        setForm(prev => ({
                            ...prev,
                            country: v,
                            state: '',
                            city: '',
                            street: '',
                            postal_code: '',
                            latitude: null,
                            longitude: null,
                        }));
                    }}
                />

                {/* Row 3 — region + city side by side */}
                <div className="grid grid-cols-2 gap-4">
                    <RegionSelector
                        country={form.country}
                        value={form.state}
                        onChange={(v) => {
                            setForm(prev => ({
                                ...prev,
                                state: v,
                                city: '',
                                street: '',
                                postal_code: '',
                                latitude: null,
                                longitude: null,
                            }));
                        }}
                    />
                    <CitySelector
                        country={form.country}
                        region={form.state}
                        value={form.city}
                        onChange={(v) => {
                            setForm(prev => ({
                                ...prev,
                                city: v,
                                street: '',
                                postal_code: '',
                                latitude: null,
                                longitude: null,
                            }));
                        }}
                    />
                </div>

                {/* Row 4 — street (autofills postal + coords) */}
                <StreetAutocomplete
                    country={form.country}
                    region={form.state}
                    city={form.city}
                    value={form.street}
                    onChange={(v) => set('street', v)}
                    onAutofill={({ postal_code, lat, lng }) => {
                        setForm(prev => ({
                            ...prev,
                            postal_code,
                            latitude: lat,
                            longitude: lng,
                        }));
                    }}
                />

                {/* Row 5 — postal code (autofilled but editable) */}
                <Input
                    value={form.postal_code}
                    onValueChange={(v) => set('postal_code', v)}
                    label="Postal Code"
                    placeholder="e.g. 75001"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="none"
                    classNames={inputClass}
                />

                {/* Row 6 — coordinates + map picker */}
                <div className="flex items-end gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-black font-semibold text-xs">Coordinates</label>
                        {hasCoords ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 h-10 flex-1">
                                    <MapPin size={13} className="text-black flex-shrink-0" />
                                    <span className="text-xs font-mono text-black">
                                        {form.latitude}, {form.longitude}
                                    </span>
                                </div>
                                <button type="button"
                                    onClick={() => { set('latitude', null); set('longitude', null); }}
                                    className="text-gray-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center h-10 px-3 border-2 border-dashed border-gray-300 bg-white">
                                <p className="text-xs text-gray-400">Autofilled from street — or set manually</p>
                            </div>
                        )}
                    </div>
                    <Button size="sm" radius="none"
                        onPress={() => setShowMap(true)}
                        startContent={<Navigation size={13} />}
                        className="bg-white text-black border-2 border-black font-bold text-xs hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none h-10 flex-shrink-0 px-4">
                        {hasCoords ? 'Move Pin' : 'Set on Map'}
                    </Button>
                </div>

                {/* Row 7 — primary toggle + actions */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-gray-200">
                    <button type="button"
                        onClick={() => set('is_primary', !form.is_primary)}
                        className="flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
                    >
                        <Star
                            size={15}
                            fill={form.is_primary ? 'currentColor' : 'none'}
                            className={form.is_primary ? 'text-black' : 'text-gray-300'}
                        />
                        {form.is_primary ? 'Primary address' : 'Set as primary'}
                    </button>

                    <div className="flex gap-2">
                        <Button size="sm" radius="none"
                            onPress={onCancel}
                            className="bg-white text-black border-2 border-black font-bold hover:bg-gray-100 h-9 px-4">
                            Cancel
                        </Button>
                        <Button size="sm" radius="none"
                            isLoading={isPending}
                            onPress={() => onSubmit(form)}
                            startContent={!isPending ? <Check size={14} /> : null}
                            className="bg-black text-white border-2 border-black font-bold hover:bg-white hover:text-black transition-all h-9 px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
                            {submitLabel}
                        </Button>
                    </div>
                </div>
            </div>

            {showMap && (
                <CoordinatePicker
                    initialLat={form.latitude}
                    initialLng={form.longitude}
                    onConfirm={({ lat, lng }) => {
                        set('latitude', lat);
                        set('longitude', lng);
                        setShowMap(false);
                    }}
                    onClose={() => setShowMap(false)}
                />
            )}
        </>
    );
}