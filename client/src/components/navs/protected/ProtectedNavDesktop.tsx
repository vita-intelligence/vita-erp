"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { ChevronLeft, LogOut, Menu, Building2 } from "lucide-react";

import { useLogout } from "@/hooks/api/useAuth";
import { NavGroup, NavItem, NAV_UI, cx } from "./nav.config";
import { useNavConfig } from "@/hooks/ui/useNavConfig";

export default function ProtectedNavDesktop() {
    const pathname = usePathname();
    const logout = useLogout();
    const navConfig = useNavConfig();

    const [expanded, setExpanded] = useState(false);

    const { ICON_BOX, ROW_BASE } = NAV_UI;

    const isActive = useCallback(
        (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href)),
        [pathname]
    );

    const sidebarWidth = expanded ? "w-56" : "w-16";

    const chromeButtonClass = cx(
        ICON_BOX,
        "text-white/80 hover:text-white hover:bg-white/8 transition-colors"
    );

    /** Header */
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
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden px-1">
                        <div className={cx(ICON_BOX, "bg-white/10")}>
                            {navConfig.isCompanyContext ? (
                                <Building2 size={20} />
                            ) : (
                                <span className="text-xs font-semibold tracking-wide">VE</span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="text-sm font-semibold leading-tight">
                                {navConfig.isCompanyContext ? 'Company' : 'Vita ERM'}
                            </div>
                            <div className="text-xs text-white/60">
                                {navConfig.isCompanyContext ? 'Workspace' : 'Dashboard'}
                            </div>
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

                {/* Back to Companies button */}
                {navConfig.isCompanyContext && (
                    <Link
                        href="/companies"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/75 hover:bg-white/8 hover:text-white transition-colors border border-white/10"
                    >
                        <ChevronLeft size={14} />
                        <span>Back to Companies</span>
                    </Link>
                )}
            </div>
        );
    }, [expanded, navConfig.isCompanyContext, ICON_BOX, chromeButtonClass]);

    /** Nav item renderer */
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

    /** Group renderer */
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

    /** Logout */
    const LogoutButton = useMemo(() => {
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
                    <div className="px-2 py-3">{Header}</div>

                    <nav className="flex-1 px-2 py-2 overflow-y-auto">
                        {navConfig.groups.map(renderGroup)}
                    </nav>

                    <div className="p-2 border-t border-white/10">{LogoutButton}</div>
                </div>
            </aside>

            <div className={cx("hidden md:block", sidebarWidth)} />
        </>
    );
}