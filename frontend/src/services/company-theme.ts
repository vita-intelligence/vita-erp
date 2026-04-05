/**
 * Company Theme service — fetches and saves the org's theme.
 *
 * Backend reference: apps/company/views/company_theme.py::CompanyThemeView
 * The server stores `{active_mode, tokens_by_mode}` — the browser store
 * (useThemeStore) mirrors the same shape with camelCase client keys,
 * so snake ↔ camel conversion happens here at the boundary.
 */

import type { ThemeName, ThemeTokens } from "@/config";
import { ENDPOINTS } from "@/config";
import api from "@/lib/api";

/** Server response from GET /api/v1/company/theme/. */
export type CompanyThemeResponse = {
  active_mode: string;
  tokens_by_mode: Record<string, Partial<ThemeTokens>>;
  created_at: string;
  updated_at: string;
};

/** Payload for PATCH /api/v1/company/theme/. */
export type CompanyThemePayload = {
  active_mode: ThemeName;
  tokens_by_mode: Partial<Record<ThemeName, ThemeTokens>>;
};

export async function fetchCompanyTheme(): Promise<CompanyThemeResponse> {
  const { data } = await api.get<CompanyThemeResponse>(ENDPOINTS.company.theme);
  return data;
}

export async function saveCompanyTheme(
  payload: CompanyThemePayload,
): Promise<CompanyThemeResponse> {
  const { data } = await api.patch<CompanyThemeResponse>(
    ENDPOINTS.company.theme,
    payload,
  );
  return data;
}
