'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '@heroui/react';
import { ChevronDown } from 'lucide-react';

interface CountrySelectorProps {
    value: string;
    onChange: (country: string) => void;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
    const [countries, setCountries] = useState<string[]>([]);
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load all countries once on mount
    useEffect(() => {
        setLoading(true);
        fetch('https://restcountries.com/v3.1/all?fields=name')
            .then(r => r.json())
            .then((data: any[]) => {
                const names = data
                    .map((c: any) => c.name.common as string)
                    .sort((a, b) => a.localeCompare(b));
                setCountries(names);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Sync display when value changes externally
    useEffect(() => { setQuery(value); }, [value]);

    // Close on outside click — reset query to committed value
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

    const filtered = query.trim()
        ? countries.filter(c => c.toLowerCase().includes(query.toLowerCase()))
        : countries;

    const handleSelect = (country: string) => {
        onChange(country);
        setQuery(country);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative flex flex-col gap-1.5">
            <label className="text-black font-semibold text-xs">Country</label>
            <div className="relative">
                <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search country..."
                    className="w-full h-10 border-2 border-black px-3 pr-8 text-sm text-black bg-white outline-none placeholder:text-gray-400"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    {loading ? <Spinner size="sm" /> : <ChevronDown size={14} />}
                </div>
            </div>

            {open && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black border-t-0 max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {filtered.slice(0, 80).map(country => (
                        <button
                            key={country}
                            type="button"
                            onMouseDown={() => handleSelect(country)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors
                                ${country === value
                                    ? 'bg-black text-white'
                                    : 'hover:bg-gray-100 text-black'
                                }`}
                        >
                            {country}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}