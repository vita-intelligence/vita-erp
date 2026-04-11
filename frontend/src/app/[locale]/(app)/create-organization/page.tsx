"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Building2, Globe, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  getCountryOptions,
  getCurrencyOptions,
  getTimezoneOptions,
  INDUSTRY_CODES,
  LANGUAGE_OPTIONS,
} from "@/config/options";
import { billingApi } from "@/lib/billing";
import { createOrganization } from "@/services/organization";
import { useAuthStore } from "@/stores/auth";
import { useOrgStore } from "@/stores/organization";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const selectClass =
  "appearance-none border-2 border-white bg-black px-4 py-3 font-mono text-sm text-white outline-none focus:border-neutral-400 transition-colors w-full cursor-pointer";

const inputClass =
  "border-2 border-white bg-black px-4 py-3 font-mono text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-400 transition-colors";

const labelClass =
  "font-mono text-xs font-medium tracking-wider text-neutral-400 uppercase";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

function useCreateOrgSchema() {
  const t = useTranslations("organizations");
  return z.object({
    name: z.string().min(1, t("errors.name_required")),
    slug: z.string().optional(),
    industry: z.string().min(1, t("errors.industry_required")),
    country: z.string().min(1, t("errors.country_required")),
    timezone: z.string().min(1, t("errors.timezone_required")),
    base_currency: z.string().min(1, t("errors.currency_required")),
  });
}

type CreateOrgForm = z.infer<ReturnType<typeof useCreateOrgSchema>>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 3;

