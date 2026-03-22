/**
 * Hover effect computation — pure logic, no React dependency.
 *
 * Returns both 2D transform values (lift, sink, scale) and 3D hover
 * rotation values. The button CSS composes these:
 *
 *   transform: perspective(800px)
 *     rotateX(var(--hover-x, var(--static-x)))
 *     rotateY(var(--hover-y, var(--static-y)))
 *     rotateZ(var(--hover-z, var(--static-z)))
 *     var(--hover-transform);
 *
 * When hover rotation values are "" (empty), the CSS var is removed from
 * the DOM and falls back to the static rotation — preserving 3D on hover.
 */

export type HoverType =
  | "none"
  // 2D effects
  | "lift"
  | "sink"
  | "scale"
  | "lift-scale"
  // Z-rotation (uses 3D system)
  | "tilt-z"
  // Filter effects
  | "glow"
  | "brightness"
  // 3D effects
  | "tilt-forward"
  | "tilt-side"
  | "tilt-3d"
  | "flip-peek"
  // Combined 2D + 3D
  | "lift-tilt";

export type TiltDir = "left" | "right";

export type HoverVars = {
  /** 2D transform: translateY, scale, etc. Empty = none. */
  transform: string;
  /** CSS filter: glow, brightness. "none" = no filter. */
  filter: string;
  /** 3D hover rotation values. "" = inherit from static (no override). */
  hoverRotateX: string;
  hoverRotateY: string;
  hoverRotateZ: string;
};

export type HoverParams = {
  liftPx: number;
  sinkPx: number;
  scaleFactor: number;
  tiltDeg: number;
  tiltDir: TiltDir;
  glowBlur: number;
  glowOpacity: number;
  brightnessVal: number;
  // 3D fine-grained overrides
  hover3DRx?: number;
  hover3DRy?: number;
  hover3DRz?: number;
};

/** Identity hover — no visual change, 3D falls back to static. */
const IDENTITY: HoverVars = {
  transform: "",
  filter: "none",
  hoverRotateX: "",
  hoverRotateY: "",
  hoverRotateZ: "",
};

export function computeHoverVars(
  type: HoverType,
  params: HoverParams,
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
    hover3DRx,
    hover3DRy,
    hover3DRz,
  } = params;

  switch (type) {
    case "none":
      return { ...IDENTITY };

    // ── 2D effects (3D inherits from static) ───────────────────────────────
    case "lift":
      return { ...IDENTITY, transform: `translateY(-${liftPx}px)` };
    case "sink":
      return { ...IDENTITY, transform: `translateY(${sinkPx}px)` };
    case "scale":
      return {
        ...IDENTITY,
        transform: `scale(${scaleFactor.toFixed(2)})`,
      };
    case "lift-scale":
      return {
        ...IDENTITY,
        transform: `translateY(-${liftPx}px) scale(${scaleFactor.toFixed(2)})`,
      };

    // ── Z-rotation (via 3D system) ────────────────────────────────────────
    case "tilt-z": {
      const deg = tiltDir === "left" ? -tiltDeg : tiltDeg;
      return { ...IDENTITY, hoverRotateZ: `${deg}deg` };
    }

    // ── Filter effects (3D inherits from static) ──────────────────────────
    case "glow": {
      const op = (glowOpacity / 100).toFixed(2);
      return {
        ...IDENTITY,
        filter: `drop-shadow(0 0 ${glowBlur}px oklch(from var(--vita-primary) l c h / ${op}))`,
      };
    }
    case "brightness":
      return {
        ...IDENTITY,
        filter: `brightness(${brightnessVal.toFixed(2)})`,
      };

    // ── 3D effects ────────────────────────────────────────────────────────
    case "tilt-forward":
      return {
        ...IDENTITY,
        hoverRotateX: `${hover3DRx ?? -5}deg`,
        hoverRotateY: "0deg",
        hoverRotateZ: "0deg",
      };
    case "tilt-side":
      return {
        ...IDENTITY,
        hoverRotateX: "0deg",
        hoverRotateY: `${hover3DRy ?? 8}deg`,
        hoverRotateZ: "0deg",
      };
    case "tilt-3d":
      return {
        ...IDENTITY,
        hoverRotateX: `${hover3DRx ?? -4}deg`,
        hoverRotateY: `${hover3DRy ?? 6}deg`,
        hoverRotateZ: `${hover3DRz ?? 0}deg`,
      };
    case "flip-peek":
      return {
        ...IDENTITY,
        hoverRotateX: "0deg",
        hoverRotateY: `${hover3DRy ?? 15}deg`,
        hoverRotateZ: "0deg",
      };

    // ── Combined ──────────────────────────────────────────────────────────
    case "lift-tilt":
      return {
        transform: `translateY(-${liftPx}px)`,
        filter: "none",
        hoverRotateX: `${hover3DRx ?? -3}deg`,
        hoverRotateY: `${hover3DRy ?? 4}deg`,
        hoverRotateZ: "0deg",
      };

    default:
      return { ...IDENTITY };
  }
}
