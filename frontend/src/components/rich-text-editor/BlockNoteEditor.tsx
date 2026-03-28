"use client";

/**
 * BlockNoteEditor — WYSIWYG rich text editor powered by BlockNote.
 *
 * Must be dynamically imported with { ssr: false } since BlockNote
 * requires browser APIs (DOM, Selection, etc.).
 */

import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";

import type { Block } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";

type BlockNoteEditorProps = {
  content?: string;
  onChange?: (json: string) => void;
  readOnly?: boolean;
  isDark?: boolean;
  placeholder?: string;
};

export function BlockNoteEditorInner({
  content,
  onChange,
  readOnly,
  isDark,
  placeholder,
}: BlockNoteEditorProps) {
  // Parse initial content from JSON string
  let initialContent: Block[] | undefined;
  if (content) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        initialContent = parsed;
      }
    } catch {
      // Not valid JSON — start empty
    }
  }

  const editor = useCreateBlockNote({
    initialContent,
    defaultStyles: true,
  });

  // Track changes and emit JSON string
  useEditorChange(() => {
    if (onChange) {
      onChange(JSON.stringify(editor.document));
    }
  }, editor);

  return (
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      theme={isDark ? "dark" : "light"}
      data-placeholder={placeholder}
    />
  );
}
