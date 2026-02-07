"use client";

import React, { Dispatch, SetStateAction, useLayoutEffect, useRef } from "react";
import {
    Calendar,
    Package,
    ShoppingCart,
    BookOpen,
    Beaker,
    Warehouse,
    Share2,
    MessageSquare,
    Users,
    BarChart3,
    Zap,
} from "lucide-react";
import { Button } from "@heroui/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Feature list data
 * Each feature represents a key capability of the Vita ERM platform
 */
const FEATURES = [
    {
        icon: Calendar,
        number: "01",
        title: "Task & Deadline Management",
        description:
            "Structured scheduling with enforced deadlines, real-time status tracking and automated escalation protocols.",
    },
    {
        icon: Package,
        number: "02",
        title: "Product & Material Registry",
        description:
            "Centralized, fully auditable database for products, ingredients, specifications and complete batch traceability.",
    },
    {
        icon: ShoppingCart,
        number: "03",
        title: "Procurement & Purchasing Control",
        description:
            "Demand forecasting, formal PO generation, supplier evaluation and multi-level approval workflows.",
    },
    {
        icon: BookOpen,
        number: "04",
        title: "Recipe & Formulation Control",
        description:
            "Versioned master recipes with automatic BOM costing, regulatory compliance checks and scalable calculations.",
    },
    {
        icon: Beaker,
        number: "05",
        title: "R&D Formulation Environment",
        description:
            "Isolated development space for trials, version comparison, risk evaluation and seamless production handover.",
    },
    {
        icon: Warehouse,
        number: "06",
        title: "Inventory & Stock Management",
        description:
            "Live inventory tracking, lot/batch/serial control, expiry alerts, cycle counting and intelligent re-ordering.",
    },
    {
        icon: Share2,
        number: "07",
        title: "Customer Production Visibility",
        description:
            "Secure, role-based client portal delivering real-time updates on order progress and production milestones.",
    },
    {
        icon: MessageSquare,
        number: "08",
        title: "Internal Communication Protocol",
        description:
            "Contextual, auditable discussions and document sharing — integrated directly with tasks and records.",
    },
    {
        icon: Users,
        number: "09",
        title: "Role-Based Responsibility Assignment",
        description:
            "Clear delegation of duties, execution oversight, accountability logs and individual performance metrics.",
    },
    {
        icon: BarChart3,
        number: "10",
        title: "Operational & Performance Reporting",
        description:
            "Customizable executive dashboards with yield metrics, efficiency KPIs, variance analysis and profitability views.",
    },
    {
        icon: Zap,
        number: "11",
        title: "Embedded AI Capabilities",
        description:
            "Intelligent assistance for formulation optimization, predictive alerts, auto-generated documentation and anomaly detection.",
    },
] as const;

/**
 * Animation configuration
 */
