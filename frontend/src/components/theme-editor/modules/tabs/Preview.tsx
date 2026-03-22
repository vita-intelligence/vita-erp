"use client";

/**
 * Live tabs preview — uses real HeroUI Tabs compound component
 * so CSS tokens from tabs.css apply automatically.
 */

import { Tabs } from "@/components/ui/tabs";

const TAB_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    content:
      "General dashboard showing key metrics, active orders, and alerts for the current production cycle.",
  },
  {
    id: "production",
    label: "Production",
    content:
      "Real-time production line status, throughput rates, and machine utilization across all facilities.",
  },
  {
    id: "quality",
    label: "Quality",
    content:
      "Quality assurance metrics including pass rates, defect tracking, and inspection schedules.",
  },
  {
    id: "shipping",
    label: "Shipping",
    content:
      "Outbound logistics overview with shipment tracking, carrier performance, and delivery estimates.",
  },
];

export function Preview() {
  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      <Tabs aria-label="ERP sections" defaultSelectedKey="overview">
        <Tabs.List>
          {TAB_ITEMS.map((item) => (
            <Tabs.Tab key={item.id} id={item.id}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {TAB_ITEMS.map((item) => (
          <Tabs.Panel key={item.id} id={item.id}>
            <p className="text-sm leading-relaxed text-vita-text-secondary">
              {item.content}
            </p>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
