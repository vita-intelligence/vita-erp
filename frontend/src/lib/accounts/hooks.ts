/**
 * React Query hooks for the accounts/onboarding API.
 *
 * Mutations invalidate every key under `["accounts"]` so the
 * onboarding form, member list, and invitation lists all refresh
 * after a write — most flows mutate state in more than one place
 * (e.g., creating an invitation also bumps the pending list).
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { accountsApi } from "./api";
import type { CreateInvitationPayload } from "./types";

export const ACCOUNTS_KEYS = {
  onboardingForm: ["accounts", "onboardingForm"] as const,
  meOnboarding: ["accounts", "meOnboarding"] as const,
  invitations: ["accounts", "invitations"] as const,
  invitationLookup: (token: string) =>
    ["accounts", "invitationLookup", token] as const,
};

export function useOnboardingForm() {
  return useQuery({
    queryKey: ACCOUNTS_KEYS.onboardingForm,
    queryFn: () => accountsApi.getOnboardingForm(),
  });
}

export function useUpdateOnboardingForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      definition: Parameters<typeof accountsApi.updateOnboardingForm>[0],
    ) => accountsApi.updateOnboardingForm(definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useMyOnboarding() {
  return useQuery({
    queryKey: ACCOUNTS_KEYS.meOnboarding,
    queryFn: () => accountsApi.getMyOnboarding(),
  });
}

export function useSubmitOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountsApi.submitOnboarding,
    onSuccess: () => {
      // Refresh user (the AuthGuard reads requires_onboarding from /auth/me/),
      // re-fetch the form (the version may have advanced), and re-fetch
      // the cached me-onboarding (now contains updated responses).
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: ACCOUNTS_KEYS.invitations,
    queryFn: () => accountsApi.listInvitations(),
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvitationPayload) =>
      accountsApi.createInvitation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEYS.invitations });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      accountsApi.revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEYS.invitations });
    },
  });
}

export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      accountsApi.resendInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEYS.invitations });
    },
  });
}

/**
 * Public — used by the /accept-invite landing page before the user
 * is logged in.
 */
export function useInvitationLookup(token: string | null) {
  return useQuery({
    queryKey: token
      ? ACCOUNTS_KEYS.invitationLookup(token)
      : ["accounts", "invitationLookup", "null"],
    queryFn: () =>
      token
        ? accountsApi.lookupInvitation(token)
        : Promise.reject(new Error("missing_token")),
    enabled: token !== null,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => accountsApi.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
