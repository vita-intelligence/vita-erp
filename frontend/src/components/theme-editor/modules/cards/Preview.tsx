"use client";

/**
 * Live card preview — uses real HeroUI Card and Button so CSS tokens
 * from card.css and button.css apply automatically.
 *
 * When cursor-tracking is enabled, mouse movement over the card
 * dynamically adjusts its 3D rotation.
 */

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useThemeStore } from "@/stores/theme";

import { useCursorTrack } from "../_shared/useCursorTrack";

const PREVIEW_ROW_KEYS: ReadonlyArray<{
  labelKey: string;
  valueKey: string;
  mono?: boolean;
}> = [
  { labelKey: "product", valueKey: "productValue" },
  { labelKey: "quantity", valueKey: "quantityValue", mono: true },
  { labelKey: "status", valueKey: "statusValue" },
  { labelKey: "dueDate", valueKey: "dueDateValue", mono: true },
  { labelKey: "assignedTo", valueKey: "assignedToValue" },
];

export function Preview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();

  const trackIntensity = parseFloat(tokens.cardCursorTrack ?? "0");
  const trackRestore = parseFloat(tokens.cardCursorTrackRestore ?? "300");
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "card",
    trackIntensity,
    trackRestore,
  );

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        {t("preview.livePreview")}
        {trackIntensity > 0 && (
          <span className="ml-2 normal-case opacity-60">
            — {t("preview.moveCursor")}
          </span>
        )}
      </p>

      <Card
        onMouseMove={trackIntensity > 0 ? onMouseMove : undefined}
        onMouseLeave={trackIntensity > 0 ? onMouseLeave : undefined}
      >
        {/* Header */}
        <Card.Header className="flex-row items-center justify-between">
          <div>
            <Card.Title className="font-vita-heading text-sm">
              {t("preview.cards.productionOrder")}
            </Card.Title>
            <Card.Description className="font-vita-mono text-xs">
              {t("preview.cards.orderMeta")}
            </Card.Description>
          </div>
          <Chip
            style={{
              background: "var(--vita-warning-light)",
              color: "var(--vita-text-on-warning)",
              borderColor: "var(--vita-warning)",
            }}
          >
            {t("preview.cards.statusValue")}
          </Chip>
        </Card.Header>

        {/* Data rows */}
        <Card.Content className="px-4 py-0">
          {PREVIEW_ROW_KEYS.map(({ labelKey, valueKey, mono }) => (
            <div
              key={labelKey}
              className="flex items-center justify-between"
              style={{
                padding: "0.6rem 0",
                borderBottom: "1px solid var(--vita-neutral-100)",
              }}
            >
              <span className="text-xs text-vita-text-muted">
                {t(`preview.cards.${labelKey}`)}
              </span>
              <span
                className={`text-xs font-medium ${mono ? "font-vita-mono" : ""}`}
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t(`preview.cards.${valueKey}`)}
              </span>
            </div>
          ))}
        </Card.Content>

        {/* Footer actions */}
        <Card.Footer className="justify-end gap-2">
          <Button variant="outline" size="sm">
            {t("preview.cards.reject")}
          </Button>
          <Button variant="primary" size="sm">
            {t("preview.cards.approve")}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
