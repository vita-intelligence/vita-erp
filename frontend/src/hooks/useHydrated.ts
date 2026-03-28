/**
 * useHydrated — returns true once React has hydrated on the client.
 *
 * Use this to disable interactive elements (buttons, links, forms)
 * during the hydration gap — the period between SSR HTML rendering
 * and JavaScript becoming interactive.
 *
 * Usage:
 *   const hydrated = useHydrated();
 *   <Button isDisabled={!hydrated}>Click me</Button>
 */

import { useEffect, useState } from "react";

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
