"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Section,
  ShadowBuilder,
  SliderRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

export function ButtonGroupModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const gapPx = parseFloat(tokens.buttonGroupGap ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.buttonGroup.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`Gap — ${gapPx}px`}
          min={0}
          max={8}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ buttonGroupGap: `${v}px` })}
          hint={[`0 ${t("hints.connected")}`, `8px ${t("hints.separated")}`]}
          onReset={() => resetColor(["buttonGroupGap"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.containerBorder")}>
        <BorderControls
          keys={{
            top: "buttonGroupBorderTop",
            right: "buttonGroupBorderRight",
            bottom: "buttonGroupBorderBottom",
            left: "buttonGroupBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax={`3px ${t("hints.heavy")}`}
        />
        <BorderStyleRow tokenKey="buttonGroupBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.containerShadow")}>
        <ShadowBuilder
          value={tokens.buttonGroupShadow ?? "none"}
          onChange={(v) => setTokens({ buttonGroupShadow: v })}
          onReset={() => resetColor(["buttonGroupShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 10 }}
        />
      </Section>
    </div>
  );
}
