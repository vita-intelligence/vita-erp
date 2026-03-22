"use client";

/**
 * Live button group preview — uses real HeroUI ButtonGroup and Button
 * so CSS tokens from button-group.css and button.css apply automatically.
 */

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function Preview() {
  const t = useTranslations("themeEditor");

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      {/* View toggle */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          {t("preview.viewToggle")}
        </p>
        <div className="flex flex-wrap gap-2">
          <ButtonGroup>
            <Button variant="primary" size="sm">
              List
            </Button>
            <Button variant="outline" size="sm">
              Grid
            </Button>
            <Button variant="outline" size="sm">
              Table
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.actions")}</p>
        <div className="flex flex-wrap gap-2">
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button variant="outline" size="sm">
              Print
            </Button>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* In context */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">{t("preview.inContext")}</p>
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-vita-md p-3"
          style={{
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
          }}
        >
          <span
            className="font-vita-heading text-sm"
            style={{ fontWeight: 600, color: "var(--vita-text-primary)" }}
          >
            Orders
          </span>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              List
            </Button>
            <Button variant="primary" size="sm">
              Grid
            </Button>
            <Button variant="outline" size="sm">
              Table
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
