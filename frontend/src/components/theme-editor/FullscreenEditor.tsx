"use client";

import { RotateCcw, X } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme";

import { groupedModules, THEME_EDITOR_MODULES } from "./config";
import { ModeSwitcher } from "./ModeSwitcher";
import { PreviewExternalProvider } from "./modules/_shared";

const GROUPS = groupedModules();

/** Tailwind lg breakpoint (1024px) — true when viewport is lg or wider. */
const LG_QUERY = "(min-width: 1024px)";
const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(LG_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(LG_QUERY).matches;
const getServerSnapshot = () => false;

function useIsLg() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type Props = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onClose: () => void;
};

export function FullscreenEditor({ activeTab, setActiveTab, onClose }: Props) {
  const { resetAll, resetColor } = useThemeStore();
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

  const isLg = useIsLg();
  const hasPreview = !!active.preview;
  const showSplitPreview = hasPreview && isLg;

  // Lock background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-vita-modal flex flex-col bg-vita-background font-vita-sans">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-vita-neutral-200 bg-vita-surface px-4 md:px-6">
        <h1 className="text-sm font-semibold font-vita-heading text-vita-text-primary md:text-base">
          Brand &amp; Theme Editor
        </h1>
        <div className="flex items-center gap-2">
          <ModeSwitcher />
          <button
            type="button"
            className="hidden h-8 items-center rounded-vita-md border border-vita-neutral-200 px-3 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100 sm:flex"
            onClick={resetAll}
          >
            Reset all
          </button>
          <button
            type="button"
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-vita-md text-vita-text-muted transition-colors hover:bg-vita-neutral-100 hover:text-vita-text-primary"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Mobile: two-level nav */}
        <nav className="shrink-0 border-b border-vita-neutral-200 bg-vita-surface md:hidden">
          {/* Group selector */}
          <div className="flex items-center gap-1 border-b border-vita-neutral-100 bg-vita-neutral-50 px-3 py-1.5">
            {GROUPS.map(({ group }) => (
              <Button
                key={group}
                variant={activeGroup === group ? "primary" : "ghost"}
                size="sm"
                onPress={() => switchGroup(group)}
              >
                {group}
              </Button>
            ))}
          </div>
          {/* Module tabs for active group */}
          <div className="flex items-center overflow-x-auto px-1">
            {activeGroupItems.map((m) => (
              <button
                key={m.id}
                type="button"
                className="relative shrink-0 px-3 py-2.5 text-sm font-medium font-vita-heading whitespace-nowrap transition-colors"
                style={
                  activeTab === m.id
                    ? { color: "var(--vita-primary)" }
                    : { color: "var(--vita-text-muted)" }
                }
                onClick={() => setActiveTab(m.id)}
              >
                {m.label}
                {activeTab === m.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "var(--vita-primary)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Desktop: grouped sidebar */}
        <nav className="hidden w-56 shrink-0 flex-col border-r border-vita-neutral-200 bg-vita-surface md:flex">
          <div className="flex-1 overflow-y-auto py-2">
            {GROUPS.map(({ group, items }) => (
              <div key={group} className="mb-1">
                <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-vita-text-muted">
                  {group}
                </p>
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="w-full px-4 py-2.5 text-left transition-colors"
                    style={
                      activeTab === m.id
                        ? {
                            background: "var(--vita-primary)",
                            color: "var(--vita-text-on-primary)",
                          }
                        : { color: "var(--vita-text-secondary)" }
                    }
                    onClick={() => setActiveTab(m.id)}
                  >
                    <p className="text-sm font-medium font-vita-heading">
                      {m.label}
                    </p>
                    <p
                      className="text-xs leading-tight"
                      style={
                        activeTab === m.id
                          ? { color: "var(--vita-text-on-primary-muted)" }
                          : { color: "var(--vita-text-muted)" }
                      }
                    >
                      {m.description}
                    </p>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-vita-neutral-200 p-3">
            <button
              type="button"
              className="w-full rounded-vita-md border border-vita-neutral-200 py-2 text-xs text-vita-text-secondary transition-colors hover:bg-vita-neutral-100"
              onClick={resetAll}
            >
              Reset all to defaults
            </button>
          </div>
        </nav>

        {/* Content — two-column on lg+ when module has a preview */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div
            className={
              showSplitPreview
                ? "mx-auto max-w-5xl lg:flex lg:items-start lg:gap-8"
                : "mx-auto max-w-2xl"
            }
          >
            {/* Controls column */}
            <div className={showSplitPreview ? "min-w-0 flex-1" : undefined}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
                    {active.label}
                  </h2>
                  <p className="text-xs text-vita-text-muted">
                    {active.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => resetColor(active.resetKeys)}
                >
                  <RotateCcw size={11} />
                  Reset section
                </Button>
              </div>
              {showSplitPreview ? (
                <PreviewExternalProvider value={true}>
                  <active.component />
                </PreviewExternalProvider>
              ) : (
                <active.component />
              )}
            </div>

            {/* Sticky preview pane — only rendered on lg+ */}
            {showSplitPreview && active.preview && (
              <div className="w-[400px] shrink-0 sticky top-4 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
                <active.preview />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
