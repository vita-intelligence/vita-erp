import React from "react";
import { Users, LayoutDashboard, DollarSign, FlaskConical } from "lucide-react";

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
 * COMPANY_NAV_GROUPS
 * ------------------
 * Navigation shown when inside a company context
 * hrefs are relative - will be prefixed with /companies/{id}
 */
export const COMPANY_NAV_GROUPS: NavGroup[] = [
    {
        key: "main",
        label: "Main",
        items: [
            { key: "overview", label: "Overview", href: "", icon: <LayoutDashboard size={20} /> },
            { key: "team", label: "Team", href: "/team", icon: <Users size={20} /> },
        ],
    },
    {
        key: "modules",
        label: "Modules",
        items: [
            { key: "sales", label: "Sales", href: "/sales", icon: <DollarSign size={20} /> },
            { key: "rnd", label: "R&D", href: "/rnd", icon: <FlaskConical size={20} /> },
        ],
    },
];

/**
 * COMPANY_MOBILE_PRIMARY_KEYS
 */
export const COMPANY_MOBILE_PRIMARY_KEYS = new Set<string>(["overview", "team", "projects"]);