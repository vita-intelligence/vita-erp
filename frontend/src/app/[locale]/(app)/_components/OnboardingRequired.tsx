"use client";

/**
 * OnboardingRequired — full-screen blocker shown when the user is
 * authenticated and verified but their active org's `Membership.requires_onboarding`
 * is True.
 *
 * The blocker fires for two scenarios:
 *
 *   1. **First-time onboarding**: a brand-new member who just accepted
 *      an invite. The form starts empty.
 *   2. **Re-onboarding**: an existing member whose admin added a new
 *      required field after they completed v1. The form is pre-filled
 *      with their previous answers and the user only has to touch the
 *      newly-required fields. The FormViewer's zod validator handles
 *      the highlighting.
 *
 * Both flows hit the same `OnboardingForm` wrapper which handles file
 * extraction + multipart submission + the orphan-file rule.
 *
 * After successful submission, the AuthGuard re-fetches `/auth/me/`
 * and the cached `requires_onboarding` flag flips to False, so this
 * blocker drops without a full page reload.
 */

import { Loader2, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Spinner } from "@/components/ui/spinner";
import { useMyOnboarding } from "@/lib/accounts";
import { logout } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";

import OnboardingForm from "./OnboardingForm";

export default function OnboardingRequired() {
  const t = useTranslations("accounts");
  const { fetchUser, clearUser } = useAuthStore();
  const onboardingQuery = useMyOnboarding();

  const handleSubmitted = async () => {
    // Re-fetch user so AuthGuard sees the new requires_onboarding=false
    // and renders the app instead of this blocker.
    await fetchUser();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* swallow — logout is best-effort */
    }
    clearUser();
    window.location.href = "/login";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{
        backgroundColor: "var(--vita-background)",
      }}
    >
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--vita-neutral-200)" }}
      >
        <h1 className="text-lg font-semibold text-vita-text-primary">
          {t("onboarding.title")}
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm text-vita-text-muted transition-colors hover:text-vita-text-primary"
        >
          <LogOut size={14} />
          {t("onboarding.logout")}
        </button>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <p className="mb-6 text-sm text-vita-text-muted">
          {t("onboarding.intro")}
        </p>

        {onboardingQuery.isLoading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner />
          </div>
        )}

        {onboardingQuery.error && (
          <div
            className="rounded border px-4 py-3 text-sm"
            style={{
              borderColor: "var(--vita-error)",
              color: "var(--vita-error)",
            }}
          >
            {t("onboarding.loadError")}
          </div>
        )}

        {onboardingQuery.data && (
          <OnboardingForm
            schema={onboardingQuery.data.form.definition}
            initialResponses={onboardingQuery.data.responses}
            onSubmitted={handleSubmitted}
          />
        )}

        {onboardingQuery.isFetching && !onboardingQuery.isLoading && (
          <div className="mt-4 flex items-center gap-2 text-xs text-vita-text-muted">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("onboarding.refreshing")}
          </div>
        )}
      </main>
    </div>
  );
}
