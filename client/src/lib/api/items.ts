import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface UnitOfMeasure {
    id: number;
    name: string;
    abbreviation: string;
}

export interface Category {
    id: number;
    name: string;
}

export type ItemType = 'raw' | 'bom';

export interface Item {
    id: number;
    name: string;
    description: string;
    item_type: ItemType;
    unit_of_measurement: number;
    uom: string;                  // abbreviation — read only
    category: number | null;
    category_name: string | null;
    is_active: boolean;
    date_added: string;
}

export interface ItemDetail extends Item {
    recipes: Recipe[];
}

export interface RecipeLine {
    id: number;
    ingredient: number;
    ingredient_name: string;
    ingredient_uom: string;
    quantity: number;
}

export interface Recipe {
    id: number;
    name: string;
    output_quantity: number;
    is_default: boolean;
    created_at: string;
}

export interface RecipeDetail extends Recipe {
    lines: RecipeLine[];
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

export interface CreateCategoryData {
    name: string;
}

export interface UpdateCategoryData {
    name: string;
}

export interface CreateItemData {
    name: string;
    item_type: ItemType;
    unit_of_measurement: number;
    description?: string;
    category?: number | null;
}

export interface UpdateItemData {
    name?: string;
    description?: string;
    unit_of_measurement?: number;
    category?: number | null;
    is_active?: boolean;
}

export interface RecipeLineData {
    ingredient: number;
    quantity: number;
}

export interface CreateRecipeData {
    name?: string;
    output_quantity: number;
    is_default?: boolean;
    lines: RecipeLineData[];
}

export interface UpdateRecipeData {
    name?: string;
    output_quantity?: number;
    is_default?: boolean;
    lines?: RecipeLineData[];   // omit to keep existing lines unchanged
}

export interface ItemFilters {
    type?: ItemType;
    active?: boolean;
    category?: number;
}

// ============================================================================
// API
// ============================================================================

export const categoryAPI = {
    list: (companyId: number): Promise<Category[]> =>
        apiRequest(`/api/items/companies/${companyId}/categories/`),

    create: (companyId: number, data: CreateCategoryData): Promise<Category> =>
        apiRequest(`/api/items/companies/${companyId}/categories/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    get: (companyId: number, categoryId: number): Promise<Category> =>
        apiRequest(`/api/items/companies/${companyId}/categories/${categoryId}/`),

    update: (companyId: number, categoryId: number, data: UpdateCategoryData): Promise<Category> =>
        apiRequest(`/api/items/companies/${companyId}/categories/${categoryId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, categoryId: number): Promise<void> =>
        apiRequest(`/api/items/companies/${companyId}/categories/${categoryId}/`, {
            method: 'DELETE',
        }),
};

export const itemAPI = {
    list: (companyId: number, filters?: ItemFilters): Promise<Item[]> => {
        const params = new URLSearchParams();
        if (filters?.type)     params.set('type', filters.type);
        if (filters?.active !== undefined) params.set('active', String(filters.active));
        if (filters?.category) params.set('category', String(filters.category));
        const qs = params.toString();
        return apiRequest(`/api/items/companies/${companyId}/items/${qs ? `?${qs}` : ''}`);
    },

    create: (companyId: number, data: CreateItemData): Promise<ItemDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    get: (companyId: number, itemId: number): Promise<ItemDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/`),

    update: (companyId: number, itemId: number, data: UpdateItemData): Promise<ItemDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, itemId: number): Promise<void> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/`, {
            method: 'DELETE',
        }),
};

export const recipeAPI = {
    list: (companyId: number, itemId: number): Promise<RecipeDetail[]> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/`),

    create: (companyId: number, itemId: number, data: CreateRecipeData): Promise<RecipeDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    get: (companyId: number, itemId: number, recipeId: number): Promise<RecipeDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/`),

    update: (companyId: number, itemId: number, recipeId: number, data: UpdateRecipeData): Promise<RecipeDetail> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, itemId: number, recipeId: number): Promise<void> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/`, {
            method: 'DELETE',
        }),
};