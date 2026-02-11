// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
// API FUNCTIONS
// ============================================================================

export const companyAPI = {
    /**
     * Create a new company
     * POST /api/companies/
     */
    create: async (data: CreateCompanyData): Promise<Company> => {
        const response = await fetch(`${API_BASE_URL}/api/companies/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.name?.[0] || 
                                responseData.description?.[0] || 
                                responseData.detail ||
                                'Failed to create company';
            throw new Error(errorMessage);
        }

        return responseData;
    },

    /**
     * Get my companies (where user has active membership)
     * GET /api/companies/me/
     */
    getMyCompanies: async (page: number = 1): Promise<CompanyListResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/companies/me/?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch companies');
        }

        return data;
    },
};