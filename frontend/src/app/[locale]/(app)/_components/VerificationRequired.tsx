"use client";

import gsap from "gsap";
import { Loader2, LogOut, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

/** Cooldown between resend attempts (seconds) */
const RESEND_COOLDOWN = 60;

/**
 * Full-screen blocker shown when the user is authenticated but
 * has not yet verified their email address.
 *
 * Provides:
 * - Resend verification email (with cooldown timer)
 * - Refresh status (re-checks /auth/me/)
 * - Logout
 */
export default function VerificationRequired() {
  const t = useTranslations("auth");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, fetchUser, clearUser } = useAuthStore();

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // GSAP entrance
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
      },
    );
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    setResending(true);
    setResent(false);
    try {
      await api.post("/auth/resend-verification/");
      setResent(true);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      // Silently fail — user can retry
    } finally {
      setResending(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
    // If verified, AuthGuard will re-render and show children
  }, [fetchUser]);

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/auth/logout/");
    } catch {
      // Clear state regardless
    }
    clearUser();
    router.replace("/login");
  }, [clearUser, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      {/* Scan lines overlay (matches auth layout) */}
      <div
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      <div className="relative z-2 w-full max-w-[420px] border border-neutral-800 bg-[#0a0a0a]">
        {/* Top accent line */}
        <div className="h-0.5 bg-white" />

        {/* Content */}
        <div
          ref={containerRef}
          className="flex flex-col items-center gap-6 p-8"
        >
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center border border-neutral-700 bg-neutral-900">
            <Mail size={24} className="text-neutral-400" />
          </div>

          {/* Title */}
          <h1 className="text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
            {t("verification_required.title")}
          </h1>

          {/* Description */}
          <p className="text-center font-mono text-[11px] leading-relaxed text-neutral-500">
            {t("verification_required.description", {
              email: user?.email ?? "",
            })}
          </p>

          {/* Resent confirmation */}
          {resent && (
            <div className="w-full border border-green-900 bg-green-950/30 px-4 py-3">
              <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-wide text-green-400">
                {t("verification_required.resent")}
              </p>
            </div>
          )}

          {/* Resend button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex w-full items-center justify-center gap-2 bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            {cooldown > 0
              ? t("verification_required.resend_cooldown", {
                  seconds: cooldown,
                })
              : t("verification_required.resend")}
          </button>

          {/* Secondary actions */}
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white disabled:opacity-50"
            >
              {refreshing && <Loader2 size={10} className="animate-spin" />}
              {t("verification_required.check_status")}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
            >
              <LogOut size={10} />
              {t("sign_out")}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 px-8 py-4 text-center">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
            {t("layout.footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
