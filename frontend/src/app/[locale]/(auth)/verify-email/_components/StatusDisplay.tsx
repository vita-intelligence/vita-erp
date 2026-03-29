"use client";

import { Link } from "@heroui/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

type Status = "success" | "error" | "already_verified";

interface StatusDisplayProps {
  status: Status;
  title: string;
  description: string;
  /** Primary CTA label */
  actionLabel: string;
  /** Primary CTA href */
  actionHref: string;
  /** Optional secondary link */
  secondaryLabel?: string;
  secondaryHref?: string;
}

const STATUS_ICON: Record<
  Status,
  { char: string; borderColor: string; bgColor: string; textColor: string }
> = {
  success: {
    char: "\u2713",
    borderColor: "border-green-800",
    bgColor: "bg-green-950/30",
    textColor: "text-green-400",
  },
  already_verified: {
    char: "\u2713",
    borderColor: "border-green-800",
    bgColor: "bg-green-950/30",
    textColor: "text-green-400",
  },
  error: {
    char: "\u2717",
    borderColor: "border-red-800",
    bgColor: "bg-red-950/30",
    textColor: "text-red-400",
  },
};

export default function StatusDisplay({
  status,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: StatusDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const icon = STATUS_ICON[status];

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
      {/* Status icon */}
      <div className="flex items-center justify-center">
        <div
          className={`flex h-12 w-12 items-center justify-center border ${icon.borderColor} ${icon.bgColor}`}
        >
          <span className={`font-mono text-lg ${icon.textColor}`}>
            {icon.char}
          </span>
        </div>
      </div>

      <h2 className="text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-white">
        {title}
      </h2>

      <p className="text-center font-mono text-xs leading-relaxed text-neutral-400">
        {description}
      </p>

      <Link
        href={actionHref}
        className="flex w-full items-center justify-center bg-white py-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-neutral-200"
      >
        {actionLabel}
      </Link>

      {secondaryLabel && secondaryHref && (
        <div className="flex items-center justify-center">
          <Link
            href={secondaryHref}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-white"
          >
            {secondaryLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
