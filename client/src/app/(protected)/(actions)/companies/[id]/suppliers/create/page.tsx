'use client';

import React, { useEffect, useRef } from 'react';
import { Input, Textarea, Button } from '@heroui/react';
import { Truck, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { useCreateSupplier } from '@/hooks/api/useSuppliers';
import { CreateSupplierFormData, createSupplierSchema } from '@/lib/ValidationSchemas';


export default function CreateSupplierPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const createSupplier = useCreateSupplier(companyId);

    // ── Refs ──────────────────────────────────────────────────────────────────
    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // ── Form ──────────────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<CreateSupplierFormData>({
        resolver: zodResolver(createSupplierSchema),
        mode: 'onSubmit',
    });

    // ── Animation ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const breadcrumb = breadcrumbRef.current;
        const container = containerRef.current;
        const header = headerRef.current;
        const form = formRef.current;
        if (!breadcrumb || !container || !header || !form) return;

        const formElements = form.querySelectorAll('.form-field, .form-action');

        gsap.set(breadcrumb, { opacity: 0, y: -10 });
        gsap.set(container, { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(header.children, { opacity: 0, y: 20 });
        gsap.set(formElements, { opacity: 0, x: -20 });

        gsap.timeline()
            .to(breadcrumb, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(container, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2')
            .to(header.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
            .to(formElements, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
    }, []);

    // ── Submit ────────────────────────────────────────────────────────────────
    const onSubmit = (data: CreateSupplierFormData) => {
        createSupplier.mutate(
            {
                name: data.name,
                description: data.description ?? '',
            },
            {
                onSuccess: (supplier) => {
                    setTimeout(() => {
                        router.push(`/companies/${companyId}/suppliers/${supplier.id}`);
                    }, 300);
                },
            }
        );
    };

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    const breadcrumbItems = [
        { label: 'Suppliers', href: `/companies/${companyId}/suppliers` },
        { label: 'New Supplier' },
    ];

    const inputClass = {
        label: "text-black font-semibold text-sm sm:text-base",
        input: "text-black text-sm sm:text-base",
        inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Breadcrumbs */}
            <div ref={breadcrumbRef} className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Form container */}
            <div
                ref={containerRef}
                className="w-full max-w-2xl mx-auto bg-white border-2 border-black p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
                {/* Header */}
                <div ref={headerRef} className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center flex-shrink-0">
                            <Truck className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-black leading-tight">
                            New Supplier
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Add a supplier to use in purchase orders
                    </p>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                    {/* Name */}
                    <div className="form-field">
                        <Input
                            {...register('name')}
                            label="Supplier Name"
                            placeholder="e.g. Global Foods Ltd"
                            startContent={<Building2 className="text-gray-500 flex-shrink-0" size={18} />}
                            variant="bordered"
                            radius="none"
                            classNames={inputClass}
                            isInvalid={isSubmitted && !!errors.name}
                            errorMessage={errors.name?.message}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-field">
                        <Textarea
                            {...register('description')}
                            label="Description (Optional)"
                            placeholder="Notes about this supplier — products they carry, lead times, etc."
                            variant="bordered"
                            radius="none"
                            minRows={3}
                            classNames={inputClass}
                            isInvalid={isSubmitted && !!errors.description}
                            errorMessage={errors.description?.message}
                        />
                    </div>

                    {/* Actions */}
                    <div className="form-action flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                        <Button
                            type="button"
                            size="lg"
                            radius="none"
                            onPress={() => router.back()}
                            isDisabled={createSupplier.isPending}
                            className="w-full sm:flex-1 bg-white text-black font-bold text-sm sm:text-base border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            radius="none"
                            isLoading={createSupplier.isPending}
                            className="w-full sm:flex-1 bg-black text-white font-bold text-sm sm:text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                            Create Supplier
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}