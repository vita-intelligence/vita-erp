import { ENDPOINTS } from "@/config";
import api from "@/lib/api";
import type { OrganizationSummary } from "@/types/api";

export type User = {
  id: string;
  email: string;
  is_verified: boolean;
  date_joined: string;
  organizations: OrganizationSummary[];
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
};

type ResetPasswordPayload = {
  token: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<void> {
  await api.post(ENDPOINTS.auth.login, payload);
}

export async function register(payload: RegisterPayload): Promise<void> {
  await api.post(ENDPOINTS.auth.register, payload);
}

export async function logout(): Promise<void> {
  await api.post(ENDPOINTS.auth.logout);
}

export async function refreshToken(): Promise<void> {
  await api.post(ENDPOINTS.auth.refresh);
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>(ENDPOINTS.auth.me);
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post(ENDPOINTS.auth.forgotPassword, { email });
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<void> {
  await api.post(ENDPOINTS.auth.resetPassword, payload);
}

export async function resendVerification(): Promise<void> {
  await api.post(ENDPOINTS.auth.resendVerification);
}
