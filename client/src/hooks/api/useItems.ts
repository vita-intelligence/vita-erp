import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    uomAPI,
    categoryAPI,
    itemAPI,
    recipeAPI,
    recipeLineAPI,
    itemAttributeAPI,
    Category,
    ItemDetail,
    CreateCategoryData,
    UpdateCategoryData,
    CreateItemData,
    UpdateItemData,
    CreateRecipeData,
    UpdateRecipeData,
    CreateRecipeLineData,
    UpdateRecipeLineData,
    CreateItemAttributeData,
    UpdateItemAttributeData,

    ItemFilters,
    RecipeDetail,
} from '@/lib/api/items';
import { useToast } from '../ui/useToast';

// ============================================================================
// UNITS OF MEASURE
// ============================================================================

export function useUnitOfMeasures() {
    return useQuery({
        queryKey: ['uom'],
        queryFn: () => uomAPI.list(),
        staleTime: Infinity, // seeded by migration, never changes at runtime
    });
}

// ============================================================================
// CATEGORIES
// ============================================================================

export function useCategories(companyId: number) {
    return useQuery({
        queryKey: ['categories', companyId],
        queryFn: () => categoryAPI.list(companyId),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCategory(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateCategoryData) => categoryAPI.create(companyId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
            toast.success('Category created', `"${data.name}" has been added.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to create category', error.message);
        },
    });
}

export function useUpdateCategory(companyId: number, categoryId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: UpdateCategoryData) => categoryAPI.update(companyId, categoryId, data),
        onSuccess: (updated) => {
            // Instantly patch the category in the list cache — no waiting for refetch
            queryClient.setQueryData<Category[]>(
                ['categories', companyId],
                (old) => old?.map(c => c.id === categoryId ? updated : c) ?? []
            );
            // Invalidate items — they embed category_name which is now stale
            queryClient.invalidateQueries({ queryKey: ['items', companyId] });
            toast.success('Category updated', `Renamed to "${updated.name}".`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update category', error.message);
        },
    });
}

export function useDeleteCategory(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (categoryId: number) => categoryAPI.delete(companyId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
            toast.info('Category deleted');
        },
        onError: (error: Error) => {
            toast.error('Failed to delete category', error.message);
        },
    });
}

// ============================================================================
// ITEMS
// ============================================================================

export function useItems(companyId: number, filters?: ItemFilters) {
    return useQuery({
        queryKey: ['items', companyId, filters],
        queryFn: () => itemAPI.list(companyId, filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useItem(companyId: number, itemId: number) {
    return useQuery({
        queryKey: ['items', companyId, itemId],
        queryFn: () => itemAPI.get(companyId, itemId),
        staleTime: 2 * 60 * 1000,
    });
}

/**
 * useItemSearch — debounced search for ingredients in recipe line picker.
 * Only fires when `enabled` is true and query is at least 2 characters.
 * Results are cached for 30s per query string.
 */
export function useItemSearch(companyId: number, search: string, enabled: boolean) {
    return useQuery({
        queryKey: ['items', companyId, { search }],
        queryFn: () => itemAPI.list(companyId, { search, active: true }),
        staleTime: 30 * 1000,
        enabled: enabled && search.length >= 2,
    });
}

export function useCreateItem(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateItemData) => itemAPI.create(companyId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['items', companyId] });
            toast.success('Item created', `"${data.name}" has been added.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to create item', error.message);
        },
    });
}

export function useUpdateItem(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: UpdateItemData) => itemAPI.update(companyId, itemId, data),
        onSuccess: (data) => {
            queryClient.setQueryData(['items', companyId, itemId], data);
            queryClient.invalidateQueries({ queryKey: ['items', companyId] });
            toast.success('Item updated', `"${data.name}" has been saved.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update item', error.message);
        },
    });
}

export function useDeleteItem(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (itemId: number) => itemAPI.delete(companyId, itemId),
        onSuccess: (_, itemId) => {
            queryClient.removeQueries({ queryKey: ['items', companyId, itemId] });
            queryClient.invalidateQueries({ queryKey: ['items', companyId] });
            toast.info('Item deleted');
        },
        onError: (error: Error) => {
            toast.error('Failed to delete item', error.message);
        },
    });
}

// ============================================================================
// RECIPES
// ============================================================================

export function useRecipes(companyId: number, itemId: number) {
    return useQuery({
        queryKey: ['recipes', companyId, itemId],
        queryFn: () => recipeAPI.list(companyId, itemId),
        staleTime: 2 * 60 * 1000,
    });
}

export function useRecipe(companyId: number, itemId: number, recipeId: number) {
    return useQuery({
        queryKey: ['recipes', companyId, itemId, recipeId],
        queryFn: () => recipeAPI.get(companyId, itemId, recipeId),
        staleTime: 2 * 60 * 1000,
    });
}

export function useCreateRecipe(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateRecipeData) => recipeAPI.create(companyId, itemId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            queryClient.invalidateQueries({ queryKey: ['items', companyId, itemId] });
            toast.success('Recipe created', `"${data.name}" has been added.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to create recipe', error.message);
        },
    });
}

