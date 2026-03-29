"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

/** Strength levels mapped to visual properties */
const STRENGTH_CONFIG = [
  { label: "strength_empty", color: "bg-neutral-800", width: "w-0" },
  { label: "strength_weak", color: "bg-red-500", width: "w-1/4" },
  { label: "strength_fair", color: "bg-orange-500", width: "w-2/4" },
  { label: "strength_good", color: "bg-yellow-500", width: "w-3/4" },
  { label: "strength_strong", color: "bg-green-500", width: "w-full" },
] as const;

/**
 * Calculates password strength score (0–4) based on:
 * - Length thresholds (8, 12)
 * - Character variety (uppercase, lowercase, digit, special)
 */
function calculateStrength(password: string): number {
  if (password.length === 0) return 0;
  if (password.length < 8) return 1;

  let criteria = 0;
  if (/[a-z]/.test(password)) criteria++;
  if (/[A-Z]/.test(password)) criteria++;
  if (/[0-9]/.test(password)) criteria++;
  if (/[^a-zA-Z0-9]/.test(password)) criteria++;

  // Bonus for length >= 12
  if (password.length >= 12) criteria++;

  // Map criteria count (0–5) → strength level (1–4)
  if (criteria <= 1) return 1;
  if (criteria <= 2) return 2;
  if (criteria <= 3) return 3;
  return 4;
}

interface PasswordStrengthBarProps {
  /** Current password value to evaluate */
  password: string;
}

export default function PasswordStrengthBar({
  password,
}: PasswordStrengthBarProps) {
  const t = useTranslations("auth");
  const score = useMemo(() => calculateStrength(password), [password]);
  const config = STRENGTH_CONFIG[score];

  if (password.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Bar track */}
      <div className="h-1 w-full bg-neutral-800">
        <div
          className={`h-full ${config.color} ${config.width} transition-all duration-300 ease-out`}
        />
      </div>
      {/* Label */}
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
        {t(config.label)}
      </p>
    </div>
  );
}
