"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/ui/tabs";

import GeneralSettings from "./_components/GeneralSettings";

const TAB_IDS = ["general"] as const;
type SettingsTab = (typeof TAB_IDS)[number];

function getHashTab(): SettingsTab {
  if (typeof window === "undefined") return "general";
  const hash = window.location.hash.replace("#", "");
  return TAB_IDS.includes(hash as SettingsTab)
    ? (hash as SettingsTab)
    : "general";
}

export default function SettingsPage() {
  const t = useTranslations("companySettings");
  const [activeTab, setActiveTab] = useState<SettingsTab>(getHashTab);

  useEffect(() => {
    const onHashChange = () => setActiveTab(getHashTab());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = useCallback((key: React.Key) => {
    const tab = String(key) as SettingsTab;
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-vita-text-primary">
          {t("page.title")}
        </h1>
      </div>

      <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange}>
        <TabList aria-label={t("page.title")}>
          <Tab id="general">
            {t("tabs.general")}
            <TabIndicator />
          </Tab>
        </TabList>

        <TabPanel id="general">
          <div className="pt-6">
            <GeneralSettings />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
