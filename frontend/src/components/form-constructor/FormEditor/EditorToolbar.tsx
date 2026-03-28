"use client";

/**
 * EditorToolbar — top bar with form name, undo/redo, preview, export/import.
 */

import {
  Download,
  Eye,
  EyeOff,
  Redo2,
  Settings,
  Undo2,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import type { FormSchema } from "../types";

type EditorToolbarProps = {
  schema: FormSchema;
  showPreview: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNameChange: (name: string) => void;
  onTogglePreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onImport: (schema: FormSchema) => void;
  onOpenSettings: () => void;
};

export function EditorToolbar({
  schema,
  showPreview,
  canUndo,
  canRedo,
  onNameChange,
  onTogglePreview,
  onUndo,
  onRedo,
  onImport,
  onOpenSettings,
}: EditorToolbarProps) {
  const t = useTranslations("formConstructor");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schema.name || "form"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as FormSchema;
        if (parsed.version === 1 && Array.isArray(parsed.elements)) {
          onImport(parsed);
        }
      } catch {
        // Invalid JSON — ignore
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported
    e.target.value = "";
  }

  const iconBtnClass =
    "flex h-8 w-8 items-center justify-center rounded-vita-md transition-colors";

  return (
    <div className="flex items-center gap-3">
      {/* Form name */}
      <Input
        className="flex-1"
        placeholder={t("editor.formNamePlaceholder")}
        value={schema.name}
        onChange={(e) => onNameChange(e.target.value)}
      />

      {/* Undo / Redo */}
      <button
        type="button"
        title={t("editor.undo")}
        className={iconBtnClass}
        style={{
          color: canUndo
            ? "var(--vita-text-secondary)"
            : "var(--vita-neutral-300)",
        }}
        disabled={!canUndo}
        onClick={onUndo}
      >
        <Undo2 size={16} />
      </button>
      <button
        type="button"
        title={t("editor.redo")}
        className={iconBtnClass}
        style={{
          color: canRedo
            ? "var(--vita-text-secondary)"
            : "var(--vita-neutral-300)",
        }}
        disabled={!canRedo}
        onClick={onRedo}
      >
        <Redo2 size={16} />
      </button>

      {/* Preview toggle */}
      <button
        type="button"
        title={t("editor.preview")}
        className={iconBtnClass}
        style={{
          color: showPreview
            ? "var(--vita-primary)"
            : "var(--vita-text-secondary)",
        }}
        onClick={onTogglePreview}
      >
        {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {/* Form settings */}
      <button
        type="button"
        title={t("formSettings.title")}
        className={iconBtnClass}
        style={{ color: "var(--vita-text-secondary)" }}
        onClick={onOpenSettings}
      >
        <Settings size={16} />
      </button>

      {/* Export */}
      <button
        type="button"
        title={t("editor.exportJson")}
        className={iconBtnClass}
        style={{ color: "var(--vita-text-secondary)" }}
        onClick={handleExport}
      >
        <Download size={16} />
      </button>

      {/* Import */}
      <button
        type="button"
        title={t("editor.importJson")}
        className={iconBtnClass}
        style={{ color: "var(--vita-text-secondary)" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
