"use client";

import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { PAPER_SIZES, TEXT_DIRECTIONS } from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function DocumentDefaultsSection({ control, t }: Props) {
  return (
    <Section
      title={t("sections.document_defaults")}
      description={t("sections.document_defaults_description")}
    >
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
      <div className="py-4">
        <span className="block text-sm font-medium text-vita-text-primary">
          {t("fields.default_document_language")}
        </span>
        <span className="mb-2 block text-xs text-vita-text-muted">
          {t("descriptions.default_document_language")}
        </span>
        <Controller
          name="default_document_language"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              value={String(field.value)}
              onChange={field.onChange}
              maxLength={10}
              placeholder="en"
              aria-label={t("fields.default_document_language")}
            />
          )}
        />
      </div>
    </Section>
  );
}
