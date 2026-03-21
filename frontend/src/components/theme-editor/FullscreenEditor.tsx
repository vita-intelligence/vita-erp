"use client";

import { useEffect } from "react";

import { useThemeStore } from "@/stores/theme";

import { THEME_EDITOR_MODULES } from "./config";
import { ModeSwitcher } from "./ModeSwitcher";

type Props = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onClose: () => void;
};

export function FullscreenEditor({ activeTab, setActiveTab, onClose }: Props) {
  const { resetAll } = useThemeStore();
  const active =
    THEME_EDITOR_MODULES.find((m) => m.id === activeTab) ??
    THEME_EDITOR_MODULES[0];

  // Lock background scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-vita-modal flex flex-col bg-vita-background">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-vita-neutral-200 bg-vita-surface px-4 md:px-6">
        <h1 className="text-sm font-semibold text-vita-neutral-900 md:text-base">
          Brand &amp; Theme Editor
        </h1>
        <div className="flex items-center gap-2">
          <ModeSwitcher />
          <button
            type="button"
            className="hidden rounded-vita-md border border-vita-neutral-200 px-3 py-1 text-xs text-vita-neutral-600 transition-colors hover:bg-vita-neutral-100 sm:block"
            onClick={resetAll}
          >
            Reset all
          </button>
          <button
            type="button"
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-vita-md text-vita-neutral-500 transition-colors hover:bg-vita-neutral-100 hover:text-vita-neutral-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Mobile: horizontal scrollable tabs */}
        <nav className="flex shrink-0 overflow-x-auto border-b border-vita-neutral-200 bg-vita-surface md:hidden">
          {THEME_EDITOR_MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="relative shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
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
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--vita-primary)" }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop: sidebar */}
        <nav className="hidden w-56 shrink-0 flex-col border-r border-vita-neutral-200 bg-vita-surface md:flex">
          <ul className="flex-1 space-y-0.5 p-3">
            {THEME_EDITOR_MODULES.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className="w-full rounded-vita-md px-3 py-2.5 text-left transition-colors"
                  style={
                    activeTab === m.id
                      ? {
                          background: "var(--vita-primary)",
                          color: "var(--vita-text-on-primary)",
                        }
                      : { color: "var(--vita-neutral-700)" }
                  }
                  onClick={() => setActiveTab(m.id)}
                >
                  <p className="text-sm font-medium">{m.label}</p>
                  <p
                    className="text-xs leading-tight"
                    style={
                      activeTab === m.id
                        ? { color: "var(--vita-text-on-primary-muted)" }
                        : { color: "var(--vita-neutral-400)" }
                    }
                  >
                    {m.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-vita-neutral-200 p-3">
            <button
              type="button"
              className="w-full rounded-vita-md border border-vita-neutral-200 py-2 text-xs text-vita-neutral-600 transition-colors hover:bg-vita-neutral-100"
              onClick={resetAll}
            >
              Reset all to defaults
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-2xl">
            <active.component />
          </div>
        </div>
      </div>
    </div>
  );
}
