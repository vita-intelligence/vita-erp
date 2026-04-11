/**
 * React Query hooks for the billing API.
 *
 * Query keys are exported so any mutation can invalidate them without
 * importing the full hook module. Keep the keys in sync with the
 * endpoint paths for easy grep.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { billingApi } from "./api";

export const BILLING_KEYS = {
  subscription: ["billing", "subscription"] as const,
  usage: ["billing", "usage"] as const,
  breakdown: ["billing", "breakdown"] as const,
  invoices: ["billing", "invoices"] as const,
  addons: ["billing", "addons"] as const,
  checkoutSession: (id: string) => ["billing", "checkoutSession", id] as const,
};

export function useSubscription() {
  return useQuery({
    queryKey: BILLING_KEYS.subscription,
    queryFn: () => billingApi.getSubscription(),
  });
}

export function useUsage() {
  return useQuery({
    queryKey: BILLING_KEYS.usage,
    queryFn: () => billingApi.getUsage(),
  });
}

export function useBillingBreakdown() {
  return useQuery({
    queryKey: BILLING_KEYS.breakdown,
    queryFn: () => billingApi.getBreakdown(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: BILLING_KEYS.invoices,
    queryFn: () => billingApi.getInvoices(),
  });
}

export function useAddons() {
  return useQuery({
    queryKey: BILLING_KEYS.addons,
    queryFn: () => billingApi.getAddons(),
  });
}

export function useUpdateStorageQuota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quotaGb: number) => billingApi.updateStorageQuota(quotaGb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useToggleAddon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => billingApi.toggleAddon(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    },
  });
}

export function useCustomerPortalSession() {
  return useMutation({
    mutationFn: (returnUrl?: string) =>
      billingApi.createCustomerPortalSession(returnUrl),
  });
}

export function useCheckoutSession() {
  return useMutation({
    mutationFn: billingApi.createCheckoutSession,
  });
}

export function useCheckoutSessionStatus(
  sessionId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: sessionId
      ? BILLING_KEYS.checkoutSession(sessionId)
      : ["billing", "checkoutSession", "null"],
    queryFn: () =>
      sessionId
        ? billingApi.getCheckoutSessionStatus(sessionId)
        : Promise.resolve({ status: "pending" as const }),
    enabled: enabled && sessionId !== null,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 2s until backend says ready or failed.
      if (!data || data.status === "pending") return 2000;
      return false;
    },
  });
}
