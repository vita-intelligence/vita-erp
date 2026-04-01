import type {
  CompanySettings,
  CompanySettingsResponse,
} from "@/app/[locale]/(app)/(org)/settings/_types/company-settings";
import { ENDPOINTS } from "@/config";
import api from "@/lib/api";

export async function getCompanySettings(): Promise<CompanySettingsResponse> {
  const { data } = await api.get<CompanySettingsResponse>(
    ENDPOINTS.company.settings,
  );
  return data;
}

export async function updateCompanySettings(
  patch: Partial<CompanySettings>,
): Promise<CompanySettingsResponse> {
  const { data } = await api.patch<CompanySettingsResponse>(
    ENDPOINTS.company.settings,
    patch,
  );
  return data;
}
