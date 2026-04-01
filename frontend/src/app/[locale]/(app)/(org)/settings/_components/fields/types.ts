import type { useTranslations } from "next-intl";
import type { Control } from "react-hook-form";

import type { CompanySettings } from "../../_types/company-settings";

export type SettingsFieldProps = {
  name: keyof CompanySettings;
  control: Control<CompanySettings>;
  t: ReturnType<typeof useTranslations>;
};
