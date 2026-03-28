"use client";

/**
 * RichTextEditor — universal rich text editing component for Vita ERP.
 *
 * Two modes:
 *   - Rich: BlockNote WYSIWYG (Notion-style block editor)
 *   - Code: raw Markdown with live split-screen preview
 *
 * Content is stored as BlockNote JSON (array of blocks).
 * Can be used inline (embedded) or as a fullscreen overlay.
 */

import { Code, Eye, Trash2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme";

import { CodeEditor } from "./CodeEditor";
import type { EditorMode, RichTextEditorProps } from "./types";

// Dynamic import — BlockNote needs browser APIs
const BlockNoteEditor = dynamic(
  () =>
    import("./BlockNoteEditor").then((m) => ({
      default: m.BlockNoteEditorInner,
    })),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

function EditorSkeleton() {
  return (
    <div
      className="flex flex-1 items-center justify-center"
      style={{ color: "var(--vita-text-muted)" }}
    >
      <p className="text-sm">Loading editor...</p>
    </div>
  );
}

export function RichTextEditor({
  content = "",
  onChange,
  readOnly = false,
  fullscreen = false,
  onClose,
  title,
  onSave,
  isSaving,
  minHeight = "400px",
  placeholder,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<EditorMode>("rich");
  const [richContent, setRichContent] = useState(content);
  const [codeContent, setCodeContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const { mode: themeMode } = useThemeStore();
  const isDark = themeMode === "dark";

  // Sync rich content changes upward
  const handleRichChange = useCallback(
    (json: string) => {
      setRichContent(json);
      onChange?.(json);
    },
    [onChange],
  );

  // Sync code content — store as-is (markdown string, not JSON)
  const handleCodeChange = useCallback(
    (md: string) => {
      setCodeContent(md);
      // In code mode, we still notify parent but with raw markdown
      // The consumer decides how to handle it
      onChange?.(md);
    },
    [onChange],
  );

  const handleClear = () => {
    setRichContent("");
    setCodeContent("");
    setEditorKey((k) => k + 1);
    onChange?.("");
  };

  const handleSave = () => {
    const toSave = mode === "rich" ? richContent : codeContent;
    onSave?.(toSave);
  };

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  // ── Editor content ──────────────────────────────────────────────────────

  const editorContent = (
    <div
      className="flex flex-1 flex-col overflow-hidden"
      style={{
        background: isDark ? "oklch(0.15 0 0)" : "var(--vita-background)",
      }}
    >
      {mode === "rich" ? (
        <div className="flex-1 overflow-y-auto">
          <BlockNoteEditor
            key={editorKey}
            content={richContent}
            onChange={handleRichChange}
            readOnly={readOnly}
            isDark={isDark}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <div className="flex-1">
          <CodeEditor
            content={codeContent}
            onChange={handleCodeChange}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );

  // ── Toolbar ─────────────────────────────────────────────────────────────

  const toolbar = (
    <div
      className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6"
      style={{
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "var(--vita-neutral-200)",
        background: "var(--vita-surface)",
      }}
    >
      {/* Left — title */}
      <div className="flex min-w-0 flex-col gap-0.5">
        {title && (
          <p
            className="truncate text-sm font-bold uppercase"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {title}
          </p>
        )}
      </div>

      {/* Center — mode toggle */}
      <div
        className="flex shrink-0 items-center gap-1 p-1"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "var(--vita-neutral-200)",
          borderRadius: "var(--vita-input-radius, 6px)",
        }}
      >
        <button
          type="button"
          onClick={() => setMode("rich")}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors md:px-3"
          style={{
            background: mode === "rich" ? "var(--vita-primary)" : "transparent",
            color:
              mode === "rich"
                ? "var(--vita-text-on-primary, #fff)"
                : "var(--vita-text-muted)",
            borderRadius: "calc(var(--vita-input-radius, 6px) - 2px)",
          }}
        >
          <Eye size={12} />
          <span className="hidden sm:inline">Rich</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("code")}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors md:px-3"
          style={{
            background: mode === "code" ? "var(--vita-primary)" : "transparent",
            color:
              mode === "code"
                ? "var(--vita-text-on-primary, #fff)"
                : "var(--vita-text-muted)",
            borderRadius: "calc(var(--vita-input-radius, 6px) - 2px)",
          }}
        >
          <Code size={12} />
          <span className="hidden sm:inline">Code</span>
        </button>
      </div>

      {/* Right — actions */}
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {!readOnly && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-colors"
            style={{ color: "var(--vita-text-muted)" }}
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
        {onSave && !readOnly && (
          <Button
            onPress={handleSave}
            variant="primary"
            size="sm"
            isDisabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
        {fullscreen && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="transition-colors"
            style={{ color: "var(--vita-text-muted)" }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Fullscreen mode ─────────────────────────────────────────────────────

  if (fullscreen) {
    return createPortal(
      <div
        ref={panelRef}
        className="fixed inset-0 flex flex-col"
        style={{
          zIndex: 99998,
          background: "var(--vita-background)",
        }}
      >
        {toolbar}
        {editorContent}
      </div>,
      document.body,
    );
  }

  // ── Inline (embedded) mode ──────────────────────────────────────────────

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        minHeight,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--vita-neutral-200)",
        borderRadius: "var(--vita-input-radius, 8px)",
        background: "var(--vita-surface)",
      }}
    >
      {toolbar}
      {editorContent}
    </div>
  );
}
