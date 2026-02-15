'use client';

import React from 'react';
import { Skeleton } from '@heroui/react';

export function ItemCardSkeleton() {
    return (
        <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-none flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3 rounded-none" />
                    <Skeleton className="h-3 w-1/4 rounded-none" />
                </div>
            </div>
        </div>
    );
}