"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { LogOut, MoreHorizontal } from "lucide-react";

import { useLogout } from "@/hooks/useAuth";
import { NAV_GROUPS, MOBILE_PRIMARY_KEYS, NAV_UI, cx } from "./nav.config";

/**
 * ProtectedNavMobile
 * -----------------------------
 * Mobile navigation strategy:
 * - Bottom bar: 3–5 primary routes + "More"
 * - "More" opens a bottom sheet with grouped navigation (scales for many items)
 *
 * Edit:
 * - NAV_GROUPS (routes + grouping)
 * - MOBILE_PRIMARY_KEYS (which routes go to the bottom bar)
 */

export default function ProtectedNavMobile() {
    const pathname = usePathname();
    const logout = useLogout();

    // Controlled modal state is the most reliable option with UI libs.
    const [isSheetOpen, setSheetOpen] = useState(false);

    const { ICON_BOX } = NAV_UI;

    const isActive = useCallback(
        (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href)),
        [pathname]
    );

    const openSheet = useCallback(() => setSheetOpen(true), []);
    const closeSheet = useCallback(() => setSheetOpen(false), []);

    /**
     * Bottom bar should remain small. We pull only keys from MOBILE_PRIMARY_KEYS.
     * Everything else remains grouped for the "More" sheet.
     */
    const primaryItems = useMemo(() => {
        return NAV_GROUPS.flatMap((g) => g.items).filter((i) =>
            MOBILE_PRIMARY_KEYS.has(i.key)
        );
    }, []);

    const overflowGroups = useMemo(() => {
        return NAV_GROUPS.map((g) => ({
            ...g,
            items: g.items.filter((i) => !MOBILE_PRIMARY_KEYS.has(i.key)),
        })).filter((g) => g.items.length > 0);
    }, []);

    return (
        <>
            {/* ========================= Bottom Bar ========================= */}
            <nav
                className={cx(
                    "md:hidden fixed bottom-0 left-0 right-0 z-50",
                    "bg-black text-white border-t border-white/10"
                )}
                aria-label="Mobile navigation"
            >
                <ul className="flex items-center justify-around px-2 py-2">
                    {primaryItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <li key={item.key} className="flex-1">
                                <Link
                                    href={item.href}
                                    className={cx(
                                        "flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors",
                                        active ? "text-white" : "text-white/70 hover:text-white"
                                    )}
                                >
                                    <span className={cx(ICON_BOX, active && "bg-blue-700")}>
                                        {item.icon}
                                    </span>
                                    <span className="text-[11px]">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}

                    {/* More -> opens sheet */}
                    <li className="flex-1">
                        <Button
                            variant="light"
                            fullWidth
                            onPress={openSheet}
                            aria-label="More"
                            className={cx(
                                "flex flex-col items-center justify-center gap-1 py-2",
                                "text-white/70 hover:text-white"
                            )}
                        >
                            <span className={cx(ICON_BOX, isSheetOpen && "bg-white/10")}>
                                <MoreHorizontal size={20} />
                            </span>
                            <span className="text-[11px]">More</span>
                        </Button>
                    </li>
                </ul>
            </nav>

            {/* ========================= “More” Sheet ========================= */}
            <Modal
                isOpen={isSheetOpen}
                onOpenChange={setSheetOpen}
                placement="bottom"
                backdrop="blur"
                isDismissable
                classNames={{
                    base: "bg-black text-white border-t border-white/10",
                    body: "pb-6",
                }}
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-3 pb-2">
                            {/* Center “drag handle” — clickable close */}
                            <div className="flex justify-center">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onPress={closeSheet}
                                    aria-label="Close menu"
                                    className="h-auto min-h-0 px-6 py-2"
                                >
                                    <span className="h-1.5 w-12 rounded-full bg-white/25" />
                                </Button>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">Vita ERM</span>
                                <span className="text-xs text-white/60">Navigation</span>
                            </div>
                        </ModalHeader>

                        <ModalBody>
                            {overflowGroups.length === 0 ? (
                                <div className="text-sm text-white/60">Nothing else yet.</div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {overflowGroups.map((group) => (
                                        <section key={group.key}>
                                            {group.label && (
                                                <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/45">
                                                    {group.label}
                                                </div>
                                            )}

                                            {/* Grid scales well even with many items */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {group.items.map((item) => {
                                                    const active = isActive(item.href);

                                                    return (
                                                        <Link
                                                            key={item.key}
                                                            href={item.href}
                                                            onClick={closeSheet}
                                                            className={cx(
                                                                "flex items-center gap-3 rounded-xl px-3 py-3",
                                                                "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
                                                                active && "border-blue-600/50 bg-blue-700/30"
                                                            )}
                                                        >
                                                            <span className={cx(ICON_BOX, "bg-white/5")}>
                                                                {item.icon}
                                                            </span>

                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium leading-tight">
                                                                    {item.label}
                                                                </div>
                                                                <div className="text-xs text-white/55 truncate">
                                                                    {group.label ?? "Section"}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}

                            {/* Logout: safe placement (no accidental tap on close) */}
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <Button
                                    variant="flat"
                                    color="danger"
                                    fullWidth
                                    isDisabled={logout.isPending}
                                    onPress={() => {
                                        logout.mutate();
                                        closeSheet();
                                    }}
                                >
                                    <LogOut size={18} />
                                    <span className="ml-2">
                                        {logout.isPending ? "Logging out..." : "Logout"}
                                    </span>
                                </Button>
                            </div>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}