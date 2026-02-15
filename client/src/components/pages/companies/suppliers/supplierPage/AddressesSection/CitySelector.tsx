'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/react';
import { ChevronDown } from 'lucide-react';

interface CitySelectorProps {
    country: string;
    region: string;
    value: string;
    onChange: (city: string) => void;
}

export function CitySelector({ country, region, value, onChange }: CitySelectorProps) {
    const [cities, setCities] = useState<string[]>([]);
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabled = !country;

    useEffect(() => { setQuery(value); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery(value);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [value]);

    const search = (q: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!country || q.length < 2) { setCities([]); return; }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const locationQuery = [q, region, country].filter(Boolean).join(', ');
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&addressdetails=1&limit=10&featuretype=city`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data: any[] = await res.json();
                const unique = [...new Set(
                    data
                        .map((r: any) => r.address?.city || r.address?.town || r.address?.village || '')
                        .filter(Boolean)
                )];
                setCities(unique);
                if (unique.length > 0) setOpen(true);
            } catch {
                setCities([]);
            } finally {
                setLoading(false);
            }
        }, 400);
    };

    const handleSelect = (city: string) => {
        onChange(city);
        setQuery(city);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative flex flex-col gap-1.5">
            <label className={`font-semibold text-xs ${disabled ? 'text-gray-300' : 'text-black'}`}>
                City
            </label>
            <div className="relative">
                <input
                    value={query}
                    disabled={disabled}
                    onChange={e => { setQuery(e.target.value); search(e.target.value); }}
                    onFocus={() => cities.length > 0 && setOpen(true)}
                    placeholder={disabled ? 'Select country first' : 'Search city...'}
                    className={`w-full h-10 border-2 px-3 pr-8 text-sm bg-white outline-none placeholder:text-gray-400
                        ${disabled ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-black text-black'}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    {loading ? <Spinner size="sm" /> : <ChevronDown size={14} />}
                </div>
            </div>

            {open && cities.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black border-t-0 max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {cities.map(city => (
                        <button
                            key={city}
                            type="button"
                            onMouseDown={() => handleSelect(city)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors
                                ${city === value ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}