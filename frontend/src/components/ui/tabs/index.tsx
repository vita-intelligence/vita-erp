/**
 * Tabs — Vita ERP tab navigation built on React Aria.
 *
 * Fully accessible (WCAG 2.1 AA) with keyboard navigation (Arrow keys),
 * focus management, and screen reader support via React Aria primitives.
 *
 * All visual properties are driven by --vita-tabs-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Usage:
 *   <Tabs selectedKey={key} onSelectionChange={setKey}>
 *     <Tabs.List aria-label="Sections">
 *       <Tabs.Tab id="one">One</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel id="one">Content</Tabs.Panel>
 *   </Tabs>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from "react-aria-components";

// ── Tabs Root ───────────────────────────────────────────────────────────────

export interface TabsRootProps
  extends Omit<AriaTabsProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TabsRootInner(
  { className, style, children, ...ariaProps }: TabsRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTabs
      {...ariaProps}
      ref={ref}
      data-slot="tabs"
      className={["vita-tabs", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </AriaTabs>
  );
}

// ── Tab List ────────────────────────────────────────────────────────────────

export interface TabListProps<T extends object = object>
  extends Omit<AriaTabListProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TabListInner<T extends object = object>(
  { className, style, children, ...ariaProps }: TabListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTabList<T>
      {...ariaProps}
      ref={ref}
      data-slot="tab-list"
      className={["vita-tab-list", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "var(--vita-tabs-list-radius, 12px)",
        padding: "var(--vita-tabs-list-padding, 4px)",
        gap: "var(--vita-tabs-list-gap, 0px)",
        backgroundColor: "var(--vita-neutral-100)",

        // 3D perspective rotation
        transform:
          "perspective(800px)" +
          " rotateX(var(--vita-tabs-rotate-x, 0deg))" +
          " rotateY(var(--vita-tabs-rotate-y, 0deg))" +
          " rotateZ(var(--vita-tabs-rotate-z, 0deg))",
        transitionProperty: "transform",
        transitionDuration: "var(--vita-tabs-transition-duration, 200ms)",

        ...style,
      }}
    >
      {children}
    </AriaTabList>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<AriaTabProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TabInner(
  { className, style, children, ...ariaProps }: TabProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTab
      {...ariaProps}
      ref={ref}
      data-slot="tab"
      className={["vita-tab", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
        whiteSpace: "nowrap",
        userSelect: "none",
        borderRadius: "var(--vita-tabs-tab-radius, 8px)",
        paddingInline: "var(--vita-tabs-tab-padding-x, 12px)",
        paddingTop: "var(--vita-tabs-tab-padding-y, 6px)",
        paddingBottom: "var(--vita-tabs-tab-padding-y, 6px)",
        fontSize: "var(--vita-tabs-tab-font-size, 14px)",
        fontWeight: "var(--vita-tabs-tab-font-weight, 500)",
        color: "var(--vita-text-secondary)",
        transitionProperty: "color, background-color",
        transitionDuration: "var(--vita-tabs-transition-duration, 200ms)",
        ...style,
      }}
    >
      {children}
    </AriaTab>
  );
}

export const Tab = forwardRef(TabInner);
Tab.displayName = "Tab";

// ── Tab Panel ───────────────────────────────────────────────────────────────

export interface TabPanelProps
  extends Omit<AriaTabPanelProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TabPanelInner(
  { className, style, children, ...ariaProps }: TabPanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTabPanel
      {...ariaProps}
      ref={ref}
      data-slot="tab-panel"
      className={["vita-tab-panel", className].filter(Boolean).join(" ")}
      style={{
        padding: "var(--vita-tabs-panel-padding, 12px)",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </AriaTabPanel>
  );
}

export const TabPanel = forwardRef(TabPanelInner);
TabPanel.displayName = "TabPanel";

// ── Tab Indicator ───────────────────────────────────────────────────────────

export interface TabIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Visual indicator rendered inside a Tab. Visibility is controlled via CSS
 * based on the parent Tab's [data-selected] attribute.
 */
export function TabIndicator({ className, style }: TabIndicatorProps) {
  return (
    <span
      data-slot="tab-indicator"
      className={["vita-tab-indicator", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}

// ── Tab Separator ───────────────────────────────────────────────────────────

export interface TabSeparatorProps {
  className?: string;
  style?: CSSProperties;
}

export function TabSeparator({ className, style }: TabSeparatorProps) {
  return (
    <span
      data-slot="tab-separator"
      className={className}
      style={{
        width: "1px",
        alignSelf: "stretch",
        backgroundColor: "var(--vita-neutral-300)",
        ...style,
      }}
    />
  );
}

// ── Compound Exports ────────────────────────────────────────────────────────

const TabsRootWithRef = forwardRef(TabsRootInner);
TabsRootWithRef.displayName = "TabsRoot";

const TabListWithRef = forwardRef(TabListInner) as <T extends object = object>(
  props: TabListProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof TabListInner>;

export { TabsRootWithRef as TabsRoot };
export { TabListWithRef as TabList };

export const Tabs = Object.assign(TabsRootWithRef, {
  Root: TabsRootWithRef,
  List: TabListWithRef,
  Tab,
  Panel: TabPanel,
  Indicator: TabIndicator,
  Separator: TabSeparator,
});
Tabs.displayName = "Tabs";
