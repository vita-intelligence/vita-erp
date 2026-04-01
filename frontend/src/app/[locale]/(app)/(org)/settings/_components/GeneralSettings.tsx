"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { ButtonRoot } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { updateCompanySettings } from "@/services/company-settings";

import { useCompanySettings } from "../_hooks/useCompanySettings";
import {
  type CompanySettings,
  type CompanySettingsResponse,
  companySettingsSchema,
} from "../_types/company-settings";
import CurrencyDisplaySection from "./sections/CurrencyDisplaySection";
import DateTimeSection from "./sections/DateTimeSection";
import DocumentDefaultsSection from "./sections/DocumentDefaultsSection";
import FiscalSection from "./sections/FiscalSection";
import MeasurementSection from "./sections/MeasurementSection";
import NumberFormattingSection from "./sections/NumberFormattingSection";
import PrecisionSection from "./sections/PrecisionSection";
import RoundingSection from "./sections/RoundingSection";

function extractFormValues(settings: CompanySettingsResponse): CompanySettings {
  const { created_at: _, updated_at: __, ...formValues } = settings;
  return formValues;
}

export default function GeneralSettings() {
  const { data: settings, isLoading } = useCompanySettings();

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return <GeneralSettingsForm settings={settings} />;
}

function GeneralSettingsForm({
  settings,
}: {
  settings: CompanySettingsResponse;
}) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <NumberFormattingSection control={control} t={t} />
      <Separator />
      <PrecisionSection control={control} t={t} />
      <Separator />
      <CurrencyDisplaySection control={control} t={t} />
      <Separator />
      <RoundingSection control={control} t={t} />
      <Separator />
      <DateTimeSection control={control} t={t} />
      <Separator />
      <MeasurementSection control={control} t={t} />
      <Separator />
      <FiscalSection control={control} t={t} />
      <Separator />
      <DocumentDefaultsSection control={control} t={t} />

      <div className="sticky bottom-0 flex items-center gap-3 border-t bg-background py-4">
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
