import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    categoryAPI,
    itemAPI,
    recipeAPI,
    CreateCategoryData,
    UpdateCategoryData,
    CreateItemData,
    UpdateItemData,
    CreateRecipeData,
    UpdateRecipeData,
    ItemFilters,
} from '@/lib/api/items';
import { useToast } from '../ui/useToast';

// ============================================================================
// CATEGORIES
// ============================================================================

export function useCategories(companyId: number) {
    return useQuery({
        queryKey: ['categories', companyId],
        queryFn: () => categoryAPI.list(companyId),
        staleTime: 5 * 60 * 1000, // 5 min — categories rarely change
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['categories', companyId] });
            toast.success('Category updated', `Renamed to "${data.name}".`);
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

export function useCreateItem(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateItemData) => itemAPI.create(companyId, data),
        onSuccess: (data) => {
            // Invalidate all item lists for this company (any filter combo)
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
            // Update the specific item cache + invalidate lists
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
            // Also refresh the parent item since it embeds recipe summaries
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