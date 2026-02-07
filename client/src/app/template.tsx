"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Animation configuration for page transitions
 */
const ANIMATION_CONFIG = {
    // Shape animations (gates opening)
    SHAPES: {
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.08,
    },

    // Content fade-in
    CONTENT: {
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
    },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Template - Page transition wrapper
 * 
 * Creates a dynamic "gates opening" effect when pages load:
 * 1. Black geometric shapes cover the screen
 * 2. Shapes split apart and fly away (like gates opening)
 * 3. Content fades in as shapes disappear
 * 
 * This component wraps all pages and runs on every route change
 */
export default function Template({ children }: { children: React.ReactNode }) {
    // ========================================================================
    // REFS
    // ========================================================================

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const shapesRef = useRef<HTMLDivElement[]>([]);

    // ========================================================================
    // ANIMATION
    // ========================================================================

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        const shapes = shapesRef.current.filter(Boolean);

        if (!container || !content || shapes.length === 0) return;

        // Create timeline for page entrance
        const tl = gsap.timeline();

        // Set initial states - shapes cover the screen
        gsap.set(shapes, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
        });

        gsap.set(content, {
            opacity: 0,
        });

        gsap.set(container, {
            opacity: 1,
        });

        // Animation sequence: gates open!
        tl
            // Shapes split apart in different directions
            .to(shapes[0], {
                // Top left - flies up and left
                x: -window.innerWidth,
                y: -window.innerHeight,
                rotation: -45,
                scale: 0.5,
                opacity: 0,
                duration: ANIMATION_CONFIG.SHAPES.duration,
                ease: ANIMATION_CONFIG.SHAPES.ease,
            })
            .to(shapes[1], {
                // Top right - flies up and right
                x: window.innerWidth,
                y: -window.innerHeight,
                rotation: 45,
                scale: 0.5,
                opacity: 0,
                duration: ANIMATION_CONFIG.SHAPES.duration,
                ease: ANIMATION_CONFIG.SHAPES.ease,
            }, `-=${ANIMATION_CONFIG.SHAPES.duration - ANIMATION_CONFIG.SHAPES.stagger}`)
            .to(shapes[2], {
                // Bottom left - flies down and left
                x: -window.innerWidth,
                y: window.innerHeight,
                rotation: 45,
                scale: 0.5,
                opacity: 0,
                duration: ANIMATION_CONFIG.SHAPES.duration,
                ease: ANIMATION_CONFIG.SHAPES.ease,
            }, `-=${ANIMATION_CONFIG.SHAPES.duration - ANIMATION_CONFIG.SHAPES.stagger}`)
            .to(shapes[3], {
                // Bottom right - flies down and right
                x: window.innerWidth,
                y: window.innerHeight,
                rotation: -45,
                scale: 0.5,
                opacity: 0,
                duration: ANIMATION_CONFIG.SHAPES.duration,
                ease: ANIMATION_CONFIG.SHAPES.ease,
            }, `-=${ANIMATION_CONFIG.SHAPES.duration - ANIMATION_CONFIG.SHAPES.stagger}`)
            // Content fades in as shapes disappear
            .to(content, {
                opacity: 1,
                duration: ANIMATION_CONFIG.CONTENT.duration,
                ease: ANIMATION_CONFIG.CONTENT.ease,
            }, `-=${ANIMATION_CONFIG.SHAPES.duration * 0.6}`)
            // Hide container after animation
            .to(container, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    if (container) {
                        container.style.pointerEvents = 'none';
                    }
                },
            });

    }, []);

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <>
            {/* Transition Container - Gates that open */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[9999]"
                aria-hidden="true"
            >
                {/* Shape 1: Top Left - Large Triangle */}
                <div
                    ref={(el) => {
                        if (el) shapesRef.current[0] = el;
                    }}
                    className="absolute top-0 left-0 w-1/2 h-1/2 bg-black origin-center"
                    style={{
                        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    }}
                />

                {/* Shape 2: Top Right - Large Triangle */}
                <div
                    ref={(el) => {
                        if (el) shapesRef.current[1] = el;
                    }}
                    className="absolute top-0 right-0 w-1/2 h-1/2 bg-black origin-center"
                    style={{
                        clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                    }}
                />

                {/* Shape 3: Bottom Left - Large Triangle */}
                <div
                    ref={(el) => {
                        if (el) shapesRef.current[2] = el;
                    }}
                    className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-black origin-center"
                    style={{
                        clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
                    }}
                />

                {/* Shape 4: Bottom Right - Large Triangle */}
                <div
                    ref={(el) => {
                        if (el) shapesRef.current[3] = el;
                    }}
                    className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-black origin-center"
                    style={{
                        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                    }}
                />
            </div>

            {/* Page Content - Fades in */}
            <div ref={contentRef}>
                {children}
            </div>
        </>
    );
}