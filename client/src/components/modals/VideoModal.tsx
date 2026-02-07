"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@heroui/react";

// ============================================================================
// TYPES
// ============================================================================

type VideoModalProps = {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title?: string;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts various YouTube URL formats to embed URL
 * 
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID (passthrough)
 * 
 * @param input - YouTube URL in any supported format
 * @returns Embed URL or null if invalid
 */
function getYouTubeEmbedUrl(input: string): string | null {
    try {
        const url = new URL(input);

        // Already an embed URL - return as-is
        if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
            return input;
        }

        // Short URL format (youtu.be/VIDEO_ID)
        if (url.hostname === "youtu.be") {
            const videoId = url.pathname.replace("/", "");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        // Standard URL format (youtube.com/watch?v=VIDEO_ID)
        if (url.hostname.includes("youtube.com")) {
            const videoId = url.searchParams.get("v");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        return null;
    } catch {
        // Invalid URL format
        return null;
    }
}

/**
 * Converts YouTube embed URL back to watch URL
 * Useful for opening video in new tab
 * 
 * @param embedUrl - YouTube embed URL
 * @returns Watch URL or null if invalid
 */
function getYouTubeWatchUrl(embedUrl: string | null): string | null {
    if (!embedUrl) return null;

    const match = embedUrl.match(/\/embed\/([^?]+)/);
    if (match?.[1]) {
        return `https://www.youtube.com/watch?v=${match[1]}`;
    }

    return null;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * VideoModal - Full-screen YouTube video player modal
 * 
 * Features:
 * - Converts YouTube URLs to embeds automatically
 * - Autoplay on open
 * - Click outside or ESC to close
 * - Prevents body scroll when open
 * - Responsive sizing
 * - Error handling for invalid URLs
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal closes
 * @param url - YouTube URL (any format)
 * @param title - Accessible title for screen readers
 */
export default function VideoModal({
    isOpen,
    onClose,
    url,
    title = "YouTube video"
}: VideoModalProps) {
    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    /**
     * Convert user-provided URL to embed format
     * Memoized to avoid recalculation on every render
     */
    const embedUrl = useMemo(() => getYouTubeEmbedUrl(url), [url]);

    /**
     * Generate watch URL for fallback/external link
     * Memoized to avoid recalculation on every render
     */
    const watchUrl = useMemo(() => getYouTubeWatchUrl(embedUrl), [embedUrl]);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    /**
     * Handle modal side effects when open
     * - Prevent body scroll
     * - Listen for ESC key
     * - Clean up on close
     */
    useEffect(() => {
        if (!isOpen) return;

        // Store original overflow value for restoration
        const previousOverflow = document.body.style.overflow;

        // Prevent background scroll
        document.body.style.overflow = "hidden";

        /**
         * Close modal on ESC key press
         */
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup function
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    // ========================================================================
    // RENDER
    // ========================================================================

    // Don't render anything if modal is closed
    if (!isOpen) return null;

    /**
     * Handle clicks on backdrop (outside video)
     * Only close if clicking the backdrop itself, not children
     */
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={handleBackdropClick}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-5xl">

                {/* Close Button */}
                <Button
                    isIconOnly
                    radius="full"
                    variant="flat"
                    onPress={onClose}
                    aria-label="Close video modal"
                    className="absolute -top-14 right-0 text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                    ✕
                </Button>

                {/* Video Container */}
                <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">

                    {/* 16:9 Aspect Ratio Container */}
                    <div className="relative w-full pt-[56.25%]">

                        {embedUrl ? (
                            // Valid YouTube video - show iframe
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`${embedUrl}?autoplay=1&rel=0`}
                                title={title}
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            // Invalid URL - show error message
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                <div className="space-y-4">
                                    <p className="text-white/80 text-lg">
                                        Invalid YouTube link
                                    </p>
                                    <p className="text-white/50 text-sm">
                                        Please provide a valid YouTube URL
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}