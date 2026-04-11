/**
 * Onboarding + invitation API client.
 *
 * Most calls are plain JSON POST/GET — the interesting one is
 * `submitOnboarding`, which builds a multipart `FormData` body so
 * file fields ride alongside the JSON `responses` payload in a
 * single request. The convention for file parts is `file:<field_name>`
 * which the backend's `OnboardingMeView._extract_files` decodes back
 * into a `{field_name: File}` dict.
 *
 * Why multipart? It's the only way to upload binary files together
 * with the rest of the form responses in one atomic request. If the
 * user closes the tab before submitting, no file ever leaves their
 * browser — the orphan-file rule the user explicitly asked for.
 */

import { ENDPOINTS } from "@/config";
import api from "@/lib/api";
import type {
  CreateInvitationPayload,
  Invitation,
  InvitationLookup,
  OnboardingForm,
  OnboardingMePayload,
} from "./types";

interface SubmitOnboardingArgs {
  /** Plain JSON values for non-file fields. */
  responses: Record<string, unknown>;
  /** Files keyed by their form field name (e.g. `profile_photo`). */
  files: Record<string, File>;
}

export const accountsApi = {
  // ── Admin: form editor ──────────────────────────────────────────────────

  async getOnboardingForm(): Promise<OnboardingForm> {
    const { data } = await api.get<OnboardingForm>(
      ENDPOINTS.accounts.onboardingForm,
    );
    return data;
  },

  async updateOnboardingForm(
    definition: OnboardingForm["definition"],
  ): Promise<OnboardingForm> {
    const { data } = await api.put<OnboardingForm>(
      ENDPOINTS.accounts.onboardingForm,
      { definition },
    );
    return data;
  },

  // ── Member: self onboarding ─────────────────────────────────────────────

  async getMyOnboarding(): Promise<OnboardingMePayload> {
    const { data } = await api.get<OnboardingMePayload>(
      ENDPOINTS.accounts.meOnboarding,
    );
    return data;
  },

  /**
   * Submit the user's onboarding form.
   *
   * Builds a multipart body with one JSON part (`responses`) and one
   * binary part per uploaded file (`file:<field_name>`). The backend
   * service `submit_onboarding` will create `UserMediaAsset` rows for
   * each file, replace the matching keys in `responses` with media
   * references, and clean up any orphaned assets from the previous
   * submission in the same transaction.
   */
  async submitOnboarding(args: SubmitOnboardingArgs): Promise<unknown> {
    const formData = new FormData();
    formData.append("responses", JSON.stringify(args.responses));
    for (const [fieldName, file] of Object.entries(args.files)) {
      formData.append(`file:${fieldName}`, file);
    }
    const { data } = await api.post(ENDPOINTS.accounts.meOnboarding, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  // ── Media ───────────────────────────────────────────────────────────────

  /**
   * Build the URL for fetching an uploaded asset. The backend handles
   * permission checks and either streams the file directly (dev) or
   * redirects to a signed bucket URL (prod, future).
   */
  mediaUrl(assetId: string): string {
    return ENDPOINTS.accounts.media(assetId);
  },

  // ── Invitations ─────────────────────────────────────────────────────────

  async listInvitations(): Promise<{ data: Invitation[] }> {
    const { data } = await api.get<{ data: Invitation[] }>(
      ENDPOINTS.accounts.invitations,
    );
    return data;
  },

  async createInvitation(
    payload: CreateInvitationPayload,
  ): Promise<Invitation> {
    const { data } = await api.post<Invitation>(
      ENDPOINTS.accounts.invitations,
      payload,
    );
    return data;
  },

  async revokeInvitation(invitationId: string): Promise<void> {
    await api.delete(ENDPOINTS.accounts.invitation(invitationId));
  },

  async resendInvitation(invitationId: string): Promise<Invitation> {
    const { data } = await api.post<Invitation>(
      ENDPOINTS.accounts.invitationResend(invitationId),
    );
    return data;
  },

  /** Public — no auth required. Used by /accept-invite landing. */
  async lookupInvitation(token: string): Promise<InvitationLookup> {
    const { data } = await api.get<InvitationLookup>(
      ENDPOINTS.accounts.invitationLookup,
      { params: { token } },
    );
    return data;
  },

  async acceptInvitation(token: string): Promise<{
    status: string;
    organization_id: string;
    organization_slug: string;
  }> {
    const { data } = await api.post<{
      status: string;
      organization_id: string;
      organization_slug: string;
    }>(ENDPOINTS.accounts.invitationAccept, { token });
    return data;
  },
};
