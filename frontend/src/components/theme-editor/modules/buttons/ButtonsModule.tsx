"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
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

const HOVER_OPTIONS: { labelKey: string; icon: string; value: HoverType }[] = [
  { labelKey: "hover3d.none", icon: "", value: "none" },
  { labelKey: "hover3d.lift", icon: "↑", value: "lift" },
  { labelKey: "labels.sink", icon: "↓", value: "sink" },
  { labelKey: "hover3d.scale", icon: "⊕", value: "scale" },
  { labelKey: "hover3d.liftScale", icon: "↑⊕", value: "lift-scale" },
  { labelKey: "labels.tilt", icon: "↻", value: "tilt-z" },
  { labelKey: "labels.glow", icon: "✦", value: "glow" },
  { labelKey: "labels.brightness", icon: "☀", value: "brightness" },
  { labelKey: "hover3d.tiltForward", icon: "⟳", value: "tilt-forward" },
  { labelKey: "hover3d.tiltSide", icon: "⟳", value: "tilt-side" },
  { labelKey: "hover3d.tilt3d", icon: "⟳", value: "tilt-3d" },
  { labelKey: "hover3d.flipPeek", icon: "⟳", value: "flip-peek" },
  { labelKey: "hover3d.liftTilt", icon: "↑⟳", value: "lift-tilt" },
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
  const t = useTranslations("themeEditor");
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
        {t("modules.buttons.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vita-text-secondary">
              {t("labels.cornerRadius")}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
                {radiusPx}px
              </span>
              <button
                type="button"
                title={t("chrome.reset")}
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
            <span>0 — {t("presets.sharp").toLowerCase()}</span>
            <span>24px — {t("presets.rounded").toLowerCase()}</span>
          </div>
        </div>

        <Row label={t("labels.quickPresets")}>
          {[
            { label: t("presets.sharp"), value: "0px" },
            { label: "4px", value: "4px" },
            { label: "8px", value: "8px" },
            { label: "12px", value: "12px" },
            { label: t("presets.pill"), value: "9999px" },
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
      <Section title={t("sections.typography")}>
        <FontWeightRow tokenKey="btnFontWeight" />

        <Row
          label={t("labels.letterSpacing")}
          onReset={() => resetColor(["btnLetterSpacing"])}
        >
          {[
            { label: t("presets.default"), value: "0em" },
            { label: t("presets.snug"), value: "0.02em" },
            { label: t("presets.wide"), value: "0.06em" },
            { label: t("presets.widest"), value: "0.12em" },
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

        <Row
          label={t("labels.textCase")}
          onReset={() => resetColor(["btnTextTransform"])}
        >
          {[
            { label: t("labels.textNormal"), value: "none" },
            { label: t("labels.uppercase"), value: "uppercase" },
            { label: t("labels.capitalize"), value: "capitalize" },
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
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "btnBorderTop",
            right: "btnBorderRight",
            bottom: "btnBorderBottom",
            left: "btnBorderLeft",
          }}
          max={8}
          step={1}
          hintMax={`8px ${t("hints.thick")}`}
        />
        <BorderStyleRow tokenKey="btnBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
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
      <Section title={t("sections.motion")}>
        <Row label={t("labels.hoverEffect")} onReset={resetHover}>
          {HOVER_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              active={hoverType === o.value}
              onClick={() => switchHoverType(o.value)}
            >
              {o.icon ? `${o.icon} ${t(o.labelKey)}` : t(o.labelKey)}
            </Chip>
          ))}
        </Row>

        {/* Lift controls */}
        {SHOWS_LIFT.has(hoverType) && (
          <SliderRow
            label={`${t("labels.lift")} — ${liftPx}px`}
            min={1}
            max={8}
            value={liftPx}
            onChange={(v) => {
              setLiftPx(v);
              applyHover(hoverType, { liftPx: v });
            }}
            hint={[`1px ${t("hints.subtle")}`, `8px ${t("hints.floating")}`]}
          />
        )}

        {/* Sink controls */}
        {SHOWS_SINK.has(hoverType) && (
          <SliderRow
            label={`${t("labels.sink")} — ${sinkPx}px`}
            min={1}
            max={6}
            value={sinkPx}
            onChange={(v) => {
              setSinkPx(v);
              applyHover(hoverType, { sinkPx: v });
            }}
            hint={[`1px ${t("hints.subtle")}`, `6px ${t("hints.deep")}`]}
          />
        )}

        {/* Scale controls */}
        {SHOWS_SCALE.has(hoverType) && (
          <SliderRow
            label={`${t("labels.scale")} — ${scaleFactor.toFixed(2)}×`}
            min={1.01}
            max={1.1}
            step={0.01}
            value={scaleFactor}
            onChange={(v) => {
              setScaleFactor(v);
              applyHover(hoverType, { scaleFactor: v });
            }}
            hint={[`1.01 ${t("hints.subtle")}`, `1.10 ${t("hints.strong")}`]}
          />
        )}

        {/* Tilt Z controls */}
        {SHOWS_TILT_Z.has(hoverType) && (
          <>
            <SliderRow
              label={`${t("labels.tilt")} — ${tiltDeg}°`}
              min={1}
              max={12}
              value={tiltDeg}
              onChange={(v) => {
                setTiltDeg(v);
                applyHover(hoverType, { tiltDeg: v });
              }}
              hint={[`1° ${t("hints.subtle")}`, `12° ${t("hints.dramatic")}`]}
            />
            <Row label={t("labels.direction")}>
              {(["left", "right"] as TiltDir[]).map((d) => (
                <Chip
                  key={d}
                  active={tiltDir === d}
                  onClick={() => {
                    setTiltDir(d);
                    applyHover(hoverType, { tiltDir: d });
                  }}
                >
                  {d === "left"
                    ? `↺ ${t("labels.left")}`
                    : `↻ ${t("labels.right")}`}
                </Chip>
              ))}
            </Row>
          </>
        )}

        {/* Glow controls */}
        {SHOWS_GLOW.has(hoverType) && (
          <>
            <SliderRow
              label={`${t("labels.blur")} — ${glowBlur}px`}
              min={2}
              max={30}
              value={glowBlur}
              onChange={(v) => {
                setGlowBlur(v);
                applyHover(hoverType, { glowBlur: v });
              }}
              hint={[`2px ${t("hints.tight")}`, `30px ${t("hints.diffuse")}`]}
            />
            <SliderRow
              label={`${t("labels.opacity")} — ${glowOpacity}%`}
              min={10}
              max={100}
              value={glowOpacity}
              onChange={(v) => {
                setGlowOpacity(v);
                applyHover(hoverType, { glowOpacity: v });
              }}
              hint={[`10% ${t("hints.soft")}`, `100% ${t("hints.vivid")}`]}
            />
          </>
        )}

        {/* Brightness controls */}
        {SHOWS_BRIGHTNESS.has(hoverType) && (
          <SliderRow
            label={`${t("labels.brightness")} — ${brightnessVal.toFixed(2)}×`}
            min={0.7}
            max={1.3}
            step={0.01}
            value={brightnessVal}
            onChange={(v) => {
              setBrightnessVal(v);
              applyHover(hoverType, { brightnessVal: v });
            }}
            hint={[`0.70 ${t("hints.darken")}`, `1.30 ${t("hints.lighten")}`]}
          />
        )}

        {/* 3D hover fine-grained controls */}
        {SHOWS_3D.has(hoverType) && (
          <>
            <SliderRow
              label={`${t("hover3d.hoverX")} — ${hover3DRx}°`}
              min={-30}
              max={30}
              step={1}
              value={hover3DRx}
              onChange={(v) => {
                setHover3DRx(v);
                applyHover(hoverType, { hover3DRx: v });
              }}
              hint={[
                `-30° ${t("hints.backward")}`,
                `30° ${t("hints.forward")}`,
              ]}
            />
            <SliderRow
              label={`${t("hover3d.hoverY")} — ${hover3DRy}°`}
              min={-30}
              max={30}
              step={1}
              value={hover3DRy}
              onChange={(v) => {
                setHover3DRy(v);
                applyHover(hoverType, { hover3DRy: v });
              }}
              hint={[`-30° ${t("hints.left")}`, `30° ${t("hints.right")}`]}
            />
            <SliderRow
              label={`${t("hover3d.hoverZ")} — ${hover3DRz}°`}
              min={-20}
              max={20}
              step={1}
              value={hover3DRz}
              onChange={(v) => {
                setHover3DRz(v);
                applyHover(hoverType, { hover3DRz: v });
              }}
              hint={[
                `-20° ${t("hints.counterCw")}`,
                `20° ${t("hints.clockwise")}`,
              ]}
            />
          </>
        )}

        {/* Press scale */}
        <SliderRow
          label={`${t("labels.press")} — ${pressScale.toFixed(2)}×`}
          min={0.85}
          max={1}
          step={0.01}
          value={pressScale}
          onChange={(v) => setTokens({ btnPressScale: v.toFixed(2) })}
          hint={[`0.85 ${t("hints.strong")}`, `1.00 ${t("hints.none")}`]}
        />

        {/* Transition speed */}
        <TransitionRow tokenKey="btnTransitionDuration" />
      </Section>
    </div>
  );
}
