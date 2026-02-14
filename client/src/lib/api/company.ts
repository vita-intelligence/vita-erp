import { apiRequest } from '@/lib/api/client';

// ============================================================================
// TYPES
// ============================================================================

export interface Company {
    id: number;
    name: string;
    description: string;
    date_created: string;
}

export interface CreateCompanyData {
    name: string;
    description?: string;
}

export interface CompanyListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Company[];
}

// ============================================================================
// API
// ============================================================================

export const companyAPI = {
    create: (data: CreateCompanyData): Promise<Company> =>
        apiRequest(`/api/companies/`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getMyCompanies: (page: number = 1): Promise<CompanyListResponse> =>
        apiRequest(`/api/companies/me/?page=${page}`),
};