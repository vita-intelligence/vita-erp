'use client';

import { Input, Button } from '@heroui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import gsap from 'gsap';

// ============================================================================
// TYPES
// ============================================================================

interface FormErrors {
    email?: string;
    password?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function LoginForm() {
    // ========================================================================
    // STATE
    // ========================================================================

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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

        const formElements = form.querySelectorAll('.form-field, .form-action');
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
    // VALIDATION
    // ========================================================================

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({ email: true, password: true });

        if (!validateForm()) return;

        setIsLoading(true);

        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Login:', { email, password });

        setIsLoading(false);
    };

    const handleFieldBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <div className="form-field">
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleFieldBlur('email')}
                        startContent={<Mail className="text-gray-500" size={20} />}
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touched.email && !!errors.email}
                        errorMessage={touched.email && errors.email}
                    />
                </div>

                {/* Password */}
                <div className="form-field">
                    <Input
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleFieldBlur('password')}
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
                        isInvalid={touched.password && !!errors.password}
                        errorMessage={touched.password && errors.password}
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
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
}