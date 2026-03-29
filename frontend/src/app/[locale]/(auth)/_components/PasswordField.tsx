"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
  /** Unique field identifier — used for htmlFor/id binding */
  fieldId: string;
  /** Uppercase monospace label text */
  label: string;
  /** Input placeholder text */
  placeholder: string;
  /** RHF register return — spreads name, ref, onChange, onBlur */
  registration: UseFormRegisterReturn;
  /** Field-level validation error from RHF */
  error?: FieldError;
  /** Browser autocomplete hint (e.g. "current-password", "new-password") */
  autoComplete?: string;
  /** Optional content rendered below the input, above the error (e.g. strength bar) */
  children?: React.ReactNode;
}

export default function PasswordField({
  fieldId,
  label,
  placeholder,
  registration,
  error,
  autoComplete = "current-password",
  children,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...registration}
          className="w-full border border-neutral-700 bg-black px-4 py-3 pr-12 font-mono text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-white"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-white"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {children}
      {error && (
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
