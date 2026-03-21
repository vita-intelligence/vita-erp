"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");

  return (
    <main>
      <h1>{t("appName")}</h1>
      <p>{t("loading")}</p>
      <p>{t("noResults")}</p>
    </main>
  );
}
