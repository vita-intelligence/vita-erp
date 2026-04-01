import { ENDPOINTS } from "@/config";
import api from "@/lib/api";
import type { OrganizationDetail } from "@/types/api";

export type CreateOrganizationPayload = {
  name: string;
  slug?: string;
  industry?: string;
  country?: string;
  timezone?: string;
  base_currency?: string;
};

export async function createOrganization(
  payload: CreateOrganizationPayload,
): Promise<OrganizationDetail> {
  const { data } = await api.post<OrganizationDetail>(
    ENDPOINTS.organizations.create,
    payload,
  );
  return data;
}

export async function selectOrganization(
  orgId: string,
): Promise<OrganizationDetail> {
  const { data } = await api.post<OrganizationDetail>(
    ENDPOINTS.organizations.select(orgId),
  );
  return data;
}

export async function getOrganizationDetail(
  orgId: string,
): Promise<OrganizationDetail> {
  const { data } = await api.get<OrganizationDetail>(
    ENDPOINTS.organizations.detail(orgId),
  );
  return data;
}
