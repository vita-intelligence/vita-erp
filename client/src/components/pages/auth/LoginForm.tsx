'use client';

import { Input, Button } from '@heroui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { LoginFormData, loginSchema } from '@/lib/ValidationSchemas';
import { useLogin } from '@/hooks/api/useAuth';

// ============================================================================
// COMPONENT
// ============================================================================

export default function LoginForm() {
    // ========================================================================
    // STATE
    // ========================================================================

    const [showPassword, setShowPassword] = useState(false);

    // ========================================================================
    // HOOKS
    // ========================================================================

    const loginMutation = useLogin();

    // ========================================================================
    // FORM
    // ========================================================================

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
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

        gsap.set(container, {
            opacity: 0,
            y: 30,
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

    const onSubmit = async (data: LoginFormData) => {
        loginMutation.mutate(data);
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
                    Welcome Back
                </h1>
                <p className="text-gray-600 text-base">
                    Please log in to your account to continue
                </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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

                {/* Password */}
                <div className="form-field">
                    <Input
                        {...register('password')}
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter your password"
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

                {/* Forgot Password */}
                <div className="form-action flex justify-end">
                    <button
                        type="button"
                        className="text-sm text-black hover:underline font-medium transition-all"
                        onClick={() => console.log('Forgot password')}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit Button */}
                <div className="form-action">
                    <Button
                        type="submit"
                        size="lg"
                        radius="none"
                        className="w-full bg-black text-white font-bold text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        isLoading={loginMutation.isPending}
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
}