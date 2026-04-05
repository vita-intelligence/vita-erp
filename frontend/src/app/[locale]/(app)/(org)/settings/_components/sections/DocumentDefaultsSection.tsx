"use client";

import { Controller } from "react-hook-form";

import {
  ComboBox,
  ComboBoxInput,
  ComboBoxInputGroup,
  ComboBoxListBox,
  ComboBoxPopover,
  ComboBoxTrigger,
} from "@/components/ui/combo-box";
import { ListBox } from "@/components/ui/select";
import { I18N } from "@/config";

import { PAPER_SIZES, TEXT_DIRECTIONS } from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

/** Native language names — displayed in each language's own script/label. */
const LOCALE_NATIVE_NAMES: Record<(typeof I18N.locales)[number], string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  hi: "हिन्दी",
  ar: "العربية",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  it: "Italiano",
  tr: "Türkçe",
  id: "Bahasa Indonesia",
};

export default function DocumentDefaultsSection({ control, t }: Props) {
  const languageLabel = t("fields.default_document_language");
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
          {languageLabel}
        </span>
        <span className="mb-2 block text-xs text-vita-text-muted">
          {t("descriptions.default_document_language")}
        </span>
        <Controller
          name="default_document_language"
          control={control}
          render={({ field }) => (
            <ComboBox
              selectedKey={String(field.value)}
              onSelectionChange={(key) => {
                if (key == null) return;
                field.onChange(String(key));
              }}
              aria-label={languageLabel}
              allowsCustomValue={false}
              menuTrigger="focus"
            >
              <ComboBoxInputGroup>
                <ComboBoxInput
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: "8px 12px",
                    fontSize: "var(--vita-input-font-size, 14px)",
                    color: "var(--vita-text-primary)",
                  }}
                />
                <ComboBoxTrigger />
              </ComboBoxInputGroup>
              <ComboBoxPopover>
                <ComboBoxListBox>
                  {I18N.locales.map((code) => (
                    <ListBox.Item
                      key={code}
                      id={code}
                      textValue={`${LOCALE_NATIVE_NAMES[code]} ${code}`}
                    >
                      {LOCALE_NATIVE_NAMES[code]}{" "}
                      <span style={{ color: "var(--vita-text-muted)" }}>
                        ({code})
                      </span>
                    </ListBox.Item>
                  ))}
                </ComboBoxListBox>
              </ComboBoxPopover>
            </ComboBox>
          )}
        />
      </div>
    </Section>
  );
}
