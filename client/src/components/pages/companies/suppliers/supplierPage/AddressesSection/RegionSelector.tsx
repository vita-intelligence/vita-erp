'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/react';
import { ChevronDown } from 'lucide-react';

interface RegionSelectorProps {
    country: string;
    value: string;
    onChange: (region: string) => void;
}

export function RegionSelector({ country, value, onChange }: RegionSelectorProps) {
    const [regions, setRegions] = useState<string[]>([]);
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
        if (!country || q.length < 2) { setRegions([]); return; }

        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)},${encodeURIComponent(country)}&format=json&addressdetails=1&limit=10&featuretype=state`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data: any[] = await res.json();
                const unique = [...new Set(
                    data
                        .map((r: any) => r.address?.state || r.address?.region || '')
                        .filter(Boolean)
                )];
                setRegions(unique);
                if (unique.length > 0) setOpen(true);
            } catch {
                setRegions([]);
            } finally {
                setLoading(false);
            }
        }, 400);
    };

    const handleSelect = (region: string) => {
        onChange(region);
        setQuery(region);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative flex flex-col gap-1.5">
            <label className={`font-semibold text-xs ${disabled ? 'text-gray-300' : 'text-black'}`}>
                State / Region
            </label>
            <div className="relative">
                <input
                    value={query}
                    disabled={disabled}
                    onChange={e => { setQuery(e.target.value); search(e.target.value); }}
                    onFocus={() => regions.length > 0 && setOpen(true)}
                    placeholder={disabled ? 'Select country first' : 'Search region...'}
                    className={`w-full h-10 border-2 px-3 pr-8 text-sm bg-white outline-none placeholder:text-gray-400
                        ${disabled ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-black text-black'}`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    {loading ? <Spinner size="sm" /> : <ChevronDown size={14} />}
                </div>
            </div>

            {open && regions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black border-t-0 max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {regions.map(region => (
                        <button
                            key={region}
                            type="button"
                            onMouseDown={() => handleSelect(region)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors
                                ${region === value ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}