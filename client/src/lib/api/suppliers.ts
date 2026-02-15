import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface Supplier {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    date_added: string;
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

export interface CreateSupplierData {
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface UpdateSupplierData {
    name?: string;
    description?: string;
    is_active?: boolean;
}

export interface SupplierFilters {
    search?: string;
    active?: boolean;
}

// ============================================================================
// API
// ============================================================================

export const supplierAPI = {
    list: (companyId: number, filters?: SupplierFilters): Promise<Supplier[]> => {
        const params = new URLSearchParams();
        if (filters?.search)             params.set('search', filters.search);
        if (filters?.active !== undefined) params.set('active', String(filters.active));
        const qs = params.toString();
        return apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${qs ? `?${qs}` : ''}`);
    },

    get: (companyId: number, supplierId: number): Promise<Supplier> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`),

    create: (companyId: number, data: CreateSupplierData): Promise<Supplier> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (companyId: number, supplierId: number, data: UpdateSupplierData): Promise<Supplier> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, supplierId: number): Promise<void> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`, {
            method: 'DELETE',
        }),
};