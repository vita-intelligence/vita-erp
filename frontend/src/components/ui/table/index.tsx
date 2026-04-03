/**
 * Table — Vita ERP table built on React Aria.
 *
 * Accessible data table with keyboard navigation, sorting,
 * row selection, and screen reader support.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Cell as AriaCell,
  type CellProps as AriaCellProps,
  Column as AriaColumn,
  type ColumnProps as AriaColumnProps,
  Row as AriaRow,
  type RowProps as AriaRowProps,
  Table as AriaTable,
  TableBody as AriaTableBody,
  type TableBodyProps as AriaTableBodyProps,
  TableHeader as AriaTableHeader,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
} from "react-aria-components";

export interface TableProps
  extends Omit<AriaTableProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TableInner(
  { className, style, children, ...ariaProps }: TableProps,
  ref: ForwardedRef<HTMLTableElement>,
) {
  return (
    <AriaTable
      {...ariaProps}
      ref={ref}
      data-slot="table"
      className={["vita-table", className].filter(Boolean).join(" ")}
      style={{ width: "100%", borderCollapse: "collapse", ...style }}
    >
      {children}
    </AriaTable>
  );
}

export const Table = forwardRef(TableInner);
Table.displayName = "Table";

// Re-export building blocks with Vita naming
export interface TableHeaderProps<T extends object = object>
  extends Omit<AriaTableHeaderProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}
function TableHeaderInner<T extends object = object>(
  { className, style, children, ...ariaProps }: TableHeaderProps<T>,
  ref: ForwardedRef<HTMLTableSectionElement>,
) {
  return (
    <AriaTableHeader<T>
      {...ariaProps}
      ref={ref}
      data-slot="table-header"
      className={className}
      style={style}
    >
      {children}
    </AriaTableHeader>
  );
}
export const TableHeader = forwardRef(TableHeaderInner) as <
  T extends object = object,
>(
  props: TableHeaderProps<T> & { ref?: ForwardedRef<HTMLTableSectionElement> },
) => ReturnType<typeof TableHeaderInner>;

export interface TableBodyProps<T extends object = object>
  extends Omit<AriaTableBodyProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}
function TableBodyInner<T extends object = object>(
  { className, style, children, ...ariaProps }: TableBodyProps<T>,
  ref: ForwardedRef<HTMLTableSectionElement>,
) {
  return (
    <AriaTableBody<T>
      {...ariaProps}
      ref={ref}
      data-slot="table-body"
      className={className}
      style={style}
    >
      {children}
    </AriaTableBody>
  );
}
export const TableBody = forwardRef(TableBodyInner) as <
  T extends object = object,
>(
  props: TableBodyProps<T> & { ref?: ForwardedRef<HTMLTableSectionElement> },
) => ReturnType<typeof TableBodyInner>;

export interface ColumnProps
  extends Omit<AriaColumnProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function ColumnInner(
  { className, style, children, ...ariaProps }: ColumnProps,
  ref: ForwardedRef<HTMLTableCellElement>,
) {
  return (
    <AriaColumn
      {...ariaProps}
      ref={ref}
      data-slot="table-column"
      className={className}
      style={{
        textAlign: "left",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
        borderBottom: "1px solid var(--vita-neutral-200)",
        color: "var(--vita-text-secondary)",
        ...style,
      }}
    >
      {children}
    </AriaColumn>
  );
}
export const Column = forwardRef(ColumnInner);
Column.displayName = "Column";

export interface RowProps<T extends object = object>
  extends Omit<AriaRowProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function RowInner<T extends object = object>(
  { className, style, children, ...ariaProps }: RowProps<T>,
  ref: ForwardedRef<HTMLTableRowElement>,
) {
  return (
    <AriaRow<T>
      {...ariaProps}
      ref={ref}
      data-slot="table-row"
      className={["vita-table-row", className].filter(Boolean).join(" ")}
      style={{ borderBottom: "1px solid var(--vita-neutral-100)", ...style }}
    >
      {children}
    </AriaRow>
  );
}
export const Row = forwardRef(RowInner) as <T extends object = object>(
  props: RowProps<T> & { ref?: ForwardedRef<HTMLTableRowElement> },
) => ReturnType<typeof RowInner>;

export interface CellProps extends Omit<AriaCellProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function CellInner(
  { className, style, children, ...ariaProps }: CellProps,
  ref: ForwardedRef<HTMLTableCellElement>,
) {
  return (
    <AriaCell
      {...ariaProps}
      ref={ref}
      data-slot="table-cell"
      className={className}
      style={{
        padding: "8px 12px",
        fontSize: "14px",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </AriaCell>
  );
}
export const Cell = forwardRef(CellInner);
Cell.displayName = "Cell";
