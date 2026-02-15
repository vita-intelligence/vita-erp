import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    supplierAPI,
    Supplier,
    CreateSupplierData,
    UpdateSupplierData,
    SupplierFilters,
} from '@/lib/api/suppliers';
import { useToast } from '../ui/useToast';

// ============================================================================
// QUERIES
// ============================================================================

export function useSuppliers(companyId: number, filters?: SupplierFilters) {
    return useQuery({
        queryKey: ['suppliers', companyId, filters],
        queryFn: () => supplierAPI.list(companyId, filters),
        staleTime: 2 * 60 * 1000,
        enabled: !!companyId,
    });
}

export function useSupplier(companyId: number, supplierId: number) {
    return useQuery({
        queryKey: ['suppliers', companyId, supplierId],
        queryFn: () => supplierAPI.get(companyId, supplierId),
        staleTime: 2 * 60 * 1000,
        enabled: !!companyId && !!supplierId,
    });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateSupplier(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateSupplierData) => supplierAPI.create(companyId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
            toast.success('Supplier created', `"${data.name}" has been added.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to create supplier', error.message);
        },
    });
}

export function useUpdateSupplier(companyId: number, supplierId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: UpdateSupplierData) => supplierAPI.update(companyId, supplierId, data),
        onSuccess: (updated) => {
            // Patch detail cache instantly
            queryClient.setQueryData(['suppliers', companyId, supplierId], updated);
            // Patch list cache in-place — no waiting for refetch
            queryClient.setQueryData<Supplier[]>(
                ['suppliers', companyId],
                (old) => old?.map(s => s.id === supplierId ? updated : s) ?? []
            );
            toast.success('Supplier updated', `"${updated.name}" has been saved.`);
        },
        onError: (error: Error) => {
            toast.error('Failed to update supplier', error.message);
        },
    });
}

export function useDeleteSupplier(companyId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (supplierId: number) => supplierAPI.delete(companyId, supplierId),
        onSuccess: (_, supplierId) => {
            queryClient.removeQueries({ queryKey: ['suppliers', companyId, supplierId] });
            queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
            toast.info('Supplier deleted');
        },
        onError: (error: Error) => {
            toast.error('Failed to delete supplier', error.message);
        },
    });
}