"use client";

import { RotateCcw } from "lucide-react";
import { useThemeStore } from "@/stores/theme";

export function SpacingModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const pct = Math.round((parseFloat(tokens.spacing) / 0.25) * 100);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Scales all padding, gaps, and margins across the entire interface.
        Changes are visible in real time — try dragging this window over your
        page to compare.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
            Density
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-vita-neutral-600">
              {pct}%
            </span>
            <button
              type="button"
              title="Reset"
              className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
              onClick={() => resetColor(["spacing"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={0.2}
          max={0.35}
          step={0.005}
          value={parseFloat(tokens.spacing)}
          className="w-full accent-vita-primary"
          onChange={(e) => setTokens({ spacing: `${e.target.value}rem` })}
        />
        <div className="flex justify-between text-xs text-vita-neutral-400">
          <span>Compact — 80%</span>
          <span>Default — 100%</span>
          <span>Comfortable — 140%</span>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
          Preview
        </p>
        <div className="rounded-vita-lg border border-vita-neutral-200 bg-vita-surface overflow-hidden">
          <div className="border-b border-vita-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-vita-neutral-800">
              Production Order #00842
            </p>
          </div>
          <div className="divide-y divide-vita-neutral-100">
            {[
              { label: "Product", value: "Steel Frame A-14" },
              { label: "Quantity", value: "3,891 units" },
              { label: "Status", value: "In Progress" },
              { label: "Due date", value: "Mar 28, 2026" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-2"
              >
                <span className="text-xs text-vita-neutral-500">{label}</span>
                <span className="text-xs font-medium text-vita-neutral-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-vita-neutral-400">
          This card uses Tailwind spacing utilities — drag the slider to see all
          padding and gaps scale in real time.
        </p>
      </div>
    </div>
  );
}
