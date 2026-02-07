"use client";

import { Button } from "@heroui/react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ThreeBg from "../bg/ThreeBg";

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
    DEFAULTS: { ease: "power3.out" },

    BACKGROUND: {
        duration: 1.6,
        ease: "power2.out",
        delay: 0.1,
    },

    TITLE_SPANS: {
        duration: 0.8,
        stagger: 0.1,
        offset: "-=0.9",
    },

    TEXT: {
        duration: 0.6,
        offset: "-=0.45",
    },

    CTA: {
        duration: 0.6,
        offset: "-=0.35",
    },

    VIDEO: {
        duration: 0.8,
        offset: "-=0.6",
    },
} as const;

const DEMO_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1";

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Hero - Animated landing page hero section with 3D background
 * 
 * Features:
 * - GSAP-powered entrance animations
 * - Interactive 3D background (desktop only)
 * - Responsive layout (stacks on mobile, side-by-side on desktop)
 * - Video demo placeholder with play button
 * - Call-to-action buttons
 * 
 * Animation sequence:
 * 1. Background fades in
 * 2. Title spans appear with stagger
 * 3. Subtitle text fades up
 * 4. CTA buttons fade up
 * 5. Video preview slides in from right
 */
export default function Hero() {
    // ========================================================================
    // REFS - DOM Elements
    // ========================================================================

    const root = useRef<HTMLElement | null>(null);
    const title = useRef<HTMLHeadingElement | null>(null);
    const text = useRef<HTMLParagraphElement | null>(null);
    const cta = useRef<HTMLDivElement | null>(null);
    const video = useRef<HTMLDivElement | null>(null);
    const bgRef = useRef<HTMLDivElement | null>(null);

    // ========================================================================
    // STATE
    // ========================================================================

    const [eventSourceEl, setEventSourceEl] = useState<HTMLElement | null>(null);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    /**
     * Set up event source for ThreeBg component
     * Ensures mouse interactions are captured from the root element
     */
    useEffect(() => {
        setEventSourceEl(root.current);
    }, []);

    /**
     * GSAP entrance animation sequence
     * Runs once on mount, orchestrates all element animations
     */
    useLayoutEffect(() => {
        if (!root.current) return;

        const ctx = gsap.context(() => {
            // Initial states (hidden)
            gsap.set(bgRef.current, { opacity: 0 });
            gsap.set(text.current, { opacity: 0, y: 16 });
            gsap.set(cta.current, { opacity: 0, y: 16 });
            gsap.set(video.current, { opacity: 0, x: 60 });

            const spans = title.current?.querySelectorAll("span") ?? [];
            gsap.set(spans, { opacity: 0, y: 40 });

            // Animation timeline
            const tl = gsap.timeline({ defaults: ANIMATION_CONFIG.DEFAULTS });

            tl
                // 1. Fade in background
                .to(bgRef.current, {
                    opacity: 1,
                    duration: ANIMATION_CONFIG.BACKGROUND.duration,
                    ease: ANIMATION_CONFIG.BACKGROUND.ease,
                    delay: ANIMATION_CONFIG.BACKGROUND.delay,
                })
                // 2. Stagger in title spans
                .to(
                    spans,
                    {
                        opacity: 1,
                        y: 0,
                        stagger: ANIMATION_CONFIG.TITLE_SPANS.stagger,
                        duration: ANIMATION_CONFIG.TITLE_SPANS.duration,
                    },
                    ANIMATION_CONFIG.TITLE_SPANS.offset
                )
                // 3. Fade in subtitle text
                .to(
                    text.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: ANIMATION_CONFIG.TEXT.duration,
                    },
                    ANIMATION_CONFIG.TEXT.offset
                )
                // 4. Fade in CTA section
                .to(
                    cta.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: ANIMATION_CONFIG.CTA.duration,
                    },
                    ANIMATION_CONFIG.CTA.offset
                )
                // 5. Slide in video preview
                .to(
                    video.current,
                    {
                        opacity: 1,
                        x: 0,
                        duration: ANIMATION_CONFIG.VIDEO.duration,
                    },
                    ANIMATION_CONFIG.VIDEO.offset
                );
        }, root);

        return () => ctx.revert();
    }, []);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleDemoClick = () => {
        window.open(DEMO_VIDEO_URL, "_blank");
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <section
            ref={root}
            className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 md:px-12 lg:px-20 py-16 overflow-hidden"
        >
            {/* ============================================================ */}
            {/* BACKGROUND LAYER - 3D Scene (Desktop Only) */}
            {/* ============================================================ */}
            <div ref={bgRef} className="absolute inset-0 z-0 opacity-0 hidden lg:block">
                <ThreeBg eventSource={eventSourceEl} />
                {/* Overlay to darken 3D background for text readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* ============================================================ */}
            {/* CONTENT LAYER */}
            {/* ============================================================ */}
            <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* ======================================================== */}
                {/* LEFT COLUMN - Text Content */}
                {/* ======================================================== */}
                <div className="space-y-6 lg:space-y-10 max-w-2xl">

                    {/* Main Heading */}
                    <h1
                        ref={title}
                        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none"
                    >
                        <span className="block">The Most</span>
                        <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                            Efficient ERM
                        </span>
                        <span className="block mt-1 lg:mt-2">Platform</span>
                    </h1>

                    {/* Subtitle Description */}
                    <p
                        ref={text}
                        className="text-lg sm:text-xl lg:text-2xl text-gray-300/90 font-light leading-relaxed max-w-xl"
                    >
                        Streamline manufacturing operations, automate complex workflows, and
                        achieve{" "}
                        <span className="text-white font-medium">
                            enterprise-grade efficiency
                        </span>{" "}
                        — without the complexity.
                    </p>

                    {/* Call-to-Action Section */}
                    <div
                        ref={cta}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8 pt-4 lg:pt-6"
                    >
                        {/* Primary CTA Button */}
                        <Button
                            variant="shadow"
                            color="primary"
                            radius="sm"
                            size="lg"
                            className="font-semibold text-lg px-10 py-7"
                        >
                            Get Started →
                        </Button>

                        {/* Social Proof - Customer Count */}
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="hidden sm:block h-8 w-px bg-gray-700/60" />
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl font-bold text-white/90">+100</span>
                                <span className="text-sm sm:text-base">Manufacturers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* RIGHT COLUMN - Video Demo Preview */}
                {/* ======================================================== */}
                <div
                    ref={video}
                    className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/70 bg-gradient-to-b from-gray-950 to-black border border-gray-800/80 aspect-video group transition-all duration-500 hover:scale-[1.02]"
                >
                    {/* Video background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/80 via-gray-950 to-black" />

                    {/* Interactive play button area */}
                    <button
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        aria-label="Watch demo"
                        onClick={handleDemoClick}
                    >
                        {/* Play button icon */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 flex items-center justify-center hover:scale-110 transition">
                            ▶
                        </div>

                        {/* Duration badge (top-right) */}
                        <div className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full bg-black/60 border border-gray-700 text-gray-400">
                            2:18 min
                        </div>

                        {/* Video title overlay (bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/90 to-transparent flex items-end pb-5 pl-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-white/60" />
                                <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">
                                    Vita ERM Platform Demo
                                </span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
}