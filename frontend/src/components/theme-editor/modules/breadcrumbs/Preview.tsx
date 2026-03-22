"use client";

/**
 * Live breadcrumb preview — uses real HeroUI Breadcrumbs so CSS tokens
 * from breadcrumbs.css apply automatically via `.breadcrumbs` BEM classes.
 *
 * The separator icon and underline hover mode are still driven by the
 * theme store since those require runtime selection logic.
 */

import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight, Circle, Minus, Slash } from "lucide-react";
import { useTranslations } from "next-intl";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";

import { useThemeStore } from "@/stores/theme";

// ── Separator icon map ──────────────────────────────────────────────────────

export const SEPARATOR_ICONS: Record<string, LucideIcon> = {
  "chevron-right": ChevronRight,
  slash: Slash,
  dot: Circle,
  "arrow-right": ArrowRight,
  minus: Minus,
};

// ── Sample trails ───────────────────────────────────────────────────────────

const TRAIL = [
  { labelKey: "dashboard", isCurrent: false },
  { labelKey: "production", isCurrent: false },
  { labelKey: "orders", isCurrent: false },
  { labelKey: "ORD-00842", isCurrent: true, isRaw: true },
];

const SHORT_TRAIL = [
  { labelKey: "home", isCurrent: false },
  { labelKey: "settings", isCurrent: true },
];

// ── Component ───────────────────────────────────────────────────────────────

export function Preview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();

  const separatorIcon = tokens.breadcrumbsSeparatorIcon ?? "chevron-right";
  const separatorSize = Number.parseFloat(
    tokens.breadcrumbsSeparatorSize ?? "16",
  );
  const SepIcon = SEPARATOR_ICONS[separatorIcon] ?? ChevronRight;

  const separator = (
    <SepIcon size={separatorSize} className="text-vita-text-muted" />
  );

  function renderTrail(
    items: ReadonlyArray<{
      labelKey: string;
      isCurrent: boolean;
      isRaw?: boolean;
    }>,
  ) {
    return (
      <Breadcrumbs separator={separator}>
        {items.map((item) => {
          const label = item.isRaw
            ? item.labelKey
            : t(`preview.breadcrumbs.${item.labelKey}`);
          return (
            <BreadcrumbsItem
              key={item.labelKey}
              href={item.isCurrent ? undefined : "#"}
              className={
                item.labelKey.startsWith("ORD-") ? "font-vita-mono" : ""
              }
            >
              {label}
            </BreadcrumbsItem>
          );
        })}
      </Breadcrumbs>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.navigationTrail")}
        </p>
        {renderTrail(TRAIL)}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.shortTrail")}
        </p>
        {renderTrail(SHORT_TRAIL)}
      </div>

      {/* In context */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.inContext")}</p>
        <div
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
            borderRadius: "var(--vita-card-radius)",
            padding: "12px 16px",
          }}
        >
          {renderTrail(TRAIL)}
          <h1
            className="font-vita-heading"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--vita-text-primary)",
              marginTop: "8px",
            }}
          >
            {t("preview.breadcrumbs.orderLabel")}{" "}
            <span className="font-vita-mono">ORD-00842</span>
          </h1>
          <p style={{ fontSize: "13px", color: "var(--vita-text-muted)" }}>
            {t("preview.breadcrumbs.orderDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
