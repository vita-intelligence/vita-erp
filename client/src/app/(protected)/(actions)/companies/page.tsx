'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Pagination, Skeleton } from '@heroui/react';
import { Building2, Plus, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useMyCompanies } from '@/hooks/useCompany';

export default function CompaniesPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const { data, isLoading } = useMyCompanies(page);

    // ========================================================================
    // REFS & ANIMATIONS
    // ========================================================================

    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const cards = cardsRef.current;

        if (!header || !cards) return;

        const tl = gsap.timeline();

        gsap.set([header, cards], {
            opacity: 0,
            y: 20,
        });

        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
        }).to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
        }, '-=0.3');
    }, []);

    // ========================================================================
    // RENDER
    // ========================================================================

    const totalPages = data ? Math.ceil(data.count / 10) : 1; // Assuming 10 per page

    return (
        <div className="space-y-6">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                        My Companies
                    </h1>
                    <p className="text-gray-600">
                        {data ? `${data.count} ${data.count === 1 ? 'company' : 'companies'}` : 'Loading...'}
                    </p>
                </div>

                <Button
                    size="lg"
                    radius="none"
                    className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                    startContent={<Plus size={20} />}
                    onPress={() => router.push('/companies/add')}
                >
                    Add Company
                </Button>
            </div>

            {/* Companies List */}
            <div ref={cardsRef}>
                {isLoading ? (
                    // Loading skeleton
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} radius="none" className="border-2 border-black">
                                <CardBody className="p-6">
                                    <Skeleton className="h-6 w-1/3 mb-3 rounded-none" />
                                    <Skeleton className="h-4 w-2/3 mb-2 rounded-none" />
                                    <Skeleton className="h-4 w-1/4 rounded-none" />
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : data && data.results.length > 0 ? (
                    // Companies grid
                    <div className="space-y-4">
                        {data.results.map((company) => (
                            <Card
                                key={company.id}
                                isPressable
                                radius="none"
                                className="border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                                onPress={() => router.push(`/companies/${company.id}`)}
                            >
                                <CardBody className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                            <Building2 className="text-white" size={24} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-black mb-2">
                                                {company.name}
                                            </h3>

                                            {company.description && (
                                                <div className="flex items-start gap-2 mb-3">
                                                    <FileText className="text-gray-500 flex-shrink-0 mt-0.5" size={16} />
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {company.description}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={16} />
                                                <span>
                                                    Joined {new Date(company.date_created).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="hidden sm:flex items-center">
                                            <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                                                <span className="text-black font-bold">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <div className="bg-white border-2 border-black p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-black mx-auto mb-4 flex items-center justify-center">
                            <Building2 className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                            No companies yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your first company to get started
                        </p>
                        <Button
                            size="lg"
                            radius="none"
                            className="bg-black text-white font-bold border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                            startContent={<Plus size={20} />}
                            onPress={() => router.push('/companies/add')}
                        >
                            Add Company
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {data && data.results.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center pt-8">
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
            </div>
        </div>
    );
}