"use client";

import { usePathname, useRouter } from "next/navigation";
import { animatePageOut } from "./PageTransitions";

interface AnimatedLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    asChild?: boolean; // Set to true when wrapping content inside a Button
}

/**
 * AnimatedLink - Link component with page transition animation
 * 
 * Usage:
 * 
 * Standalone (renders as button):
 * <AnimatedLink href="/about">About Us</AnimatedLink>
 * 
 * Inside a Button component (renders as div):
 * <Button>
 *   <AnimatedLink href="/dashboard" asChild>
 *     Go to Dashboard
 *   </AnimatedLink>
 * </Button>
 */
const AnimatedLink = ({
    href,
    children,
    className = "",
    asChild = false
}: AnimatedLinkProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Only animate if navigating to a different page
        if (pathname !== href) {
            animatePageOut(href, router);
        }
    };

    // If used inside another button/clickable element, render as div
    if (asChild) {
        return (
            <div
                className={className}
                onClick={handleClick}
            >
                {children}
            </div>
        );
    }

    // Otherwise render as button
    return (
        <button
            className={className}
            onClick={handleClick}
        >
            {children}
        </button>
    );
};

export default AnimatedLink;