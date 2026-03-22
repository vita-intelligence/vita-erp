"use client";

import { useThemeStore } from "@/stores/theme";

import {
  Chip,
  FontWeightRow,
  Hover3DControls,
  Row,
  Section,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const LIST_RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Soft", value: "6px" },
  { label: "Rounded", value: "12px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function TabsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const listRadiusPx = parseFloat(tokens.tabsListRadius ?? "12");
  const listPaddingPx = parseFloat(tokens.tabsListPadding ?? "4");
  const listGapPx = parseFloat(tokens.tabsListGap ?? "0");
  const tabRadiusPx = parseFloat(tokens.tabsTabRadius ?? "8");
  const tabPaddingXPx = parseFloat(tokens.tabsTabPaddingX ?? "12");
  const tabPaddingYPx = parseFloat(tokens.tabsTabPaddingY ?? "6");
  const tabFontPx = parseFloat(tokens.tabsTabFontSize ?? "14");
  const panelPaddingPx = parseFloat(tokens.tabsPanelPadding ?? "12");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the tab list, items, active indicator, and panel padding.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Tab list ── */}
      <Section title="Tab list">
        <Row
          label="Radius preset"
          onReset={() => resetColor(["tabsListRadius"])}
        >
          {LIST_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.tabsListRadius === p.value}
              onClick={() => setTokens({ tabsListRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Radius — ${listRadiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={listRadiusPx}
          onChange={(v) => setTokens({ tabsListRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
        />

        <SliderRow
          label={`Padding — ${listPaddingPx}px`}
          min={0}
          max={12}
          step={1}
          value={listPaddingPx}
          onChange={(v) => setTokens({ tabsListPadding: `${v}px` })}
          hint={["0 flush", "12px spacious"]}
          onReset={() => resetColor(["tabsListPadding"])}
        />

        <SliderRow
          label={`Gap — ${listGapPx}px`}
          min={0}
          max={8}
          step={1}
          value={listGapPx}
          onChange={(v) => setTokens({ tabsListGap: `${v}px` })}
          hint={["0 touching", "8px spaced"]}
          onReset={() => resetColor(["tabsListGap"])}
        />
      </Section>

      {/* ── Tab items ── */}
      <Section title="Tab items">
        <SliderRow
          label={`Radius — ${tabRadiusPx}px`}
          min={0}
          max={16}
          step={1}
          value={tabRadiusPx}
          onChange={(v) => setTokens({ tabsTabRadius: `${v}px` })}
          hint={["0 sharp", "16px rounded"]}
          onReset={() => resetColor(["tabsTabRadius"])}
        />

        <SliderRow
          label={`Padding X — ${tabPaddingXPx}px`}
          min={4}
          max={24}
          step={1}
          value={tabPaddingXPx}
          onChange={(v) => setTokens({ tabsTabPaddingX: `${v}px` })}
          hint={["4px tight", "24px wide"]}
          onReset={() => resetColor(["tabsTabPaddingX"])}
        />

        <SliderRow
          label={`Padding Y — ${tabPaddingYPx}px`}
          min={2}
          max={14}
          step={1}
          value={tabPaddingYPx}
          onChange={(v) => setTokens({ tabsTabPaddingY: `${v}px` })}
          hint={["2px tight", "14px tall"]}
          onReset={() => resetColor(["tabsTabPaddingY"])}
        />

        <SliderRow
          label={`Font size — ${tabFontPx}px`}
          min={10}
          max={18}
          step={1}
          value={tabFontPx}
          onChange={(v) => setTokens({ tabsTabFontSize: `${v}px` })}
          hint={["10px small", "18px large"]}
          onReset={() => resetColor(["tabsTabFontSize"])}
        />

        <FontWeightRow tokenKey="tabsTabFontWeight" label="Weight" />
      </Section>

      {/* ── Panel ── */}
      <Section title="Panel">
        <SliderRow
          label={`Padding — ${panelPaddingPx}px`}
          min={0}
          max={24}
          step={1}
          value={panelPaddingPx}
          onChange={(v) => setTokens({ tabsPanelPadding: `${v}px` })}
          hint={["0 flush", "24px spacious"]}
          onReset={() => resetColor(["tabsPanelPadding"])}
        />
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "tabsRotateX",
          rotateY: "tabsRotateY",
          rotateZ: "tabsRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "tabsHoverRotateX",
          hoverRotateY: "tabsHoverRotateY",
          hoverRotateZ: "tabsHoverRotateZ",
          hoverTranslateY: "tabsHoverTranslateY",
          hoverScale: "tabsHoverScale",
          transitionDuration: "tabsTransitionDuration",
        }}
      />
    </div>
  );
}
