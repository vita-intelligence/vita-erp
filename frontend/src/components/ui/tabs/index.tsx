/**
 * Tabs — Vita ERP wrapper for HeroUI Tabs.
 *
 * Applies theme tokens as inline styles on the List, Tab, and Panel
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * 3D rotation and hover transforms remain in CSS for :hover support.
 */

"use client";

import {
  Tab as HeroTab,
  TabIndicator as HeroTabIndicator,
  TabList as HeroTabList,
  TabListContainer as HeroTabListContainer,
  TabPanel as HeroTabPanel,
  TabSeparator as HeroTabSeparator,
  Tabs as HeroTabs,
  type TabsRootProps,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type TabIndicatorProps,
  type TabListContainerProps,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabSeparatorProps,
  type TabsProps,
  type TabsRootProps,
  type TabsVariants,
  tabsVariants,
} from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedRoot({ children, style, ...props }: TabsRootProps) {
  return (
    <HeroTabs
      {...props}
      style={{
        ...style,
      }}
    >
      {children}
    </HeroTabs>
  );
}

function ThemedList({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroTabList>) {
  return (
    <HeroTabList
      {...props}
      style={{
        borderRadius: "var(--vita-tabs-list-radius, 12px)",
        padding: "var(--vita-tabs-list-padding, 4px)",
        gap: "var(--vita-tabs-list-gap, 0px)",
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
    </HeroTabList>
  );
}

function ThemedTab({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroTab>) {
  return (
    <HeroTab
      {...props}
      style={{
        borderRadius: "var(--vita-tabs-tab-radius, 8px)",
        paddingInline: "var(--vita-tabs-tab-padding-x, 12px)",
        paddingTop: "var(--vita-tabs-tab-padding-y, 6px)",
        paddingBottom: "var(--vita-tabs-tab-padding-y, 6px)",
        fontSize: "var(--vita-tabs-tab-font-size, 14px)",
        fontWeight: "var(--vita-tabs-tab-font-weight, 500)",
        ...style,
      }}
    >
      {children}
    </HeroTab>
  );
}

function ThemedPanel({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroTabPanel>) {
  return (
    <HeroTabPanel
      {...props}
      style={{
        padding: "var(--vita-tabs-panel-padding, 12px)",
        ...style,
      }}
    >
      {children}
    </HeroTabPanel>
  );
}

// ── Named Exports (for direct imports) ───────────────────────────────────────

export { ThemedRoot as TabsRoot };
export { ThemedList as TabList };
export { ThemedTab as Tab };
export { ThemedPanel as TabPanel };
export {
  HeroTabListContainer as TabListContainer,
  HeroTabIndicator as TabIndicator,
  HeroTabSeparator as TabSeparator,
};

// ── Compound Export ──────────────────────────────────────────────────────────

export const Tabs = Object.assign(ThemedRoot, {
  Root: ThemedRoot,
  ListContainer: HeroTabListContainer,
  List: ThemedList,
  Tab: ThemedTab,
  Indicator: HeroTabIndicator,
  Separator: HeroTabSeparator,
  Panel: ThemedPanel,
});
