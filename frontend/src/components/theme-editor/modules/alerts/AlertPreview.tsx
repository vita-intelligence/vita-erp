"use client";

/**
 * Live alert preview — uses real HeroUI Alert so CSS tokens
 * from alert.css apply automatically via `.alert` BEM classes.
 *
 * Status mappings: the data file uses "info" but HeroUI expects "accent"
 * for the informational variant. We map accordingly.
 */

import { useTranslations } from "next-intl";

import { Alert } from "@/components/ui/alert";

const STATUS_MAP: Record<string, "success" | "warning" | "danger" | "accent"> =
  {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "accent",
  };

const ALERTS = [
  {
    status: "success",
    title: "Order completed",
    description: "Production order #00842 has been fulfilled and shipped.",
  },
  {
    status: "warning",
    title: "Low stock alert",
    description: "Steel Frame A-14 inventory is below reorder threshold.",
  },
  {
    status: "danger",
    title: "Machine offline",
    description:
      "CNC Mill #3 reported a fault — maintenance has been notified.",
  },
  {
    status: "info",
    title: "Scheduled maintenance",
    description: "System will be unavailable Saturday 02:00–04:00 UTC.",
  },
] as const;

export function AlertPreview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        {t("preview.alertPreview")}
      </p>
      <div className="space-y-2">
        {ALERTS.map((a) => (
          <Alert key={a.status} status={STATUS_MAP[a.status]}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title className="font-vita-heading">{a.title}</Alert.Title>
              <Alert.Description>{a.description}</Alert.Description>
            </Alert.Content>
          </Alert>
        ))}
      </div>
    </div>
  );
}
