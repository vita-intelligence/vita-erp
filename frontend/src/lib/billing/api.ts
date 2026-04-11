/**
 * Billing API client — thin wrapper around axios calls to the backend.
 *
 * All calls return the response payload directly. Errors bubble up as
 * axios errors — consumers catch them and pattern-match on
 * `error.response?.data?.detail` for machine-readable error codes.
 */

import { ENDPOINTS } from "@/config";
import api from "@/lib/api";
import type {
  AddOn,
  BillingBreakdown,
  CheckoutSessionResponse,
  CheckoutSessionStatus,
  CreateCheckoutPayload,
  Invoice,
  SubscriptionDetail,
  UsagePayload,
} from "./types";

export const billingApi = {
  async getSubscription(): Promise<SubscriptionDetail> {
    const { data } = await api.get<SubscriptionDetail>(
      ENDPOINTS.billing.subscription,
    );
    return data;
  },

  async getUsage(): Promise<UsagePayload> {
    const { data } = await api.get<UsagePayload>(ENDPOINTS.billing.usage);
    return data;
  },

  async getBreakdown(): Promise<BillingBreakdown> {
    const { data } = await api.get<BillingBreakdown>(
      ENDPOINTS.billing.breakdown,
    );
    return data;
  },

  async getInvoices(): Promise<{ data: Invoice[] }> {
    const { data } = await api.get<{ data: Invoice[] }>(
      ENDPOINTS.billing.invoices,
    );
    return data;
  },

  async updateStorageQuota(quotaGb: number): Promise<SubscriptionDetail> {
    const { data } = await api.patch<SubscriptionDetail>(
      ENDPOINTS.billing.storageQuota,
      { quota_gb: quotaGb },
    );
    return data;
  },

  async createCheckoutSession(
    payload: CreateCheckoutPayload,
  ): Promise<CheckoutSessionResponse> {
    const { data } = await api.post<CheckoutSessionResponse>(
      ENDPOINTS.billing.checkoutSession,
      payload,
    );
    return data;
  },

  async getCheckoutSessionStatus(
    sessionId: string,
  ): Promise<CheckoutSessionStatus> {
    const { data } = await api.get<CheckoutSessionStatus>(
      ENDPOINTS.billing.checkoutSessionStatus(sessionId),
    );
    return data;
  },

  async createCustomerPortalSession(
    returnUrl?: string,
  ): Promise<{ url: string }> {
    const { data } = await api.post<{ url: string }>(
      ENDPOINTS.billing.customerPortal,
      returnUrl ? { return_url: returnUrl } : {},
    );
    return data;
  },

  async getAddons(): Promise<{ data: AddOn[] }> {
    const { data } = await api.get<{ data: AddOn[] }>(ENDPOINTS.billing.addons);
    return data;
  },

  async toggleAddon(slug: string): Promise<{ status: "added" | "removed" }> {
    const { data } = await api.post<{ status: "added" | "removed" }>(
      ENDPOINTS.billing.addonToggle(slug),
    );
    return data;
  },
};
