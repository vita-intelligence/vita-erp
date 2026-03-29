"use client";

import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface AuthFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Unique field identifier — used for htmlFor/id binding */
  fieldId: string;
  /** Uppercase monospace label text */
  label: string;
  /** RHF register return — spreads name, ref, onChange, onBlur */
  registration: UseFormRegisterReturn;
  /** Field-level validation error from RHF */
  error?: FieldError;
}

export default function AuthField({
  fieldId,
  label,
  registration,
  error,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
      >
        {label}
      </label>
      <input
        id={fieldId}
        {...registration}
        {...inputProps}
        className="w-full border border-neutral-700 bg-black px-4 py-3 font-mono text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-white"
      />
      {error && (
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
