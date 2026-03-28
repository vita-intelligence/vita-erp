"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import type { FieldRendererProps } from "../../types";

export function FileRenderer({
  field,
  value,
  onChange,
  error,
  readOnly,
}: FieldRendererProps) {
  const t = useTranslations("formConstructor");
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = field.type === "image";
  const file = value as File | null;

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept={isImage ? "image/*" : undefined}
        className="hidden"
        disabled={readOnly}
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          onChange(selected);
        }}
      />

      {/* Dropzone-style area */}
      {!file ? (
        <button
          type="button"
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-vita-lg border-2 border-dashed px-4 py-8 transition-colors hover:border-solid"
          style={{
            borderColor: error
              ? "var(--vita-error)"
              : "var(--vita-neutral-300)",
            color: "var(--vita-text-muted)",
            background: "var(--vita-background)",
          }}
          onClick={() => !readOnly && inputRef.current?.click()}
          disabled={readOnly}
        >
          <p className="text-sm">{t("viewer.file.dropzone")}</p>
        </button>
      ) : (
        <div
          className="flex items-center justify-between rounded-vita-lg px-4 py-3"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
          }}
        >
          <span
            className="truncate text-sm"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {file.name}
          </span>
          {!readOnly && (
            <Button
              size="sm"
              variant="ghost"
              onPress={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              {t("viewer.file.remove")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
