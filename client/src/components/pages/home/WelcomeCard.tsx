"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import { FullScreenLoader3D } from "@/components/ui/loaders/FullScreenLoader3D";
import { Card, Avatar } from "@heroui/react";
import { User as UserIcon } from "lucide-react";
import gsap from "gsap";

export default function WelcomeCard() {
    const { data: user, isLoading } = useCurrentUser();

    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const view = useMemo(() => {
        const isGuest = !user;
        const displayName = user?.username ?? "Guest";

        // replace with real avatar field when available
        const avatarSrc: string | undefined = (user as any)?.avatarUrl;

        return { isGuest, displayName, avatarSrc };
    }, [user]);

    useLayoutEffect(() => {
        if (isLoading || !cardRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cardRef.current,
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );

            gsap.fromTo(
                contentRef.current,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.15 }
            );
        });

        return () => ctx.revert();
    }, [isLoading]);

    if (isLoading) {
        return <FullScreenLoader3D label="Loading your space" />;
    }

    return (
        <section className="w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
            <Card
                ref={cardRef}
                shadow="sm"
                className="p-6 md:p-8 rounded-2xl shadow-lg
                   bg-white/70 dark:bg-gray-950/60 backdrop-blur-md
                   border border-gray-200/60 dark:border-gray-800/50"
            >
                <div ref={contentRef} className="flex items-center gap-4 md:gap-5">
                    <Avatar
                        src={view.avatarSrc}
                        name={view.displayName}
                        size="lg"
                        color={view.isGuest ? "default" : "primary"}
                        isBordered
                        classNames={{
                            base: "w-16 h-16 md:w-20 md:h-20",
                            img: "object-cover",
                        }}
                        fallback={
                            <UserIcon
                                size={42}
                                className="text-black dark:text-black"
                            />
                        }
                    />

                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                            Welcome{view.isGuest ? "" : ","} {view.displayName}
                        </h1>

                        <p className="mt-1 text-lg md:text-xl text-gray-600 dark:text-gray-400">
                            What are you up to today?
                        </p>
                    </div>
                </div>
            </Card>
        </section>
    );
}