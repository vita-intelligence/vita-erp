"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useThemeStore } from "@/stores/theme";

import { THEME_EDITOR_MODULES } from "./config";
import { ModeSwitcher } from "./ModeSwitcher";

// ---------------------------------------------------------------------------
// Resize handles
// ---------------------------------------------------------------------------

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const CURSOR: Record<ResizeDir, string> = {
  n: "n-resize",
  ne: "ne-resize",
  e: "e-resize",
  se: "se-resize",
  s: "s-resize",
  sw: "sw-resize",
  w: "w-resize",
  nw: "nw-resize",
};

function ResizeHandles({
  onStart,
}: {
  onStart: (dir: ResizeDir) => (e: React.MouseEvent) => void;
}) {
  // z-index 9999 — must sit above all window content
  // Outer window has NO overflow-hidden so handles are never clipped
  const base: React.CSSProperties = { position: "absolute", zIndex: 9999 };
  const E = 6; // edge strip thickness (px)
  const C = 12; // corner hit area (px)

  return (
    <>
      {/* Edges */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          top: 0,
          left: C,
          right: C,
          height: E,
          cursor: "n-resize",
        }}
        onMouseDown={onStart("n")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          bottom: 0,
          left: C,
          right: C,
          height: E,
          cursor: "s-resize",
        }}
        onMouseDown={onStart("s")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          left: 0,
          top: C,
          bottom: C,
          width: E,
          cursor: "w-resize",
        }}
        onMouseDown={onStart("w")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          right: 0,
          top: C,
          bottom: C,
          width: E,
          cursor: "e-resize",
        }}
        onMouseDown={onStart("e")}
      />
      {/* Corners */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          top: 0,
          left: 0,
          width: C,
          height: C,
          cursor: "nw-resize",
        }}
        onMouseDown={onStart("nw")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          top: 0,
          right: 0,
          width: C,
          height: C,
          cursor: "ne-resize",
        }}
        onMouseDown={onStart("ne")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          bottom: 0,
          left: 0,
          width: C,
          height: C,
          cursor: "sw-resize",
        }}
        onMouseDown={onStart("sw")}
      />
      {/* biome-ignore lint/a11y/noStaticElementInteractions: resize handle */}
      <div
        style={{
          ...base,
          bottom: 0,
          right: 0,
          width: C,
          height: C,
          cursor: "se-resize",
        }}
        onMouseDown={onStart("se")}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Window editor
// ---------------------------------------------------------------------------

const WIN_MIN_W = 320;
const WIN_MIN_H = 380;
const WIN_DEFAULT_W = 460;
const WIN_DEFAULT_H = 580;

type Props = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onClose: () => void;
};

