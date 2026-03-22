"use client";

/**
 * CalculateTab — expression editor for calculate-type fields.
 *
 * Provides a textarea for entering calculation expressions that reference
 * other fields via {field_id} syntax. Displays a list of available field
 * IDs for easy reference.
 */

import { useTranslations } from "next-intl";

import { Label, TextArea, TextField } from "@/components/ui/textarea";

import { collectFields } from "../../shared/schema-utils";
import type { ConfigTabProps } from "../../types";

export function CalculateTab({ field, onUpdate, allElements }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  // All fields except the current calculate field itself
  const availableFields = collectFields(allElements).filter(
    (f) => f.id !== field.id,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Expression textarea */}
      <TextField>
        <Label>{t("config.calculate.expression")}</Label>
        <TextArea
          value={field.calculate ?? ""}
          onChange={(e) => onUpdate({ calculate: e.target.value || undefined })}
          placeholder={t("config.calculate.expressionPlaceholder")}
          rows={4}
          className="font-mono"
        />
      </TextField>

      {/* Syntax description */}
      <div
        className="rounded-vita-md p-3"
        style={{
          background: "var(--vita-info-light)",
          border: "1px solid var(--vita-neutral-200)",
        }}
      >
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.calculate.syntaxHint")}
        </p>
      </div>

      {/* Available fields reference */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.calculate.availableFields")}
        </span>

        {availableFields.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
            {t("config.calculate.noFieldsAvailable")}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {availableFields.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 rounded-vita-sm px-2 py-1"
                style={{ background: "var(--vita-background)" }}
              >
                <code
                  className="rounded-vita-sm px-1.5 py-0.5 text-[11px]"
                  style={{
                    background: "var(--vita-neutral-100)",
                    color: "var(--vita-primary)",
                    fontFamily: "monospace",
                  }}
                >
                  {`{${f.id}}`}
                </code>
                <span
                  className="truncate text-xs"
                  style={{ color: "var(--vita-text-muted)" }}
                >
                  {f.label || f.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
