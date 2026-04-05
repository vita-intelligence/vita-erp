"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { I18N } from "@/config";
import { useCompanySettingsStore } from "@/stores/companySettings";

type Locale = (typeof I18N.locales)[number];

function isKnownLocale(code: string | undefined): code is Locale {
  return !!code && (I18N.locales as readonly string[]).includes(code);
}

/**
 * Enforces org-level default_ui_language on the URL.
 *
 * When the URL locale segment doesn't match the org's configured
 * default UI language, rewrites the path under the correct locale.
 * User-level overrides will later take precedence over this rule.
 */
export default function LocaleEnforcer() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const orgLocale = useCompanySettingsStore(
    (s) => s.settings?.default_ui_language,
  );

  useEffect(() => {
    if (!isKnownLocale(orgLocale)) return;
    if (orgLocale === currentLocale) return;
    if (!pathname) return;

    // pathname: "/{locale}/..." — swap the first segment.
    const segments = pathname.split("/");
    if (segments.length < 2) return;
    segments[1] = orgLocale;
    const next = segments.join("/") || `/${orgLocale}`;
    router.replace(next);
  }, [orgLocale, currentLocale, pathname, router]);

  return null;
}
