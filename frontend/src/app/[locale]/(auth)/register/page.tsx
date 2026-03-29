"use client";

import { Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

import AuthField from "../_components/AuthField";
import PasswordField from "../_components/PasswordField";
import ServerError from "../_components/ServerError";
import { useServerError } from "../_hooks/useServerError";
import PasswordStrengthBar from "./_components/PasswordStrengthBar";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function useRegisterSchema() {
  const t = useTranslations("auth");
  return z
    .object({
      email: z
        .string()
        .min(1, t("errors.email_required"))
        .email({ message: t("errors.email_invalid") }),
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

type RegisterForm = z.infer<ReturnType<typeof useRegisterSchema>>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { fetchUser } = useAuthStore();
  const { serverError, handleApiError, clearError } = useServerError();

  const schema = useRegisterSchema();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", passwordConfirm: "" },
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

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    try {
      await api.post("/auth/register/", {
        email: data.email,
        password: data.password,
      });
      await fetchUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <ServerError message={serverError} />

      <AuthField
        fieldId="email"
        label={t("email")}
        type="email"
        autoComplete="email"
        placeholder={t("email_placeholder")}
        registration={register("email")}
        error={errors.email}
      />

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
        {isSubmitting ? t("signing_up") : t("sign_up")}
      </button>

      {/* Link to login */}
      <div className="flex items-center justify-center">
        <Link
          href="/login"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
        >
          {t("have_account")}
        </Link>
      </div>
    </form>
  );
}
