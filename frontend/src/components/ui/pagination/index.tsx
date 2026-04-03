/**
 * Pagination — Vita ERP page navigation component.
 *
 * Custom pagination with accessible button controls.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
} from "react";

export interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  total: number;
  /** Called when page changes */
  onChange?: (page: number) => void;
  /** Number of sibling pages to show */
  siblings?: number;
  isDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

function PaginationInner(
  {
    page,
    total,
    onChange,
    siblings = 1,
    isDisabled,
    className,
    style,
  }: PaginationProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const pages = useMemo(() => {
    const items: (number | "dots")[] = [];
    const start = Math.max(2, page - siblings);
    const end = Math.min(total - 1, page + siblings);

    items.push(1);
    if (start > 2) items.push("dots");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < total - 1) items.push("dots");
    if (total > 1) items.push(total);
    return items;
  }, [page, total, siblings]);

  const go = useCallback(
    (p: number) => {
      if (!isDisabled && p >= 1 && p <= total) onChange?.(p);
    },
    [isDisabled, total, onChange],
  );

  const btnStyle: CSSProperties = {
    appearance: "none",
    border: "1px solid var(--vita-neutral-200)",
    background: "var(--vita-surface)",
    color: "var(--vita-text-primary)",
    borderRadius: "var(--vita-btn-radius, 8px)",
    minWidth: "32px",
    height: "32px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 500,
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: isDisabled ? 0.5 : 1,
  };

  const activeStyle: CSSProperties = {
    ...btnStyle,
    backgroundColor: "var(--vita-primary)",
    color: "var(--vita-text-on-primary)",
    borderColor: "var(--vita-primary)",
  };

  return (
    <nav
      ref={ref}
      data-slot="pagination"
      aria-label="Pagination"
      className={className}
      style={{ display: "flex", alignItems: "center", gap: "4px", ...style }}
    >
      <button
        type="button"
        disabled={isDisabled || page <= 1}
        onClick={() => go(page - 1)}
        style={btnStyle}
        aria-label="Previous page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === "dots" ? (
          <span
            key={`dots-${String(i)}-sep`}
            style={{
              ...btnStyle,
              border: "none",
              background: "none",
              cursor: "default",
            }}
          >
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            type="button"
            disabled={isDisabled}
            onClick={() => go(p)}
            style={p === page ? activeStyle : btnStyle}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={isDisabled || page >= total}
        onClick={() => go(page + 1)}
        style={btnStyle}
        aria-label="Next page"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}

export const Pagination = forwardRef(PaginationInner);
Pagination.displayName = "Pagination";
