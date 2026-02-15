'use client';

import React, { useEffect, useState } from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ItemType, Category } from '@/lib/api/items';

export interface ItemsFiltersState {
    search: string;
    type: ItemType | '';
    category: number | '';
    active: boolean | '';
}

interface ItemsFiltersProps {
    filters: ItemsFiltersState;
    categories: Category[];
    onChange: (filters: ItemsFiltersState) => void;
}

export const EMPTY_FILTERS: ItemsFiltersState = {
    search: '',
    type: '',
    category: '',
    active: '',
};

const hasActiveFilters = (filters: ItemsFiltersState) =>
    filters.search !== '' ||
    filters.type !== '' ||
    filters.category !== '' ||
    filters.active !== '';

export function ItemsFilters({ filters, categories, onChange }: ItemsFiltersProps) {
    // All filter state is local — nothing is committed to the parent until Search is pressed.
    // This prevents a new API call firing on every dropdown change.
    const [localSearch, setLocalSearch] = useState(filters.search);
    const [localType, setLocalType] = useState<ItemType | ''>(filters.type);
    const [localCategory, setLocalCategory] = useState<number | ''>(filters.category);
    const [localActive, setLocalActive] = useState<boolean | ''>(filters.active);

    // Sync local state when filters are reset externally (e.g. "Clear" button on the list page)
    useEffect(() => {
        setLocalSearch(filters.search);
        setLocalType(filters.type);
        setLocalCategory(filters.category);
        setLocalActive(filters.active);
    }, [filters]);

    const handleSearch = () => {
        onChange({
            search: localSearch.trim(),
            type: localType,
            category: localCategory,
            active: localActive,
        });
    };

    const handleClear = () => {
        // Reset both local state and committed filters at once
        setLocalSearch('');
        setLocalType('');
        setLocalCategory('');
        setLocalActive('');
        onChange(EMPTY_FILTERS);
    };

    // Show the indicator based on what's actually committed (not local staging)
    const filtersActive = hasActiveFilters(filters);

    // Show the clear button if either committed or local state has values
    const hasPendingOrActive =
        localSearch !== '' || localType !== '' || localCategory !== '' || localActive !== '';

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3">

            {/* Search input */}
            <div className="flex gap-2">
                <Input
                    value={localSearch}
                    onValueChange={setLocalSearch}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search items..."
                    variant="bordered"
                    radius="none"
                    startContent={<Search size={16} className="text-gray-400 flex-shrink-0" />}
                    classNames={{
                        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-10",
                    }}
                />
                <Button
                    radius="none"
                    onPress={handleSearch}
                    className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none h-10 px-4 flex-shrink-0"
                >
                    Search
                </Button>
            </div>

            {/* Dropdowns — staged locally, applied on Search press */}
            <div className="flex flex-wrap gap-2">

                <Select
                    placeholder="All types"
                    selectedKeys={localType ? [localType] : []}
                    onSelectionChange={(keys) =>
                        setLocalType((Array.from(keys)[0] as ItemType) ?? '')
                    }
                    variant="bordered"
                    radius="none"
                    size="sm"
                    className="w-36"
                    classNames={{ trigger: "border-2 border-black shadow-none h-9" }}
                >
                    <SelectItem key="raw">Raw Material</SelectItem>
                    <SelectItem key="bom">BOM Item</SelectItem>
                </Select>

                <Select
                    placeholder="All categories"
                    selectedKeys={localCategory ? [String(localCategory)] : []}
                    onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0];
                        setLocalCategory(val ? Number(val) : '');
                    }}
                    variant="bordered"
                    radius="none"
                    size="sm"
                    className="w-44"
                    classNames={{ trigger: "border-2 border-black shadow-none h-9" }}
                >
                    {categories.map(c => (
                        <SelectItem key={String(c.id)}>{c.name}</SelectItem>
                    ))}
                </Select>

                <Select
                    placeholder="All statuses"
                    selectedKeys={localActive !== '' ? [String(localActive)] : []}
                    onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0];
                        setLocalActive(val === undefined ? '' : val === 'true');
                    }}
                    variant="bordered"
                    radius="none"
                    size="sm"
                    className="w-36"
                    classNames={{ trigger: "border-2 border-black shadow-none h-9" }}
                >
                    <SelectItem key="true">Active</SelectItem>
                    <SelectItem key="false">Inactive</SelectItem>
                </Select>

                {/* Clear — resets everything immediately */}
                {hasPendingOrActive && (
                    <Button
                        size="sm"
                        radius="none"
                        onPress={handleClear}
                        startContent={<X size={14} />}
                        className="h-9 border-2 border-black bg-gray-100 text-black font-semibold hover:bg-black hover:text-white transition-all"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Committed filters indicator */}
            {filtersActive && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <SlidersHorizontal size={11} />
                    Filters active — showing filtered results
                </p>
            )}
        </div>
    );
}