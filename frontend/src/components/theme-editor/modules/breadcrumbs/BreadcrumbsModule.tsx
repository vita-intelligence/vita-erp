"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  SliderRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

const RADIUS_PRESETS = [
  { label: "None", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "Pill", value: "9999px" },
];

export function BreadcrumbsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const fontSizePx = parseFloat(tokens.breadcrumbsFontSize ?? "14");
  const gapPx = parseFloat(tokens.breadcrumbsGap ?? "8");
  const separatorPx = parseFloat(tokens.breadcrumbsSeparatorSize ?? "16");
  const separatorOpacity = parseFloat(
    tokens.breadcrumbsSeparatorOpacity ?? "0.5",
  );
  const itemPxX = parseFloat(tokens.breadcrumbsItemPaddingX ?? "0");
  const itemPxY = parseFloat(tokens.breadcrumbsItemPaddingY ?? "0");
  const itemRadiusPx = parseFloat(tokens.breadcrumbsItemRadius ?? "0");
  const itemBorderPx = parseFloat(tokens.breadcrumbsItemBorderWidth ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of breadcrumb navigation trails — from plain
        text links to tag/pill-style items with borders and backgrounds.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label={`Font size — ${fontSizePx}px`}
          min={11}
          max={18}
          step={1}
          value={fontSizePx}
          onChange={(v) => setTokens({ breadcrumbsFontSize: `${v}px` })}
          hint={["11px compact", "18px large"]}
          onReset={() => resetColor(["breadcrumbsFontSize"])}
        />
        <FontWeightRow tokenKey="breadcrumbsFontWeight" label="Link weight" />
        <FontWeightRow
          tokenKey="breadcrumbsActiveFontWeight"
          label="Active weight"
        />
        <Row
          label="Letter spacing"
          onReset={() => resetColor(["breadcrumbsLetterSpacing"])}
        >
          {[
            { label: "Default", value: "0em" },
            { label: "Wide", value: "0.04em" },
            { label: "Wider", value: "0.08em" },
            { label: "Widest", value: "0.14em" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsLetterSpacing === o.value}
              onClick={() => setTokens({ breadcrumbsLetterSpacing: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <Row
          label="Text case"
          onReset={() => resetColor(["breadcrumbsTextTransform"])}
        >
          {[
            { label: "Normal", value: "none" },
            { label: "UPPERCASE", value: "uppercase" },
            { label: "Capitalize", value: "capitalize" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsTextTransform === o.value}
              onClick={() => setTokens({ breadcrumbsTextTransform: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <Row
          label="Underline"
          onReset={() => resetColor(["breadcrumbsUnderline"])}
        >
          {[
            { label: "None", value: "none" },
            { label: "Hover", value: "hover" },
            { label: "Always", value: "underline" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsUnderline === o.value}
              onClick={() => setTokens({ breadcrumbsUnderline: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Item shape ── */}
      <Section title="Item shape">
        <SliderRow
          label={`Padding X — ${itemPxX}px`}
          min={0}
          max={16}
          step={1}
          value={itemPxX}
          onChange={(v) => setTokens({ breadcrumbsItemPaddingX: `${v}px` })}
          hint={["0 plain text", "16px tag-style"]}
          onReset={() => resetColor(["breadcrumbsItemPaddingX"])}
        />
        <SliderRow
          label={`Padding Y — ${itemPxY}px`}
          min={0}
          max={8}
          step={1}
          value={itemPxY}
          onChange={(v) => setTokens({ breadcrumbsItemPaddingY: `${v}px` })}
          hint={["0 inline", "8px padded"]}
          onReset={() => resetColor(["breadcrumbsItemPaddingY"])}
        />
        <SliderRow
          label={`Radius — ${itemRadiusPx}px`}
          min={0}
          max={20}
          step={1}
          value={Math.min(itemRadiusPx, 20)}
          onChange={(v) => setTokens({ breadcrumbsItemRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["breadcrumbsItemRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.breadcrumbsItemRadius === p.value}
              onClick={() => setTokens({ breadcrumbsItemRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Item border ── */}
      <Section title="Item border">
        <SliderRow
          label={`Width — ${itemBorderPx}px`}
          min={0}
          max={3}
          step={0.5}
          value={itemBorderPx}
          onChange={(v) => setTokens({ breadcrumbsItemBorderWidth: `${v}px` })}
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["breadcrumbsItemBorderWidth"])}
        />
        <BorderStyleRow tokenKey="breadcrumbsItemBorderStyle" />
      </Section>

      {/* ── Spacing ── */}
      <Section title="Spacing">
        <SliderRow
          label={`Gap — ${gapPx}px`}
          min={2}
          max={20}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ breadcrumbsGap: `${v}px` })}
          hint={["2px tight", "20px spacious"]}
          onReset={() => resetColor(["breadcrumbsGap"])}
        />
      </Section>

      {/* ── Separator ── */}
      <Section title="Separator">
        <Row
          label="Icon"
          onReset={() => resetColor(["breadcrumbsSeparatorIcon"])}
        >
          {[
            { label: "›", value: "chevron-right" },
            { label: "/", value: "slash" },
            { label: "•", value: "dot" },
            { label: "→", value: "arrow-right" },
            { label: "—", value: "minus" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={
                (tokens.breadcrumbsSeparatorIcon ?? "chevron-right") === o.value
              }
              onClick={() => setTokens({ breadcrumbsSeparatorIcon: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`Icon size — ${separatorPx}px`}
          min={10}
          max={24}
          step={1}
          value={separatorPx}
          onChange={(v) => setTokens({ breadcrumbsSeparatorSize: `${v}px` })}
          hint={["10px small", "24px large"]}
          onReset={() => resetColor(["breadcrumbsSeparatorSize"])}
        />
        <SliderRow
          label={`Opacity — ${Math.round(separatorOpacity * 100)}%`}
          min={0.1}
          max={1}
          step={0.05}
          value={separatorOpacity}
          onChange={(v) => setTokens({ breadcrumbsSeparatorOpacity: `${v}` })}
          hint={["10% faint", "100% full"]}
          onReset={() => resetColor(["breadcrumbsSeparatorOpacity"])}
        />
      </Section>
    </div>
  );
}
