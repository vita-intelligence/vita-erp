"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthStore } from "@/stores/auth";
import { useOrgStore } from "@/stores/organization";

import OnboardingRequired from "../../_components/OnboardingRequired";

interface OrgGuardProps {
  children: React.ReactNode;
}

/**
 * Protects org-scoped routes. Runs after AuthGuard (user is authenticated + verified).
 *
 * States:
 * 1. No organizations → redirect to /create-organization
 * 2. Multiple organizations, none selected → redirect to /select-organization
 * 3. One organization → auto-select it
 * 4. Organization selected → render children
 */
export default function OrgGuard({ children }: OrgGuardProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentOrg, isLoading, selectOrganization } = useOrgStore();
  const autoSelectAttempted = useRef(false);

  const organizations = user?.organizations ?? [];

  useEffect(() => {
    if (currentOrg || isLoading || autoSelectAttempted.current) return;

    if (organizations.length === 0) {
      router.replace("/create-organization");
      return;
    }

    if (organizations.length === 1) {
      autoSelectAttempted.current = true;
      selectOrganization(organizations[0].id).then((success) => {
        if (!success) {
          router.replace("/select-organization");
        }
      });
      return;
    }

    // Multiple orgs, none selected
    router.replace("/select-organization");
  }, [organizations, currentOrg, isLoading, selectOrganization, router]);

  if (isLoading || (!currentOrg && organizations.length > 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vita-background">
        <Loader2 size={24} className="animate-spin text-vita-text-muted" />
      </div>
    );
  }

  if (!currentOrg) {
    return null;
  }

  // 4th gate state: org is selected but the user hasn't completed
  // (or needs to re-complete) onboarding for it. Read the cached
  // `requires_onboarding` flag from the user's organizations list,
  // which the backend computes server-side and includes in /auth/me/.
  const activeOrgMembership = organizations.find((o) => o.id === currentOrg.id);
  if (activeOrgMembership?.requires_onboarding) {
    return <OnboardingRequired />;
  }

  return <>{children}</>;
}
