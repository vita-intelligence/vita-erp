"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCompanySettings,
  updateCompanySettings,
} from "@/services/company-settings";

import type {
  CompanySettings,
  CompanySettingsResponse,
} from "../_types/company-settings";

const QUERY_KEY = ["company-settings"] as const;

export function useCompanySettings() {
  return useQuery<CompanySettingsResponse>({
    queryKey: QUERY_KEY,
    queryFn: getCompanySettings,
  });
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation<
    CompanySettingsResponse,
    unknown,
    Partial<CompanySettings>
  >({
    mutationFn: updateCompanySettings,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}
