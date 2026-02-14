'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BrutalistBreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function BrutalistBreadcrumbs({ items, className = '' }: BrutalistBreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={`inline-flex items-center bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}
        >
            <ol className="flex items-center gap-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {item.href && !isLast ? (
                                // Clickable breadcrumb
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 text-sm font-semibold text-black hover:underline transition-all group"
                                >
                                    {item.icon && (
                                        <span className="group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span>{item.label}</span>
                                </Link>
                            ) : (
                                // Current page (not clickable)
                                <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                    {item.icon && <span>{item.icon}</span>}
                                    <span>{item.label}</span>
                                </span>
                            )}

                            {/* Separator */}
                            {!isLast && (
                                <ChevronRight size={16} className="text-black flex-shrink-0" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}