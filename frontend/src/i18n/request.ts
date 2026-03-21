import { getRequestConfig } from "next-intl/server";
import { I18N } from "@/config";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as never)) {
    locale = I18N.defaultLocale;
  }

  const messages = Object.fromEntries(
    await Promise.all(
      I18N.namespaces.map(async (ns) => [
        ns,
        (await import(`../../messages/${locale}/${ns}.json`)).default,
      ]),
    ),
  );

  return { locale, messages };
});
