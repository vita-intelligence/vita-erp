"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth";

import VerificationRequired from "./VerificationRequired";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Protects authenticated routes with three-state guard:
 *
 * 1. Not authenticated → redirect to /login
 * 2. Authenticated but unverified → full-screen verification blocker
 * 3. Authenticated and verified → render children
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vita-background">
        <Loader2 size={24} className="animate-spin text-vita-text-muted" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user?.is_verified) {
    return <VerificationRequired />;
  }

  return <>{children}</>;
}
