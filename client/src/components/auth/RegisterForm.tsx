'use client';

import { Input, Button } from '@heroui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { RegisterFormData, registerSchema } from '@/lib/ValidationSchemas';

// ============================================================================
// COMPONENT
// ============================================================================

export default function RegisterForm() {
    // ========================================================================
    // STATE
    // ========================================================================

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ========================================================================
    // FORM
    // ========================================================================

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur', // Validate on blur
    });

    // ========================================================================
    // REFS
    // ========================================================================

    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // ========================================================================
    // ANIMATIONS
    // ========================================================================

    useEffect(() => {
        const container = containerRef.current;
        const header = headerRef.current;
        const form = formRef.current;

        if (!container || !header || !form) return;

        const tl = gsap.timeline();

        // Set initial states
        gsap.set(container, {
            opacity: 0,
            y: 30,
            scale: 0.95,
        });

        gsap.set(header.children, {
            opacity: 0,
            y: 20,
        });

        const formElements = form.querySelectorAll('.form-field, .form-action, .form-terms');
        gsap.set(formElements, {
            opacity: 0,
            x: -20,
        });

        // Animate in
        tl.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
        })
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

    const onSubmit = async (data: RegisterFormData) => {
        console.log('Register data:', data);

        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // TODO: Navigate to dashboard or show error
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div
            ref={containerRef}
            className="w-full max-w-md bg-white border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
            {/* Header */}
            <div ref={headerRef} className="mb-8">
                <h1 className="text-4xl font-bold text-black mb-2">
                    Create Account
                </h1>
                <p className="text-gray-600 text-base">
                    Start using Vita ERM today
                </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Email */}
                <div className="form-field">
                    <Input
                        {...register('email')}
                        type="email"
                        label="Email Address"
                        placeholder="you@company.com"
                        startContent={<Mail className="text-gray-500" size={20} />}
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touchedFields.email && !!errors.email}
                        errorMessage={errors.email?.message}
                    />
                </div>

                {/* Username */}
                <div className="form-field">
                    <Input
                        {...register('username')}
                        type="text"
                        label="Username"
                        placeholder="johndoe"
                        startContent={<User className="text-gray-500" size={20} />}
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touchedFields.username && !!errors.username}
                        errorMessage={errors.username?.message}
                    />
                </div>

                {/* Password */}
                <div className="form-field">
                    <Input
                        {...register('password')}
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Create a strong password"
                        startContent={<Lock className="text-gray-500" size={20} />}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="text-gray-500 hover:text-black transition-colors" size={20} />
                                ) : (
                                    <Eye className="text-gray-500 hover:text-black transition-colors" size={20} />
                                )}
                            </button>
                        }
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touchedFields.password && !!errors.password}
                        errorMessage={errors.password?.message}
                    />
                </div>

                {/* Confirm Password */}
                <div className="form-field">
                    <Input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        startContent={<Lock className="text-gray-500" size={20} />}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="focus:outline-none"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="text-gray-500 hover:text-black transition-colors" size={20} />
                                ) : (
                                    <Eye className="text-gray-500 hover:text-black transition-colors" size={20} />
                                )}
                            </button>
                        }
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touchedFields.confirmPassword && !!errors.confirmPassword}
                        errorMessage={errors.confirmPassword?.message}
                    />
                </div>

                {/* Submit Button */}
                <div className="form-action">
                    <Button
                        type="submit"
                        size="lg"
                        radius="none"
                        className="w-full bg-black text-white font-bold text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none mt-2"
                        isLoading={isSubmitting}
                    >
                        Create Account
                    </Button>
                </div>
            </form>

            {/* Terms */}
            <p className="form-terms mt-6 text-xs text-gray-600 text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-black font-semibold hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-black font-semibold hover:underline">Privacy Policy</a>
            </p>
        </div>
    );
}