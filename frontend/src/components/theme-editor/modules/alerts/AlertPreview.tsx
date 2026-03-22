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

const ALERT_KEYS = [
  {
    status: "success",
    titleKey: "successTitle",
    descKey: "successDescription",
  },
  {
    status: "warning",
    titleKey: "warningTitle",
    descKey: "warningDescription",
  },
  { status: "danger", titleKey: "dangerTitle", descKey: "dangerDescription" },
  { status: "info", titleKey: "infoTitle", descKey: "infoDescription" },
] as const;

export function AlertPreview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        {t("preview.alertPreview")}
      </p>
      <div className="space-y-2">
        {ALERT_KEYS.map((a) => (
          <Alert key={a.status} status={STATUS_MAP[a.status]}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title className="font-vita-heading">
                {t(`preview.alerts.${a.titleKey}`)}
              </Alert.Title>
              <Alert.Description>
                {t(`preview.alerts.${a.descKey}`)}
              </Alert.Description>
            </Alert.Content>
          </Alert>
        ))}
      </div>
    </div>
  );
}
