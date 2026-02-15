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
    company: number;      // read-only — set by backend from URL
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
    recipes: Recipe[];            // lightweight summaries, no lines
    attributes: ItemAttribute[];
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
    lines?: RecipeLineData[];     // omit to keep existing lines unchanged
}

export interface CreateRecipeLineData {
    ingredient: number;
    quantity: number;
}

export interface UpdateRecipeLineData {
    quantity: number;             // ingredient is immutable — only quantity can change
}

export interface ItemFilters {
    type?: ItemType;
    active?: boolean;
    category?: number;
    search?: string;
}

export interface ItemAttribute {
    id: number;
    key: string;
    value: string;
}

export interface CreateItemAttributeData {
    key: string;
    value: string;
}

export interface UpdateItemAttributeData {
    key?: string;
    value?: string;
}

// ============================================================================
// API
// ============================================================================

export const uomAPI = {
    /**
     * Global list — no company scope.
     * Seeded by migration, never changes at runtime.
     */
    list: (): Promise<UnitOfMeasure[]> =>
        apiRequest('/api/items/uom/'),
};

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
        if (filters?.type)                    params.set('type', filters.type);
        if (filters?.active !== undefined)    params.set('active', String(filters.active));
        if (filters?.category !== undefined)  params.set('category', String(filters.category));
        if (filters?.search)                  params.set('search', filters.search);
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

export const recipeLineAPI = {
    /**
     * List all lines for a recipe.
     * Prefer using recipeAPI.get() which returns lines embedded — use this
     * only when you need the lines independently of the recipe header.
     */
    list: (companyId: number, itemId: number, recipeId: number): Promise<RecipeLine[]> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/lines/`),

    /** Add a single ingredient to a recipe. */
    create: (companyId: number, itemId: number, recipeId: number, data: CreateRecipeLineData): Promise<RecipeLine> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/lines/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /** Update quantity of an existing ingredient line. Ingredient itself is immutable. */
    update: (companyId: number, itemId: number, recipeId: number, lineId: number, data: UpdateRecipeLineData): Promise<RecipeLine> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/lines/${lineId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    /** Remove an ingredient from a recipe. Cannot remove the last line. */
    delete: (companyId: number, itemId: number, recipeId: number, lineId: number): Promise<void> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/recipes/${recipeId}/lines/${lineId}/`, {
            method: 'DELETE',
        }),
};


export const itemAttributeAPI = {
    list: (companyId: number, itemId: number): Promise<ItemAttribute[]> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/attributes/`),

    create: (companyId: number, itemId: number, data: CreateItemAttributeData): Promise<ItemAttribute> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/attributes/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (companyId: number, itemId: number, attrId: number, data: UpdateItemAttributeData): Promise<ItemAttribute> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/attributes/${attrId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, itemId: number, attrId: number): Promise<void> =>
        apiRequest(`/api/items/companies/${companyId}/items/${itemId}/attributes/${attrId}/`, {
            method: 'DELETE',
        }),
};