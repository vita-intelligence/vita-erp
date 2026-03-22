"use client";

/**
 * Live button preview — uses real HeroUI Button so hover/press animations
 * reflect the current theme tokens in real time.
 *
 * When cursor tracking is enabled, each button responds to mouse position.
 */

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme";

import { useCursorTrack } from "../_shared/useCursorTrack";

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
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();
  const trackIntensity = parseFloat(tokens.btnCursorTrack ?? "0");
  const trackRestore = parseFloat(tokens.btnCursorTrackRestore ?? "300");
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "btn",
    trackIntensity,
    trackRestore,
  );

  const trackProps = trackIntensity > 0 ? { onMouseMove, onMouseLeave } : {};

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
          {t("preview.livePreview")}
        </p>
        <p className="text-xs text-vita-text-muted">
          {t("preview.hoverToTest")}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.variants")}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" {...trackProps}>
            Primary
          </Button>
          <Button variant="secondary" {...trackProps}>
            Secondary
          </Button>
          <Button variant="outline" {...trackProps}>
            Outline
          </Button>
          <Button variant="ghost" {...trackProps}>
            Ghost
          </Button>
          <Button variant="tertiary" {...trackProps}>
            Tertiary
          </Button>
          <Button variant="danger-soft" {...trackProps}>
            Danger soft
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.semanticColors")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SEMANTIC_BUTTONS.map(({ label, vars }) => (
            <Button key={label} variant="primary" style={vars} {...trackProps}>
              {label}
            </Button>
          ))}
          <Button variant="danger" {...trackProps}>
            Danger solid
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.sizesStates")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" {...trackProps}>
            Small
          </Button>
          <Button variant="primary" size="md" {...trackProps}>
            Medium
          </Button>
          <Button variant="primary" size="lg" {...trackProps}>
            Large
          </Button>
          <Button variant="primary" isDisabled>
            Disabled
          </Button>
          <Button variant="outline" {...trackProps}>
            <Plus size={14} />
            With icon
          </Button>
        </div>
      </div>
    </div>
  );
}
