'use client';

import React from 'react';
import { Building2, Users, Lock, Package, ShoppingBasket, Truck } from 'lucide-react';
import { Permission } from '@/lib/api/access';

// ============================================================================
// PERMISSION GROUPS CATALOG
// Mirrors PERMISSION_CATALOG in Python — add new groups here as you expand.
// ============================================================================

export const PERMISSION_GROUPS: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'companies', label: 'Company Management', icon: <Building2 size={16} /> },
    { key: 'members', label: 'Member Management', icon: <Users size={16} /> },
    { key: 'roles', label: 'Role & Access Control', icon: <Lock size={16} /> },
    { key: 'items', label: 'Items Registration', icon: <Package size={16} /> },
    { key: 'procurements', label: 'Procurements', icon: <ShoppingBasket size={16} /> },
    { key: 'suppliers', label: 'Suppliers', icon: <Truck size={16} /> },
];

// ============================================================================
// PERMISSION GROUP — single collapsible group row
// ============================================================================

interface PermissionGroupProps {
    label: string;
    icon: React.ReactNode;
    permissions: Permission[];
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
}

function PermissionGroup({ label, icon, permissions, selectedIds, onToggle }: PermissionGroupProps) {
    const allSelected = permissions.every(p => selectedIds.has(p.id));
    const someSelected = permissions.some(p => selectedIds.has(p.id));

    const toggleAll = () => {
        if (allSelected) {
            permissions.forEach(p => selectedIds.has(p.id) && onToggle(p.id));
        } else {
            permissions.forEach(p => !selectedIds.has(p.id) && onToggle(p.id));
        }
    };

    return (
        // No onClick here — was causing double-fires when clicking individual rows
        <div className="border-2 border-black">

            {/* Group header — clicking anywhere on it toggles all */}
            <button
                type="button"
                onClick={toggleAll}
                className="w-full cursor-pointer flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors border-b-2 border-black"
            >
                <div className="flex items-center gap-2 font-bold text-black">
                    {icon}
                    {label}
                </div>
                <div className={`w-5 h-5 border-2 border-black flex items-center justify-center flex-shrink-0
                    ${allSelected ? 'bg-black' : someSelected ? 'bg-gray-400' : 'bg-white'}`}
                >
                    {(allSelected || someSelected) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                                d={allSelected ? 'M1 4L4 7L9 1' : 'M1 4H9'}
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </button>

            {/* Individual permission rows — full row is clickable */}
            <div className="divide-y divide-gray-100">
                {permissions.map(permission => (
                    <label
                        key={permission.id}
                        onClick={(e) => {
                            e.stopPropagation(); // prevent event bubbling to parent
                            onToggle(permission.id);
                        }}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-semibold text-black">{permission.description}</p>
                            <p className="text-xs text-gray-400 font-mono">{permission.key}</p>
                        </div>
                        <div
                            className={`w-5 h-5 border-2 border-black flex items-center justify-center flex-shrink-0 transition-colors
                                ${selectedIds.has(permission.id) ? 'bg-black' : 'bg-white'}`}
                        >
                            {selectedIds.has(permission.id) && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// PERMISSION PICKER — drop this wherever you need the full picker UI
// ============================================================================

interface PermissionPickerProps {
    catalog: Permission[] | undefined;
    isLoading: boolean;
    selectedIds: Set<number>;
    onToggle: (id: number) => void;
}

export default function PermissionPicker({ catalog, isLoading, selectedIds, onToggle }: PermissionPickerProps) {
    const groupedPermissions = PERMISSION_GROUPS.map(group => ({
        ...group,
        permissions: (catalog ?? []).filter(p => p.key.startsWith(`${group.key}.`)),
    }));

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-black">Permissions</h2>
                <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
            </div>

            {isLoading ? (
                <div className="border-2 border-black p-8 text-center text-gray-400">
                    Loading permissions...
                </div>
            ) : (
                <div className="space-y-3">
                    {groupedPermissions.map(group =>
                        group.permissions.length > 0 && (
                            <PermissionGroup
                                key={group.key}
                                label={group.label}
                                icon={group.icon}
                                permissions={group.permissions}
                                selectedIds={selectedIds}
                                onToggle={onToggle}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}