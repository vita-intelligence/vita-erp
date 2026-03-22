"use client";

import { useTranslations } from "next-intl";

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
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function TabsModule() {
  const t = useTranslations("themeEditor");
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
        {t("modules.tabs.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Tab list ── */}
      <Section title={t("sections.tabList")}>
        <Row
          label={t("labels.radiusPreset")}
          onReset={() => resetColor(["tabsListRadius"])}
        >
          {LIST_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.tabsListRadius === p.value}
              onClick={() => setTokens({ tabsListRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.radius")} — ${listRadiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={listRadiusPx}
          onChange={(v) => setTokens({ tabsListRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `24px ${t("hints.rounded")}`]}
        />

        <SliderRow
          label={`${t("labels.padding")} — ${listPaddingPx}px`}
          min={0}
          max={12}
          step={1}
          value={listPaddingPx}
          onChange={(v) => setTokens({ tabsListPadding: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `12px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["tabsListPadding"])}
        />

        <SliderRow
          label={`${t("labels.gap")} — ${listGapPx}px`}
          min={0}
          max={8}
          step={1}
          value={listGapPx}
          onChange={(v) => setTokens({ tabsListGap: `${v}px` })}
          hint={[`0 ${t("hints.touching")}`, `8px ${t("hints.spaced")}`]}
          onReset={() => resetColor(["tabsListGap"])}
        />
      </Section>

      {/* ── Tab items ── */}
      <Section title={t("sections.tabItems")}>
        <SliderRow
          label={`${t("labels.radius")} — ${tabRadiusPx}px`}
          min={0}
          max={16}
          step={1}
          value={tabRadiusPx}
          onChange={(v) => setTokens({ tabsTabRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `16px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["tabsTabRadius"])}
        />

        <SliderRow
          label={`${t("labels.paddingX")} — ${tabPaddingXPx}px`}
          min={4}
          max={24}
          step={1}
          value={tabPaddingXPx}
          onChange={(v) => setTokens({ tabsTabPaddingX: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `24px ${t("hints.wide")}`]}
          onReset={() => resetColor(["tabsTabPaddingX"])}
        />

        <SliderRow
          label={`${t("labels.paddingY")} — ${tabPaddingYPx}px`}
          min={2}
          max={14}
          step={1}
          value={tabPaddingYPx}
          onChange={(v) => setTokens({ tabsTabPaddingY: `${v}px` })}
          hint={[`2px ${t("hints.tight")}`, `14px ${t("hints.tall")}`]}
          onReset={() => resetColor(["tabsTabPaddingY"])}
        />

        <SliderRow
          label={`${t("labels.fontSize")} — ${tabFontPx}px`}
          min={10}
          max={18}
          step={1}
          value={tabFontPx}
          onChange={(v) => setTokens({ tabsTabFontSize: `${v}px` })}
          hint={[`10px ${t("hints.small")}`, `18px ${t("hints.large")}`]}
          onReset={() => resetColor(["tabsTabFontSize"])}
        />

        <FontWeightRow
          tokenKey="tabsTabFontWeight"
          label={t("labels.weight")}
        />
      </Section>

      {/* ── Panel ── */}
      <Section title={t("sections.panel")}>
        <SliderRow
          label={`${t("labels.padding")} — ${panelPaddingPx}px`}
          min={0}
          max={24}
          step={1}
          value={panelPaddingPx}
          onChange={(v) => setTokens({ tabsPanelPadding: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `24px ${t("hints.spacious")}`]}
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
