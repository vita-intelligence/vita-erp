"use client";

/**
 * useCursorTrack — cursor-tracking 3D rotation for any element.
 *
 * Calculates rotateX/Y based on cursor position relative to the element
 * center. Sets CSS custom properties directly on the element so the
 * CSS hover rule picks them up (element-level vars override :root).
 *
 * @param prefix     CSS var prefix, e.g. "btn" → sets --vita-btn-hover-rotate-x
 * @param intensity  Max rotation in degrees at the element edge (0 = disabled)
 * @param restoreMs  Transition duration for the return-to-rest animation
 */

import { useCallback, useRef } from "react";

type CursorTrackHandlers = {
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
};

export function useCursorTrack(
  prefix: string,
  intensity: number,
  restoreMs: number,
): CursorTrackHandlers {
  const rafRef = useRef<number>(0);

  const varX = `--vita-${prefix}-hover-rotate-x`;
  const varY = `--vita-${prefix}-hover-rotate-y`;
  const varZ = `--vita-${prefix}-hover-rotate-z`;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (intensity <= 0) return;
      const el = e.currentTarget;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // Normalized -0.5 → +0.5 from center
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        // X rotation: cursor at top → positive (tilt backward), bottom → negative
        // Y rotation: cursor at right → positive (tilt right), left → negative
        const rx = -ny * intensity;
        const ry = nx * intensity;

        el.style.setProperty(varX, `${rx.toFixed(1)}deg`);
        el.style.setProperty(varY, `${ry.toFixed(1)}deg`);
        el.style.setProperty(varZ, "0deg");
        // Instant response while tracking
        el.style.setProperty("transition-duration", "0ms");
      });
    },
    [intensity, varX, varY, varZ],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      cancelAnimationFrame(rafRef.current);
      const el = e.currentTarget;
      // Remove element-level overrides so CSS falls back to :root / static
      el.style.removeProperty(varX);
      el.style.removeProperty(varY);
      el.style.removeProperty(varZ);
      // Smooth restore transition
      el.style.setProperty("transition-duration", `${restoreMs}ms`);
    },
    [restoreMs, varX, varY, varZ],
  );

  return { onMouseMove, onMouseLeave };
}
