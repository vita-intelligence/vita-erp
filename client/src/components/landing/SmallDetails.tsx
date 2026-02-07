"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Panel content data
 */
const PANELS = [
    {
        text: "Built by experts in manufacturing",
        color: "bg-white",
        textColor: "text-black",
        position: "top-left",
    },
    {
        text: "Grounded in scientific research",
        color: "bg-black",
        textColor: "text-white",
        position: "bottom-right",
    },
    {
        text: "Designed to be understood by anyone",
        color: "bg-white",
        textColor: "text-black",
        position: "top-left",
    },
] as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * SmallDetails - Card-stack scroll effect
 * 
 * Panels slide down one by one as you scroll, creating a card-stack reveal effect.
 * 
 * @returns Three stacked panels with slide transitions
 */
export default function SmallDetails() {
    // ========================================================================
    // REFS
    // ========================================================================

    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

    // ========================================================================
    // SCROLL ANIMATION SETUP
    // ========================================================================

    useLayoutEffect(() => {
        const container = containerRef.current;
        const panels = panelsRef.current.filter(Boolean);

        if (!container || panels.length === 0) return;

        const ctx = gsap.context(() => {
            // Set initial states
            panels.forEach((panel, i) => {
                if (!panel) return;

                // All panels start at their normal position
                // We'll animate them in using ScrollTrigger

                const heading = panel.querySelector("h2");
                const line = panel.querySelector(".decorative-line");

                if (heading) {
                    gsap.set(heading, {
                        opacity: 0,
                        y: 40,
                    });
                }

                if (line) {
                    gsap.set(line, {
                        scaleX: 0,
                        opacity: 0,
                    });
                }
            });

            // Create a master timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: () => `+=${window.innerHeight * (PANELS.length + 1)}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    markers: false, // Set to true to debug
                }
            });

            // Animate each panel in sequence
            panels.forEach((panel, i) => {
                if (!panel) return;

                const heading = panel.querySelector("h2");
                const line = panel.querySelector(".decorative-line");

                if (i === 0) {
                    // First panel: just animate text
                    tl.to(heading, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power3.out",
                    }, 0);

                    if (line) {
                        tl.to(line, {
                            scaleX: 1,
                            opacity: 0.4,
                            duration: 0.3,
                            ease: "power2.out",
                        }, 0.2);
                    }

                    // Hold first panel
                    tl.to({}, { duration: 1 });
                } else {
                    // Subsequent panels: slide up from below
                    gsap.set(panel, { yPercent: 100 });

                    tl.to(panel, {
                        yPercent: 0,
                        duration: 1,
                        ease: "none",
                    });

                    // Animate text
                    tl.to(heading, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power3.out",
                    }, "<0.3");

                    if (line) {
                        tl.to(line, {
                            scaleX: 1,
                            opacity: 0.4,
                            duration: 0.3,
                            ease: "power2.out",
                        }, "<0.2");
                    }

                    // Hold this panel before next
                    if (i < panels.length - 1) {
                        tl.to({}, { duration: 1 });
                    }
                }
            });
        });

        // Cleanup
        return () => {
            ctx.revert();
        };
    }, []);

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden"
        >
            {PANELS.map((panel, i) => {
                // Map string position to Tailwind classes
                let alignClasses = "items-center justify-center text-center";
                let offsetClasses = "";

                switch (panel.position) {
                    case "top-left":
                        alignClasses = "items-start justify-start text-left";
                        offsetClasses = "pt-20 pl-8 md:pt-32 md:pl-16 lg:pl-32";
                        break;
                    case "bottom-right":
                        alignClasses = "items-end justify-end text-right";
                        offsetClasses = "pb-20 pr-8 md:pb-32 md:pr-16 lg:pr-32";
                        break;
                    default:
                        // fallback to centered
                        break;
                }

                return (
                    <div
                        key={i}
                        ref={(el) => {
                            if (el) panelsRef.current[i] = el;
                        }}
                        className={`
                            absolute
                            inset-0
                            w-full
                            h-full
                            flex 
                            ${alignClasses}
                            ${panel.color}
                            ${panel.textColor}
                            overflow-hidden
                        `}
                        style={{
                            zIndex: i + 1,
                        }}
                    >
                        {/* Subtle background decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div
                                className={`
                                    absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl
                                    ${panel.position.includes("left") ? "-left-20 top-20" : "-right-20 bottom-20"}
                                    ${panel.color === "bg-black" ? "bg-gray-400" : "bg-gray-800"}
                                `}
                            />
                        </div>

                        {/* Content */}
                        <div
                            className={`
                                relative z-10 max-w-4xl w-full
                                ${offsetClasses}
                                space-y-6 md:space-y-10
                            `}
                        >
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                                {panel.text}
                            </h2>

                            {/* Decorative line */}
                            <div className="decorative-line h-0.5 w-20 bg-current rounded origin-left" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}