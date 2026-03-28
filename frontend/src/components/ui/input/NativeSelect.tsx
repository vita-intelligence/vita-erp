"use client";

/**
 * NativeSelect — a themed <select> that visually matches the Input component.
 *
 * Uses the same --vita-input-* CSS tokens for radius, border, padding, font size.
 * Strips browser defaults with appearance:none and adds a custom SVG chevron.
 *
 * Usage:
 *   import { NativeSelect } from "@/components/ui/input/NativeSelect";
 *
 *   <NativeSelect value={val} onChange={e => setVal(e.target.value)}>
 *     <option value="">Pick one...</option>
 *     <option value="a">Option A</option>
 *   </NativeSelect>
 */

const CHEVRON_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

const BASE_STYLE: React.CSSProperties = {
  WebkitAppearance: "none",
  width: "100%",
  borderRadius: "var(--vita-input-radius, 0px)",
  borderTopWidth: "var(--vita-input-border-top, 1px)",
  borderRightWidth: "var(--vita-input-border-right, 1px)",
  borderBottomWidth: "var(--vita-input-border-bottom, 1px)",
  borderLeftWidth: "var(--vita-input-border-left, 1px)",
  borderStyle:
    "var(--vita-input-border-style, solid)" as React.CSSProperties["borderStyle"],
  borderColor: "var(--vita-neutral-200)",
  boxShadow: "var(--vita-input-shadow, none)",
  background: "var(--vita-surface)",
  color: "var(--vita-text-primary)",
  paddingLeft: "var(--vita-input-padding-x, 12px)",
  paddingRight: "36px",
  paddingTop: "var(--vita-input-padding-y, 8px)",
  paddingBottom: "var(--vita-input-padding-y, 8px)",
  fontSize: "var(--vita-input-font-size, 14px)",
  backgroundImage: CHEVRON_SVG,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  transitionProperty: "border-color, box-shadow, outline, background-color",
  transitionTimingFunction: "ease",
  transitionDuration: "var(--vita-input-transition-duration, 150ms)",
};

type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  /** Additional inline styles merged on top of themed defaults */
  style?: React.CSSProperties;
};

export function NativeSelect({
  className,
  style,
  children,
  ...props
}: NativeSelectProps) {
  return (
    <select
      className={`appearance-none ${className ?? ""}`}
      style={{ ...BASE_STYLE, ...style }}
      {...props}
    >
      {children}
    </select>
  );
}
