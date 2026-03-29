"use client";

import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import api from "@/lib/api";

import StatusDisplay from "./_components/StatusDisplay";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VerifyState =
  | { status: "loading" }
  | { status: "success" }
  | { status: "already_verified" }
  | { status: "error"; code: string };

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const loaderRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<VerifyState>({ status: "loading" });
  const hasVerified = useRef(false);

  const verify = useCallback(async (verifyToken: string) => {
    try {
      const { data } = await api.post<{ status: string }>(
        "/auth/verify-email/",
        {
          token: verifyToken,
        },
      );
      if (data.status === "already_verified") {
        setState({ status: "already_verified" });
      } else {
        setState({ status: "success" });
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, unknown> };
      };
      const code = String(error.response?.data?.error || "generic");
      setState({ status: "error", code });
    }
  }, []);

  // Auto-verify on mount
  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (!token) {
      setState({ status: "error", code: "token_required" });
      return;
    }
    verify(token);
  }, [token, verify]);

  // GSAP for loader
  useEffect(() => {
    if (state.status !== "loading" || !loaderRef.current) return;
    gsap.fromTo(
      loaderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    );
  }, [state.status]);

  // Loading state
  if (state.status === "loading") {
    return (
      <div
        ref={loaderRef}
        className="flex flex-col items-center gap-4 py-8 opacity-0"
      >
        <Loader2 size={24} className="animate-spin text-neutral-500" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
          {t("verify.verifying")}
        </p>
      </div>
    );
  }

  // Success
  if (state.status === "success") {
    return (
      <StatusDisplay
        status="success"
        title={t("verify.success_title")}
        description={t("verify.success_description")}
        actionLabel={t("sign_in")}
        actionHref="/login"
      />
    );
  }

  // Already verified
  if (state.status === "already_verified") {
    return (
      <StatusDisplay
        status="already_verified"
        title={t("verify.already_title")}
        description={t("verify.already_description")}
        actionLabel={t("sign_in")}
        actionHref="/login"
      />
    );
  }

  // Error
  return (
    <StatusDisplay
      status="error"
      title={t("verify.error_title")}
      description={t(`verify.error_${state.code}` as Parameters<typeof t>[0])}
      actionLabel={t("verify.resend")}
      actionHref="/login"
      secondaryLabel={t("back_to_login")}
      secondaryHref="/login"
    />
  );
}
