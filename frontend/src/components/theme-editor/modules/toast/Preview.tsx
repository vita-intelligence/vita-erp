"use client";

import { useTranslations } from "next-intl";

import { toast } from "@/components/ui/toast";

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast(t("preview.toast.defaultMessage"))}
        >
          {t("preview.toast.default")}
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.success(t("preview.toast.successMessage"))}
        >
          {t("preview.toast.success")}
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.warning(t("preview.toast.warningMessage"))}
        >
          {t("preview.toast.warning")}
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.danger(t("preview.toast.dangerMessage"))}
        >
          {t("preview.toast.danger")}
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.info(t("preview.toast.infoMessage"))}
        >
          {t("preview.toast.info")}
        </button>
      </div>
    </div>
  );
}