const ANIMATION_CONFIG = {
    BACKGROUND: {
        targetColor: "#000000",
        start: "top 70%",
        end: "top 20%",
    },

    HEADER: {
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
    },

    FEATURES: {
        // Alternating animations for visual interest
        LEFT: {
            duration: 1,
            ease: "power3.out",
            xOffset: -100,
            rotation: -3,
        },
        RIGHT: {
            duration: 1,
            ease: "power3.out",
            xOffset: 100,
            rotation: 3,
        },
    },

    CTA: {
        duration: 1,
        ease: "power3.out",
    },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * WhyItsGood - Feature showcase section
 * 
 * Features:
 * - Background color transition on scroll (white → black)
 * - Staggered entrance animations for all content
 * - 11 numbered feature cards with icons
 * - Call-to-action section at bottom
 * 
 * All animations use GSAP for optimal performance
 * 
 * @returns A full feature showcase section
 */
type WhyItsGoodProps = {
    setIsVideoOpen: Dispatch<SetStateAction<boolean>>;
};

export default function WhyItsGood({ setIsVideoOpen }: WhyItsGoodProps) {
    // ========================================================================
    // REFS
    // ========================================================================

    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    // ========================================================================
    // SCROLL ANIMATIONS
    // ========================================================================

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const header = headerRef.current;
        const featuresContainer = featuresRef.current;
        const cta = ctaRef.current;

        if (!section) return;

        const ctx = gsap.context(() => {
            // ================================================================
            // BACKGROUND COLOR TRANSITION
            // ================================================================

            /**
             * Smooth background color fade from white to black
             * Syncs with scroll position as section enters viewport
             */
            gsap.to(section, {
                backgroundColor: ANIMATION_CONFIG.BACKGROUND.targetColor,
                scrollTrigger: {
                    trigger: section,
                    start: ANIMATION_CONFIG.BACKGROUND.start,
                    end: ANIMATION_CONFIG.BACKGROUND.end,
                    scrub: true,
                },
            });

            // ================================================================
            // HEADER ANIMATION
            // ================================================================

            /**
             * Staggered fade-in for header elements
             * Title, description, and badge animate in sequence
             */
            if (header) {
                const headerElements = header.querySelectorAll("h2, p, div");

                gsap.set(headerElements, {
                    opacity: 0,
                    y: 40,
                });

                gsap.to(headerElements, {
                    opacity: 1,
                    y: 0,
                    duration: ANIMATION_CONFIG.HEADER.duration,
                    ease: ANIMATION_CONFIG.HEADER.ease,
                    stagger: ANIMATION_CONFIG.HEADER.stagger,
                    scrollTrigger: {
                        trigger: header,
                        start: "top 80%",
                    },
                });
            }

            // ================================================================
            // FEATURES ANIMATION
            // ================================================================

            /**
             * Each feature card gets its own scroll trigger
             * Alternates between sliding from left and right with rotation
             * Creates dynamic, engaging entrance effects
             */
            if (featuresContainer) {
                const featureCards = featuresContainer.querySelectorAll(".feature-card");

                featureCards.forEach((card, index) => {
                    // Alternate between left and right animations
                    const isEven = index % 2 === 0;
                    const config = isEven ? ANIMATION_CONFIG.FEATURES.LEFT : ANIMATION_CONFIG.FEATURES.RIGHT;

                    // Find elements within this card
                    const number = card.querySelector(".feature-number");
                    const icon = card.querySelector(".feature-icon");
                    const content = card.querySelector(".feature-content");

                    // Set initial states
                    gsap.set(card, {
                        opacity: 0,
                    });

                    if (number) {
                        gsap.set(number, {
                            opacity: 0,
                            scale: 0.5,
                            rotation: isEven ? -45 : 45,
                        });
                    }

                    if (icon) {
                        gsap.set(icon, {
                            opacity: 0,
                            scale: 0,
                            rotation: isEven ? 180 : -180,
                        });
                    }

                    if (content) {
                        gsap.set(content, {
                            opacity: 0,
                            x: config.xOffset,
                            rotationY: config.rotation,
                        });
                    }

                    // Create timeline for this card
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 60%",
                            toggleActions: "play none none reverse",
                        }
                    });

                    // Animate card container
                    tl.to(card, {
                        opacity: 1,
                        duration: 0.3,
                    });

                    // Animate number (scale + rotate in)
                    if (number) {
                        tl.to(number, {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 0.6,
                            ease: "back.out(1.7)",
                        }, "-=0.2");
                    }

                    // Animate icon (scale + spin in)
                    if (icon) {
                        tl.to(icon, {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 0.7,
                            ease: "back.out(1.7)",
                        }, "-=0.5");
                    }

                    // Animate content (slide + rotate in)
                    if (content) {
                        tl.to(content, {
                            opacity: 1,
                            x: 0,
                            rotationY: 0,
                            duration: config.duration,
                            ease: config.ease,
                        }, "-=0.6");
                    }
                });
            }

            // ================================================================
            // CTA ANIMATION
            // ================================================================

            /**
             * Final call-to-action section fades in
             */
            if (cta) {
                const ctaElements = cta.querySelectorAll("p, .cta-buttons, .cta-note");

                gsap.set(ctaElements, {
                    opacity: 0,
                    y: 30,
                });

                gsap.to(ctaElements, {
                    opacity: 1,
                    y: 0,
                    duration: ANIMATION_CONFIG.CTA.duration,
                    ease: ANIMATION_CONFIG.CTA.ease,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: cta,
                        start: "top 85%",
                    },
                });
            }
        });

        return () => ctx.revert();
    }, []);

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <section
            ref={sectionRef}
            className="py-24 md:py-32 bg-white text-white transition-colors duration-300"
        >
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* ============================================================ */}
                {/* HEADER SECTION */}
                {/* ============================================================ */}
                <div ref={headerRef} className="text-center mb-20 md:mb-28">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Unified Manufacturing Execution Platform
                    </h2>

                    <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Vita ERM delivers a single, secure system for full-spectrum production oversight —
                        replacing disjointed tools with integrated control, traceability and intelligent decision support.
                    </p>

                    <div className="mt-8 inline-block border border-primary/30 bg-primary/10 px-7 py-3 text-sm font-semibold uppercase tracking-widest text-primary">
                        AI-Enabled Across Every Process Layer
                    </div>
                </div>

                {/* ============================================================ */}
                {/* FEATURES LIST */}
                {/* ============================================================ */}
                <div
                    ref={featuresRef}
                    className="space-y-16 md:space-y-20"
                >
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.number}
                            className="feature-card flex flex-col md:flex-row gap-8 md:gap-12 items-start"
                        >
                            {/* Feature Number & Icon */}
                            <div className="flex items-center gap-6 flex-shrink-0">
                                {/* Number */}
                                <div className="feature-number text-5xl md:text-6xl font-black text-primary/30">
                                    {feature.number}
                                </div>

                                {/* Icon */}
                                <div className="feature-icon w-16 h-16 md:w-20 md:h-20 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                                    <feature.icon size={32} strokeWidth={2} />
                                </div>
                            </div>

                            {/* Feature Content */}
                            <div className="feature-content">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ============================================================ */}
                {/* CLOSING CTA */}
                {/* ============================================================ */}
                <div ref={ctaRef} className="mt-28 md:mt-36 text-center">
                    {/* Summary Statement */}
                    <p className="text-2xl md:text-3xl font-bold leading-tight">
                        Material intake → production execution → customer delivery —
                        <br className="hidden sm:block" />
                        Complete visibility and control within one robust platform.
                    </p>

                    {/* Action Buttons */}
                    <div className="cta-buttons mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                            size="lg"
                            radius="none"
                            variant="solid"
                            color="primary"
                            disableRipple
                            className="min-w-[220px] font-semibold text-lg shadow-lg shadow-primary/20"
                        >
                            Get Started
                        </Button>

                        <Button
                            size="lg"
                            radius="none"
                            variant="bordered"
                            disableRipple
                            onPress={() => {
                                setIsVideoOpen(prev => !prev)
                            }}
                            className="
                                min-w-[220px] 
                                font-semibold 
                                text-lg 
                                border-2 
                                border-white/30 
                                text-white 
                                hover:bg-white/10 
                                transition-colors 
                                duration-200
                            "
                        >
                            Watch Video
                        </Button>
                    </div>

                    {/* Helper Text */}
                    <p className="cta-note mt-6 text-sm text-gray-400">
                        Schedule a guided demonstration or request detailed technical documentation.
                    </p>
                </div>
            </div>
        </section>
    );
}