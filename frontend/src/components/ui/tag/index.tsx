/**
 * Tag — Vita ERP tag/label built on React Aria TagGroup.
 *
 * Shares badge tokens (--vita-badge-*) with Chip for visual consistency.
 * Supports removable tags via onRemove callback.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
} from "react-aria-components";

// ── TagGroup ────────────────────────────────────────────────────────────────

export interface TagGroupProps
  extends Omit<AriaTagGroupProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TagGroupInner(
  { className, style, children, ...ariaProps }: TagGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTagGroup
      {...ariaProps}
      ref={ref}
      data-slot="tag-group"
      className={className}
      style={style}
    >
      {children}
    </AriaTagGroup>
  );
}

export const TagGroup = forwardRef(TagGroupInner);
TagGroup.displayName = "TagGroup";

// ── TagList ─────────────────────────────────────────────────────────────────

export interface TagListProps<T extends object = object>
  extends Omit<AriaTagListProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TagListInner<T extends object = object>(
  { className, style, children, ...ariaProps }: TagListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTagList<T>
      {...ariaProps}
      ref={ref}
      data-slot="tag-list"
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "4px", ...style }}
    >
      {children}
    </AriaTagList>
  );
}

export const TagList = forwardRef(TagListInner) as <T extends object = object>(
  props: TagListProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof TagListInner>;

// ── Tag ─────────────────────────────────────────────────────────────────────

export interface TagProps extends Omit<AriaTagProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function TagInner(
  { className, style, children, ...ariaProps }: TagProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTag
      {...ariaProps}
      ref={ref}
      data-slot="tag"
      className={["vita-tag", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        borderRadius: "var(--vita-badge-radius, 9999px)",
        padding:
          "var(--vita-badge-padding-y, 0.2rem) var(--vita-badge-padding-x, 0.55rem)",
        fontSize: "var(--vita-badge-font-size, 0.6875rem)",
        fontWeight: "var(--vita-badge-font-weight, 600)",
        backgroundColor: "var(--vita-neutral-100)",
        color: "var(--vita-text-primary)",
        border: "1px solid var(--vita-neutral-200)",
        outline: "none",
        cursor: "default",
        ...style,
      }}
    >
      {children}
    </AriaTag>
  );
}

export const Tag = forwardRef(TagInner);
Tag.displayName = "Tag";
