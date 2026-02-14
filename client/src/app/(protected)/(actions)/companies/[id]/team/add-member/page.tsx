'use client';

import { Input, Textarea, Button, Select, SelectItem } from '@heroui/react';
import React, { useEffect, useRef } from 'react';
import { UserPlus, Mail, Shield, MessageSquare } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import { useCreateInvite } from '@/hooks/api/useInvite';
import { useCompanyRoles } from '@/hooks/api/useAccess';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { InviteFormData, inviteSchema } from '@/lib/ValidationSchemas';

export default function AddMemberPage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const createInvite = useCreateInvite(companyId);
    const { data: roles, isLoading: rolesLoading } = useCompanyRoles(companyId);

    // ========================================================================
    // FORM
    // ========================================================================

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, touchedFields },
    } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
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

        gsap.set(breadcrumb, { opacity: 0, y: -10 });
        gsap.set(container, { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(header.children, { opacity: 0, y: 20 });

        const formElements = form.querySelectorAll('.form-field, .form-action');
        gsap.set(formElements, { opacity: 0, x: -20 });

        tl.to(breadcrumb, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(container, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2')
            .to(header.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
            .to(formElements, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
    }, []);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const onSubmit = async (data: InviteFormData) => {
        createInvite.mutate(
            {
                invitee_email: data.invitee_email,
                role: Number(data.role),
                message: data.message,
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        router.push(`/companies/${companyId}/team`);
                    }, 500);
                },
            }
        );
    };

    // ========================================================================
    // BREADCRUMB CONFIG
    // ========================================================================

    const breadcrumbItems = [
        { label: 'Team', href: `/companies/${companyId}/team` },
        { label: 'Invite Member' },
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
                            <UserPlus className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-black leading-tight">
                            Invite Member
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Send an invitation to join your team
                    </p>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                    {/* Email */}
                    <div className="form-field">
                        <Input
                            {...register('invitee_email')}
                            type="email"
                            label="Email Address"
                            placeholder="user@example.com"
                            startContent={<Mail className="text-gray-500" size={18} />}
                            variant="bordered"
                            radius="none"
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={touchedFields.invitee_email && !!errors.invitee_email}
                            errorMessage={errors.invitee_email?.message}
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="form-field">
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Role"
                                    placeholder="Select a role"
                                    variant="bordered"
                                    radius="none"
                                    startContent={<Shield className="text-gray-500" size={18} />}
                                    isLoading={rolesLoading}
                                    classNames={{
                                        label: "text-black font-semibold text-sm sm:text-base",
                                        value: "text-black text-sm sm:text-base",
                                        trigger: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                                    }}
                                    isInvalid={touchedFields.role && !!errors.role}
                                    errorMessage={errors.role?.message}
                                >
                                    {(roles ?? []).map((role) => (
                                        <SelectItem key={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>

                    {/* Optional Message */}
                    <div className="form-field">
                        <Textarea
                            {...register('message')}
                            label="Message (Optional)"
                            placeholder="Add a personal message to your invitation..."
                            variant="bordered"
                            radius="none"
                            minRows={4}
                            startContent={<MessageSquare className="text-gray-500" size={18} />}
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={touchedFields.message && !!errors.message}
                            errorMessage={errors.message?.message}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="form-field bg-gray-50 border-2 border-black p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <Mail className="text-black mt-0.5 flex-shrink-0" size={18} />
                            <div>
                                <h3 className="font-bold text-black mb-1 text-sm sm:text-base">
                                    What happens next?
                                </h3>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                                    <li>• Invitation will be sent via email</li>
                                    <li>• Expires in 7 days if not accepted</li>
                                    <li>• User will join with selected role</li>
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
                            isLoading={createInvite.isPending}
                        >
                            Send Invitation
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}