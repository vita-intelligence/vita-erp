"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  Section,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Module ───────────────────────────────────────────────────────────────────

export function SpinnerModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const sizeSmPx = parseFloat(tokens.spinnerSizeSm ?? "20");
  const sizeMdPx = parseFloat(tokens.spinnerSizeMd ?? "32");
  const sizeLgPx = parseFloat(tokens.spinnerSizeLg ?? "48");
  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.spinner.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Sizes ── */}
      <Section title={t("sections.sizes")}>
        <SliderRow
          label={`${t("labels.small")} — ${sizeSmPx}px`}
          min={12}
          max={32}
          step={1}
          value={sizeSmPx}
          onChange={(v) => setTokens({ spinnerSizeSm: `${v}px` })}
          hint={[`12px ${t("hints.compact")}`, `32px ${t("hints.large")}`]}
          onReset={() => resetColor(["spinnerSizeSm"])}
        />

        <SliderRow
          label={`${t("labels.medium")} — ${sizeMdPx}px`}
          min={20}
          max={48}
          step={1}
          value={sizeMdPx}
          onChange={(v) => setTokens({ spinnerSizeMd: `${v}px` })}
          hint={[`20px ${t("hints.compact")}`, `48px ${t("hints.large")}`]}
          onReset={() => resetColor(["spinnerSizeMd"])}
        />

        <SliderRow
          label={`${t("labels.large")} — ${sizeLgPx}px`}
          min={32}
          max={72}
          step={1}
          value={sizeLgPx}
          onChange={(v) => setTokens({ spinnerSizeLg: `${v}px` })}
          hint={[`32px ${t("hints.compact")}`, `72px ${t("hints.large")}`]}
          onReset={() => resetColor(["spinnerSizeLg"])}
        />
      </Section>

      {/* ── 3D Transform — tilts the spin into perspective ── */}
      <Transform3DControls
        keys={{
          rotateX: "spinnerRotateX",
          rotateY: "spinnerRotateY",
          rotateZ: "spinnerRotateZ",
        }}
      />
    </div>
  );
}
