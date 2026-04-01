"use client";

import { Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { resetPassword } from "@/services/auth";

import PasswordField from "../_components/PasswordField";
import ServerError from "../_components/ServerError";
import PasswordStrengthBar from "../register/_components/PasswordStrengthBar";
import ResetSuccess from "./_components/ResetSuccess";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function useResetSchema() {
  const t = useTranslations("auth");
  return z
    .object({
      password: z
        .string()
        .min(1, t("errors.password_required"))
        .min(8, t("errors.password_too_short")),
      passwordConfirm: z.string().min(1, t("errors.password_required")),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("errors.passwords_dont_match"),
      path: ["passwordConfirm"],
    });
}

type ResetForm = z.infer<ReturnType<typeof useResetSchema>>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const formRef = useRef<HTMLFormElement>(null);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useResetSchema();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const passwordValue = watch("password");

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

  const onSubmit = async (data: ResetForm) => {
    setServerError(null);
    try {
      await resetPassword({ token: token ?? "", password: data.password });
      setDone(true);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: Record<string, unknown>; status?: number };
      };

      if (error.response?.status === 429) {
        setServerError(t("errors.rate_limited"));
        return;
      }

      const errorData = error.response?.data;
      if (errorData?.error === "token_invalid_or_expired") {
        setServerError(t("reset.token_expired"));
      } else if (errorData?.password) {
        const code = String((errorData.password as string[])[0]);
        setServerError(t(`errors.${code}`));
      } else {
        setServerError(t("errors.generic"));
      }
    }
  };

  if (done) {
    return <ResetSuccess />;
  }

  // No token in URL — show error state
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-red-400">
          {t("reset.token_expired")}
        </p>
        <Link
          href="/forgot-password"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
        >
          {t("reset.request_new")}
        </Link>
      </div>
    );
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
          {t("reset.title")}
        </h2>
        <p className="font-mono text-[11px] leading-relaxed text-neutral-500">
          {t("reset.description")}
        </p>
      </div>

      <PasswordField
        fieldId="password"
        label={t("password")}
        placeholder={t("password_placeholder")}
        autoComplete="new-password"
        registration={register("password")}
        error={errors.password}
      >
        <PasswordStrengthBar password={passwordValue} />
      </PasswordField>

      <PasswordField
        fieldId="passwordConfirm"
        label={t("password_confirm")}
        placeholder={t("password_confirm_placeholder")}
        autoComplete="new-password"
        registration={register("passwordConfirm")}
        error={errors.passwordConfirm}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
        {isSubmitting ? t("reset.submitting") : t("reset.submit")}
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
