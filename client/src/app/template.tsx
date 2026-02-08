"use client";

import { animatePageIn } from "@/components/animations/PageTransitions";
import { useEffect } from "react";

/**
 * Template - Page transition wrapper
 * 
 * Automatically plays enter animation when page loads
 * Contains the 4 triangular shapes that animate
 */
export default function Template({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        animatePageIn();
    }, []);

    return (
        <div>
            {/* Shape 1: Top Left Triangle */}
            <div
                id="transition-shape-1"
                className="min-h-screen bg-black z-[9999] fixed top-0 left-0 w-1/2 h-1/2"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }}
            />

            {/* Shape 2: Top Right Triangle */}
            <div
                id="transition-shape-2"
                className="min-h-screen bg-black z-[9999] fixed top-0 right-0 w-1/2 h-1/2"
                style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                }}
            />

            {/* Shape 3: Bottom Left Triangle */}
            <div
                id="transition-shape-3"
                className="min-h-screen bg-black z-[9999] fixed bottom-0 left-0 w-1/2 h-1/2"
                style={{
                    clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
                }}
            />

            {/* Shape 4: Bottom Right Triangle */}
            <div
                id="transition-shape-4"
                className="min-h-screen bg-black z-[9999] fixed bottom-0 right-0 w-1/2 h-1/2"
                style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                }}
            />

            {children}
        </div>
    );
}