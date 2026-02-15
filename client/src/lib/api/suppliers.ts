import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export type AddressType = 'headquarters' | 'warehouse' | 'billing' | 'other';

export interface SupplierAddress {
    id:                   number;
    label:                string;
    address_type:         AddressType;
    address_type_display: string;
    street:               string;
    city:                 string;
    state:                string;
    postal_code:          string;
    country:              string;
    latitude:             string | null;   // DecimalField serializes as string
    longitude:            string | null;
    is_primary:           boolean;
}

export interface Supplier {
    id:          number;
    name:        string;
    description: string;
    is_active:   boolean;
    date_added:  string;
}

export interface SupplierDetail extends Supplier {
    addresses: SupplierAddress[];
}

// ============================================================================
// PAYLOAD TYPES
// ============================================================================

export interface CreateSupplierData {
    name:        string;
    description?: string;
    is_active?:  boolean;
}

export interface UpdateSupplierData {
    name?:        string;
    description?: string;
    is_active?:   boolean;
}

export interface CreateSupplierAddressData {
    label?:        string;
    address_type?: AddressType;
    street?:       string;
    city?:         string;
    state?:        string;
    postal_code?:  string;
    country?:      string;
    latitude?:     number | null;
    longitude?:    number | null;
    is_primary?:   boolean;
}

export interface UpdateSupplierAddressData {
    label?:        string;
    address_type?: AddressType;
    street?:       string;
    city?:         string;
    state?:        string;
    postal_code?:  string;
    country?:      string;
    latitude?:     number | null;
    longitude?:    number | null;
    is_primary?:   boolean;
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
        if (filters?.search)               params.set('search', filters.search);
        if (filters?.active !== undefined) params.set('active', String(filters.active));
        const qs = params.toString();
        return apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${qs ? `?${qs}` : ''}`);
    },

    get: (companyId: number, supplierId: number): Promise<SupplierDetail> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`),

    create: (companyId: number, data: CreateSupplierData): Promise<SupplierDetail> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (companyId: number, supplierId: number, data: UpdateSupplierData): Promise<SupplierDetail> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, supplierId: number): Promise<void> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/`, {
            method: 'DELETE',
        }),
};

export const supplierAddressAPI = {
    list: (companyId: number, supplierId: number): Promise<SupplierAddress[]> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/addresses/`),

    create: (companyId: number, supplierId: number, data: CreateSupplierAddressData): Promise<SupplierAddress> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/addresses/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (companyId: number, supplierId: number, addressId: number, data: UpdateSupplierAddressData): Promise<SupplierAddress> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/addresses/${addressId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (companyId: number, supplierId: number, addressId: number): Promise<void> =>
        apiRequest(`/api/suppliers/companies/${companyId}/suppliers/${supplierId}/addresses/${addressId}/`, {
            method: 'DELETE',
        }),
};