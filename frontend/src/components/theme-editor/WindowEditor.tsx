"use client";

import { GripHorizontal, RotateCcw, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useThemeStore } from "@/stores/theme";

import { GROUP_I18N_KEY, groupedModules, THEME_EDITOR_MODULES } from "./config";
import { ModeSwitcher } from "./ModeSwitcher";

const GROUPS = groupedModules();

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

const WIN_MIN_W = 280;
const WIN_MIN_H = 420;
const WIN_DEFAULT_W = 480;
const WIN_DEFAULT_H = 600;

type Props = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onClose: () => void;
};

export function WindowEditor({ activeTab, setActiveTab, onClose }: Props) {
  const { resetAll, resetColor } = useThemeStore();
  const t = useTranslations("themeEditor");

  /** Resolve a translatable label for a module by its config id. */
  function moduleLabel(id: string): string {
    const key = id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    try {
      return t(`modules.${key}.label`);
    } catch {
      return id;
    }
  }

  function groupLabel(group: string): string {
    const key = GROUP_I18N_KEY[group] ?? group.toLowerCase();
    try {
      return t(`groups.${key}`);
    } catch {
      return group;
    }
  }

  const [search, setSearch] = useState("");
  const searchLower = search.toLowerCase().trim();

  /** All modules whose label matches the search query. */
  const searchResults = searchLower
    ? THEME_EDITOR_MODULES.filter((m) =>
        moduleLabel(m.id).toLowerCase().includes(searchLower),
      )
    : [];

  const isSearching = searchLower.length > 0;

  const active =
    THEME_EDITOR_MODULES.find((m) => m.id === activeTab) ??
    THEME_EDITOR_MODULES[0];

  const activeGroup =
    GROUPS.find((g) => g.items.some((m) => m.id === activeTab))?.group ??
    GROUPS[0].group;
  const activeGroupItems =
    GROUPS.find((g) => g.group === activeGroup)?.items ?? [];

  function switchGroup(group: string) {
    const first = GROUPS.find((g) => g.group === group)?.items[0];
    if (first) setActiveTab(first.id);
  }

  const [pos, setPos] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("vita-theme-editor-pos") ?? "",
      );
      if (saved?.x !== undefined && saved?.y !== undefined) {
        return {
          x: Math.min(saved.x, window.innerWidth - 100),
          y: Math.min(saved.y, window.innerHeight - 100),
        };
      }
    } catch {
      /* no saved position */
    }
    const w = Math.min(WIN_DEFAULT_W, window.innerWidth - 16);
    const h = Math.min(WIN_DEFAULT_H, window.innerHeight - 16);
    return {
      x: Math.max(0, (window.innerWidth - w) / 2),
      y: Math.max(0, (window.innerHeight - h) / 2),
    };
  });

  const [size, setSize] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("vita-theme-editor-size") ?? "",
      );
      if (saved?.width && saved?.height) {
        return {
          width: Math.min(saved.width, window.innerWidth - 16),
          height: Math.min(saved.height, window.innerHeight - 16),
        };
      }
    } catch {
      /* no saved size */
    }
    return {
      width: Math.min(WIN_DEFAULT_W, window.innerWidth - 16),
      height: Math.min(WIN_DEFAULT_H, window.innerHeight - 16),
    };
  });

  // Persist position and size to localStorage
  useEffect(() => {
    localStorage.setItem("vita-theme-editor-pos", JSON.stringify(pos));
  }, [pos]);
  useEffect(() => {
    localStorage.setItem("vita-theme-editor-size", JSON.stringify(size));
  }, [size]);

  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Block scroll-through on non-scrollable areas (header, group bar).
  // Allow wheel events inside the scrollable content pane and the
  // horizontally-scrollable module tabs strip. The tabs strip also
  // converts vertical scroll into horizontal scroll for convenience.
  // Must be non-passive so preventDefault() is honoured by the browser.
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const stop = (e: WheelEvent) => {
      // Allow vertical scroll inside the content pane
      if (contentRef.current?.contains(e.target as Node)) return;
      // Convert vertical scroll → horizontal scroll inside the tabs strip
      if (tabsRef.current?.contains(e.target as Node)) {
        tabsRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
        return;
      }
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
      className="fixed rounded-vita-xl font-vita-sans"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex: 99999,
      }}
    >
      <ResizeHandles onStart={startResize} />

      {/* Inner content — card tokens applied so radius/shadow/border reflect theme live */}
      <div
        className="flex h-full flex-col overflow-hidden"
        style={{
          background: "var(--vita-surface)",
          borderRadius: "var(--vita-card-radius)",
          borderTopWidth: "var(--vita-card-border-top)",
          borderRightWidth: "var(--vita-card-border-right)",
          borderBottomWidth: "var(--vita-card-border-bottom)",
          borderLeftWidth: "var(--vita-card-border-left)",
          borderStyle: "solid",
          borderColor: "var(--vita-neutral-200)",
          boxShadow:
            "var(--vita-card-shadow, 0 20px 25px -5px oklch(0 0 0 / 0.1))",
        }}
      >
        {/* Title bar */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: drag handle */}
        <div
          className="flex shrink-0 select-none flex-col border-b cursor-grab"
          style={{
            background: "var(--vita-surface)",
            borderBottomColor: "var(--vita-neutral-200)",
          }}
          onMouseDown={onDragMouseDown}
        >
          {/* Top row: title + actions */}
          <div className="flex h-10 items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <GripHorizontal
                aria-hidden="true"
                size={14}
                className="shrink-0"
                style={{ color: "var(--vita-text-muted)" }}
              />
              <span
                className="text-sm font-semibold font-vita-heading"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t("chrome.title")}
              </span>
            </div>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
            <div
              className="flex items-center gap-1"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Tooltip>
                <button
                  type="button"
                  aria-label={t("chrome.resetAllTooltip")}
                  className="flex h-7 w-7 items-center justify-center transition-colors"
                  style={{ color: "var(--vita-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--vita-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--vita-text-muted)";
                  }}
                  onClick={resetAll}
                >
                  <RotateCcw size={13} />
                </button>
                <Tooltip.Content>{t("chrome.resetAllTooltip")}</Tooltip.Content>
              </Tooltip>
              <Tooltip>
                <button
                  type="button"
                  aria-label={t("chrome.close")}
                  className="flex h-7 w-7 items-center justify-center transition-colors"
                  style={{ color: "var(--vita-text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--vita-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--vita-text-muted)";
                  }}
                  onClick={onClose}
                >
                  <X size={13} />
                </button>
                <Tooltip.Content>{t("chrome.close")}</Tooltip.Content>
              </Tooltip>
            </div>
          </div>

          {/* Theme presets row — separate line, scrollable */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto px-3 py-3"
            style={{ scrollbarWidth: "none" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ModeSwitcher />
          </div>
        </div>

        {/* Search bar */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
        <div
          className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5"
          style={{ borderBottomColor: "var(--vita-neutral-200)" }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Search
            size={12}
            style={{ color: "var(--vita-text-muted)", flexShrink: 0 }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("chrome.searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-xs outline-none"
            style={{
              color: "var(--vita-text-primary)",
              caretColor: "var(--vita-primary)",
            }}
          />
          {search && (
            <button
              type="button"
              className="p-0.5"
              style={{ color: "var(--vita-text-muted)" }}
              onClick={() => setSearch("")}
            >
              <X size={11} />
            </button>
          )}
        </div>

        {isSearching ? (
          /* Search results — flat list */
          /* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */
          <div
            ref={tabsRef}
            className="flex shrink-0 flex-col overflow-y-auto border-b"
            style={{
              borderBottomColor: "var(--vita-neutral-200)",
              maxHeight: "160px",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {searchResults.length === 0 ? (
              <p
                className="px-3 py-3 text-xs"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {t("preview.noResults")}
              </p>
            ) : (
              searchResults.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="px-3 py-1.5 text-left text-xs font-medium font-vita-heading transition-colors"
                  style={
                    activeTab === m.id
                      ? {
                          background: "var(--vita-primary)",
                          color: "var(--vita-text-on-primary)",
                        }
                      : { color: "var(--vita-text-secondary)" }
                  }
                  onClick={() => {
                    setActiveTab(m.id);
                    setSearch("");
                  }}
                >
                  {moduleLabel(m.id)}
                </button>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Group selector */}
            {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
            <div
              className="flex shrink-0 items-center gap-1 overflow-x-auto border-b px-3 py-1.5"
              style={{
                background: "var(--vita-surface)",
                borderBottomColor: "var(--vita-neutral-200)",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {GROUPS.map(({ group }) => (
                <button
                  key={group}
                  type="button"
                  className="whitespace-nowrap px-2.5 py-0.5 text-xs font-medium transition-colors"
                  style={
                    activeGroup === group
                      ? {
                          background: "var(--vita-primary)",
                          color: "var(--vita-text-on-primary)",
                        }
                      : {
                          background: "transparent",
                          color: "var(--vita-text-secondary)",
                        }
                  }
                  onClick={() => switchGroup(group)}
                >
                  {groupLabel(group)}
                </button>
              ))}
            </div>

            {/* Module tabs — only active group's items */}
            {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
            <div
              ref={tabsRef}
              className="flex shrink-0 items-center overflow-x-auto border-b px-1"
              style={{
                borderBottomColor: "var(--vita-neutral-200)",
                scrollbarWidth: "none",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {activeGroupItems.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="relative px-3 py-2 text-xs font-medium font-vita-heading whitespace-nowrap transition-colors"
                  style={
                    activeTab === m.id
                      ? { color: "var(--vita-primary)" }
                      : { color: "var(--vita-text-muted)" }
                  }
                  onClick={() => setActiveTab(m.id)}
                >
                  {moduleLabel(m.id)}
                  {activeTab === m.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: "var(--vita-primary)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: stop drag propagation */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {moduleLabel(active.id)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => resetColor(active.resetKeys)}
            >
              <RotateCcw size={10} />
              {t("chrome.reset")}
            </Button>
          </div>
          <active.component />
        </div>
      </div>
    </div>
  );
}
