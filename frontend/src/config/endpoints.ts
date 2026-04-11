/**
 * API endpoint registry — single source of truth for all backend paths.
 *
 * Every API call in the frontend must reference a path from this file.
 * Paths are relative to the API base URL configured in config/api.ts.
 */

export const ENDPOINTS = {
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    logout: "/auth/logout/",
    refresh: "/auth/refresh/",
    me: "/auth/me/",
    forgotPassword: "/auth/forgot-password/",
    resetPassword: "/auth/reset-password/",
    verifyEmail: "/auth/verify-email/",
    resendVerification: "/auth/resend-verification/",
    changePassword: "/auth/me/password/",
    changeEmail: "/auth/me/email/",
    sessions: "/auth/sessions/",
    session: (id: string) => `/auth/sessions/${id}/`,
  },

  organizations: {
    list: "/organizations/",
    create: "/organizations/",
    detail: (id: string) => `/organizations/${id}/`,
    select: (id: string) => `/organizations/${id}/select/`,
  },

  company: {
    settings: "/company/settings/",
    theme: "/company/theme/",
  },

  rbac: {
    mePermissions: "/rbac/me/permissions/",
    roles: "/rbac/roles/",
    role: (id: string) => `/rbac/roles/${id}/`,
    rolePermissions: (id: string) => `/rbac/roles/${id}/permissions/`,
    roleMembers: (id: string) => `/rbac/roles/${id}/members/`,
    roleMember: (roleId: string, userId: string) =>
      `/rbac/roles/${roleId}/members/${userId}/`,
    organogram: "/rbac/organogram/",
    orgMembers: "/rbac/org-members/",
  },

  billing: {
    subscription: "/billing/subscription/",
    usage: "/billing/usage/",
    breakdown: "/billing/breakdown/",
    invoices: "/billing/invoices/",
    storageQuota: "/billing/storage-quota/",
    checkoutSession: "/billing/checkout-session/",
    checkoutSessionStatus: (id: string) => `/billing/checkout-session/${id}/`,
    customerPortal: "/billing/customer-portal/",
    addons: "/billing/addons/",
    addonToggle: (slug: string) => `/billing/addons/${slug}/toggle/`,
  },
} as const;
