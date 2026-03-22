"use client";

/**
 * Live tabs preview — uses real HeroUI Tabs compound component
 * so CSS tokens from tabs.css apply automatically.
 */

import { useTranslations } from "next-intl";

import { Tabs } from "@/components/ui/tabs";

const TAB_ITEMS = [
  { id: "overview", labelKey: "overview", contentKey: "overviewContent" },
  { id: "production", labelKey: "production", contentKey: "productionContent" },
  { id: "quality", labelKey: "quality", contentKey: "qualityContent" },
  { id: "shipping", labelKey: "shipping", contentKey: "shippingContent" },
];

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <Tabs aria-label="ERP sections" defaultSelectedKey="overview">
        <Tabs.List>
          {TAB_ITEMS.map((item) => (
            <Tabs.Tab key={item.id} id={item.id}>
              {t(`preview.tabs.${item.labelKey}`)}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {TAB_ITEMS.map((item) => (
          <Tabs.Panel key={item.id} id={item.id}>
            <p className="text-sm leading-relaxed text-vita-text-secondary">
              {t(`preview.tabs.${item.contentKey}`)}
            </p>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
