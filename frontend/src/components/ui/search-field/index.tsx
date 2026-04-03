/**
 * SearchField — Vita ERP search input built on React Aria.
 *
 * Accessible search field with clear button and submit support.
 * Shares --vita-input-* tokens with Input for visual consistency.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Label as AriaLabel,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from "react-aria-components";

export interface SearchFieldProps
  extends Omit<AriaSearchFieldProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SearchFieldInner(
  { className, style, children, ...ariaProps }: SearchFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSearchField
      {...ariaProps}
      ref={ref}
      data-slot="search-field"
      className={["vita-search-field", className].filter(Boolean).join(" ")}
      style={{ display: "flex", flexDirection: "column", gap: "4px", ...style }}
    >
      {children}
    </AriaSearchField>
  );
}

export const SearchField = forwardRef(SearchFieldInner);
SearchField.displayName = "SearchField";

export {
  AriaButton as SearchFieldClearButton,
  AriaInput as SearchFieldInput,
  AriaLabel as SearchFieldLabel,
};
