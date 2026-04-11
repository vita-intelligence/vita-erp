/**
 * Billing-specific display helpers.
 *
 * Money formatting is intentionally NOT in this file — every monetary
 * amount in the Billing tab renders via `useFormatters()` from
 * `@/hooks/useFormatters`, which reads the org's CompanySettings so
 * numbers respect the configured decimal separator, thousands
 * separator, currency symbol position, and negative-number style.
 * Do not add a `formatPence` helper here — importers should use
 * `fmt.formatCurrency(pence / 100, code)` via the settings-aware hook.
 */

/** Format bytes into a human-readable string, e.g. 5368709120 → "5.00 GB".
 *  Byte magnitudes are locale-agnostic (KB/MB/GB/TB are the canonical
 *  units in storage dialogs) so this one stays separator-insensitive. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/** Compute days remaining between now and a future ISO timestamp. Zero-floored. */
export function daysUntil(isoTimestamp: string | null): number {
  if (!isoTimestamp) return 0;
  const then = new Date(isoTimestamp).getTime();
  const now = Date.now();
  const diff = then - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
