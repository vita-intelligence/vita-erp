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

const SEMANTIC_BUTTONS: { key: string; vars: React.CSSProperties }[] = [
  {
    key: "danger",
    vars: {
      "--button-bg": "var(--vita-error)",
      "--button-fg": "var(--vita-text-on-danger)",
      "--button-bg-hover": "var(--vita-error-dark)",
    } as React.CSSProperties,
  },
  {
    key: "success",
    vars: {
      "--button-bg": "var(--vita-success)",
      "--button-fg": "var(--vita-text-on-primary)",
      "--button-bg-hover": "var(--vita-success-dark)",
    } as React.CSSProperties,
  },
  {
    key: "warning",
    vars: {
      "--button-bg": "var(--vita-warning)",
      "--button-fg": "var(--vita-text-on-warning)",
      "--button-bg-hover": "var(--vita-warning-dark)",
    } as React.CSSProperties,
  },
  {
    key: "info",
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
            {t("preview.buttons.primary")}
          </Button>
          <Button variant="secondary" {...trackProps}>
            {t("preview.buttons.secondary")}
          </Button>
          <Button variant="outline" {...trackProps}>
            {t("preview.buttons.outline")}
          </Button>
          <Button variant="ghost" {...trackProps}>
            {t("preview.buttons.ghost")}
          </Button>
          <Button variant="tertiary" {...trackProps}>
            {t("preview.buttons.tertiary")}
          </Button>
          <Button variant="danger-soft" {...trackProps}>
            {t("preview.buttons.dangerSoft")}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.semanticColors")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SEMANTIC_BUTTONS.map(({ key, vars }) => (
            <Button key={key} variant="primary" style={vars} {...trackProps}>
              {t(`preview.buttons.${key}`)}
            </Button>
          ))}
          <Button variant="danger" {...trackProps}>
            {t("preview.buttons.dangerSolid")}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.sizesStates")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" {...trackProps}>
            {t("preview.buttons.small")}
          </Button>
          <Button variant="primary" size="md" {...trackProps}>
            {t("preview.buttons.medium")}
          </Button>
          <Button variant="primary" size="lg" {...trackProps}>
            {t("preview.buttons.large")}
          </Button>
          <Button variant="primary" isDisabled>
            {t("preview.buttons.disabled")}
          </Button>
          <Button variant="outline" {...trackProps}>
            <Plus size={14} />
            {t("preview.buttons.withIcon")}
          </Button>
        </div>
      </div>
    </div>
  );
}
