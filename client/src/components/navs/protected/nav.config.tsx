import React from "react";
import { Building, Home, Mail, Settings } from "lucide-react";

export type NavItem = {
    key: string;
    label: string;
    href: string;
    icon: React.ReactNode;
};

export type NavGroup = {
    key: string;
    label?: string;
    items: NavItem[];
};

/**
 * NAV_GROUPS
 * ----------
 * ✅ Add new links here (grouped).
 */
export const NAV_GROUPS: NavGroup[] = [
    {
        key: "core",
        label: "Core",
        items: [
            { key: "home", label: "Home", href: "/home", icon: <Home size={20} /> },
            { key: "settings", label: "Settings", href: "/settings", icon: <Settings size={20} /> },
        ],
    },
    {
        key: "actions",
        label: "Actions",
        items: [
            { key: "companies", label: "Companies", href: "/companies", icon: <Building size={20} /> },
            { key: "invitations", label: "Invitations", href: "/invitations", icon: <Mail size={20} /> },
        ],
    },
];

/**
 * MOBILE_PRIMARY_KEYS
 * -------------------
 * Bottom bar should stay clean (3–5 keys max).
 * Everything else goes into the “More” sheet.
 */
export const MOBILE_PRIMARY_KEYS = new Set<string>(["home"]);

/** Styling tokens shared by nav components */
export const NAV_UI = {
    ICON_BOX: "grid h-10 w-10 place-items-center rounded-xl",
    ROW_BASE: "group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors",
};

/** Tiny className helper */
export function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}