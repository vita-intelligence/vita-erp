"use client";

import { Controller } from "react-hook-form";

import { PAPER_SIZES, TEXT_DIRECTIONS } from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function DocumentDefaultsSection({ control, t }: Props) {
  return (
    <Section title={t("sections.document_defaults")}>
      <SelectField
        name="default_paper_size"
        options={PAPER_SIZES}
        optionKey="default_paper_size"
        control={control}
        t={t}
      />
      <SelectField
        name="text_direction"
        options={TEXT_DIRECTIONS}
        optionKey="text_direction"
        control={control}
        t={t}
      />
      <div>
        <span className="mb-1 block text-sm font-medium">
          {t("fields.default_document_language")}
        </span>
        <Controller
          name="default_document_language"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              value={String(field.value)}
              onChange={field.onChange}
              maxLength={10}
              placeholder="en"
              aria-label={t("fields.default_document_language")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{
                borderRadius: "var(--vita-input-radius, 0px)",
                borderColor: "var(--vita-input-border-color, #d4d4d8)",
              }}
            />
          )}
        />
      </div>
    </Section>
  );
}
