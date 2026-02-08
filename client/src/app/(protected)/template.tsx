"use client";

import React from "react";

/**
 * Protected Template
 * ------------------
 * Lightweight template used inside protected routes.
 *
 * Purpose:
 * - Override global animated template
 * - Remove transition overlays
 * - Keep rendering instant & clean
 *
 * This prevents animation layers from interfering
 * with authenticated dashboards and navigation UI.
 */

export default function ProtectedTemplate({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}