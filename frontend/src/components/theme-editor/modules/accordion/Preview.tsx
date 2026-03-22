"use client";

/**
 * Live accordion preview — uses real HeroUI Accordion so CSS tokens
 * from accordion.css apply automatically via `.accordion` BEM classes.
 */

import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = [
  {
    id: "production",
    titleKey: "productionTitle",
    contentKey: "productionContent",
  },
  {
    id: "inventory",
    titleKey: "inventoryTitle",
    contentKey: "inventoryContent",
  },
  { id: "export", titleKey: "exportTitle", contentKey: "exportContent" },
  { id: "roles", titleKey: "rolesTitle", contentKey: "rolesContent" },
] as const;

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <Accordion defaultExpandedKeys={[FAQ_KEYS[0].id]}>
        {FAQ_KEYS.map((item) => (
          <AccordionItem key={item.id} id={item.id}>
            <AccordionHeading>
              <AccordionTrigger>
                {t(`preview.accordion.${item.titleKey}`)}
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody>
                <p className="text-sm leading-relaxed text-vita-text-secondary">
                  {t(`preview.accordion.${item.contentKey}`)}
                </p>
              </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
