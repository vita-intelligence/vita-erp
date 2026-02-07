'use client';

import { Input, Button } from '@heroui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import gsap from 'gsap';

// ============================================================================
// TYPES
// ============================================================================

interface FormErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateUsername = (username: string): boolean => {
    // 3-20 characters, alphanumeric and underscore only
    return username.length >= 3 &&
        username.length <= 20 &&
        /^[a-zA-Z0-9_]+$/.test(username);
};

const validatePassword = (password: string): boolean => {
    return password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function RegisterForm() {
    // ========================================================================
    // STATE
    // ========================================================================

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
    // VALIDATION
    // ========================================================================

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!username) {
            newErrors.username = 'Username is required';
        } else if (!validateUsername(username)) {
            newErrors.username = '3-20 characters, letters, numbers, and underscore only';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, and number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({
            email: true,
            username: true,
            password: true,
            confirmPassword: true,
        });

        if (!validateForm()) return;

        setIsLoading(true);

        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Register:', { email, username, password });

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
                    Create Account
                </h1>
                <p className="text-gray-600 text-base">
                    Start using Vita ERM today
                </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

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

                {/* Username */}
                <div className="form-field">
                    <Input
                        type="text"
                        label="Username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => handleFieldBlur('username')}
                        startContent={<User className="text-gray-500" size={20} />}
                        variant="bordered"
                        radius="none"
                        classNames={{
                            label: "text-black font-semibold",
                            input: "text-black",
                            inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                        }}
                        isInvalid={touched.username && !!errors.username}
                        errorMessage={touched.username && errors.username}
                    />
                </div>

                {/* Password */}
                <div className="form-field">
                    <Input
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Create a strong password"
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

                {/* Confirm Password */}
                <div className="form-field">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleFieldBlur('confirmPassword')}
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
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        errorMessage={touched.confirmPassword && errors.confirmPassword}
                    />
                </div>

                {/* Submit Button */}
                <div className="form-action">
                    <Button
                        type="submit"
                        size="lg"
                        radius="none"
                        className="w-full bg-black text-white font-bold text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none mt-2"
                        isLoading={isLoading}
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