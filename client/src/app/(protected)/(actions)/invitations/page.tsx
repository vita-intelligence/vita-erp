'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pagination, Skeleton } from '@heroui/react';
import { Inbox } from 'lucide-react';
import gsap from 'gsap';
import { useReceivedInvites } from '@/hooks/api/useInvite';
import { InviteCard } from '@/components/pages/invitations/InviteCard';

export default function InvitationsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useReceivedInvites(page);

    const headerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const list = listRef.current;
        if (!header || !list) return;

        gsap.set([header, list], { opacity: 0, y: 20 });

        gsap.timeline()
            .to(header, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
            .to(list, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    }, []);

    const totalPages = data ? Math.ceil(data.count / 10) : 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                        Invitations
                    </h1>
                    {isLoading ? (
                        <Skeleton className="h-5 w-32 rounded-none" />
                    ) : (
                        <p className="text-gray-600">
                            {data?.count ?? 0} pending {data?.count === 1 ? 'invitation' : 'invitations'}
                        </p>
                    )}
                </div>
            </div>

            {/* List */}
            <div ref={listRef} className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border-2 border-black p-6">
                            <div className="flex items-start gap-4">
                                <Skeleton className="w-12 h-12 rounded-none flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/3 rounded-none" />
                                    <Skeleton className="h-4 w-1/2 rounded-none" />
                                    <Skeleton className="h-4 w-1/4 rounded-none" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : data && data.results.length > 0 ? (
                    <>
                        {data.results.map((invite) => (
                            <InviteCard key={invite.id} invite={invite} />
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center pt-4">
                                <Pagination
                                    total={totalPages}
                                    page={page}
                                    onChange={setPage}
                                    radius="none"
                                    showControls
                                    classNames={{
                                        cursor: "bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                                        item: "border-2 border-black bg-white hover:bg-gray-100",
                                    }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    // Empty state
                    <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                            <Inbox className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">No invitations</h3>
                        <p className="text-gray-600">You don't have any pending invitations</p>
                    </div>
                )}
            </div>
        </div>
    );
}