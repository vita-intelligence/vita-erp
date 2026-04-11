/**
 * Billing domain types — match the DRF serializers in `apps.billing.serializers.billing`.
 *
 * All monetary values are integer pence. Storage values in bytes unless
 * the field name ends `_gb`.
 */

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused"
  | "incomplete";

export type BillingCycle = "monthly" | "annual";

export interface SubscriptionDetail {
  id: string;
  status: SubscriptionStatus;
  billing_cycle: BillingCycle;
  storage_quota_gb: number;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_start: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string;
}

export interface UsagePayload {
  seats_used: number;
  storage_used_bytes: number;
  storage_quota_gb: number;
  storage_quota_bytes: number;
  storage_used_percent: number;
}

export interface UserCostLine {
  user_id: string;
  email: string;
  total_pence: number;
  permissions: Array<[string, string, number]>;
}

export interface BillingBreakdown {
  base_price_pence: number;
  user_cost_total_pence: number;
  storage_quota_gb: number;
  storage_minimum_gb: number;
  storage_price_per_gb_pence: number;
  storage_used_bytes: number;
  storage_cost_pence: number;
  grand_total_pence: number;
  currency: string;
  users: UserCostLine[];
}

export type AddOnBillingType = "recurring" | "one_time";

export interface AddOn {
  id: string;
  slug: string;
  name: string;
  description: string;
  module_code: string;
  billing_type: AddOnBillingType;
  price_pence: number;
  is_active: boolean;
  is_active_on_subscription: boolean;
}

export interface Invoice {
  id: string;
  number: string | null;
  status: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  period_start: number;
  period_end: number;
}

export interface CheckoutSessionResponse {
  url: string;
  session_id: string;
}

export type CheckoutSessionStatus =
  | { status: "pending" }
  | { status: "ready"; slug: string; org_id: string }
  | { status: "failed"; reason: string };

export interface CreateCheckoutPayload {
  name: string;
  slug: string;
  industry?: string;
  country?: string;
  timezone?: string;
  base_currency?: string;
}
