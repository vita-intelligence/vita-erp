"use client";

/**
 * FloatingTrigger — a draggable floating icon (similar to Next.js dev indicator)
 * that opens the windowed theme editor on click.
 *
 * Persists its position across sessions via localStorage.
 * Snaps to screen edges for a polished feel.
 */

import { Palette } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useThemeStore } from "@/stores/theme";

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "vita-theme-trigger-pos";
const SIZE = 44;
const EDGE_MARGIN = 16;

type Position = { x: number; y: number };

function clampPosition(pos: Position): Position {
  if (typeof window === "undefined") return pos;
  return {
    x: Math.max(
      EDGE_MARGIN,
      Math.min(pos.x, window.innerWidth - SIZE - EDGE_MARGIN),
    ),
    y: Math.max(
      EDGE_MARGIN,
      Math.min(pos.y, window.innerHeight - SIZE - EDGE_MARGIN),
    ),
  };
}

function loadPosition(): Position {
  if (typeof window === "undefined") return { x: EDGE_MARGIN, y: EDGE_MARGIN };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return clampPosition(JSON.parse(raw));
  } catch {
    // ignore
  }
  // Default: bottom-right corner
  return {
    x: window.innerWidth - SIZE - EDGE_MARGIN,
    y: window.innerHeight - SIZE - EDGE_MARGIN,
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export function FloatingTrigger() {
  const toggleEditor = useThemeStore((s) => s.toggleEditor);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const didDrag = useRef(false);
  const posRef = useRef(pos);

  useEffect(() => {
    setPos(loadPosition());
    setMounted(true);
  }, []);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Persist position
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch {
      // ignore
    }
  }, [pos, mounted]);

  // Keep in bounds on resize
  useEffect(() => {
    const onResize = () => setPos((p) => clampPosition(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Drag ──────────────────────────────────────────────────────────────────

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didDrag.current = false;
    setDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const origX = posRef.current.x;
    const origY = posRef.current.y;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
      setPos(clampPosition({ x: origX + dx, y: origY + dy }));
    };

    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const onClick = useCallback(() => {
    if (!didDrag.current) {
      toggleEditor();
    }
  }, [toggleEditor]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating icon */}
      <button
        type="button"
        aria-label="Open theme editor"
        onPointerDown={onPointerDown}
        onClick={onClick}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: SIZE,
          height: SIZE,
          zIndex: 99999,
          borderRadius: "50%",
          border: "none",
          cursor: dragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--vita-primary, #0a0a0a)",
          color: "var(--vita-text-on-primary, #fff)",
          boxShadow:
            "0 4px 14px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
          transition: dragging
            ? "none"
            : "box-shadow 0.2s ease, transform 0.2s ease",
          transform: dragging ? "scale(1.1)" : "scale(1)",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <Palette size={20} />
      </button>
    </>,
    document.body,
  );
}
