"use client";

import { animatePageOut } from "@/components/ui/animations/PageTransitions";
import { usePathname, useRouter } from "next/navigation";

/**
 * usePageTransition - Hook for triggering page transitions
 * 
 * Returns a function that triggers the exit animation and navigates
 * 
 * Usage:
 * 
 * const transitionTo = usePageTransition();
 * 
 * <Button onClick={() => transitionTo('/dashboard')}>
 *   Go to Dashboard
 * </Button>
 */
export function usePageTransition() {
    const router = useRouter();
    const pathname = usePathname();

    const transitionTo = (href: string) => {
        // Only animate if navigating to a different page
        if (pathname !== href) {
            animatePageOut(href, router);
        } else {
            // Same page, just navigate immediately
            router.push(href);
        }
    };

    return transitionTo;
}