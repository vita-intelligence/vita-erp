"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { FullscreenEditor } from "./FullscreenEditor";
import { WindowEditor } from "./WindowEditor";

export type ThemeEditorMode = "fullscreen" | "window";

type ThemeEditorProps = {
  mode: ThemeEditorMode;
  open: boolean;
  onClose: () => void;
};

export function ThemeEditor({ mode, open, onClose }: ThemeEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => setMounted(true), []);

  if (!mounted || !open) return null;

  const content =
    mode === "fullscreen" ? (
      <FullscreenEditor
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />
    ) : (
      <WindowEditor
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={onClose}
      />
    );

  return createPortal(content, document.body);
}
