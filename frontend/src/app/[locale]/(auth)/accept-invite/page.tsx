"use client";

/**
 * Accept-invite landing page.
 *
 * Public route — the user clicks the link from their invitation
 * email and lands here. The page uses the public lookup endpoint to
 * resolve the token, then branches into one of four flows:
 *
 *   1. **Token invalid / not found** → error message + back to login
 *   2. **Already accepted / revoked / expired** → status message
 *   3. **Logged out** → "log in or register as <email> to accept" CTA
 *   4. **Logged in with the right email** → auto-accept + redirect into the org
 *   5. **Logged in with the wrong email** → "log out and try again" CTA
 *
 * After accepting, AuthGuard's `requires_onboarding` gate fires and
 * the user lands on the OnboardingRequired blocker for the org's
 * onboarding form.
 */

import { Loader2, LogIn, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useAcceptInvitation, useInvitationLookup } from "@/lib/accounts";
import { logout } from "@/services/auth";
import { selectOrganization } from "@/services/organization";
import { useAuthStore } from "@/stores/auth";

export default function AcceptInvitePage() {
  const t = useTranslations("accounts");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { user, isLoading: authLoading, fetchUser, clearUser } = useAuthStore();
  const lookupQuery = useInvitationLookup(token);
  const acceptMutation = useAcceptInvitation();

  const [autoAccepted, setAutoAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Auto-accept when the logged-in user's email matches the invitation.
  useEffect(() => {
    if (autoAccepted) return;
    if (authLoading || lookupQuery.isLoading) return;
    if (!user || !lookupQuery.data || !token) return;
    if (user.email.toLowerCase() !== lookupQuery.data.email.toLowerCase())
      return;
    if (lookupQuery.data.status !== "pending") return;

    setAutoAccepted(true);
    acceptMutation
      .mutateAsync(token)
      .then(async (result) => {
        await fetchUser();
        try {
          await selectOrganization(result.organization_id);
        } catch {
          // ignore — OrgGuard will pick the right org
        }
        router.replace("/dashboard");
      })
      .catch((err: unknown) => {
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail ?? "accept_failed";
        setAcceptError(t(`errors.${detail}`));
      });
  }, [
    user,
    authLoading,
    lookupQuery.data,
    lookupQuery.isLoading,
    token,
    acceptMutation,
    fetchUser,
    router,
    autoAccepted,
    t,
  ]);

  const handleLogoutAndRetry = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    clearUser();
    window.location.reload();
  };

  // ── Render branches ─────────────────────────────────────────────────────

  if (!token) {
    return (
      <Centered>
        <Heading>{t("acceptInvite.invalidTitle")}</Heading>
        <Body>{t("acceptInvite.missingToken")}</Body>
      </Centered>
    );
  }

  if (lookupQuery.isLoading || authLoading) {
    return (
      <Centered>
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </Centered>
    );
  }

  if (lookupQuery.error || !lookupQuery.data) {
    return (
      <Centered>
        <Heading>{t("acceptInvite.invalidTitle")}</Heading>
        <Body>{t("acceptInvite.notFound")}</Body>
        <CTA href="/login" icon={<LogIn size={14} />}>
          {t("acceptInvite.backToLogin")}
        </CTA>
      </Centered>
    );
  }

  const lookup = lookupQuery.data;

  if (lookup.status !== "pending") {
    return (
      <Centered>
        <Heading>{t(`acceptInvite.${lookup.status}Title`)}</Heading>
        <Body>{t(`acceptInvite.${lookup.status}Description`)}</Body>
        <CTA href="/login" icon={<LogIn size={14} />}>
          {t("acceptInvite.backToLogin")}
        </CTA>
      </Centered>
    );
  }

  // ── Logged out ──────────────────────────────────────────────────────────

  if (!user) {
    return (
      <Centered>
        <Heading>{t("acceptInvite.welcome", { org: lookup.org_name })}</Heading>
        <Body>
          {t("acceptInvite.loggedOutPrompt", { email: lookup.email })}
        </Body>
        <div className="mt-4 flex flex-col gap-2">
          <CTA
            href={`/login?email=${encodeURIComponent(lookup.email)}&invite=${token}`}
            icon={<LogIn size={14} />}
          >
            {t("acceptInvite.signIn")}
          </CTA>
          <CTA
            href={`/register?email=${encodeURIComponent(lookup.email)}&invite=${token}`}
            icon={<UserPlus size={14} />}
            variant="secondary"
          >
            {t("acceptInvite.createAccount")}
          </CTA>
        </div>
      </Centered>
    );
  }

  // ── Logged in with the wrong email ──────────────────────────────────────

  if (user.email.toLowerCase() !== lookup.email.toLowerCase()) {
    return (
      <Centered>
        <Heading>{t("acceptInvite.wrongAccountTitle")}</Heading>
        <Body>
          {t("acceptInvite.wrongAccountBody", {
            current: user.email,
            invited: lookup.email,
          })}
        </Body>
        <button
          type="button"
          onClick={handleLogoutAndRetry}
          className="mt-4 inline-flex items-center justify-center gap-2 border-2 border-white px-6 py-3 font-mono text-sm uppercase text-white"
        >
          <LogOut size={14} />
          {t("acceptInvite.logoutAndRetry")}
        </button>
      </Centered>
    );
  }

  // ── Logged in with the right email — auto-accepting ────────────────────

  if (acceptError) {
    return (
      <Centered>
        <Heading>{t("acceptInvite.acceptFailedTitle")}</Heading>
        <Body>{acceptError}</Body>
      </Centered>
    );
  }

  return (
    <Centered>
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <Body className="mt-4">{t("acceptInvite.accepting")}</Body>
    </Centered>
  );
}

// ── Layout primitives — match the brutalist auth-page style ────────────────

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        {children}
      </div>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-mono text-2xl font-bold uppercase tracking-tight text-white">
      {children}
    </h1>
  );
}

function Body({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-sm text-neutral-400 ${className}`}>
      {children}
    </p>
  );
}

function CTA({
  href,
  children,
  icon,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "border-2 border-white text-white"
      : "border-2 border-neutral-700 text-neutral-400";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm uppercase ${cls}`}
    >
      {icon}
      {children}
    </Link>
  );
}
