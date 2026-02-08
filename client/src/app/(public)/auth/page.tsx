'use client';

import LoginForm from '@/components/pages/auth/LoginForm';
import RegisterForm from '@/components/pages/auth/RegisterForm';
import React, { useState } from 'react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Toggle Switch */}
            <div className="mb-8 flex items-center gap-4 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`px-8 py-3 font-bold text-sm transition-all ${isLogin
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    LOGIN
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`px-8 py-3 font-bold text-sm transition-all ${!isLogin
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    REGISTER
                </button>
            </div>

            {/* Form */}
            {isLogin ? <LoginForm /> : <RegisterForm />}
        </main>
    );
}