export function useUpdateRecipe(companyId: number, itemId: number, recipeId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: UpdateRecipeData) => recipeAPI.update(companyId, itemId, recipeId, data),
        onSuccess: (data) => {
            queryClient.setQueryData(['recipes', companyId, itemId, recipeId], data);
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            toast.success('Recipe updated', `"${data.name}" has been saved.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update recipe', error.message);
        },
    });
}

export function useDeleteRecipe(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (recipeId: number) => recipeAPI.delete(companyId, itemId, recipeId),
        onSuccess: (_, recipeId) => {
            queryClient.removeQueries({ queryKey: ['recipes', companyId, itemId, recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            queryClient.invalidateQueries({ queryKey: ['items', companyId, itemId] });
            toast.info('Recipe deleted');
        },
        onError: (error: Error) => {
            toast.error('Failed to delete recipe', error.message);
        },
    });
}

// ============================================================================
// RECIPE LINES
// ============================================================================

export function useCreateRecipeLine(companyId: number, itemId: number, recipeId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateRecipeLineData) =>
            recipeLineAPI.create(companyId, itemId, recipeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId, recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            toast.success('Ingredient added');
        },
        onError: (error: Error) => {
            toast.error('Failed to add ingredient', error.message);
        },
    });
}

export function useUpdateRecipeLine(companyId: number, itemId: number, recipeId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ lineId, data }: { lineId: number; data: UpdateRecipeLineData }) =>
            recipeLineAPI.update(companyId, itemId, recipeId, lineId, data),
        onSuccess: (updatedLine) => {
            // Patch the line in-place inside the cached recipe
            queryClient.setQueryData<RecipeDetail>(
                ['recipes', companyId, itemId, recipeId],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        lines: old.lines.map(l =>
                            l.id === updatedLine.id ? updatedLine : l
                        ),
                    };
                }
            );
            // Also invalidate the list so recipe summaries stay fresh
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            toast.success('Quantity updated');
        },
        onError: (error: Error) => {
            toast.error('Failed to update quantity', error.message);
        },
    });
}

export function useDeleteRecipeLine(companyId: number, itemId: number, recipeId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (lineId: number) =>
            recipeLineAPI.delete(companyId, itemId, recipeId, lineId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId, recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', companyId, itemId] });
            toast.info('Ingredient removed');
        },
        onError: (error: Error) => {
            toast.error('Failed to remove ingredient', error.message);
        },
    });
}


// ============================================================================
// ITEM ATTRIBUTES
// ============================================================================

export function useCreateItemAttribute(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateItemAttributeData) =>
            itemAttributeAPI.create(companyId, itemId, data),
        onSuccess: (newAttr) => {
            // Patch the attribute directly into the cached item — no refetch needed
            queryClient.setQueryData<ItemDetail>(
                ['items', companyId, itemId],
                (old) => old ? { ...old, attributes: [...old.attributes, newAttr] } : old
            );
            toast.success('Attribute added', `"${newAttr.key}" has been added.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to add attribute', error.message);
        },
    });
}

export function useUpdateItemAttribute(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ attrId, data }: { attrId: number; data: UpdateItemAttributeData }) =>
            itemAttributeAPI.update(companyId, itemId, attrId, data),
        onSuccess: (updated) => {
            // Patch the specific attribute in the cached item
            queryClient.setQueryData<ItemDetail>(
                ['items', companyId, itemId],
                (old) => old ? {
                    ...old,
                    attributes: old.attributes.map(a => a.id === updated.id ? updated : a),
                } : old
            );
            toast.success('Attribute updated');
        },
        onError: (error: Error) => {
            toast.error('Failed to update attribute', error.message);
        },
    });
}

export function useDeleteItemAttribute(companyId: number, itemId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (attrId: number) =>
            itemAttributeAPI.delete(companyId, itemId, attrId),
        onSuccess: (_, attrId) => {
            // Remove the attribute directly from the cached item
            queryClient.setQueryData<ItemDetail>(
                ['items', companyId, itemId],
                (old) => old ? {
                    ...old,
                    attributes: old.attributes.filter(a => a.id !== attrId),
                } : old
            );
            toast.info('Attribute removed');
        },
        onError: (error: Error) => {
            toast.error('Failed to remove attribute', error.message);
        },
    });
}