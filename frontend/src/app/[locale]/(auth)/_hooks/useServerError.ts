"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

type ApiErrorResponse = {
  response?: {
    data?: Record<string, unknown>;
    status?: number;
  };
};

/**
 * Encapsulates server-side error handling for auth forms.
 *
 * Maps backend error codes (email_taken, invalid_credentials, etc.)
 * to translated user-facing messages via the "auth.errors.*" namespace.
 *
 * Handles:
 * - 429 rate limiting
 * - Field-level errors (email, password)
 * - Non-field errors (invalid_credentials, account_disabled)
 * - Generic fallback
 */
export function useServerError() {
  const t = useTranslations("auth");
  const [serverError, setServerError] = useState<string | null>(null);

  const clearError = useCallback(() => setServerError(null), []);

  const handleApiError = useCallback(
    (err: unknown) => {
      const error = err as ApiErrorResponse;

      if (error.response?.status === 429) {
        setServerError(t("errors.rate_limited"));
        return;
      }

      const data = error.response?.data;
      if (!data) {
        setServerError(t("errors.generic"));
        return;
      }

      // Field-level errors: pick the first code from the first error field
      const fieldKeys = ["email", "password", "non_field_errors"];
      for (const key of fieldKeys) {
        if (data[key]) {
          const code = String((data[key] as string[])[0]);
          setServerError(t(`errors.${code}`));
          return;
        }
      }

      setServerError(t("errors.generic"));
    },
    [t],
  );

  return { serverError, handleApiError, clearError } as const;
}
