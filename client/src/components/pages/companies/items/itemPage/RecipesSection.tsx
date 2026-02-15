'use client';

import React, { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { Plus, X, Check, ChefHat } from 'lucide-react';
import { Item } from '@/lib/api/items';
import { useRecipes, useCreateRecipe } from '@/hooks/api/useItems';
import { RecipeCard } from './RecipeCard';

interface RecipesSectionProps {
    companyId: number;
    itemId: number;
    rawMaterials: Item[];
    canEdit: boolean;
}

export function RecipesSection({ companyId, itemId, rawMaterials, canEdit }: RecipesSectionProps) {
    const { data: recipes = [], isLoading } = useRecipes(companyId, itemId);
    const createRecipe = useCreateRecipe(companyId, itemId);

    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newQty, setNewQty] = useState('1');

    const handleCreate = () => {
        if (!newQty) return;
        createRecipe.mutate(
            {
                name: newName || 'New Recipe',
                output_quantity: Number(newQty),
                is_default: recipes.length === 0, // first recipe is default automatically
                lines: [],                          // lines added via RecipeCard after creation
            },
            {
                onSuccess: () => {
                    setCreating(false);
                    setNewName('');
                    setNewQty('1');
                },
            }
        );
    };

    const inputClass = {
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none h-9",
        input: "text-black text-sm",
    };

    return (
        <div className="space-y-4">

            {/* Section header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ChefHat size={18} className="text-black" />
                    <h2 className="text-lg font-bold text-black">Recipes</h2>
                    {!isLoading && (
                        <span className="text-xs text-gray-400 font-mono">({recipes.length})</span>
                    )}
                </div>

                {canEdit && !creating && (
                    <Button
                        size="sm"
                        radius="none"
                        onPress={() => setCreating(true)}
                        startContent={<Plus size={14} />}
                        className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none text-xs"
                    >
                        New Recipe
                    </Button>
                )}
            </div>

            {/* New recipe form */}
            {creating && (
                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">New Recipe</p>
                    <div className="flex items-center gap-2">
                        <Input
                            value={newName}
                            onValueChange={setNewName}
                            placeholder="Recipe name (optional)"
                            variant="bordered"
                            radius="none"
                            size="sm"
                            classNames={inputClass}
                            className="flex-1"
                        />
                        <Input
                            value={newQty}
                            onValueChange={setNewQty}
                            type="number"
                            placeholder="Output qty"
                            variant="bordered"
                            radius="none"
                            size="sm"
                            classNames={inputClass}
                            className="w-32"
                            startContent={<span className="text-gray-400 text-xs whitespace-nowrap">produces</span>}
                        />
                        <Button isIconOnly size="sm" radius="none"
                            isLoading={createRecipe.isPending}
                            onPress={handleCreate}
                            className="bg-black text-white border-2 border-black w-9 h-9 min-w-0">
                            {!createRecipe.isPending && <Check size={14} />}
                        </Button>
                        <Button isIconOnly size="sm" radius="none"
                            onPress={() => { setCreating(false); setNewName(''); setNewQty('1'); }}
                            className="bg-white text-black border-2 border-black w-9 h-9 min-w-0 hover:bg-gray-100">
                            <X size={14} />
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        You can add ingredients after creating the recipe.
                    </p>
                </div>
            )}

            {/* Recipe list */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white border-2 border-black h-16 animate-pulse" />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="bg-white border-2 border-black p-10 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ChefHat className="mx-auto text-gray-300 mb-3" size={32} />
                    <p className="font-bold text-black mb-1">No recipes yet</p>
                    <p className="text-sm text-gray-500">Add a recipe to define how this item is manufactured</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            companyId={companyId}
                            itemId={itemId}
                            rawMaterials={rawMaterials}
                            canEdit={canEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}