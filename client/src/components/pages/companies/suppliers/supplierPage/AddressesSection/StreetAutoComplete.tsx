'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/react';
import { Search } from 'lucide-react';

interface AutofillData {
    postal_code: string;
    lat: number;
    lng: number;
}

interface NominatimResult {
    display_name: string;
    address: {
        road?: string;
        house_number?: string;
        postcode?: string;
    };
    lat: string;
    lon: string;
}

interface StreetAutocompleteProps {
    country: string;
    region: string;
    city: string;
    value: string;
    onChange: (street: string) => void;
    onAutofill: (data: AutofillData) => void;
}

export function StreetAutocomplete({ country, region, city, value, onChange, onAutofill }: StreetAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabled = !city && !country;

    useEffect(() => { setQuery(value); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const search = (q: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (q.length < 3) { setResults([]); return; }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const locationQuery = [q, city, region, country].filter(Boolean).join(', ');
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&addressdetails=1&limit=6`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data: NominatimResult[] = await res.json();
                setResults(data);
                if (data.length > 0) setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const handleSelect = (result: NominatimResult) => {
        const addr = result.address;
        const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
        onChange(street);
        setQuery(street);
        setOpen(false);
        setResults([]);
        onAutofill({
            postal_code: addr.postcode ?? '',
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
        });
    };

    return (
        <div ref={containerRef} className="relative flex flex-col gap-1.5 mb-8">
            <label className={`font-semibold text-xs ${disabled ? 'text-gray-300' : 'text-black'}`}>
                Street
            </label>
            <div className="relative">
                <input
                    value={query}
                    disabled={disabled}
                    onChange={e => { setQuery(e.target.value); onChange(e.target.value); search(e.target.value); }}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    placeholder={disabled ? 'Select country first' : 'Start typing a street...'}
                    className={`w-full h-10 border-2 px-3 pr-8 text-sm bg-white outline-none placeholder:text-gray-400
                        ${disabled ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-black text-black'}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    {loading ? <Spinner size="sm" /> : <Search size={14} />}
                </div>
            </div>

            {open && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black border-t-0 max-h-52 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {results.map((result, i) => (
                        <button
                            key={i}
                            type="button"
                            onMouseDown={() => handleSelect(result)}
                            className="w-full text-left px-3 py-2.5 text-xs text-black hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 truncate"
                        >
                            {result.display_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}