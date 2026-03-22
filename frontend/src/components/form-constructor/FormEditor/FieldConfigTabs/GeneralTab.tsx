"use client";

/**
 * GeneralTab — basic field settings: ID, label, description, required, hidden.
 *
 * Validates field ID uniqueness using isIdUnique from schema-utils and
 * displays an inline warning when the entered ID collides with another element.
 */

import { useTranslations } from "next-intl";
import { isIdUnique } from "../../shared/schema-utils";
import type { ConfigTabProps } from "../../types";

export function GeneralTab({ field, onUpdate, allElements }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  // Check uniqueness excluding the field's own original ID
  const idDuplicate =
    field.id.trim() !== "" && !isIdUnique(field.id, allElements, field.id);

  return (
    <div className="flex flex-col gap-5">
      {/* Field ID */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.general.fieldId")}
        </span>
        <input
          type="text"
          value={field.id}
          onChange={(e) => onUpdate({ id: e.target.value })}
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: idDuplicate
              ? "1px solid var(--vita-warning)"
              : "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        />
        {idDuplicate && (
          <span className="text-xs" style={{ color: "var(--vita-warning)" }}>
            {t("config.general.duplicateIdWarning")}
          </span>
        )}
      </label>

      {/* Label */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.general.label")}
        </span>
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.general.description")}
        </span>
        <input
          type="text"
          value={field.description ?? ""}
          onChange={(e) =>
            onUpdate({ description: e.target.value || undefined })
          }
          placeholder={t("config.general.descriptionPlaceholder")}
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        />
      </label>

      {/* Required toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.general.required")}
          </span>
          <span className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
            {t("config.general.requiredHint")}
          </span>
        </div>
        <div
          role="switch"
          aria-checked={field.required}
          tabIndex={0}
          className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors"
          style={{
            background: field.required
              ? "var(--vita-primary)"
              : "var(--vita-neutral-300)",
          }}
          onClick={() => onUpdate({ required: !field.required })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onUpdate({ required: !field.required });
            }
          }}
        >
          <span
            className="absolute top-0.5 block h-4 w-4 rounded-full transition-transform"
            style={{
              background: "var(--vita-surface)",
              transform: field.required
                ? "translateX(18px)"
                : "translateX(2px)",
            }}
          />
        </div>
      </div>

      {/* Hidden toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.general.hidden")}
          </span>
          <span className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
            {t("config.general.hiddenHint")}
          </span>
        </div>
        <div
          role="switch"
          aria-checked={field.hidden}
          tabIndex={0}
          className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors"
          style={{
            background: field.hidden
              ? "var(--vita-primary)"
              : "var(--vita-neutral-300)",
          }}
          onClick={() => onUpdate({ hidden: !field.hidden })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onUpdate({ hidden: !field.hidden });
            }
          }}
        >
          <span
            className="absolute top-0.5 block h-4 w-4 rounded-full transition-transform"
            style={{
              background: "var(--vita-surface)",
              transform: field.hidden ? "translateX(18px)" : "translateX(2px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