export default function CreateOrganizationPage() {
  const t = useTranslations("organizations");
  const router = useRouter();
  const pathname = usePathname();
  const { fetchUser } = useAuthStore();
  const { selectOrganization } = useOrgStore();

  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");
  const stepRef = useRef<HTMLDivElement>(null);

  // Detect current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Intl API options — localized, complete, memoized per locale
  const countryOptions = useMemo(
    () => getCountryOptions(currentLocale),
    [currentLocale],
  );
  const timezoneOptions = useMemo(
    () => getTimezoneOptions(currentLocale),
    [currentLocale],
  );
  const currencyOptions = useMemo(
    () => getCurrencyOptions(currentLocale),
    [currentLocale],
  );

  const schema = useCreateOrgSchema();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      industry: "",
      country: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      base_currency: "USD",
    },
  });

  // GSAP entrance animation — re-runs on step change
  // biome-ignore lint/correctness/useExhaustiveDependencies: step triggers re-animation
  useEffect(() => {
    if (!stepRef.current) return;
    gsap.fromTo(
      stepRef.current.children,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
      },
    );
  }, [step]);

  const handleLanguageChange = (locale: string) => {
    // Replace the locale segment in the current path
    const newPath = pathname.replace(`/${currentLocale}/`, `/${locale}/`);
    router.replace(newPath);
  };

  const onSubmit = async (data: CreateOrgForm) => {
    setServerError("");
    try {
      // Production flow: start a Stripe Checkout Session and redirect
      // the user to Stripe to collect a card and start the 14-day trial.
      // After payment the webhook handler creates the actual org.
      const checkout = await billingApi.createCheckoutSession({
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        industry: data.industry || undefined,
        country: data.country || undefined,
        timezone: data.timezone || undefined,
        base_currency: data.base_currency || undefined,
      });
      window.location.href = checkout.url;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = err.response.data as Record<string, unknown>;
        const detail = data.detail as string | undefined;
        const slugErrors = data.slug as string[] | undefined;
        const errorCode = detail || slugErrors?.[0] || "creation_failed";
        setServerError(t(`errors.${errorCode}`));
      } else {
        setServerError(t("errors.creation_failed"));
      }
    }
  };

  // The direct-create path still exists for admin/test use. Silence the
  // unused-symbol lint without removing the import, since `createOrganization`
  // is referenced by `services/organization.ts` consumers elsewhere.
  void createOrganization;
  void fetchUser;
  void selectOrganization;
  void router;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-white">
            {step === 1 ? (
              <Globe size={32} className="text-white" />
            ) : (
              <Building2 size={32} className="text-white" />
            )}
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-white uppercase">
            {t("create.title")}
          </h1>
          <p className="mt-2 font-mono text-sm text-neutral-400">
            {t("create.description")}
          </p>
          <p className="mt-1 font-mono text-xs text-neutral-500">
            {t("create.step_info", { current: step, total: TOTAL_STEPS })}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Server error */}
          {serverError && (
            <div className="border border-red-500 bg-red-500/10 px-4 py-3 font-mono text-sm text-red-400">
              {serverError}
            </div>
          )}

          {/* ── Step 1: Language ─────────────────────────────────── */}
          {step === 1 && (
            <div ref={stepRef} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="language" className={labelClass}>
                  {t("create.language_label")}
                </label>
                <p className="font-mono text-xs text-neutral-500">
                  {t("create.language_description")}
                </p>
                <select
                  id="language"
                  value={currentLocale}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={selectClass}
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-2 flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3 font-mono text-sm font-bold text-black uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                {t("create.next_button")}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 2: Company Info ─────────────────────────────── */}
          {step === 2 && (
            <div ref={stepRef} className="flex flex-col gap-5">
              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className={labelClass}>
                  {t("create.name_label")}
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="organization"
                  placeholder={t("create.name_placeholder")}
                  {...register("name")}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="slug" className={labelClass}>
                  {t("create.slug_label")}
                </label>
                <input
                  id="slug"
                  type="text"
                  placeholder={t("create.slug_placeholder")}
                  {...register("slug")}
                  className={inputClass}
                />
                <p className="font-mono text-xs text-neutral-500">
                  {t("create.slug_hint")}
                </p>
                {errors.slug && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="industry" className={labelClass}>
                  {t("create.industry_label")}
                </label>
                <select
                  id="industry"
                  {...register("industry")}
                  className={selectClass}
                >
                  <option value="">{t("create.industry_placeholder")}</option>
                  {INDUSTRY_CODES.map((code) => (
                    <option key={code} value={code}>
                      {t(`industries.${code}`)}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.industry.message}
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-white px-6 py-3 font-mono text-sm font-bold text-white uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t("create.back_button")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const valid = await trigger(["name", "industry"]);
                    if (valid) setStep(3);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3 font-mono text-sm font-bold text-black uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  {t("create.next_button")}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Regional Settings ────────────────────────── */}
          {step === 3 && (
            <div ref={stepRef} className="flex flex-col gap-5">
              {/* Country */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="country" className={labelClass}>
                  {t("create.country_label")}
                </label>
                <select
                  id="country"
                  {...register("country")}
                  className={selectClass}
                >
                  <option value="">{t("create.country_placeholder")}</option>
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="timezone" className={labelClass}>
                  {t("create.timezone_label")}
                </label>
                <select
                  id="timezone"
                  {...register("timezone")}
                  className={selectClass}
                >
                  <option value="">{t("create.timezone_placeholder")}</option>
                  {timezoneOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.timezone.message}
                  </p>
                )}
              </div>

              {/* Base Currency */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="base_currency" className={labelClass}>
                  {t("create.currency_label")}
                </label>
                <select
                  id="base_currency"
                  {...register("base_currency")}
                  className={selectClass}
                >
                  <option value="">{t("create.currency_placeholder")}</option>
                  {currencyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.base_currency && (
                  <p className="font-mono text-xs text-red-400">
                    {errors.base_currency.message}
                  </p>
                )}
              </div>

              {/* Back + Create buttons */}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-white px-6 py-3 font-mono text-sm font-bold text-white uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t("create.back_button")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3 font-mono text-sm font-bold text-black uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("create.creating")}
                    </>
                  ) : (
                    t("create.create_button")
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
