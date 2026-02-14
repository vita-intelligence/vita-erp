import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Page Enter Animation - Gates open (shapes fly apart to reveal page)
 * Called automatically when a new page loads via template.tsx
 */
export const animatePageIn = () => {
    const shape1 = document.getElementById("transition-shape-1");
    const shape2 = document.getElementById("transition-shape-2");
    const shape3 = document.getElementById("transition-shape-3");
    const shape4 = document.getElementById("transition-shape-4");

    if (shape1 && shape2 && shape3 && shape4) {
        const tl = gsap.timeline();

        // Set initial state: shapes covering the screen (gates closed)
        tl.set([shape1, shape2, shape3, shape4], {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
        });

        // Animate shapes flying away (gates open)
        tl.to(shape1, {
            x: -window.innerWidth,
            y: -window.innerHeight,
            rotation: -45,
            scale: 0.5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
        })
        .to(shape2, {
            x: window.innerWidth,
            y: -window.innerHeight,
            rotation: 45,
            scale: 0.5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
        }, "-=1.12")
        .to(shape3, {
            x: -window.innerWidth,
            y: window.innerHeight,
            rotation: 45,
            scale: 0.5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
        }, "-=1.12")
        .to(shape4, {
            x: window.innerWidth,
            y: window.innerHeight,
            rotation: -45,
            scale: 0.5,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
        }, "-=1.12");
    }
};

/**
 * Page Exit Animation - Gates close (shapes come together to cover screen)
 * Called when user clicks a TransitionLink before navigation
 * 
 * @param href - URL to navigate to after animation
 * @param router - Next.js router instance
 */
export const animatePageOut = (href: string, router: AppRouterInstance) => {
    const shape1 = document.getElementById("transition-shape-1");
    const shape2 = document.getElementById("transition-shape-2");
    const shape3 = document.getElementById("transition-shape-3");
    const shape4 = document.getElementById("transition-shape-4");

    if (shape1 && shape2 && shape3 && shape4) {
        const tl = gsap.timeline();

        // Set initial state: shapes off-screen (gates open)
        tl.set(shape1, {
            x: -window.innerWidth,
            y: -window.innerHeight,
            rotation: -45,
            scale: 0.5,
            opacity: 0,
        });

        tl.set(shape2, {
            x: window.innerWidth,
            y: -window.innerHeight,
            rotation: 45,
            scale: 0.5,
            opacity: 0,
        });

        tl.set(shape3, {
            x: -window.innerWidth,
            y: window.innerHeight,
            rotation: 45,
            scale: 0.5,
            opacity: 0,
        });

        tl.set(shape4, {
            x: window.innerWidth,
            y: window.innerHeight,
            rotation: -45,
            scale: 0.5,
            opacity: 0,
        });

        // Animate shapes flying together (gates close)
        tl.to(shape1, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut",
        })
        .to(shape2, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut",
        }, "-=1.12")
        .to(shape3, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut",
        }, "-=1.12")
        .to(shape4, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => {
                // Navigate after animation completes
                router.push(href);
            },
        }, "-=1.12");
    }
};