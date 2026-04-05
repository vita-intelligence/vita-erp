"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { type Control, useForm } from "react-hook-form";

import { ButtonRoot } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { updateCompanySettings } from "@/services/company-settings";

import { useCompanySettings } from "../_hooks/useCompanySettings";
import {
  type CompanySettings,
  type CompanySettingsResponse,
  companySettingsSchema,
} from "../_types/company-settings";
import type { SettingsFieldProps } from "./fields/types";
import CurrencyDisplaySection from "./sections/CurrencyDisplaySection";
import DateTimeSection from "./sections/DateTimeSection";
import DocumentDefaultsSection from "./sections/DocumentDefaultsSection";
import FiscalSection from "./sections/FiscalSection";
import MeasurementSection from "./sections/MeasurementSection";
import NumberFormattingSection from "./sections/NumberFormattingSection";
import PrecisionSection from "./sections/PrecisionSection";
import RoundingSection from "./sections/RoundingSection";

type TFn = SettingsFieldProps["t"];
type SectionRenderer = (control: Control<CompanySettings>, t: TFn) => ReactNode;

const SECTIONS: {
  id: string;
  titleKey: string;
  render: SectionRenderer;
}[] = [
  {
    id: "number_formatting",
    titleKey: "sections.number_formatting",
    render: (control, t) => <NumberFormattingSection control={control} t={t} />,
  },
  {
    id: "precision",
    titleKey: "sections.precision",
    render: (control, t) => <PrecisionSection control={control} t={t} />,
  },
  {
    id: "currency_display",
    titleKey: "sections.currency_display",
    render: (control, t) => <CurrencyDisplaySection control={control} t={t} />,
  },
  {
    id: "rounding",
    titleKey: "sections.rounding",
    render: (control, t) => <RoundingSection control={control} t={t} />,
  },
  {
    id: "date_time",
    titleKey: "sections.date_time",
    render: (control, t) => <DateTimeSection control={control} t={t} />,
  },
  {
    id: "measurement",
    titleKey: "sections.measurement",
    render: (control, t) => <MeasurementSection control={control} t={t} />,
  },
  {
    id: "fiscal",
    titleKey: "sections.fiscal",
    render: (control, t) => <FiscalSection control={control} t={t} />,
  },
  {
    id: "document_defaults",
    titleKey: "sections.document_defaults",
    render: (control, t) => <DocumentDefaultsSection control={control} t={t} />,
  },
];

const SECTION_IDS = SECTIONS.map((s) => s.id);

type GeneralSettingsProps = {
  activeSection: string | null;
  onSectionChange: (section: string) => void;
};

function extractFormValues(settings: CompanySettingsResponse): CompanySettings {
  const { created_at: _, updated_at: __, ...formValues } = settings;
  return formValues;
}

export default function GeneralSettings(props: GeneralSettingsProps) {
  const { data: settings, isLoading } = useCompanySettings();

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return <GeneralSettingsForm settings={settings} {...props} />;
}

function GeneralSettingsForm({
  settings,
  activeSection: activeSectionProp,
  onSectionChange,
}: { settings: CompanySettingsResponse } & GeneralSettingsProps) {
  const t = useTranslations("companySettings");
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields, isSubmitting },
  } = useForm<CompanySettings>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: extractFormValues(settings),
  });

  const activeSection =
    activeSectionProp && SECTION_IDS.includes(activeSectionProp)
      ? activeSectionProp
      : SECTION_IDS[0];
  const active = SECTIONS.find((s) => s.id === activeSection) ?? SECTIONS[0];

  const onSubmit = async (data: CompanySettings) => {
    const patch: Partial<CompanySettings> = {};
    for (const key of Object.keys(dirtyFields) as (keyof CompanySettings)[]) {
      (patch as Record<string, unknown>)[key] = data[key];
    }

    if (Object.keys(patch).length === 0) {
      toast(t("no_changes"));
      return;
    }

    try {
      const fresh = await updateCompanySettings(patch);
      toast.success(t("saved"));
      reset(extractFormValues(fresh));
    } catch {
      toast.danger(t("errors.save_failed"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex min-h-[60vh] flex-col gap-6 md:flex-row">
        {/* Sidebar nav */}
        <nav className="shrink-0 md:w-56" aria-label={t("page.title")}>
          {/* Mobile: horizontal scrolling tabs */}
          <div
            className="flex items-center overflow-x-auto border-b md:hidden"
            style={{ borderColor: "var(--vita-neutral-200)" }}
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="relative shrink-0 px-3 py-2.5 text-sm font-medium font-vita-heading whitespace-nowrap transition-colors"
                style={
                  activeSection === s.id
                    ? { color: "var(--vita-primary)" }
                    : { color: "var(--vita-text-muted)" }
                }
                onClick={() => onSectionChange(s.id)}
              >
                {t(s.titleKey)}
                {activeSection === s.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "var(--vita-primary)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop: vertical sidebar */}
          <ul className="hidden flex-col gap-0.5 md:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="w-full rounded-vita-md px-3 py-2 text-left transition-colors"
                  style={
                    activeSection === s.id
                      ? {
                          background: "var(--vita-primary)",
                          color: "var(--vita-text-on-primary)",
                        }
                      : { color: "var(--vita-text-secondary)" }
                  }
                  onClick={() => onSectionChange(s.id)}
                >
                  <p className="text-sm font-medium font-vita-heading">
                    {t(s.titleKey)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Active section content */}
        <div className="min-w-0 flex-1">{active.render(control, t)}</div>
      </div>

      {/* Sticky save bar */}
      <div
        className="sticky bottom-0 -mx-6 mt-6 flex items-center gap-3 border-t px-6 py-4"
        style={{
          backgroundColor: "var(--vita-background)",
          borderColor: "color-mix(in srgb, currentColor 15%, transparent)",
        }}
      >
        <ButtonRoot type="submit" isDisabled={!isDirty || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            t("save")
          )}
        </ButtonRoot>
      </div>
    </form>
  );
}
