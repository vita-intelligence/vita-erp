"use client";

/**
 * Live card preview — uses real HeroUI Card and Button so CSS tokens
 * from card.css and button.css apply automatically.
 *
 * When cursor-tracking is enabled, mouse movement over the card
 * dynamically adjusts its 3D rotation.
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useThemeStore } from "@/stores/theme";

import { useCursorTrack } from "../_shared/useCursorTrack";

const PREVIEW_ROWS = [
  { label: "Product", value: "Steel Frame A-14" },
  { label: "Quantity", value: "3,891 units", mono: true },
  { label: "Status", value: "In Progress" },
  { label: "Due date", value: "Mar 28, 2026", mono: true },
  { label: "Assigned to", value: "Line 4 — Shift B" },
];

export function Preview() {
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
        Live preview
        {trackIntensity > 0 && (
          <span className="ml-2 normal-case opacity-60">
            — move cursor over card
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
              Production Order
            </Card.Title>
            <Card.Description className="font-vita-mono text-xs">
              #00842 · Created Mar 21, 2026
            </Card.Description>
          </div>
          <Chip
            style={{
              background: "var(--vita-warning-light)",
              color: "var(--vita-text-on-warning)",
              borderColor: "var(--vita-warning)",
            }}
          >
            In Progress
          </Chip>
        </Card.Header>

        {/* Data rows */}
        <Card.Content className="px-4 py-0">
          {PREVIEW_ROWS.map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex items-center justify-between"
              style={{
                padding: "0.6rem 0",
                borderBottom: "1px solid var(--vita-neutral-100)",
              }}
            >
              <span className="text-xs text-vita-text-muted">{label}</span>
              <span
                className={`text-xs font-medium ${mono ? "font-vita-mono" : ""}`}
                style={{ color: "var(--vita-text-primary)" }}
              >
                {value}
              </span>
            </div>
          ))}
        </Card.Content>

        {/* Footer actions */}
        <Card.Footer className="justify-end gap-2">
          <Button variant="outline" size="sm">
            Reject
          </Button>
          <Button variant="primary" size="sm">
            Approve
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
