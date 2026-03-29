"use client";

import { Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/lib/api";

import AuthField from "../_components/AuthField";
import ServerError from "../_components/ServerError";
import { useServerError } from "../_hooks/useServerError";
import SuccessMessage from "./_components/SuccessMessage";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function useForgotSchema() {
  const t = useTranslations("auth");
  return z.object({
    email: z
      .string()
      .min(1, t("errors.email_required"))
      .email({ message: t("errors.email_invalid") }),
  });
}

type ForgotForm = z.infer<ReturnType<typeof useForgotSchema>>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const { serverError, handleApiError, clearError } = useServerError();

  const schema = useForgotSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  // GSAP entrance animation
  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
      },
    );
  }, []);

  const onSubmit = async (data: ForgotForm) => {
    clearError();
    try {
      await api.post("/auth/forgot-password/", { email: data.email });
      setSent(true);
    } catch (err: unknown) {
      // Security: always show success to prevent email enumeration.
      // Only show error for rate limiting or network failures.
      const error = err as {
        response?: { status?: number };
      };

      if (error.response?.status === 429) {
        handleApiError(err);
      } else {
        setSent(true);
      }
    }
  };

  if (sent) {
    return <SuccessMessage />;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <ServerError message={serverError} />

      {/* Page description */}
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
          {t("forgot.title")}
        </h2>
        <p className="font-mono text-[11px] leading-relaxed text-neutral-500">
          {t("forgot.description")}
        </p>
      </div>

      <AuthField
        fieldId="email"
        label={t("email")}
        type="email"
        autoComplete="email"
        placeholder={t("email_placeholder")}
        registration={register("email")}
        error={errors.email}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
        {isSubmitting ? t("forgot.submitting") : t("forgot.submit")}
      </button>

      {/* Back to login */}
      <div className="flex items-center justify-center">
        <Link
          href="/login"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
        >
          {t("back_to_login")}
        </Link>
      </div>
    </form>
  );
}
