// Standard API response envelope
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Standard API error shape from Django REST Framework
export type ApiError = {
  detail?: string;
  [field: string]: string | string[] | undefined;
};

// Organization types
export type OrgStatus = "trial" | "active" | "suspended" | "deactivated";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  status: OrgStatus;
  industry: string;
  country: string;
  /** Membership row id for the current user in this org. */
  membership_id?: string;
  /**
   * Cached gate read by AuthGuard. True when the user is missing
   * at least one currently-required onboarding field for this org.
   */
  requires_onboarding?: boolean;
  /** Diagnostic timestamp of the user's first successful onboarding submission. */
  onboarding_completed_at?: string | null;
};

export type OrganizationDetail = OrganizationSummary & {
  timezone: string;
  base_currency: string;
  created_at: string;
  trial_days_remaining: number | null;
};
