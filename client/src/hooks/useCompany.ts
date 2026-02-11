import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyAPI, CreateCompanyData, Company } from '@/lib/api/company';
import { useToast } from '@/hooks/useToast';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * useCreateCompany - Create a new company
 * 
 * Usage:
 * const createCompany = useCreateCompany();
 * createCompany.mutate({ name: 'My Company', description: 'Optional' });
 */
export function useCreateCompany() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateCompanyData) => companyAPI.create(data),
        onSuccess: (newCompany) => {
            console.log('Company created:', newCompany);
            
            // Update cache: Add new company to the existing list
            queryClient.setQueryData(['companies', 'my', 1], (old: any) => {
                if (!old) return { count: 1, results: [newCompany], next: null, previous: null };
                
                return {
                    ...old,
                    count: old.count + 1,
                    results: [newCompany, ...old.results], // Add to beginning
                };
            });
            
            // Show success toast
            toast.success('Company created!', `${newCompany.name} has been created successfully`);
        },
        onError: (error: Error) => {
            console.error('Company creation failed:', error.message);
            
            // Show error toast
            toast.error('Failed to create company', error.message);
        },
    });
}

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * useMyCompanies - Get companies where user has active membership
 * 
 * Usage:
 * const { data, isLoading, error } = useMyCompanies();
 */
export function useMyCompanies(page: number = 1) {
    return useQuery({
        queryKey: ['companies', 'my', page],
        queryFn: () => companyAPI.getMyCompanies(page),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}