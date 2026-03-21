/**
 * Hover effect computation — pure logic, no React dependency.
 */

export type HoverType =
  | "none"
  | "lift"
  | "sink"
  | "scale"
  | "lift-scale"
  | "tilt"
  | "glow"
  | "brightness";

export type TiltDir = "left" | "right";

export type HoverVars = { transform: string; filter: string };

export type HoverParams = {
  liftPx: number;
  sinkPx: number;
  scaleFactor: number;
  tiltDeg: number;
  tiltDir: TiltDir;
  glowBlur: number;
  glowOpacity: number;
  brightnessVal: number;
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
