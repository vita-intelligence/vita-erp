"use client";

/**
 * CodeEditor — raw Markdown editor with live preview.
 *
 * Split view on desktop (write | preview), tabbed on mobile.
 * Uses `marked` for Markdown → HTML rendering.
 */

import { marked } from "marked";
import { useState } from "react";

marked.setOptions({ breaks: true, gfm: true });

type CodeEditorProps = {
  content: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
};

type CodeTab = "write" | "preview";

export function CodeEditor({ content, onChange, readOnly }: CodeEditorProps) {
  const [tab, setTab] = useState<CodeTab>("write");
  const preview = marked(content || "") as string;

  return (
    <div className="flex h-full flex-col">
      {/* Mobile tab switcher */}
      <div
        className="flex shrink-0 md:hidden"
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "var(--vita-neutral-200)",
        }}
      >
        <button
          type="button"
          onClick={() => setTab("write")}
          className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors"
          style={{
            background:
              tab === "write" ? "var(--vita-text-primary)" : "transparent",
            color:
              tab === "write"
                ? "var(--vita-background)"
                : "var(--vita-text-muted)",
          }}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className="flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors"
          style={{
            background:
              tab === "preview" ? "var(--vita-text-primary)" : "transparent",
            color:
              tab === "preview"
                ? "var(--vita-background)"
                : "var(--vita-text-muted)",
          }}
        >
          Preview
        </button>
      </div>

      {/* Editor panes */}
      <div className="flex flex-1 overflow-hidden">
        {/* Write pane */}
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`resize-none p-6 font-mono text-sm outline-none ${
            tab === "preview" ? "hidden md:flex md:flex-1" : "flex-1 md:flex-1"
          }`}
          style={{
            background: "oklch(0.15 0 0)",
            color: "#4ade80",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderRightColor: "var(--vita-neutral-200)",
          }}
          placeholder="Write markdown here..."
          spellCheck={false}
        />

        {/* Preview pane */}
        <div
          className={`overflow-y-auto p-6 ${
            tab === "write" ? "hidden md:block md:flex-1" : "flex-1 md:flex-1"
          }`}
          style={{
            background: "var(--vita-background)",
            color: "var(--vita-text-primary)",
          }}
        >
          <div
            className="prose max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown preview
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  );
}
