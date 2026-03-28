import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { HydrationGuard } from "@/components/HydrationGuard";
import { FloatingTrigger } from "@/components/theme-editor";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        {/* Progress bar — pure HTML, visible before JS loads, hidden by HydrationGuard */}
        <div id="vita-hydration-indicator" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <HydrationGuard />
            {children}
            <FloatingTrigger />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
