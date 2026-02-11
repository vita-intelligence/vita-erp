'use client';

import { Input, Textarea, Button } from '@heroui/react';
import React, { useEffect, useRef } from 'react';
import { Building2, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { useCreateCompany } from '@/hooks/useCompany';
import { useRouter } from 'next/navigation';
import { CompanyFormData, companySchema } from '@/lib/ValidationSchemas';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';


export default function AddCompanyPage() {
    // ========================================================================
    // STATE & HOOKS
    // ========================================================================

    const createCompany = useCreateCompany();
    const router = useRouter();

    // ========================================================================
    // FORM
    // ========================================================================

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        mode: 'onBlur',
    });

    // ========================================================================
    // REFS
    // ========================================================================

    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // ========================================================================
    // ANIMATIONS
    // ========================================================================

    useEffect(() => {
        const breadcrumb = breadcrumbRef.current;
        const container = containerRef.current;
        const header = headerRef.current;
        const form = formRef.current;

        if (!breadcrumb || !container || !header || !form) return;

        const tl = gsap.timeline();

        // Initial state
        gsap.set(breadcrumb, {
            opacity: 0,
            y: -10,
        });

        gsap.set(container, {
            opacity: 0,
            y: 40,
            scale: 0.95,
        });

        gsap.set(header.children, {
            opacity: 0,
            y: 20,
        });

        const formElements = form.querySelectorAll('.form-field, .form-action');
        gsap.set(formElements, {
            opacity: 0,
            x: -20,
        });

        // Animation sequence
        tl.to(breadcrumb, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
        })
            .to(container, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out',
            }, '-=0.2')
            .to(header.children, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out',
            }, '-=0.3')
            .to(formElements, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out',
            }, '-=0.3');
    }, []);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const onSubmit = async (data: CompanyFormData) => {
        createCompany.mutate(data, {
            onSuccess: (newCompany) => {
                setTimeout(() => {
                    router.push('/companies');
                }, 500);
            },
        });
    };

    // ========================================================================
    // BREADCRUMB CONFIG
    // ========================================================================

    const breadcrumbItems = [
        {
            label: 'Companies',
            href: '/companies',
            icon: <Building2 size={14} />,
        },
        {
            label: 'Add Company',
        },
    ];

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <>
            {/* Breadcrumbs */}
            <div ref={breadcrumbRef} className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Form Container */}
            <div
                ref={containerRef}
                className="w-full max-w-2xl mx-auto bg-white border-2 border-black p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
                {/* Header */}
                <div ref={headerRef} className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center flex-shrink-0">
                            <Building2 className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-black leading-tight">
                            Create Company
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Start building your organization in Vita ERM
                    </p>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                    {/* Company Name */}
                    <div className="form-field">
                        <Input
                            {...register('name')}
                            type="text"
                            label="Company Name"
                            placeholder="Acme Corporation"
                            startContent={<Building2 className="text-gray-500" size={18} />}
                            variant="bordered"
                            radius="none"
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={touchedFields.name && !!errors.name}
                            errorMessage={errors.name?.message}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-field">
                        <Textarea
                            {...register('description')}
                            label="Description (Optional)"
                            placeholder="Tell us about your company..."
                            variant="bordered"
                            radius="none"
                            minRows={4}
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={touchedFields.description && !!errors.description}
                            errorMessage={errors.description?.message}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="form-field bg-gray-50 border-2 border-black p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <FileText className="text-black mt-0.5 flex-shrink-0" size={18} />
                            <div>
                                <h3 className="font-bold text-black mb-1 text-sm sm:text-base">What happens next?</h3>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                                    <li>• You'll be assigned as the Owner</li>
                                    <li>• Full access to manage the company</li>
                                    <li>• Invite team members anytime</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-action flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                        <Button
                            type="button"
                            size="lg"
                            radius="none"
                            className="w-full sm:flex-1 bg-white text-black font-bold text-sm sm:text-base border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                            onPress={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            radius="none"
                            className="w-full sm:flex-1 bg-black text-white font-bold text-sm sm:text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                            isLoading={createCompany.isPending}
                        >
                            Create Company
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}