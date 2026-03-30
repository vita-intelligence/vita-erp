"use client";

import gsap from "gsap";
import { Building2, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/stores/auth";
import { useOrgStore } from "@/stores/organization";
import type { OrganizationSummary } from "@/types/api";

export default function SelectOrganizationPage() {
  const t = useTranslations("organizations");
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectOrganization } = useOrgStore();

  const [selectingId, setSelectingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const organizations = user?.organizations ?? [];

  // Redirect to create if no orgs
  useEffect(() => {
    if (organizations.length === 0) {
      router.replace("/create-organization");
    }
  }, [organizations, router]);

  // GSAP entrance animation
  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.06,
      },
    );
  }, []);

  const handleSelect = async (org: OrganizationSummary) => {
    setSelectingId(org.id);
    const success = await selectOrganization(org.id);
    if (success) {
      router.push("/dashboard");
    } else {
      setSelectingId(null);
    }
  };

  const statusLabel = (status: string) => {
    const key = `select.status_${status}` as const;
    try {
      return t(key);
    } catch {
      return status;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-white">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-tight text-white uppercase">
            {t("select.title")}
          </h1>
          <p className="mt-2 font-mono text-sm text-neutral-400">
            {t("select.description")}
          </p>
        </div>

        {/* Org list */}
        <div ref={listRef} className="flex flex-col gap-3">
          {organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              disabled={selectingId !== null}
              onClick={() => handleSelect(org)}
              className="flex items-center justify-between border-2 border-white px-5 py-4 text-left transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <div>
                <p className="font-mono text-sm font-bold text-white">
                  {org.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-neutral-500">
                  {org.slug}
                  {org.industry ? ` \u00B7 ${org.industry}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400 uppercase">
                  {statusLabel(org.status)}
                </span>
                {selectingId === org.id && (
                  <Loader2 size={16} className="animate-spin text-white" />
                )}
              </div>
            </button>
          ))}

          {/* Create new org button */}
          <button
            type="button"
            onClick={() => router.push("/create-organization")}
            disabled={selectingId !== null}
            className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-600 px-5 py-4 font-mono text-sm text-neutral-400 transition-colors hover:border-white hover:text-white disabled:opacity-50"
          >
            <Plus size={16} />
            {t("select.create_new")}
          </button>
        </div>
      </div>
    </div>
  );
}
