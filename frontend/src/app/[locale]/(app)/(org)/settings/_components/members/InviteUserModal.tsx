"use client";

/**
 * InviteUserModal — shared invite UI used by both the Members tab in
 * settings and the Organogram MemberList "Invite new user" button.
 *
 * If the modal was opened from inside a role's member panel, the
 * caller passes `preAssignedRoleId` so the role gets auto-attached
 * after the invitee accepts and finishes onboarding. Otherwise the
 * invite is org-wide and the new user joins with no roles.
 *
 * Errors come back as machine-readable codes (`email_invalid`,
 * `already_member`, `pending_exists`) that we look up in the
 * `accounts.errors.*` i18n namespace.
 */

import { Loader2, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
} from "@/components/ui/modal";
import { useCreateInvitation } from "@/lib/accounts";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional role to pre-attach after the invite is accepted. */
  preAssignedRoleId?: string | null;
  /** Optional callback after a successful invite (e.g. refresh a list). */
  onInvited?: () => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  preAssignedRoleId,
  onInvited,
}: InviteUserModalProps) {
  const t = useTranslations("accounts");
  const createInvite = useCreateInvitation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setEmail("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createInvite.mutateAsync({
        email: email.trim(),
        pre_assigned_role_id: preAssignedRoleId ?? null,
      });
      setSuccess(true);
      setEmail("");
      onInvited?.();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "create_failed";
      setError(t(`errors.${detail}`));
    }
  };

  return (
    <ModalBackdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      isDismissable
      style={{ padding: 16 }}
    >
      <ModalContainer>
        <ModalDialog
          aria-label={t("invite.title")}
          style={{
            width: "min(440px, 96vw)",
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
            borderRadius: "var(--vita-modal-radius, 12px)",
            padding: 24,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("invite.title")}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              style={{
                color: "var(--vita-text-muted)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <p
            className="mb-4 text-sm"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {preAssignedRoleId
              ? t("invite.descriptionWithRole")
              : t("invite.description")}
          </p>

          {success ? (
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-2 rounded border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--vita-success)",
                  color: "var(--vita-success)",
                }}
              >
                <Mail size={14} />
                {t("invite.successMessage")}
              </div>
              <Button variant="ghost" size="sm" onPress={handleClose}>
                {t("invite.close")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="invite-email-input"
                className="text-xs font-medium"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {t("invite.emailLabel")}
              </label>
              <input
                id="invite-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("invite.emailPlaceholder")}
                required
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--vita-neutral-200)",
                  background: "var(--vita-background)",
                  color: "var(--vita-text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
              />

              {error && (
                <p
                  className="text-xs font-medium"
                  style={{ color: "var(--vita-error)" }}
                >
                  {error}
                </p>
              )}

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onPress={handleClose}
                  isDisabled={createInvite.isPending}
                >
                  {t("invite.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isDisabled={createInvite.isPending || email.trim() === ""}
                >
                  {createInvite.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("invite.send")}
                </Button>
              </div>
            </form>
          )}
        </ModalDialog>
      </ModalContainer>
    </ModalBackdrop>
  );
}
