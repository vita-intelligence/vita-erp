"use client";

/**
 * MembersSettings — the new "Members" tab in settings.
 *
 * Three sections, all visible at once on desktop:
 *   1. Active members list (read-only for now; admin actions land in a follow-up)
 *   2. Pending invitations + the "Invite user" button → InviteUserModal
 *   3. Onboarding form editor — embeds the existing FormEditor scoped
 *      to the org's `OnboardingForm`. Saving triggers the backend
 *      signal that recomputes `requires_onboarding` for every member.
 *
 * Gated by `accounts:read` for viewing and `accounts:write` for the
 * write operations inside each section.
 */

import { Loader2, MailPlus, Trash2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { FormEditor } from "@/components/form-constructor/FormEditor/FormEditor";
import type { FormSchema } from "@/components/form-constructor/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useFormatters } from "@/hooks/useFormatters";
import { usePermission } from "@/hooks/usePermission";
import {
  useInvitations,
  useOnboardingForm,
  useResendInvitation,
  useRevokeInvitation,
  useUpdateOnboardingForm,
} from "@/lib/accounts";

import InviteUserModal from "./members/InviteUserModal";

export default function MembersSettings() {
  const t = useTranslations("accounts");
  const fmt = useFormatters();
  const canWrite = usePermission("accounts", "write");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [draftSchema, setDraftSchema] = useState<FormSchema | null>(null);

  const invitationsQuery = useInvitations();
  const formQuery = useOnboardingForm();
  const updateForm = useUpdateOnboardingForm();
  const revoke = useRevokeInvitation();
  const resend = useResendInvitation();

  const handleSaveForm = async () => {
    if (!draftSchema) return;
    await updateForm.mutateAsync(draftSchema);
    setDraftSchema(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Pending invitations ─────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-vita-text-primary">
              {t("members.invitationsTitle")}
            </h2>
            {canWrite && (
              <Button
                size="sm"
                variant="primary"
                onPress={() => setInviteOpen(true)}
              >
                <UserPlus size={14} className="mr-2" />
                {t("members.inviteButton")}
              </Button>
            )}
          </div>

          {invitationsQuery.isLoading ? (
            <Spinner />
          ) : invitationsQuery.data && invitationsQuery.data.data.length > 0 ? (
            <div
              className="overflow-hidden rounded border"
              style={{ borderColor: "var(--vita-neutral-200)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--vita-neutral-50)" }}>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("members.email")}
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("members.status")}
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("members.invitedAt")}
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      {t("members.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invitationsQuery.data.data.map((invitation) => (
                    <tr
                      key={invitation.id}
                      className="border-t"
                      style={{ borderColor: "var(--vita-neutral-200)" }}
                    >
                      <td className="px-3 py-2">{invitation.email}</td>
                      <td className="px-3 py-2 capitalize">
                        {t(`invitationStatus.${invitation.status}`)}
                      </td>
                      <td className="px-3 py-2">
                        {fmt.formatDate(invitation.created_at)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {canWrite && invitation.status === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onPress={() => resend.mutate(invitation.id)}
                              isDisabled={resend.isPending}
                            >
                              <MailPlus size={12} className="mr-1" />
                              {t("members.resend")}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onPress={() => revoke.mutate(invitation.id)}
                              isDisabled={revoke.isPending}
                            >
                              <Trash2 size={12} className="mr-1" />
                              {t("members.revoke")}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-vita-text-muted">
              {t("members.noInvitations")}
            </p>
          )}
        </div>
      </Card>

      {/* ── Onboarding form editor ──────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-vita-text-primary">
                {t("members.formEditorTitle")}
              </h2>
              <p className="text-xs text-vita-text-muted">
                {t("members.formEditorDescription")}
              </p>
            </div>
            {canWrite && (
              <div className="flex items-center gap-2">
                {draftSchema && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => setDraftSchema(null)}
                    isDisabled={updateForm.isPending}
                  >
                    {t("members.discard")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  isDisabled={
                    !canWrite || draftSchema === null || updateForm.isPending
                  }
                  onPress={handleSaveForm}
                >
                  {updateForm.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("members.saveForm")}
                </Button>
              </div>
            )}
          </div>

          {formQuery.isLoading ? (
            <Spinner />
          ) : formQuery.data ? (
            <FormEditor
              schema={draftSchema ?? formQuery.data.definition}
              onChange={canWrite ? (next) => setDraftSchema(next) : undefined}
            />
          ) : (
            <p className="text-sm text-vita-text-muted">
              {t("members.formLoadError")}
            </p>
          )}
        </div>
      </Card>

      <InviteUserModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={() => invitationsQuery.refetch()}
      />
    </div>
  );
}
