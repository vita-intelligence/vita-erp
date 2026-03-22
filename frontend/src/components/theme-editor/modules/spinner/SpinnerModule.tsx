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
          label={`Small — ${sizeSmPx}px`}
          min={12}
          max={32}
          step={1}
          value={sizeSmPx}
          onChange={(v) => setTokens({ spinnerSizeSm: `${v}px` })}
          hint={["12px compact", "32px large"]}
          onReset={() => resetColor(["spinnerSizeSm"])}
        />

        <SliderRow
          label={`Medium — ${sizeMdPx}px`}
          min={20}
          max={48}
          step={1}
          value={sizeMdPx}
          onChange={(v) => setTokens({ spinnerSizeMd: `${v}px` })}
          hint={["20px compact", "48px large"]}
          onReset={() => resetColor(["spinnerSizeMd"])}
        />

        <SliderRow
          label={`Large — ${sizeLgPx}px`}
          min={32}
          max={72}
          step={1}
          value={sizeLgPx}
          onChange={(v) => setTokens({ spinnerSizeLg: `${v}px` })}
          hint={["32px compact", "72px large"]}
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
