"use client";

/**
 * Auth layout — brutalist black & white, centered card.
 * No sidebar, no navigation. Just the form.
 */

import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("auth");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
    );

    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2",
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen items-center justify-center bg-black p-6 opacity-0"
    >
      {/* Scan lines overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      <div
        ref={cardRef}
        className="relative z-2 w-full max-w-[420px] border border-neutral-800 bg-[#0a0a0a] opacity-0"
      >
        {/* Top accent line */}
        <div className="h-0.5 bg-white" />

        {/* Header */}
        <div className="border-b border-neutral-800 px-8 pb-6 pt-8">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            {t("layout.system_label")}
          </p>
          <h1 className="text-[22px] font-black uppercase leading-tight tracking-tight text-white">
            {t("layout.title")}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>

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
