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
          onClick={() => toast("Default toast message")}
        >
          Default
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.success("Operation completed")}
        >
          Success
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.warning("Check your settings")}
        >
          Warning
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.danger("Something went wrong")}
        >
          Danger
        </button>
        <button
          type="button"
          className="rounded-vita-sm border border-vita-neutral-200 px-3 py-1.5 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
          onClick={() => toast.info("New update available")}
        >
          Info
        </button>
      </div>
    </div>
  );
}
