"use client";

/**
 * HydrationGuard — blocks interaction until React hydrates.
 *
 * 1. Renders a transparent overlay with a "progress" cursor that covers
 *    the entire page, preventing clicks on non-functional buttons.
 * 2. Once React mounts (useEffect fires), removes the overlay and adds
 *    `vita-hydrated` class to <html> which hides the CSS progress bar.
 */

import { useEffect, useState } from "react";

export function HydrationGuard() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // Hide the CSS-only loading bar by adding class to <html>
    document.documentElement.classList.add("vita-hydrated");
  }, []);

  if (hydrated) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        cursor: "progress",
        background: "transparent",
        pointerEvents: "auto",
      }}
    />
  );
}
