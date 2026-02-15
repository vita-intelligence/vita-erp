'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Spinner } from '@heroui/react';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, Check, X, Star, Search } from 'lucide-react';
import { RecipeDetail } from '@/lib/api/items';
import {
    useUpdateRecipe,
    useDeleteRecipe,
    useCreateRecipeLine,
    useUpdateRecipeLine,
    useDeleteRecipeLine,
    useItemSearch,
} from '@/hooks/api/useItems';

// ============================================================================
// QUANTITY HELPERS
// ============================================================================

/** Blocks minus, plus, and scientific notation keys on number inputs */
const blockInvalidQtyKeys = (e: React.KeyboardEvent) => {
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
    }
};

/** Only updates state if value is empty (user is mid-typing) or a positive number */
const handleQtyChange = (val: string, setter: (v: string) => void) => {
    // Allow empty (clearing) and anything that isn't a complete negative/zero number
    // The > 0 check only fires when val is a complete parseable number
    if (val === '' || val === '0.' || !/^-/.test(val)) setter(val);
};

// ============================================================================
// INGREDIENT SEARCH COMBOBOX
// ============================================================================

interface IngredientSearchProps {
    companyId: number;
    onSelect: (id: number, name: string, uom: string) => void;
    excludeIds?: number[];
}

function IngredientSearch({ companyId, onSelect, excludeIds = [] }: IngredientSearchProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [debounced, setDebounced] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Clear immediately when query is too short, otherwise debounce 300ms
    useEffect(() => {
        if (query.length < 2) {
            setDebounced('');
            return;
        }
        const t = setTimeout(() => setDebounced(query), 300);
        return () => clearTimeout(t);
    }, [query]);

    const { data: results = [], isFetching } = useItemSearch(
        companyId,
        debounced,
        open && debounced.length >= 2,
    );

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

    const handleSelect = (id: number, name: string, uom: string) => {
        onSelect(id, name, uom);
        setQuery(name);
        setOpen(false);
    };

    const showDropdown = open && query.length > 0;
    const showResults = debounced.length >= 2;

    return (
        <div ref={containerRef} className="relative flex-1">
            <Input
                value={query}
                onValueChange={(v) => { setQuery(v); setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder="Search ingredient..."
                variant="bordered"
                radius="none"
                size="sm"
                startContent={<Search size={14} className="text-gray-400 flex-shrink-0" />}
                endContent={isFetching ? <Spinner size="sm" /> : null}
                classNames={{
                    inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9",
                    input: "text-black text-sm",
                }}
            />

            {showDropdown && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black border-t-0 max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {!showResults && (
                        <div className="px-3 py-2 text-xs text-gray-400">
                            Type at least 2 characters to search…
                        </div>
                    )}

                    {showResults && !isFetching && results.length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-400">
                            No ingredients found for "{debounced}"
                        </div>
                    )}

                    {showResults && results.map(item => {
                        const alreadyAdded = excludeIds.includes(item.id);
                        return (
                            <button
                                key={item.id}
                                type="button"
                                disabled={alreadyAdded}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    if (!alreadyAdded) handleSelect(item.id, item.name, item.uom);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors
                                    ${alreadyAdded
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'hover:bg-black hover:text-white cursor-pointer'
                                    }`}
                            >
                                <span className="font-medium">{item.name}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="font-mono text-xs opacity-50">{item.uom}</span>
                                    {alreadyAdded && (
                                        <span className="text-[10px] text-gray-300">already added</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// RECIPE CARD
// ============================================================================

interface RecipeCardProps {
    recipe: RecipeDetail;
    companyId: number;
    itemId: number;
    canEdit: boolean;   // passed from ItemPage via RecipesSection as can('items.edit')
}

export function RecipeCard({ recipe, companyId, itemId, canEdit }: RecipeCardProps) {
    const updateRecipe = useUpdateRecipe(companyId, itemId, recipe.id);
    const deleteRecipe = useDeleteRecipe(companyId, itemId);
    const createLine = useCreateRecipeLine(companyId, itemId, recipe.id);
    const updateLine = useUpdateRecipeLine(companyId, itemId, recipe.id);
    const deleteLine = useDeleteRecipeLine(companyId, itemId, recipe.id);

    const [expanded, setExpanded] = useState(true);
    const [editingHeader, setEditingHeader] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Header edit state
    const [recipeName, setRecipeName] = useState(recipe.name);
    const [outputQty, setOutputQty] = useState(String(recipe.output_quantity));

    // New line state
    const [addingLine, setAddingLine] = useState(false);
    const [newIngredientId, setNewIngredientId] = useState<number | null>(null);
    const [newIngredientUom, setNewIngredientUom] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    // Per-line edit state
    const [editingLineId, setEditingLineId] = useState<number | null>(null);
    const [editQty, setEditQty] = useState('');

    const addedIngredientIds = recipe.lines.map(l => l.ingredient);

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9",
        input: "text-black text-sm",
    };

    const handleSaveHeader = () => {
        updateRecipe.mutate(
            { name: recipeName, output_quantity: Number(outputQty) },
            { onSuccess: () => setEditingHeader(false) }
        );
    };

    const handleSetDefault = () => {
        updateRecipe.mutate({ is_default: true });
    };

    const handleAddLine = () => {
        if (!newIngredientId || !newQuantity || Number(newQuantity) <= 0) return;
        createLine.mutate(
            { ingredient: newIngredientId, quantity: Number(newQuantity) },
            {
                onSuccess: () => {
                    setNewIngredientId(null);
                    setNewIngredientUom('');
                    setNewQuantity('');
                    setAddingLine(false);
                },
            }
        );
    };

    const handleSaveLine = (lineId: number) => {
        if (!editQty || Number(editQty) <= 0) return;
        updateLine.mutate(
            { lineId, data: { quantity: Number(editQty) } },
            { onSuccess: () => setEditingLineId(null) }
        );
    };

    const handleCancelAddLine = () => {
        setAddingLine(false);
        setNewIngredientId(null);
        setNewIngredientUom('');
        setNewQuantity('');
    };

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

            {/* Recipe header */}
            <div className="flex items-center gap-3 p-4 border-b-2 border-black">

                {/* Default star */}
                <button
                    type="button"
                    onClick={handleSetDefault}
                    disabled={recipe.is_default || !canEdit}
                    title={recipe.is_default ? 'Default recipe' : 'Set as default'}
                    className={`flex-shrink-0 transition-colors ${recipe.is_default
                        ? 'text-black cursor-default'
                        : canEdit
                            ? 'text-gray-300 hover:text-black'
                            : 'text-gray-200 cursor-default'
                        }`}
                >
                    <Star size={16} fill={recipe.is_default ? 'currentColor' : 'none'} />
                </button>

                {/* Name + output qty */}
                {editingHeader ? (
                    <div className="flex-1 flex items-center gap-2">
                        <Input
                            value={recipeName}
                            onValueChange={setRecipeName}
                            placeholder="Recipe name"
                            variant="bordered"
                            radius="none"
                            size="sm"
                            classNames={inputClass}
                            className="flex-1"
                        />
                        <Input
                            value={outputQty}
                            onValueChange={(v) => handleQtyChange(v, setOutputQty)}
                            onKeyDown={blockInvalidQtyKeys}
                            type="number"
                            placeholder="Output qty"
                            min="0.001"
                            step="any"
                            variant="bordered"
                            radius="none"
                            size="sm"
                            classNames={inputClass}
                            className="w-28"
                            startContent={<span className="text-gray-400 text-xs">qty</span>}
                        />
                    </div>
                ) : (
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-black text-sm">
                                {recipe.name || 'Recipe'}
                            </span>
                            {recipe.is_default && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Produces{' '}
                            <span className="font-mono font-bold">{recipe.output_quantity}</span> units
                            {' · '}
                            <span className="font-mono">{recipe.lines.length}</span>{' '}
                            ingredient{recipe.lines.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Header actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {canEdit && (
                        editingHeader ? (
                            <>
                                <Button isIconOnly size="sm" radius="none"
                                    isLoading={updateRecipe.isPending}
                                    onPress={handleSaveHeader}
                                    className="bg-black text-white border-2 border-black w-8 h-8 min-w-0">
                                    {!updateRecipe.isPending && <Check size={13} />}
                                </Button>
                                <Button isIconOnly size="sm" radius="none"
                                    onPress={() => setEditingHeader(false)}
                                    className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100">
                                    <X size={13} />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button isIconOnly size="sm" radius="none"
                                    onPress={() => setEditingHeader(true)}
                                    className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-black hover:text-white transition-all">
                                    <Pencil size={13} />
                                </Button>
                                {confirmDelete ? (
                                    <>
                                        <span className="text-xs text-red-600 font-semibold px-1">Delete?</span>
                                        <Button size="sm" radius="none"
                                            isLoading={deleteRecipe.isPending}
                                            onPress={() => deleteRecipe.mutate(recipe.id)}
                                            className="bg-red-600 text-white border-2 border-red-600 h-8 text-xs font-bold min-w-0 px-2">
                                            Yes
                                        </Button>
                                        <Button size="sm" radius="none"
                                            onPress={() => setConfirmDelete(false)}
                                            className="bg-white text-black border-2 border-black h-8 text-xs font-bold min-w-0 px-2 hover:bg-gray-100">
                                            No
                                        </Button>
                                    </>
                                ) : (
                                    <Button isIconOnly size="sm" radius="none"
                                        onPress={() => setConfirmDelete(true)}
                                        className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all">
                                        <Trash2 size={13} />
                                    </Button>
                                )}
                            </>
                        )
                    )}

                    {/* Collapse toggle */}
                    <Button isIconOnly size="sm" radius="none" variant="light"
                        onPress={() => setExpanded(p => !p)}
                        className="text-gray-400 hover:text-black w-8 h-8 min-w-0">
                        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </Button>
                </div>
            </div>

            {/* Lines */}
            {expanded && (
                <div className="p-4 space-y-2">
                    {recipe.lines.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-3">
                            No ingredients yet — add one below
                        </p>
                    ) : (
                        recipe.lines.map(line => (
                            <div key={line.id}
                                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-black">
                                        {line.ingredient_name}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono ml-2">
                                        {line.ingredient_uom}
                                    </span>
                                </div>

                                {editingLineId === line.id ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editQty}
                                            onValueChange={(v) => handleQtyChange(v, setEditQty)}
                                            onKeyDown={blockInvalidQtyKeys}
                                            type="number"
                                            min="0.001"
                                            step="any"
                                            variant="bordered"
                                            radius="none"
                                            size="sm"
                                            classNames={inputClass}
                                            className="w-32"
                                            endContent={
                                                <span className="text-gray-400 font-mono text-xs flex-shrink-0">
                                                    {line.ingredient_uom}
                                                </span>
                                            }
                                        />
                                        <Button isIconOnly size="sm" radius="none"
                                            isLoading={updateLine.isPending}
                                            isDisabled={!editQty || Number(editQty) <= 0}
                                            onPress={() => handleSaveLine(line.id)}
                                            className="bg-black text-white border-2 border-black w-8 h-8 min-w-0 disabled:opacity-40">
                                            {!updateLine.isPending && <Check size={13} />}
                                        </Button>
                                        <Button isIconOnly size="sm" radius="none"
                                            onPress={() => setEditingLineId(null)}
                                            className="bg-white text-black border-2 border-black w-8 h-8 min-w-0 hover:bg-gray-100">
                                            <X size={13} />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-mono font-bold text-black text-right">
                                            {line.quantity}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono w-8">
                                            {line.ingredient_uom}
                                        </span>
                                        {canEdit && (
                                            <>
                                                <Button isIconOnly size="sm" radius="none" variant="light"
                                                    onPress={() => {
                                                        setEditingLineId(line.id);
                                                        setEditQty(String(line.quantity));
                                                    }}
                                                    className="text-gray-400 hover:text-black w-7 h-7 min-w-0">
                                                    <Pencil size={12} />
                                                </Button>
                                                <Button isIconOnly size="sm" radius="none" variant="light"
                                                    isLoading={deleteLine.isPending}
                                                    onPress={() => deleteLine.mutate(line.id)}
                                                    className="text-gray-300 hover:text-red-500 w-7 h-7 min-w-0">
                                                    <Trash2 size={12} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Add ingredient row */}
                    {canEdit && (
                        addingLine ? (
                            <div className="flex items-center gap-2 pt-2">
                                <IngredientSearch
                                    companyId={companyId}
                                    excludeIds={addedIngredientIds}
                                    onSelect={(id, _name, uom) => {
                                        setNewIngredientId(id);
                                        setNewIngredientUom(uom);
                                    }}
                                />
                                <Input
                                    value={newQuantity}
                                    onValueChange={(v) => handleQtyChange(v, setNewQuantity)}
                                    onKeyDown={blockInvalidQtyKeys}
                                    type="number"
                                    placeholder="Qty"
                                    min="0.001"
                                    step="any"
                                    variant="bordered"
                                    radius="none"
                                    size="sm"
                                    classNames={inputClass}
                                    className="w-32"
                                    endContent={
                                        newIngredientUom
                                            ? <span className="text-gray-400 font-mono text-xs flex-shrink-0">{newIngredientUom}</span>
                                            : null
                                    }
                                />
                                <Button isIconOnly size="sm" radius="none"
                                    isLoading={createLine.isPending}
                                    isDisabled={!newIngredientId || !newQuantity || Number(newQuantity) <= 0}
                                    onPress={handleAddLine}
                                    className="bg-black text-white border-2 border-black w-9 h-9 min-w-0 disabled:opacity-40">
                                    {!createLine.isPending && <Check size={14} />}
                                </Button>
                                <Button isIconOnly size="sm" radius="none"
                                    onPress={handleCancelAddLine}
                                    className="bg-white text-black border-2 border-black w-9 h-9 min-w-0 hover:bg-gray-100">
                                    <X size={14} />
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setAddingLine(true)}
                                className="w-full flex items-center justify-center gap-2 py-2 mt-1 border-2 border-dashed border-gray-300 text-gray-400 text-sm hover:border-black hover:text-black transition-all"
                            >
                                <Plus size={14} />
                                Add ingredient
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}