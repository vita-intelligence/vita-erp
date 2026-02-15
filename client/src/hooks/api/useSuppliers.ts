import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    supplierAPI,
    supplierAddressAPI,
    Supplier,
    SupplierDetail,
    CreateSupplierData,
    UpdateSupplierData,
    CreateSupplierAddressData,
    UpdateSupplierAddressData,
    SupplierFilters,
} from '@/lib/api/suppliers';
import { useToast } from '../ui/useToast';

// ============================================================================
// SUPPLIERS
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
            // Invalidate list — lightweight Supplier type differs from SupplierDetail
            queryClient.invalidateQueries({ queryKey: ['suppliers', companyId] });
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

// ============================================================================
// SUPPLIER ADDRESSES
// ============================================================================

export function useCreateSupplierAddress(companyId: number, supplierId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateSupplierAddressData) =>
            supplierAddressAPI.create(companyId, supplierId, data),
        onSuccess: (newAddress) => {
            // Patch address into the cached supplier detail
            queryClient.setQueryData<SupplierDetail>(
                ['suppliers', companyId, supplierId],
                (old) => {
                    if (!old) return old;
                    // If new address is primary, demote others in cache too
                    const updated = newAddress.is_primary
                        ? old.addresses.map(a => ({ ...a, is_primary: false }))
                        : old.addresses;
                    return { ...old, addresses: [...updated, newAddress] };
                }
            );
            toast.success('Address added');
        },
        onError: (error: Error) => {
            toast.error('Failed to add address', error.message);
        },
    });
}

export function useUpdateSupplierAddress(companyId: number, supplierId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ addressId, data }: { addressId: number; data: UpdateSupplierAddressData }) =>
            supplierAddressAPI.update(companyId, supplierId, addressId, data),
        onSuccess: (updated) => {
            queryClient.setQueryData<SupplierDetail>(
                ['suppliers', companyId, supplierId],
                (old) => {
                    if (!old) return old;
                    // If updated address is now primary, demote others in cache
                    const addresses = old.addresses.map(a => {
                        if (a.id === updated.id) return updated;
                        if (updated.is_primary)  return { ...a, is_primary: false };
                        return a;
                    });
                    return { ...old, addresses };
                }
            );
            toast.success('Address updated');
        },
        onError: (error: Error) => {
            toast.error('Failed to update address', error.message);
        },
    });
}

export function useDeleteSupplierAddress(companyId: number, supplierId: number) {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (addressId: number) =>
            supplierAddressAPI.delete(companyId, supplierId, addressId),
        onSuccess: (_, addressId) => {
            queryClient.setQueryData<SupplierDetail>(
                ['suppliers', companyId, supplierId],
                (old) => old
                    ? { ...old, addresses: old.addresses.filter(a => a.id !== addressId) }
                    : old
            );
            toast.info('Address removed');
        },
        onError: (error: Error) => {
            toast.error('Failed to remove address', error.message);
        },
    });
}