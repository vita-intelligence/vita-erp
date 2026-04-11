/**
 * API client — Axios instance configured for cookie-based JWT auth.
 *
 * - Sends cookies automatically (withCredentials)
 * - On 401: attempts silent refresh, retries the original request
 * - If refresh fails: redirects to login
 */

import axios from "axios";

import { API, ENDPOINTS } from "@/config";

const api = axios.create({
  baseURL: API.baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track whether a refresh is already in progress to avoid parallel refreshes
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processPendingRequests(error: unknown = null) {
  for (const { resolve, reject } of pendingRequests) {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  }
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 (unauthorized) — not other errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry refresh/login/register endpoints (would cause infinite loop)
    const skipPaths = [
      ENDPOINTS.auth.login,
      ENDPOINTS.auth.register,
      ENDPOINTS.auth.refresh,
    ];
    if (skipPaths.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    // Don't retry if we already retried this request
    if (originalRequest._retried) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => {
        originalRequest._retried = true;
        return api(originalRequest);
      });
    }

    isRefreshing = true;
    originalRequest._retried = true;

    try {
      await api.post(ENDPOINTS.auth.refresh);
      processPendingRequests();
      return api(originalRequest);
    } catch (refreshError) {
      processPendingRequests(refreshError);

      // Refresh failed — usually means the user is logged out and we
      // should redirect to /login. EXCEPT on public pages where being
      // logged out is a perfectly valid state (accept-invite, verify-
      // email, etc.). Those pages handle the "no user" branch in their
      // own UI; force-redirecting kicks the user out before they can
      // even see the page.
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const isPublicAuthPage =
          path.includes("/accept-invite") ||
          path.includes("/verify-email") ||
          path.includes("/reset-password") ||
          path.includes("/forgot-password") ||
          path.includes("/register") ||
          path.includes("/login");

        if (!isPublicAuthPage) {
          const locale = path.split("/")[1] || "en";
          window.location.href = `/${locale}/login`;
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
