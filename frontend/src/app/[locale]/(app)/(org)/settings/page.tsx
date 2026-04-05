"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

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

/** Parses `#main/sub` → [main, sub]. Invalid main falls back to the default. */
function parseHash(): { tab: SettingsTab; section: string | null } {
  if (typeof window === "undefined") return { tab: "general", section: null };
  const raw = window.location.hash.replace("#", "");
  const [main, sub] = raw.split("/");
  const tab = TAB_IDS.includes(main as SettingsTab)
    ? (main as SettingsTab)
    : "general";
  return { tab, section: sub || null };
}

export default function SettingsPage() {
  const t = useTranslations("companySettings");
  const [{ tab: activeTab, section: activeSection }, setHashState] =
    useState(parseHash);

  useEffect(() => {
    const onHashChange = () => setHashState(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const writeHash = useCallback((tab: SettingsTab, section: string | null) => {
    const hash = section ? `#${tab}/${section}` : `#${tab}`;
    window.history.replaceState(null, "", hash);
  }, []);

  const handleTabChange = useCallback(
    (key: React.Key) => {
      const tab = String(key) as SettingsTab;
      setHashState({ tab, section: null });
      writeHash(tab, null);
    },
    [writeHash],
  );

  const handleSectionChange = useCallback(
    (section: string) => {
      setHashState((prev) => ({ tab: prev.tab, section }));
      writeHash(activeTab, section);
    },
    [activeTab, writeHash],
  );

  const generalProps = useMemo(
    () => ({
      activeSection: activeTab === "general" ? activeSection : null,
      onSectionChange: handleSectionChange,
    }),
    [activeTab, activeSection, handleSectionChange],
  );

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
            <GeneralSettings {...generalProps} />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
