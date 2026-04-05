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
  },
} as const;
