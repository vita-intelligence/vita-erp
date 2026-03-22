"use client";

/**
 * Live spinner preview — uses real HeroUI Spinner so CSS tokens
 * from spinner.css apply automatically.
 */

import { Spinner } from "@/components/ui/spinner";

export function Preview() {
  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-vita-text-muted">Small</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-vita-text-muted">Medium</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-vita-text-muted">Large</span>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--vita-neutral-200)",
          paddingTop: "0.75rem",
        }}
      >
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <span className="text-sm text-vita-text-muted">
            Loading production data...
          </span>
        </div>
      </div>
    </div>
  );
}
