"use client";

import { Plus, RotateCcw, Unlink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme";
import { Chip, Row, Section, ShadowBuilder, SliderRow } from "./_shared";

// ── Preview ───────────────────────────────────────────────────────────────────
// Uses real HeroUI buttons so hover/press animations are live.

function Preview() {
  const semantic: { label: string; vars: React.CSSProperties }[] = [
    {
      label: "Danger",
      vars: {
        "--button-bg": "var(--vita-error)",
        "--button-fg": "var(--vita-text-on-danger)",
        "--button-bg-hover": "var(--vita-error-dark)",
      } as React.CSSProperties,
    },
    {
      label: "Success",
      vars: {
        "--button-bg": "var(--vita-success)",
        "--button-fg": "var(--vita-text-on-primary)",
        "--button-bg-hover": "var(--vita-success-dark)",
      } as React.CSSProperties,
    },
    {
      label: "Warning",
      vars: {
        "--button-bg": "var(--vita-warning)",
        "--button-fg": "var(--vita-text-on-warning)",
        "--button-bg-hover": "var(--vita-warning-dark)",
      } as React.CSSProperties,
    },
    {
      label: "Info",
      vars: {
        "--button-bg": "var(--vita-info)",
        "--button-fg": "var(--vita-text-on-primary)",
        "--button-bg-hover": "var(--vita-info-dark)",
      } as React.CSSProperties,
    },
  ];

  return (
    <div className="space-y-4 rounded-vita-md border border-vita-neutral-200 bg-vita-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-vita-neutral-400">
          Live preview
        </p>
        <p className="text-xs text-vita-neutral-400">
          hover &amp; click to test
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">Variants</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger-soft">Danger soft</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">Semantic colors</p>
        <div className="flex flex-wrap gap-2">
          {semantic.map(({ label, vars }) => (
            <Button key={label} variant="primary" style={vars}>
              {label}
            </Button>
          ))}
          <Button variant="danger">Danger solid</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-vita-neutral-400">Sizes &amp; states</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" isDisabled>
            Disabled
          </Button>
          <Button variant="outline">
            <Plus size={14} />
            With icon
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Hover helpers ─────────────────────────────────────────────────────────────

type HoverType =
  | "none"
  | "lift"
  | "sink"
  | "scale"
  | "lift-scale"
  | "tilt"
  | "glow"
  | "brightness";

type TiltDir = "left" | "right";

type HoverVars = { transform: string; filter: string };

function computeHoverVars(
  type: HoverType,
  params: {
    liftPx: number;
    sinkPx: number;
    scaleFactor: number;
    tiltDeg: number;
    tiltDir: TiltDir;
    glowBlur: number;
    glowOpacity: number;
    brightnessVal: number;
  },
): HoverVars {
  const {
    liftPx,
    sinkPx,
    scaleFactor,
    tiltDeg,
    tiltDir,
    glowBlur,
    glowOpacity,
    brightnessVal,
  } = params;

  switch (type) {
    case "none":
      return { transform: "none", filter: "none" };
    case "lift":
      return { transform: `translateY(-${liftPx}px)`, filter: "none" };
    case "sink":
      return { transform: `translateY(${sinkPx}px)`, filter: "none" };
    case "scale":
      return {
        transform: `scale(${scaleFactor.toFixed(2)})`,
        filter: "none",
      };
    case "lift-scale":
      return {
        transform: `translateY(-${liftPx}px) scale(${scaleFactor.toFixed(2)})`,
        filter: "none",
      };
    case "tilt": {
      const deg = tiltDir === "left" ? -tiltDeg : tiltDeg;
      return { transform: `rotate(${deg}deg)`, filter: "none" };
    }
    case "glow": {
      const op = (glowOpacity / 100).toFixed(2);
      return {
        transform: "none",
        filter: `drop-shadow(0 0 ${glowBlur}px oklch(from var(--vita-primary) l c h / ${op}))`,
      };
    }
    case "brightness":
      return {
        transform: "none",
        filter: `brightness(${brightnessVal.toFixed(2)})`,
      };
    default:
      return { transform: "none", filter: "none" };
  }
}

// ── Border controls ───────────────────────────────────────────────────────────

function BorderControls() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const [individual, setIndividual] = useState(false);

  const allVal = parseFloat(tokens.btnBorderTop);

  function setAll(v: number) {
    const px = `${v}px`;
    setTokens({
      btnBorderTop: px,
      btnBorderRight: px,
      btnBorderBottom: px,
      btnBorderLeft: px,
    });
  }

  const sides = [
    { label: "Top", key: "btnBorderTop" as const },
    { label: "Right", key: "btnBorderRight" as const },
    { label: "Bottom", key: "btnBorderBottom" as const },
    { label: "Left", key: "btnBorderLeft" as const },
  ] as const;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-vita-neutral-600">Width</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={individual ? "Sync all sides" : "Set sides individually"}
            className={`p-0.5 transition-colors ${individual ? "text-vita-primary" : "text-vita-neutral-300 hover:text-vita-neutral-500"}`}
            onClick={() => setIndividual((v) => !v)}
          >
            <Unlink size={11} />
          </button>
          <button
            type="button"
            title="Reset borders"
            className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
            onClick={() =>
              resetColor([
                "btnBorderTop",
                "btnBorderRight",
                "btnBorderBottom",
                "btnBorderLeft",
              ])
            }
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {!individual ? (
        <SliderRow
          label={`All — ${allVal}px`}
          min={0}
          max={8}
          step={1}
          value={allVal}
          onChange={setAll}
          hint={["0 none", "8px thick"]}
        />
      ) : (
        <div className="space-y-2">
          {sides.map(({ label, key }) => (
            <SliderRow
              key={key}
              label={`${label} — ${parseFloat(tokens[key])}px`}
              min={0}
              max={8}
              step={1}
              value={parseFloat(tokens[key])}
              onChange={(v) => setTokens({ [key]: `${v}px` })}
              hint={["0", "8px"]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Module ────────────────────────────────────────────────────────────────────

export function ButtonsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const radiusPx = parseFloat(tokens.btnRadius);
  const pressScale = parseFloat(tokens.btnPressScale ?? "0.97");

  // ── Hover state ────────────────────────────────────────────────────────────
  const [hoverType, setHoverType] = useState<HoverType>("none");
  const [liftPx, setLiftPx] = useState(2);
  const [sinkPx, setSinkPx] = useState(2);
  const [scaleFactor, setScaleFactor] = useState(1.03);
  const [tiltDeg, setTiltDeg] = useState(3);
  const [tiltDir, setTiltDir] = useState<TiltDir>("right");
  const [glowBlur, setGlowBlur] = useState(8);
  const [glowOpacity, setGlowOpacity] = useState(60);
  const [brightnessVal, setBrightnessVal] = useState(1.1);

  function applyHover(
    type: HoverType,
    overrides?: Partial<{
      liftPx: number;
      sinkPx: number;
      scaleFactor: number;
      tiltDeg: number;
      tiltDir: TiltDir;
      glowBlur: number;
      glowOpacity: number;
      brightnessVal: number;
    }>,
  ) {
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

      <Preview />

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
        <Row label="Font weight" onReset={() => resetColor(["btnFontWeight"])}>
          {[
            { label: "Regular", value: "400" },
            { label: "Medium", value: "500" },
            { label: "Semibold", value: "600" },
            { label: "Bold", value: "700" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.btnFontWeight === o.value}
              onClick={() => setTokens({ btnFontWeight: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>

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
        <BorderControls />

        <Row label="Style" onReset={() => resetColor(["btnBorderStyle"])}>
          {[
            { label: "— Solid", value: "solid" },
            { label: "- - Dashed", value: "dashed" },
            { label: "··· Dotted", value: "dotted" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.btnBorderStyle === o.value}
              onClick={() => setTokens({ btnBorderStyle: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
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
        <Row
          label="Transition"
          onReset={() => resetColor(["btnTransitionDuration"])}
        >
          {[
            { label: "Instant", value: "0ms" },
            { label: "Fast", value: "100ms" },
            { label: "Normal", value: "150ms" },
            { label: "Smooth", value: "250ms" },
            { label: "Slow", value: "400ms" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.btnTransitionDuration === o.value}
              onClick={() => setTokens({ btnTransitionDuration: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>
    </div>
  );
}
