"use client";

/**
 * Live preview of how the current form values render numbers, dates,
 * and currency. Subscribes to the form via `useWatch` so the samples
 * update instantly as the user edits any formatting-related field —
 * no save required.
 *
 * Demonstrates the full lib/formatters.ts integration: the same
 * functions that drive app-wide formatting via useFormatters() are
 * used here with form-state values instead of store values.
 */

import { useTranslations } from "next-intl";
import { type Control, useWatch } from "react-hook-form";

import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
  formatPrice,
  formatQuantity,
  formatTime,
  formatWeight,
} from "@/lib/formatters";
import { useOrgStore } from "@/stores/organization";

import type {
  CompanySettings,
  CompanySettingsResponse,
} from "../_types/company-settings";

type Props = {
  control: Control<CompanySettings>;
};

const SAMPLE_NUMBER = 1234567.89;
const SAMPLE_CURRENCY = 12400.5;
const SAMPLE_QUANTITY = 3891.5;
const SAMPLE_PRICE = 19.99;
const SAMPLE_PERCENTAGE = 12.5;
const SAMPLE_WEIGHT = 25.5;

export function FormatPreview({ control }: Props) {
  const t = useTranslations("companySettings.preview");
  const values = useWatch({ control });
  const baseCurrency = useOrgStore((s) => s.currentOrg?.base_currency ?? "USD");
  const now = new Date();

  // The formatters expect a CompanySettingsResponse — useWatch returns
  // a Partial<CompanySettings>. Missing fields fall through to safe
  // defaults inside the formatters.
  const settings = values as CompanySettingsResponse;

  const rows: { key: string; label: string; value: string }[] = [
    {
      key: "number",
      label: t("number"),
      value: formatNumber(SAMPLE_NUMBER, settings),
    },
    {
      key: "currency",
      label: t("currency"),
      value: formatCurrency(SAMPLE_CURRENCY, baseCurrency, settings),
    },
    {
      key: "quantity",
      label: t("quantity"),
      value: formatQuantity(SAMPLE_QUANTITY, settings),
    },
    {
      key: "price",
      label: t("price"),
      value: formatPrice(SAMPLE_PRICE, settings),
    },
    {
      key: "percentage",
      label: t("percentage"),
      value: formatPercentage(SAMPLE_PERCENTAGE, settings),
    },
    {
      key: "weight",
      label: t("weight"),
      value: formatWeight(SAMPLE_WEIGHT, settings),
    },
    { key: "date", label: t("date"), value: formatDate(now, settings) },
    { key: "time", label: t("time"), value: formatTime(now, settings) },
  ];

  return (
    <section
      className="mb-6 rounded-vita-md border p-4"
      style={{
        borderColor: "var(--vita-neutral-200)",
        backgroundColor: "var(--vita-neutral-50)",
      }}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("title")}
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4">
        {rows.map((row) => (
          <div key={row.key} className="min-w-0">
            <dt className="text-xs text-vita-text-muted">{row.label}</dt>
            <dd className="truncate text-sm font-medium font-vita-mono text-vita-text-primary">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
