"use client";

/**
 * Live button preview — uses real HeroUI Button so hover/press animations
 * reflect the current theme tokens in real time.
 */

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const SEMANTIC_BUTTONS: { label: string; vars: React.CSSProperties }[] = [
  {
    label: "Danger",
    vars: {
      "--button-bg": "var(--vita-error)",
      "--button-fg": "var(--vita-text-on-danger)",
      "--button-bg-hover": "var(--vita-error-dark)",
    } as React.CSSProperties,
  },
  {
    label: "Success",
    vars: {
      "--button-bg": "var(--vita-success)",
      "--button-fg": "var(--vita-text-on-primary)",
      "--button-bg-hover": "var(--vita-success-dark)",
    } as React.CSSProperties,
  },
  {
    label: "Warning",
    vars: {
      "--button-bg": "var(--vita-warning)",
      "--button-fg": "var(--vita-text-on-warning)",
      "--button-bg-hover": "var(--vita-warning-dark)",
    } as React.CSSProperties,
  },
  {
    label: "Info",
    vars: {
      "--button-bg": "var(--vita-info)",
      "--button-fg": "var(--vita-text-on-primary)",
      "--button-bg-hover": "var(--vita-info-dark)",
    } as React.CSSProperties,
  },
];

export function Preview() {
  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
          Live preview
        </p>
        <p className="text-xs text-vita-text-muted">
          hover &amp; click to test
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Variants</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger-soft">Danger soft</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Semantic colors</p>
        <div className="flex flex-wrap gap-2">
          {SEMANTIC_BUTTONS.map(({ label, vars }) => (
            <Button key={label} variant="primary" style={vars}>
              {label}
            </Button>
          ))}
          <Button variant="danger">Danger solid</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Sizes &amp; states</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" isDisabled>
            Disabled
          </Button>
          <Button variant="outline">
            <Plus size={14} />
            With icon
          </Button>
        </div>
      </div>
    </div>
  );
}
