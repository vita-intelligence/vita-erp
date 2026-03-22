"use client";

/**
 * Controls for alert dialog — shape, spacing, backdrop (color + blur), shadow.
 */

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import { Section, ShadowBuilder, SliderRow } from "../_shared";
import { GradientPicker } from "../colors/gradient-picker";

export function DialogControls() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();

  const radiusPx = parseFloat(tokens.alertDialogRadius ?? "0");
  const pxX = parseFloat(tokens.alertDialogPaddingX ?? "24");
  const pxY = parseFloat(tokens.alertDialogPaddingY ?? "20");
  const blurPx = parseFloat(tokens.alertDialogBackdropBlur ?? "0");
  const opacityPct = Math.round(
    parseFloat(tokens.alertDialogBackdropOpacity ?? "1") * 100,
  );

  return (
    <>
      <Section title={t("sections.dialogShape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ alertDialogRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
          onReset={() => resetColor(["alertDialogRadius"])}
        />
      </Section>

      <Section title={t("sections.dialogSpacing")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${pxX}px`}
          min={12}
          max={40}
          step={1}
          value={pxX}
          onChange={(v) => setTokens({ alertDialogPaddingX: `${v}px` })}
          hint={["12px tight", "40px spacious"]}
          onReset={() => resetColor(["alertDialogPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${pxY}px`}
          min={12}
          max={32}
          step={1}
          value={pxY}
          onChange={(v) => setTokens({ alertDialogPaddingY: `${v}px` })}
          hint={["12px compact", "32px spacious"]}
          onReset={() => resetColor(["alertDialogPaddingY"])}
        />
      </Section>

      <Section title={t("sections.backdrop")}>
        <GradientPicker
          tokenKey="alertDialogBackdropColor"
          label="Backdrop color"
          description="Overlay behind the dialog — use semi-transparent colors or gradients"
        />
        <SliderRow
          label={`${t("labels.opacity")} — ${opacityPct}%`}
          min={0}
          max={100}
          step={5}
          value={opacityPct}
          onChange={(v) =>
            setTokens({ alertDialogBackdropOpacity: (v / 100).toFixed(2) })
          }
          hint={["0% transparent", "100% full"]}
          onReset={() => resetColor(["alertDialogBackdropOpacity"])}
        />
        <SliderRow
          label={`${t("labels.blur")} — ${blurPx}px`}
          min={0}
          max={20}
          step={1}
          value={blurPx}
          onChange={(v) => setTokens({ alertDialogBackdropBlur: `${v}px` })}
          hint={["0 none", "20px glass"]}
          onReset={() => resetColor(["alertDialogBackdropBlur"])}
        />
      </Section>

      <Section title={t("sections.dialogShadow")}>
        <ShadowBuilder
          value={tokens.alertDialogShadow ?? "none"}
          onChange={(v) => setTokens({ alertDialogShadow: v })}
          onReset={() => resetColor(["alertDialogShadow"])}
          defaults={{ y: 10, blur: 25, opacity: 15 }}
        />
      </Section>
    </>
  );
}
