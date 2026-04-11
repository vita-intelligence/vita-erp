"use client";

/**
 * Onboarding success page — landing zone after Stripe Checkout.
 *
 * The `session_id` query param is Stripe's checkout session ID. We poll
 * the backend status endpoint (which itself checks whether the webhook
 * has fired and the org has been created) and redirect to the dashboard
 * as soon as the org is ready. Usually this resolves within 1–2s.
 */

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCheckoutSessionStatus } from "@/lib/billing";
import { selectOrganization } from "@/services/organization";
import { useAuthStore } from "@/stores/auth";

export default function OnboardingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const sessionId = searchParams.get("session_id");

  const statusQuery = useCheckoutSessionStatus(sessionId, Boolean(sessionId));

  useEffect(() => {
    const data = statusQuery.data;
    if (!data) return;
    if (data.status === "ready") {
      (async () => {
        try {
          await fetchUser();
          await selectOrganization(data.org_id);
          router.replace("/dashboard");
        } catch {
          router.replace("/select-organization");
        }
      })();
    }
  }, [statusQuery.data, fetchUser, router]);

  const data = statusQuery.data;
  const isFailed = data?.status === "failed";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      {isFailed ? (
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <h1 className="font-mono text-2xl uppercase tracking-tight">
            Something went wrong
          </h1>
          <p className="font-mono text-sm text-neutral-400">
            We couldn&apos;t confirm your subscription. Please contact support
            or try again.
          </p>
          <button
            type="button"
            onClick={() => router.push("/create-organization")}
            className="mt-2 border-2 border-white px-6 py-3 font-mono text-sm uppercase"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin" />
          <h1 className="font-mono text-xl uppercase tracking-tight">
            Finalizing your organization
          </h1>
          <p className="max-w-sm text-center font-mono text-sm text-neutral-400">
            We&apos;re setting up your workspace. This usually takes a few
            seconds.
          </p>
        </div>
      )}
    </div>
  );
}
