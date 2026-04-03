/**
 * InputOtp — Vita ERP OTP/PIN input.
 *
 * Multi-segment code input for verification codes.
 * Uses individual input elements with auto-focus advancement.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useRef,
} from "react";

export interface InputOtpProps {
  /** Number of input segments */
  length?: number;
  /** Current value */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Input type */
  type?: "numeric" | "alphanumeric";
  isDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

function InputOtpInner(
  {
    length = 6,
    value = "",
    onChange,
    type = "numeric",
    isDisabled,
    className,
    style,
  }: InputOtpProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = value.padEnd(length, "").split("").slice(0, length);

  const pattern = type === "numeric" ? /^\d$/ : /^[a-zA-Z0-9]$/;

  const handleInput = useCallback(
    (index: number, char: string) => {
      if (!pattern.test(char)) return;
      const next = [...chars];
      next[index] = char;
      onChange?.(next.join(""));
      if (index < length - 1) inputRefs.current[index + 1]?.focus();
    },
    [chars, length, onChange, pattern],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = [...chars];
        if (next[index]) {
          next[index] = "";
          onChange?.(next.join(""));
        } else if (index > 0) {
          next[index - 1] = "";
          onChange?.(next.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      }
    },
    [chars, onChange],
  );

  return (
    <div
      ref={ref}
      data-slot="input-otp"
      className={["vita-input-otp", className].filter(Boolean).join(" ")}
      style={{ display: "inline-flex", gap: "8px", ...style }}
    >
      {chars.map((char, i) => {
        const segmentKey = `otp-segment-${length}-${i}`;
        return (
          <input
            key={segmentKey}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode={type === "numeric" ? "numeric" : "text"}
            maxLength={1}
            value={char}
            disabled={isDisabled}
            autoComplete="one-time-code"
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            style={{
              width: "40px",
              height: "48px",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: 600,
              fontFamily: "var(--vita-font-mono, monospace)",
              borderRadius: "var(--vita-input-radius, 8px)",
              border: "1px solid var(--vita-neutral-200)",
              backgroundColor: "var(--vita-surface)",
              color: "var(--vita-text-primary)",
              outline: "none",
              caretColor: "var(--vita-primary)",
            }}
          />
        );
      })}
    </div>
  );
}

export const InputOtp = forwardRef(InputOtpInner);
InputOtp.displayName = "InputOtp";
