"use client";

/**
 * Onboarding cancel page — landing zone when the user abandons Stripe
 * Checkout without completing payment. No org was created — the user
 * can retry or return to their existing orgs.
 */

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function OnboardingCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <XCircle className="h-10 w-10" />
        <h1 className="font-mono text-2xl uppercase tracking-tight">
          Checkout cancelled
        </h1>
        <p className="font-mono text-sm text-neutral-400">
          No charge was made. Your organization has not been created. You can
          try again whenever you&apos;re ready.
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <Link
            href="/create-organization"
            className="border-2 border-white px-6 py-3 font-mono text-sm uppercase"
          >
            Try again
          </Link>
          <Link
            href="/select-organization"
            className="border-2 border-neutral-700 px-6 py-3 font-mono text-sm uppercase text-neutral-400"
          >
            Back to my orgs
          </Link>
        </div>
      </div>
    </div>
  );
}
