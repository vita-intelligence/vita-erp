"use client";

/**
 * Billing settings tab — shows the org's subscription, usage, cost
 * breakdown, and gives the user controls to raise storage, toggle
 * add-ons, view invoices, and manage payment method via the Stripe
 * Customer Portal.
 *
 * All display formatting (money, dates) goes through `useFormatters()`
 * which reads the active org's `CompanySettings` — so a Russian org with
 * `,` decimal separator and `.` thousands separator renders
 * "£12.345,67" while a UK org renders "£12,345.67" from the same
 * backend payload.
 *
 * Write operations invalidate the shared `["billing"]` query key so the
 * whole tab re-renders with fresh numbers.
 */

import {
  CreditCard,
  ExternalLink,
  HardDrive,
  Loader2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useFormatters } from "@/hooks/useFormatters";
import { usePermission } from "@/hooks/usePermission";
import type { SubscriptionDetail } from "@/lib/billing";
import {
  formatBytes,
  useAddons,
  useBillingBreakdown,
  useCustomerPortalSession,
  useInvoices,
  useSubscription,
  useToggleAddon,
  useUpdateStorageQuota,
  useUsage,
} from "@/lib/billing";

// ── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  label,
}: {
  status: SubscriptionDetail["status"];
  label: string;
}) {
  const tone: Record<SubscriptionDetail["status"], string> = {
    trialing: "var(--vita-info)",
    active: "var(--vita-success)",
    past_due: "var(--vita-warning)",
    canceled: "var(--vita-error)",
    unpaid: "var(--vita-error)",
    paused: "var(--vita-warning)",
    incomplete: "var(--vita-warning)",
  };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase"
      style={{
        backgroundColor: tone[status],
        color: "var(--vita-text-on-primary)",
      }}
    >
      {label}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  const danger = pct >= 90;
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: "var(--vita-neutral-200)" }}
    >
      <div
        className="h-full transition-all"
        style={{
          width: `${pct}%`,
          backgroundColor: danger ? "var(--vita-error)" : "var(--vita-primary)",
        }}
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function BillingSettings() {
  const t = useTranslations("billing");
  const canManage = usePermission("billing", "manage");
  const canWrite = usePermission("billing", "write");
  const fmt = useFormatters();

  // Small adapter: convert integer pence to a pounds-denominated display
  // string using CompanySettings rules (decimal/thousands separator,
  // digit grouping, symbol position, negative format). All billing
  // amounts cross the wire as pence; this is the single place the UI
  // does the /100 conversion.
  const fmtPence = (pence: number, currencyCode?: string) =>
    fmt.formatCurrency(pence / 100, currencyCode?.toUpperCase() ?? "GBP");

  const subscriptionQuery = useSubscription();
  const usageQuery = useUsage();
  const breakdownQuery = useBillingBreakdown();
  const invoicesQuery = useInvoices();
  const addonsQuery = useAddons();

  const updateQuota = useUpdateStorageQuota();
  const toggleAddon = useToggleAddon();
  const portalMutation = useCustomerPortalSession();

  const [quotaDraft, setQuotaDraft] = useState<number | null>(null);

  const isLoading =
    subscriptionQuery.isLoading ||
    usageQuery.isLoading ||
    breakdownQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const subscription = subscriptionQuery.data;
  const usage = usageQuery.data;
  const breakdown = breakdownQuery.data;

  if (!subscription || !usage || !breakdown) {
    return (
      <Card className="p-6">
        <p className="text-sm text-vita-text-muted">{t("noSubscription")}</p>
      </Card>
    );
  }

  const handleOpenPortal = async () => {
    const result = await portalMutation.mutateAsync(undefined);
    window.location.href = result.url;
  };

  const handleQuotaApply = () => {
    if (quotaDraft === null) return;
    updateQuota.mutate(quotaDraft, {
      onSuccess: () => setQuotaDraft(null),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Plan card ───────────────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-vita-text-muted" />
              <h2 className="text-lg font-semibold text-vita-text-primary">
                {t("plan.title")}
              </h2>
              <StatusBadge
                status={subscription.status}
                label={t(`subscriptionStatus.${subscription.status}`)}
              />
            </div>
            <p className="text-sm text-vita-text-muted">
              {t("plan.description")}
            </p>
            {subscription.status === "trialing" && subscription.trial_end && (
              <p className="text-xs text-vita-text-muted">
                {t("plan.trialEndsOn", {
                  date: fmt.formatDate(subscription.trial_end),
                })}
              </p>
            )}
            {subscription.current_period_end && (
              <p className="text-xs text-vita-text-muted">
                {t("plan.nextBillingOn", {
                  date: fmt.formatDate(subscription.current_period_end),
                })}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-3xl font-semibold text-vita-text-primary">
              {fmtPence(breakdown.grand_total_pence, breakdown.currency)}
            </span>
            <span className="text-xs text-vita-text-muted">
              {t("plan.perMonth")}
            </span>
          </div>
        </div>
        {canManage && (
          <div
            className="flex items-center justify-between border-t px-6 py-3"
            style={{ borderColor: "var(--vita-neutral-200)" }}
          >
            <span className="text-xs text-vita-text-muted">
              {t("plan.managedByStripe")}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onPress={handleOpenPortal}
              isDisabled={portalMutation.isPending}
            >
              {portalMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("plan.openPortal")}
              <ExternalLink size={14} className="ml-2" />
            </Button>
          </div>
        )}
      </Card>

      {/* ── Usage bars ───────────────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-5 p-6">
          <h2 className="text-lg font-semibold text-vita-text-primary">
            {t("usage.title")}
          </h2>

          {/* Seats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-vita-text-muted" />
                <span className="text-sm font-medium">{t("usage.seats")}</span>
              </div>
              <span className="text-sm text-vita-text-muted">
                {t("usage.seatsValue", { count: usage.seats_used })}
              </span>
            </div>
            <p className="text-xs text-vita-text-muted">
              {t("usage.seatsNote")}
            </p>
          </div>

          {/* Storage */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-vita-text-muted" />
                <span className="text-sm font-medium">
                  {t("usage.storage")}
                </span>
              </div>
              <span className="text-sm text-vita-text-muted">
                {formatBytes(usage.storage_used_bytes)} /{" "}
                {usage.storage_quota_gb} GB
              </span>
            </div>
            <ProgressBar
              value={usage.storage_used_bytes}
              max={usage.storage_quota_bytes}
            />
            {usage.storage_used_percent >= 90 && (
              <p
                className="text-xs font-medium"
                style={{ color: "var(--vita-warning)" }}
              >
                {t("usage.storageNearlyFull")}
              </p>
            )}

            {canWrite && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={breakdown.storage_minimum_gb}
                  step={1}
                  value={quotaDraft ?? subscription.storage_quota_gb}
                  onChange={(e) => setQuotaDraft(Number(e.target.value))}
                  className="w-24 rounded border px-2 py-1 text-sm"
                  style={{
                    borderColor: "var(--vita-neutral-200)",
                    backgroundColor: "var(--vita-background)",
                    color: "var(--vita-text-primary)",
                  }}
                />
                <span className="text-sm text-vita-text-muted">GB</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={handleQuotaApply}
                  isDisabled={
                    updateQuota.isPending ||
                    quotaDraft === null ||
                    quotaDraft === subscription.storage_quota_gb
                  }
                >
                  {updateQuota.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("usage.updateQuota")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Breakdown table ───────────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold text-vita-text-primary">
            {t("breakdown.title")}
          </h2>
          <div
            className="overflow-hidden rounded border"
            style={{ borderColor: "var(--vita-neutral-200)" }}
          >
            <table className="w-full text-sm">
              <tbody>
                <BreakdownRow
                  label={t("breakdown.base")}
                  value={fmtPence(
                    breakdown.base_price_pence,
                    breakdown.currency,
                  )}
                />
                <BreakdownRow
                  label={t("breakdown.users", {
                    count: breakdown.users.length,
                  })}
                  value={fmtPence(
                    breakdown.user_cost_total_pence,
                    breakdown.currency,
                  )}
                />
                <BreakdownRow
                  label={t("breakdown.storage", {
                    gb: breakdown.storage_quota_gb,
                    minimum: breakdown.storage_minimum_gb,
                  })}
                  value={fmtPence(
                    breakdown.storage_cost_pence,
                    breakdown.currency,
                  )}
                />
                <BreakdownRow
                  label={t("breakdown.total")}
                  value={fmtPence(
                    breakdown.grand_total_pence,
                    breakdown.currency,
                  )}
                  emphasis
                />
              </tbody>
            </table>
          </div>

          {breakdown.users.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium text-vita-text-primary">
                {t("breakdown.perUser")}
              </summary>
              <div
                className="mt-3 overflow-hidden rounded border"
                style={{ borderColor: "var(--vita-neutral-200)" }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: "var(--vita-neutral-50)" }}>
                      <th className="px-3 py-2 text-left font-semibold">
                        {t("breakdown.user")}
                      </th>
                      <th className="px-3 py-2 text-left font-semibold">
                        {t("breakdown.permissions")}
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        {t("breakdown.cost")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.users.map((user) => (
                      <tr
                        key={user.user_id}
                        className="border-t"
                        style={{ borderColor: "var(--vita-neutral-200)" }}
                      >
                        <td className="px-3 py-2 align-top">{user.email}</td>
                        <td className="px-3 py-2 align-top text-xs text-vita-text-muted">
                          {user.permissions.length === 0
                            ? t("breakdown.noPermissions")
                            : user.permissions
                                .map(
                                  ([mod, act, p]) =>
                                    `${mod}.${act} (${fmtPence(p, breakdown.currency)})`,
                                )
                                .join(", ")}
                        </td>
                        <td className="px-3 py-2 text-right align-top font-medium">
                          {fmtPence(user.total_pence, breakdown.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      </Card>

      {/* ── Add-ons ───────────────────────────────────────────────────── */}
      {addonsQuery.data && addonsQuery.data.data.length > 0 && (
        <Card>
          <div className="flex flex-col gap-4 p-6">
            <h2 className="text-lg font-semibold text-vita-text-primary">
              {t("addons.title")}
            </h2>
            <div className="flex flex-col gap-2">
              {addonsQuery.data.data.map((addon) => (
                <div
                  key={addon.slug}
                  className="flex items-center justify-between rounded border p-3"
                  style={{ borderColor: "var(--vita-neutral-200)" }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{addon.name}</span>
                    {addon.description && (
                      <span className="text-xs text-vita-text-muted">
                        {addon.description}
                      </span>
                    )}
                    <span className="text-xs text-vita-text-muted">
                      {fmtPence(addon.price_pence, breakdown.currency)}{" "}
                      {addon.billing_type === "recurring"
                        ? t("addons.perMonth")
                        : t("addons.oneTime")}
                    </span>
                  </div>
                  {canManage && (
                    <Button
                      size="sm"
                      variant={
                        addon.is_active_on_subscription ? "danger" : "primary"
                      }
                      onPress={() => toggleAddon.mutate(addon.slug)}
                      isDisabled={toggleAddon.isPending}
                    >
                      {addon.is_active_on_subscription
                        ? t("addons.remove")
                        : t("addons.add")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ── Invoice history ───────────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold text-vita-text-primary">
            {t("invoices.title")}
          </h2>
          {invoicesQuery.isLoading ? (
            <Spinner />
          ) : invoicesQuery.data && invoicesQuery.data.data.length > 0 ? (
            <div
              className="overflow-hidden rounded border"
              style={{ borderColor: "var(--vita-neutral-200)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--vita-neutral-50)" }}>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("invoices.number")}
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("invoices.date")}
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">
                      {t("invoices.status")}
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      {t("invoices.amount")}
                    </th>
                    <th className="px-3 py-2 text-right font-semibold">
                      {t("invoices.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesQuery.data.data.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-t"
                      style={{ borderColor: "var(--vita-neutral-200)" }}
                    >
                      <td className="px-3 py-2 font-mono text-xs">
                        {inv.number ?? inv.id}
                      </td>
                      <td className="px-3 py-2">
                        {fmt.formatDate(new Date(inv.created * 1000))}
                      </td>
                      <td className="px-3 py-2">
                        {(() => {
                          // Stripe invoice statuses are a fixed enum; we
                          // translate the known ones and fall back to the
                          // raw value for any forward-compat surprises.
                          try {
                            return t(`invoiceStatus.${inv.status}`);
                          } catch {
                            return inv.status;
                          }
                        })()}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {fmtPence(inv.amount_paid, inv.currency)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {inv.hosted_invoice_url && (
                          <a
                            href={inv.hosted_invoice_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs underline"
                            style={{ color: "var(--vita-primary)" }}
                          >
                            {t("invoices.view")}
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-vita-text-muted">
              {t("invoices.empty")}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <tr className="border-t" style={{ borderColor: "var(--vita-neutral-200)" }}>
      <td
        className={`px-4 py-3 ${emphasis ? "font-semibold" : ""}`}
        style={
          emphasis ? { backgroundColor: "var(--vita-neutral-50)" } : undefined
        }
      >
        {label}
      </td>
      <td
        className={`px-4 py-3 text-right font-mono ${emphasis ? "font-semibold" : ""}`}
        style={
          emphasis ? { backgroundColor: "var(--vita-neutral-50)" } : undefined
        }
      >
        {value}
      </td>
    </tr>
  );
}
