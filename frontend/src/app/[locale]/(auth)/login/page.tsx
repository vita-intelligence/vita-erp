"use client";

import { Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";

import AuthField from "../_components/AuthField";
import PasswordField from "../_components/PasswordField";
import ServerError from "../_components/ServerError";
import { useServerError } from "../_hooks/useServerError";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function useLoginSchema() {
  const t = useTranslations("auth");
  return z.object({
    email: z
      .string()
      .min(1, t("errors.email_required"))
      .email({ message: t("errors.email_invalid") }),
    password: z.string().min(1, t("errors.password_required")),
  });
}

type LoginForm = z.infer<ReturnType<typeof useLoginSchema>>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { fetchUser } = useAuthStore();
  const { serverError, handleApiError, clearError } = useServerError();

  // Pre-filled email + carried-through invite token come from the
  // accept-invite page when the user clicks "Sign in" on the
  // logged-out branch. After a successful login we bounce back to
  // /accept-invite?token=... so the invite gets accepted automatically.
  const prefillEmail = searchParams.get("email") ?? "";
  const inviteToken = searchParams.get("invite");

  const schema = useLoginSchema();
  const defaultValues = useMemo(
    () => ({ email: prefillEmail, password: "" }),
    [prefillEmail],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues,
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

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login(data);
      await fetchUser();
      // If the user came here from an invite link, send them back to
      // /accept-invite so the auto-accept logic can run with their
      // now-authenticated session. Otherwise straight to dashboard.
      if (inviteToken) {
        router.push(`/accept-invite?token=${encodeURIComponent(inviteToken)}`);
      } else {
        router.push("/dashboard");
      }
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
        autoComplete="current-password"
        registration={register("password")}
        error={errors.password}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
        {isSubmitting ? t("signing_in") : t("sign_in")}
      </button>

      {/* Links — preserve invite token + email when bouncing into register */}
      <div className="flex items-center justify-between">
        <Link
          href={
            inviteToken
              ? `/register?email=${encodeURIComponent(prefillEmail)}&invite=${encodeURIComponent(inviteToken)}`
              : "/register"
          }
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
        >
          {t("no_account")}
        </Link>
        <Link
          href="/forgot-password"
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
        >
          {t("forgot_password")}
        </Link>
      </div>
    </form>
  );
}
