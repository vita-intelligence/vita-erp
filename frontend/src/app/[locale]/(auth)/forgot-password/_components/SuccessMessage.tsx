"use client";

import { Link } from "@heroui/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export default function SuccessMessage() {
  const t = useTranslations("auth");
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Success icon */}
      <div className="flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center border border-green-800 bg-green-950/30">
          <span className="font-mono text-lg text-green-400">&#10003;</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
        {t("forgot.success_title")}
      </h2>

      {/* Description */}
      <p className="text-center font-mono text-xs leading-relaxed text-neutral-400">
        {t("forgot.success_description")}
      </p>

      {/* Back to login */}
      <Link
        href="/login"
        className="flex w-full items-center justify-center bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
      >
        {t("back_to_login")}
      </Link>
    </div>
  );
}
