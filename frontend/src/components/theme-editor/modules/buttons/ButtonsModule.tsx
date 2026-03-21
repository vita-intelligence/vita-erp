"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  TransitionRow,
  usePreviewExternal,
} from "../_shared";
import {
  computeHoverVars,
  type HoverParams,
  type HoverType,
  type TiltDir,
} from "./hover";
import { Preview } from "./Preview";

// ── Module ────────────────────────────────────────────────────────────────────

export function ButtonsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();
  const radiusPx = parseFloat(tokens.btnRadius);
  const pressScale = parseFloat(tokens.btnPressScale ?? "0.97");

  // ── Hover state ──────────────────────────────────────────────────────────
  const [hoverType, setHoverType] = useState<HoverType>("none");
  const [liftPx, setLiftPx] = useState(2);
  const [sinkPx, setSinkPx] = useState(2);
  const [scaleFactor, setScaleFactor] = useState(1.03);
  const [tiltDeg, setTiltDeg] = useState(3);
  const [tiltDir, setTiltDir] = useState<TiltDir>("right");
  const [glowBlur, setGlowBlur] = useState(8);
  const [glowOpacity, setGlowOpacity] = useState(60);
  const [brightnessVal, setBrightnessVal] = useState(1.1);

  function applyHover(type: HoverType, overrides?: Partial<HoverParams>) {
    const vars = computeHoverVars(type, {
      liftPx,
      sinkPx,
      scaleFactor,
      tiltDeg,
      tiltDir,
      glowBlur,
      glowOpacity,
      brightnessVal,
      ...overrides,
    });
    setTokens({
      btnHoverTransform: vars.transform,
      btnHoverFilter: vars.filter,
    });
  }

  function switchHoverType(next: HoverType) {
    setHoverType(next);
    applyHover(next);
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        All controls affect every button across the application simultaneously.
        Hover and click the preview buttons to see animations live.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vita-neutral-600">Corner radius</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-vita-neutral-600">
                {radiusPx}px
              </span>
              <button
                type="button"
                title="Reset"
                className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
                onClick={() => resetColor(["btnRadius"])}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={radiusPx}
            className="w-full accent-vita-primary"
            onChange={(e) => setTokens({ btnRadius: `${e.target.value}px` })}
          />
          <div className="flex justify-between text-xs text-vita-neutral-400">
            <span>0 — sharp</span>
            <span>24px — rounded</span>
          </div>
        </div>

        <Row label="Quick presets">
          {[
            { label: "Sharp", value: "0px" },
            { label: "4px", value: "4px" },
            { label: "8px", value: "8px" },
            { label: "12px", value: "12px" },
            { label: "Pill", value: "9999px" },
          ].map((p) => (
            <Chip
              key={p.value}
              active={tokens.btnRadius === p.value}
              onClick={() => setTokens({ btnRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <FontWeightRow tokenKey="btnFontWeight" />

        <Row
          label="Letter spacing"
          onReset={() => resetColor(["btnLetterSpacing"])}
        >
          {[
            { label: "Default", value: "0em" },
            { label: "Snug", value: "0.02em" },
            { label: "Wide", value: "0.06em" },
            { label: "Widest", value: "0.12em" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.btnLetterSpacing === o.value}
              onClick={() => setTokens({ btnLetterSpacing: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>

        <Row label="Text case" onReset={() => resetColor(["btnTextTransform"])}>
          {[
            { label: "Normal", value: "none" },
            { label: "UPPERCASE", value: "uppercase" },
            { label: "Capitalize", value: "capitalize" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.btnTextTransform === o.value}
              onClick={() => setTokens({ btnTextTransform: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <BorderControls
          keys={{
            top: "btnBorderTop",
            right: "btnBorderRight",
            bottom: "btnBorderBottom",
            left: "btnBorderLeft",
          }}
          max={8}
          step={1}
          hintMax="8px thick"
        />
        <BorderStyleRow tokenKey="btnBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.btnShadow}
          onChange={(v) => setTokens({ btnShadow: v })}
          onReset={() => resetColor(["btnShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 12 }}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        {/* Hover effect type */}
        <Row
          label="Hover effect"
          onReset={() => {
            setHoverType("none");
            resetColor(["btnHoverTransform", "btnHoverFilter"]);
          }}
        >
          {(
            [
              { label: "None", value: "none" },
              { label: "↑ Lift", value: "lift" },
              { label: "↓ Sink", value: "sink" },
              { label: "⊕ Scale", value: "scale" },
              { label: "↑⊕ Lift+Scale", value: "lift-scale" },
              { label: "↻ Tilt", value: "tilt" },
              { label: "✦ Glow", value: "glow" },
              { label: "☀ Brightness", value: "brightness" },
            ] as { label: string; value: HoverType }[]
          ).map((o) => (
            <Chip
              key={o.value}
              active={hoverType === o.value}
              onClick={() => switchHoverType(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </Row>

        {/* Lift controls */}
        {(hoverType === "lift" || hoverType === "lift-scale") && (
          <SliderRow
            label={`Lift — ${liftPx}px`}
            min={1}
            max={8}
            value={liftPx}
            onChange={(v) => {
              setLiftPx(v);
              applyHover(hoverType, { liftPx: v });
            }}
            hint={["1px subtle", "8px floating"]}
          />
        )}

        {/* Sink controls */}
        {hoverType === "sink" && (
          <SliderRow
            label={`Sink — ${sinkPx}px`}
            min={1}
            max={6}
            value={sinkPx}
            onChange={(v) => {
              setSinkPx(v);
              applyHover(hoverType, { sinkPx: v });
            }}
            hint={["1px subtle", "6px deep"]}
          />
        )}

        {/* Scale controls */}
        {(hoverType === "scale" || hoverType === "lift-scale") && (
          <SliderRow
            label={`Scale — ${scaleFactor.toFixed(2)}×`}
            min={1.01}
            max={1.1}
            step={0.01}
            value={scaleFactor}
            onChange={(v) => {
              setScaleFactor(v);
              applyHover(hoverType, { scaleFactor: v });
            }}
            hint={["1.01 subtle", "1.10 strong"]}
          />
        )}

        {/* Tilt controls */}
        {hoverType === "tilt" && (
          <>
            <SliderRow
              label={`Tilt — ${tiltDeg}°`}
              min={1}
              max={12}
              value={tiltDeg}
              onChange={(v) => {
                setTiltDeg(v);
                applyHover(hoverType, { tiltDeg: v });
              }}
              hint={["1° subtle", "12° dramatic"]}
            />
            <Row label="Direction">
              {(["left", "right"] as TiltDir[]).map((d) => (
                <Chip
                  key={d}
                  active={tiltDir === d}
                  onClick={() => {
                    setTiltDir(d);
                    applyHover(hoverType, { tiltDir: d });
                  }}
                >
                  {d === "left" ? "↺ Left" : "↻ Right"}
                </Chip>
              ))}
            </Row>
          </>
        )}

        {/* Glow controls */}
        {hoverType === "glow" && (
          <>
            <SliderRow
              label={`Blur — ${glowBlur}px`}
              min={2}
              max={30}
              value={glowBlur}
              onChange={(v) => {
                setGlowBlur(v);
                applyHover(hoverType, { glowBlur: v });
              }}
              hint={["2px tight", "30px diffuse"]}
            />
            <SliderRow
              label={`Opacity — ${glowOpacity}%`}
              min={10}
              max={100}
              value={glowOpacity}
              onChange={(v) => {
                setGlowOpacity(v);
                applyHover(hoverType, { glowOpacity: v });
              }}
              hint={["10% soft", "100% vivid"]}
            />
          </>
        )}

        {/* Brightness controls */}
        {hoverType === "brightness" && (
          <SliderRow
            label={`Brightness — ${brightnessVal.toFixed(2)}×`}
            min={0.7}
            max={1.3}
            step={0.01}
            value={brightnessVal}
            onChange={(v) => {
              setBrightnessVal(v);
              applyHover(hoverType, { brightnessVal: v });
            }}
            hint={["0.70 darken", "1.30 lighten"]}
          />
        )}

        {/* Press scale */}
        <SliderRow
          label={`Press — ${pressScale.toFixed(2)}×`}
          min={0.85}
          max={1}
          step={0.01}
          value={pressScale}
          onChange={(v) => setTokens({ btnPressScale: v.toFixed(2) })}
          hint={["0.85 strong", "1.00 none"]}
        />

        {/* Transition speed */}
        <TransitionRow tokenKey="btnTransitionDuration" />
      </Section>
    </div>
  );
}
