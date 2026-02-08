"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { ChevronLeft, LogOut, Menu } from "lucide-react";

import { useLogout } from "@/hooks/useAuth";
import { NAV_GROUPS, NavGroup, NavItem, NAV_UI, cx } from "./nav.config";

/**
 * ProtectedNavDesktop
 * ------------------------------
 * Desktop navigation (md+):
 * - Collapsed: icon rail (w-16) with centered burger
 * - Expanded: full sidebar (w-56) with group labels + link text
 *
 * Edit routes/groups in: nav.config.tsx
 */

export default function ProtectedNavDesktop() {
    const pathname = usePathname();
    const logout = useLogout();

    const [expanded, setExpanded] = useState(false);

    const { ICON_BOX, ROW_BASE } = NAV_UI;

    // Stable active matcher (used by multiple sub-renderers)
    const isActive = useCallback(
        (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href)),
        [pathname]
    );

    // Sidebar width classes, centralized for readability
    const sidebarWidth = expanded ? "w-56" : "w-16";

    // Centralize shared button styles
    const chromeButtonClass = cx(
        ICON_BOX,
        "text-white/80 hover:text-white hover:bg-white/8 transition-colors"
    );

    /** ---------------------------------------------------------------------- */
    /** Header                                                                 */
    /** ---------------------------------------------------------------------- */
    const Header = useMemo(() => {
        if (!expanded) {
            return (
                <div className="flex items-center justify-center">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="Expand navigation"
                        onPress={() => setExpanded(true)}
                        className={chromeButtonClass}
                    >
                        <Menu size={20} />
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden px-1">
                    <div className={cx(ICON_BOX, "bg-white/10")}>
                        <span className="text-xs font-semibold tracking-wide">VE</span>
                    </div>

                    <div className="min-w-0">
                        <div className="text-sm font-semibold leading-tight">Vita ERM</div>
                        <div className="text-xs text-white/60">Dashboard</div>
                    </div>
                </div>

                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Collapse navigation"
                    onPress={() => setExpanded(false)}
                    className={chromeButtonClass}
                >
                    <ChevronLeft size={20} />
                </Button>
            </div>
        );
    }, [expanded, ICON_BOX, chromeButtonClass]);

    /** ---------------------------------------------------------------------- */
    /** Nav item renderer                                                      */
    /** ---------------------------------------------------------------------- */
    const renderItem = useCallback(
        (item: NavItem) => {
            const active = isActive(item.href);

            return (
                <li key={item.key}>
                    <Link
                        href={item.href}
                        className={cx(
                            ROW_BASE,
                            active
                                ? "bg-blue-700 text-white"
                                : "text-white/75 hover:bg-white/8 hover:text-white",
                            !expanded && "justify-center px-0"
                        )}
                        title={!expanded ? item.label : undefined}
                        aria-label={!expanded ? item.label : undefined}
                    >
                        <span className={ICON_BOX}>{item.icon}</span>

                        {expanded && (
                            <>
                                <span className="text-sm font-medium">{item.label}</span>
                                <span
                                    className={cx(
                                        "ml-auto h-6 w-1 rounded-full",
                                        active ? "bg-white/70" : "bg-transparent"
                                    )}
                                />
                            </>
                        )}
                    </Link>
                </li>
            );
        },
        [ICON_BOX, ROW_BASE, expanded, isActive]
    );

    /** ---------------------------------------------------------------------- */
    /** Group renderer                                                         */
    /** ---------------------------------------------------------------------- */
    const renderGroup = useCallback(
        (group: NavGroup) => (
            <section key={group.key} className="mb-2">
                {expanded && group.label && (
                    <div className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-widest text-white/45">
                        {group.label}
                    </div>
                )}

                <ul className={cx("flex flex-col gap-1", expanded ? "" : "pt-1")}>
                    {group.items.map(renderItem)}
                </ul>

                <div className="mt-3 border-t border-white/10" />
            </section>
        ),
        [expanded, renderItem]
    );

    /** ---------------------------------------------------------------------- */
    /** Logout                                                                 */
    /** ---------------------------------------------------------------------- */
    const LogoutButton = useMemo(() => {
        // Collapsed: icon-only (prevents overflow / weird centering)
        if (!expanded) {
            return (
                <div className="flex justify-center">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        isDisabled={logout.isPending}
                        onPress={() => logout.mutate()}
                        aria-label="Logout"
                        className={cx(chromeButtonClass, logout.isPending && "opacity-60")}
                    >
                        <LogOut size={20} />
                    </Button>
                </div>
            );
        }

        // Expanded: full row
        return (
            <Button
                variant="light"
                fullWidth
                isDisabled={logout.isPending}
                onPress={() => logout.mutate()}
                className={cx(
                    "w-full justify-start rounded-xl px-3 py-2",
                    "text-white/75 hover:bg-white/8 hover:text-white",
                    logout.isPending && "opacity-60"
                )}
                aria-label="Logout"
            >
                <span className={ICON_BOX}>
                    <LogOut size={20} />
                </span>
                <span className="text-sm font-medium">
                    {logout.isPending ? "Logging out..." : "Logout"}
                </span>
            </Button>
        );
    }, [ICON_BOX, chromeButtonClass, expanded, logout]);

    /** ---------------------------------------------------------------------- */
    /** Render                                                                 */
    /** ---------------------------------------------------------------------- */
    return (
        <>
            <aside
                className={cx(
                    "hidden md:flex fixed left-0 top-0 h-screen z-40",
                    "bg-black text-white border-r border-white/10",
                    "transition-[width] duration-200 ease-out",
                    sidebarWidth
                )}
                aria-label="Primary navigation"
            >
                <div className="flex h-full w-full flex-col">
                    {/* Header */}
                    <div className="px-2 py-3">{Header}</div>

                    {/* Nav groups */}
                    <nav className="flex-1 px-2 py-2 overflow-y-auto">
                        {NAV_GROUPS.map(renderGroup)}
                    </nav>

                    {/* Bottom actions */}
                    <div className="p-2 border-t border-white/10">{LogoutButton}</div>
                </div>
            </aside>

            {/* Layout spacer */}
            <div className={cx("hidden md:block", sidebarWidth)} />
        </>
    );
}