"use client";

/**
 * Live skeleton preview — uses real HeroUI Skeleton so CSS tokens
 * from skeleton.css apply automatically.
 */

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="flex gap-4">
        {/* Avatar skeleton */}
        <Skeleton
          className="h-12 w-12 shrink-0"
          style={{ borderRadius: "9999px" }}
        />

        {/* Text block skeletons */}
        <div className="flex flex-1 flex-col gap-2.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>

      {/* Full-width content skeleton */}
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