export function WindowEditor({ activeTab, setActiveTab, onClose }: Props) {
  const { resetAll } = useThemeStore();
  const active =
    THEME_EDITOR_MODULES.find((m) => m.id === activeTab) ??
    THEME_EDITOR_MODULES[0];

  const [pos, setPos] = useState(() => {
    const w = Math.min(WIN_DEFAULT_W, window.innerWidth - 16);
    const h = Math.min(WIN_DEFAULT_H, window.innerHeight - 16);
    return {
      x: Math.max(0, (window.innerWidth - w) / 2),
      y: Math.max(0, (window.innerHeight - h) / 2),
    };
  });

  const [size, setSize] = useState(() => ({
    width: Math.min(WIN_DEFAULT_W, window.innerWidth - 16),
    height: Math.min(WIN_DEFAULT_H, window.innerHeight - 16),
  }));

  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Block scroll-through on non-scrollable areas (header, tabs).
  // When the event originates inside the scrollable content pane, allow it
  // through — overscroll-contain on the content div handles boundary chaining.
  // Must be non-passive so preventDefault() is honoured by the browser.
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const stop = (e: WheelEvent) => {
      if (contentRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    el.addEventListener("wheel", stop, { passive: false });
    return () => el.removeEventListener("wheel", stop);
  }, []);

  // Live refs so closure-based handlers always read current values
  const posRef = useRef(pos);
  const sizeRef = useRef(size);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const onDragMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX,
      startY = e.clientY;
    const origX = posRef.current.x,
      origY = posRef.current.y;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";

    const onMove = (e: MouseEvent) => {
      setPos({
        x: Math.max(0, origX + e.clientX - startX),
        y: Math.max(0, origY + e.clientY - startY),
      });
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  const startResize = useCallback(
    (dir: ResizeDir) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX,
        startY = e.clientY;
      const ox = posRef.current.x,
        oy = posRef.current.y;
      const ow = sizeRef.current.width,
        oh = sizeRef.current.height;

      document.body.style.cursor = CURSOR[dir];
      document.body.style.userSelect = "none";

      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let nx = ox,
          ny = oy,
          nw = ow,
          nh = oh;

        if (dir.includes("e")) nw = Math.max(WIN_MIN_W, ow + dx);
        if (dir.includes("s")) nh = Math.max(WIN_MIN_H, oh + dy);
        if (dir.includes("w")) {
          nw = Math.max(WIN_MIN_W, ow - dx);
          nx = ox + ow - nw;
        }
        if (dir.includes("n")) {
          nh = Math.max(WIN_MIN_H, oh - dy);
          ny = oy + oh - nh;
        }

        setPos({ x: nx, y: ny });
        setSize({ width: nw, height: nh });
      };

      const onUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [],
  );

  return (
    // Outer shell — NO overflow-hidden so resize handles are never clipped
    <div
      ref={windowRef}
      className="fixed z-vita-modal rounded-vita-xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
      }}
    >
      <ResizeHandles onStart={startResize} />

      {/* Inner content — overflow-hidden clips content to rounded corners */}
      <div className="flex h-full flex-col overflow-hidden rounded-vita-xl border border-vita-neutral-200 bg-vita-surface shadow-vita-xl">
        {/* Title bar */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: drag handle */}
        <div
          className="flex h-11 shrink-0 select-none items-center justify-between border-b border-vita-neutral-200 bg-vita-surface px-3 cursor-grab"
          onMouseDown={onDragMouseDown}
        >
          <div className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="currentColor"
              className="shrink-0 text-vita-neutral-300"
            >
              <circle cx="2" cy="2" r="1.2" />
              <circle cx="6" cy="2" r="1.2" />
              <circle cx="10" cy="2" r="1.2" />
              <circle cx="2" cy="6" r="1.2" />
              <circle cx="6" cy="6" r="1.2" />
              <circle cx="10" cy="6" r="1.2" />
              <circle cx="2" cy="10" r="1.2" />
              <circle cx="6" cy="10" r="1.2" />
              <circle cx="10" cy="10" r="1.2" />
            </svg>
            <span className="text-sm font-semibold text-vita-neutral-800">
              Brand &amp; Theme
            </span>
          </div>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
          <div
            className="flex items-center gap-1.5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ModeSwitcher />
            <button
              type="button"
              title="Reset all"
              className="rounded-vita-sm px-1.5 py-0.5 text-xs text-vita-neutral-500 transition-colors hover:bg-vita-neutral-100 hover:text-vita-neutral-800"
              onClick={resetAll}
            >
              ↺
            </button>
            <button
              type="button"
              aria-label="Close"
              className="flex h-6 w-6 items-center justify-center rounded-vita-sm text-xs text-vita-neutral-400 transition-colors hover:bg-vita-neutral-100 hover:text-vita-neutral-800"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
        <div
          className="flex shrink-0 overflow-x-auto border-b border-vita-neutral-200 bg-vita-surface px-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {THEME_EDITOR_MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="relative shrink-0 whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-colors"
              style={
                activeTab === m.id
                  ? { color: "var(--vita-primary)" }
                  : { color: "var(--vita-neutral-500)" }
              }
              onClick={() => setActiveTab(m.id)}
            >
              {m.label}
              {activeTab === m.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "var(--vita-primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <active.component />
        </div>
      </div>
    </div>
  );
}
