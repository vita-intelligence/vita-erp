/**
 * Onboarding + invitation domain types.
 *
 * Mirrors the DRF serializers in
 * `backend/apps/accounts/serializers/onboarding.py`. Field-level
 * structures (`FormSchema`) are imported from the existing form
 * constructor so the runtime renderer can be reused as-is.
 */

import type { FormSchema } from "@/components/form-constructor/types";

// ── Onboarding form (admin editor) ────────────────────────────────────────

export interface OnboardingForm {
  id: string;
  definition: FormSchema;
  version: number;
  is_active: boolean;
  updated_at: string;
}

// ── Onboarding "me" view ──────────────────────────────────────────────────

/**
 * Bundle returned by `GET /api/v1/accounts/me/onboarding/`. Includes
 * the form to render and the user's existing responses (if any).
 * Pre-population means the user only has to touch fields they haven't
 * answered yet — critical for the re-onboarding flow when an admin
 * adds a new required field after the user already completed v1.
 */
export interface OnboardingMePayload {
  form: OnboardingForm;
  responses: Record<string, unknown>;
  requires_onboarding: boolean;
  submitted_at: string | null;
}

// ── Media ─────────────────────────────────────────────────────────────────

/**
 * Stored response value for a file/image field after submission.
 * The frontend renderer treats anything matching this shape as a
 * media reference and shows a thumbnail / download link instead of
 * the empty file picker.
 */
export interface MediaReference {
  type: "media";
  asset_id: string;
}

export function isMediaReference(value: unknown): value is MediaReference {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "media" &&
    typeof (value as { asset_id?: unknown }).asset_id === "string"
  );
}

// ── Invitations ───────────────────────────────────────────────────────────

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invitation {
  id: string;
  email: string;
  status: InvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
  invited_by_email: string | null;
  organization_name: string;
  pre_assigned_role_id: string | null;
}

export interface InvitationLookup {
  email: string;
  org_name: string;
  status: InvitationStatus;
  pre_assigned_role_id: string | null;
}

export interface CreateInvitationPayload {
  email: string;
  pre_assigned_role_id?: string | null;
}
