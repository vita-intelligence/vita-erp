"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  CursorTrackControls,
  FontWeightRow,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  Transform3DControls,
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

// ── Hover option labels ─────────────────────────────────────────────────────

const HOVER_OPTIONS: { label: string; value: HoverType }[] = [
  { label: "None", value: "none" },
  // 2D
  { label: "↑ Lift", value: "lift" },
  { label: "↓ Sink", value: "sink" },
  { label: "⊕ Scale", value: "scale" },
  { label: "↑⊕ Lift+Scale", value: "lift-scale" },
  // Rotation
  { label: "↻ Tilt Z", value: "tilt-z" },
  // Filter
  { label: "✦ Glow", value: "glow" },
  { label: "☀ Brightness", value: "brightness" },
  // 3D
  { label: "⟳ Tilt fwd", value: "tilt-forward" },
  { label: "⟳ Tilt side", value: "tilt-side" },
  { label: "⟳ Tilt 3D", value: "tilt-3d" },
  { label: "⟳ Flip peek", value: "flip-peek" },
  // Combined
  { label: "↑⟳ Lift+Tilt", value: "lift-tilt" },
];

// ── Helpers: which controls to show per hover type ──────────────────────────

const SHOWS_LIFT = new Set<HoverType>(["lift", "lift-scale", "lift-tilt"]);
const SHOWS_SINK = new Set<HoverType>(["sink"]);
const SHOWS_SCALE = new Set<HoverType>(["scale", "lift-scale"]);
const SHOWS_TILT_Z = new Set<HoverType>(["tilt-z"]);
const SHOWS_GLOW = new Set<HoverType>(["glow"]);
const SHOWS_BRIGHTNESS = new Set<HoverType>(["brightness"]);
const SHOWS_3D = new Set<HoverType>([
  "tilt-forward",
  "tilt-side",
  "tilt-3d",
  "flip-peek",
  "lift-tilt",
]);

// ── Module ──────────────────────────────────────────────────────────────────

export function ButtonsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();
  const radiusPx = parseFloat(tokens.btnRadius);
  const pressScale = parseFloat(tokens.btnPressScale ?? "0.97");

  // ── Hover state ───────────────────────────────────────────────────────────
  const [hoverType, setHoverType] = useState<HoverType>("none");
  const [liftPx, setLiftPx] = useState(2);
  const [sinkPx, setSinkPx] = useState(2);
  const [scaleFactor, setScaleFactor] = useState(1.03);
  const [tiltDeg, setTiltDeg] = useState(3);
  const [tiltDir, setTiltDir] = useState<TiltDir>("right");
  const [glowBlur, setGlowBlur] = useState(8);
  const [glowOpacity, setGlowOpacity] = useState(60);
  const [brightnessVal, setBrightnessVal] = useState(1.1);
  const [hover3DRx, setHover3DRx] = useState(-5);
  const [hover3DRy, setHover3DRy] = useState(8);
  const [hover3DRz, setHover3DRz] = useState(0);

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
      hover3DRx,
      hover3DRy,
      hover3DRz,
      ...overrides,
    });
    setTokens({
      btnHoverTransform: vars.transform,
      btnHoverFilter: vars.filter,
      btnHoverRotateX: vars.hoverRotateX,
      btnHoverRotateY: vars.hoverRotateY,
      btnHoverRotateZ: vars.hoverRotateZ,
    });
  }

  function switchHoverType(next: HoverType) {
    setHoverType(next);
    applyHover(next);
  }

  function resetHover() {
    setHoverType("none");
    resetColor([
      "btnHoverTransform",
      "btnHoverFilter",
      "btnHoverRotateX",
      "btnHoverRotateY",
      "btnHoverRotateZ",
    ]);
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        All controls affect every button across the application simultaneously.
        Hover and click the preview buttons to see animations live.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vita-text-secondary">
              Corner radius
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
                {radiusPx}px
              </span>
              <button
                type="button"
                title="Reset"
                className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
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
          <div className="flex justify-between text-xs text-vita-text-muted">
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

      {/* ── 3D Transform (static) ── */}
      <Transform3DControls
        keys={{
          rotateX: "btnRotateX",
          rotateY: "btnRotateY",
          rotateZ: "btnRotateZ",
        }}
      />

      {/* ── Cursor tracking ── */}
      <CursorTrackControls
        keys={{
          intensity: "btnCursorTrack",
          restore: "btnCursorTrackRestore",
        }}
      />

      {/* ── Motion (unified hover + 3D hover) ── */}
      <Section title="Motion">
        <Row label="Hover effect" onReset={resetHover}>
          {HOVER_OPTIONS.map((o) => (
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
        {SHOWS_LIFT.has(hoverType) && (
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
        {SHOWS_SINK.has(hoverType) && (
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
        {SHOWS_SCALE.has(hoverType) && (
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

        {/* Tilt Z controls */}
        {SHOWS_TILT_Z.has(hoverType) && (
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
        {SHOWS_GLOW.has(hoverType) && (
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
        {SHOWS_BRIGHTNESS.has(hoverType) && (
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

        {/* 3D hover fine-grained controls */}
        {SHOWS_3D.has(hoverType) && (
          <>
            <SliderRow
              label={`Hover X — ${hover3DRx}°`}
              min={-30}
              max={30}
              step={1}
              value={hover3DRx}
              onChange={(v) => {
                setHover3DRx(v);
                applyHover(hoverType, { hover3DRx: v });
              }}
              hint={["-30° backward", "30° forward"]}
            />
            <SliderRow
              label={`Hover Y — ${hover3DRy}°`}
              min={-30}
              max={30}
              step={1}
              value={hover3DRy}
              onChange={(v) => {
                setHover3DRy(v);
                applyHover(hoverType, { hover3DRy: v });
              }}
              hint={["-30° left", "30° right"]}
            />
            <SliderRow
              label={`Hover Z — ${hover3DRz}°`}
              min={-20}
              max={20}
              step={1}
              value={hover3DRz}
              onChange={(v) => {
                setHover3DRz(v);
                applyHover(hoverType, { hover3DRz: v });
              }}
              hint={["-20° counter-cw", "20° clockwise"]}
            />
          </>
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
