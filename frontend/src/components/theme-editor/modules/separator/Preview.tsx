"use client";

/**
 * Live separator preview — uses real HeroUI Separator so CSS tokens
 * from separator.css apply automatically.
 */

import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      {/* Horizontal separators between content blocks */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-vita-text">
            {t("preview.separator.order0847")}
          </p>
          <p className="text-xs text-vita-text-muted">
            {t("preview.separator.order0847Desc")}
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-vita-text">
            {t("preview.separator.order0848")}
          </p>
          <p className="text-xs text-vita-text-muted">
            {t("preview.separator.order0848Desc")}
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-vita-text">
            {t("preview.separator.order0849")}
          </p>
          <p className="text-xs text-vita-text-muted">
            {t("preview.separator.order0849Desc")}
          </p>
        </div>
      </div>

      {/* Vertical separator between inline items */}
      <div
        style={{
          borderTop: "1px solid var(--vita-neutral-200)",
          paddingTop: "0.75rem",
        }}
      >
        <p className="mb-2 text-xs text-vita-text-muted">
          {t("preview.vertical")}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-vita-text">
            {t("preview.separator.qty")}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-vita-text">
            {t("preview.separator.sku")}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-vita-text">
            {t("preview.separator.lot")}
          </span>
        </div>
      </div>
    </div>
  );
}
