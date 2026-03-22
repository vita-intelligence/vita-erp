"use client";

/**
 * Live separator preview — uses real HeroUI Separator so CSS tokens
 * from separator.css apply automatically.
 */

import { Separator } from "@/components/ui/separator";

export function Preview() {
  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      {/* Horizontal separators between content blocks */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-vita-text">
            Order #WO-2024-0847
          </p>
          <p className="text-xs text-vita-text-muted">
            Created 15 Mar 2024 — Production line B
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-vita-text">
            Order #WO-2024-0848
          </p>
          <p className="text-xs text-vita-text-muted">
            Created 16 Mar 2024 — Production line A
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-vita-text">
            Order #WO-2024-0849
          </p>
          <p className="text-xs text-vita-text-muted">
            Created 16 Mar 2024 — Production line C
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
        <p className="mb-2 text-xs text-vita-text-muted">Vertical separator</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-vita-text">Qty: 500</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-vita-text">SKU: VE-1042</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-vita-text">Lot: B-7291</span>
        </div>
      </div>
    </div>
  );
}
