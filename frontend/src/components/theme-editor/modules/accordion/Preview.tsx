"use client";

/**
 * Live accordion preview — uses real HeroUI Accordion so CSS tokens
 * from accordion.css apply automatically via `.accordion` BEM classes.
 */

import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FAQ_ITEMS } from "./accordion-data";

export function Preview() {
  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        Live preview
      </p>

      <Accordion defaultExpandedKeys={[FAQ_ITEMS[0].id]}>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.id} id={item.id}>
            <AccordionHeading>
              <AccordionTrigger>
                {item.title}
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel>
              <AccordionBody>
                <p className="text-sm leading-relaxed text-vita-text-secondary">
                  {item.content}
                </p>
              </AccordionBody>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
