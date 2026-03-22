"use client";

/**
 * Live spinner preview — uses real HeroUI Spinner so CSS tokens
 * from spinner.css apply automatically.
 */

import { useTranslations } from "next-intl";

import { Spinner } from "@/components/ui/spinner";

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-vita-text-muted">
            {t("preview.spinner.small")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-vita-text-muted">
            {t("preview.spinner.medium")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-vita-text-muted">
            {t("preview.spinner.large")}
          </span>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--vita-neutral-200)",
          paddingTop: "0.75rem",
        }}
      >
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <span className="text-sm text-vita-text-muted">
            {t("preview.loading")}
          </span>
        </div>
      </div>
    </div>
  );
}
