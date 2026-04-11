"use client";

/**
 * Billing banner — shown at the top of every app page when the org is
 * in a trial or problem state. Trial banner counts down days, past-due
 * prompts the user to retry payment via the Stripe Customer Portal.
 *
 * Silent when `status=active`. Renders above the main app content via
 * the `(app)` layout.
 */

import { AlertTriangle, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCustomerPortalSession, useSubscription } from "@/lib/billing";
import { daysUntil } from "@/lib/billing/format";

export function BillingBanner() {
  const t = useTranslations("billing.banner");
  const { data: subscription } = useSubscription();
  const portalMutation = useCustomerPortalSession();

  if (!subscription) return null;

  const openPortal = async () => {
    const result = await portalMutation.mutateAsync(undefined);
    window.location.href = result.url;
  };

  if (subscription.status === "trialing" && subscription.trial_end) {
    const days = daysUntil(subscription.trial_end);
    if (days > 7) return null; // quiet until last week
    return (
      <div
        className="flex items-center justify-between gap-4 px-6 py-2 text-sm"
        style={{
          backgroundColor: "var(--vita-info)",
          color: "var(--vita-text-on-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{t("trial", { days })}</span>
        </div>
      </div>
    );
  }

  if (subscription.status === "past_due") {
    return (
      <div
        className="flex items-center justify-between gap-4 px-6 py-2 text-sm"
        style={{
          backgroundColor: "var(--vita-warning)",
          color: "var(--vita-text-on-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{t("pastDue")}</span>
        </div>
        <button
          type="button"
          onClick={openPortal}
          className="rounded px-3 py-1 text-xs font-semibold underline"
        >
          {t("updatePayment")}
        </button>
      </div>
    );
  }

  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    return (
      <div
        className="flex items-center justify-between gap-4 px-6 py-2 text-sm"
        style={{
          backgroundColor: "var(--vita-error)",
          color: "var(--vita-text-on-primary)",
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{t("locked")}</span>
        </div>
        <button
          type="button"
          onClick={openPortal}
          className="rounded px-3 py-1 text-xs font-semibold underline"
        >
          {t("reactivate")}
        </button>
      </div>
    );
  }

  return null;
}
