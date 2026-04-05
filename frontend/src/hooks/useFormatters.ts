"use client";

/**
 * useFormatters — returns number/date/currency formatter functions
 * bound to the current org's CompanySettings.
 *
 * Every consumer in the app should use these formatters (instead of
 * raw .toLocaleString / hand-rolling separators) so display formatting
 * stays consistent with org-level settings.
 *
 * @example
 *   const { formatCurrency, formatDate } = useFormatters();
 *   <td>{formatCurrency(order.total)}</td>
 *   <td>{formatDate(order.due_date)}</td>
 *
 * Safe defaults: when settings are still loading (or the org switch
 * failed), every formatter returns a sensible fallback string instead
 * of crashing.
 */

import { useMemo } from "react";

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  formatPrice,
  formatQuantity,
  formatTime,
  formatWeight,
} from "@/lib/formatters";
import { useCompanySettingsStore } from "@/stores/companySettings";
import { useOrgStore } from "@/stores/organization";

export function useFormatters() {
  const settings = useCompanySettingsStore((s) => s.settings);
  const baseCurrency = useOrgStore((s) => s.currentOrg?.base_currency ?? null);

  return useMemo(
    () => ({
      /** Plain number (e.g. row counts). */
      formatNumber: (
        value: number | string | null | undefined,
        opts?: { precision?: number; noGrouping?: boolean },
      ) => formatNumber(value, settings, opts),

      /** Monetary amount — defaults to the org's base_currency. */
      formatCurrency: (
        value: number | string | null | undefined,
        currencyCode?: string,
      ) => formatCurrency(value, currencyCode ?? baseCurrency, settings),

      /** Quantity (uses quantity_precision). */
      formatQuantity: (value: number | string | null | undefined) =>
        formatQuantity(value, settings),

      /** Unit price (uses price_precision). */
      formatPrice: (value: number | string | null | undefined) =>
        formatPrice(value, settings),

      /** Percentage value — appends "%". */
      formatPercentage: (value: number | string | null | undefined) =>
        formatPercentage(value, settings),

      /** Weight — appends the org's default_weight_uom. */
      formatWeight: (value: number | string | null | undefined) =>
        formatWeight(value, settings),

      /** Date only (per date_format). */
      formatDate: (value: Date | string | number | null | undefined) =>
        formatDate(value, settings),

      /** Time only (per time_format). */
      formatTime: (value: Date | string | number | null | undefined) =>
        formatTime(value, settings),

      /** Date + time joined. */
      formatDateTime: (value: Date | string | number | null | undefined) =>
        formatDateTime(value, settings),
    }),
    [settings, baseCurrency],
  );
}

export type Formatters = ReturnType<typeof useFormatters>;
