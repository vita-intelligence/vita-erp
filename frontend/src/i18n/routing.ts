import { defineRouting } from "next-intl/routing";
import { I18N } from "@/config";

export const routing = defineRouting({
  locales: I18N.locales,
  defaultLocale: I18N.defaultLocale,
});
