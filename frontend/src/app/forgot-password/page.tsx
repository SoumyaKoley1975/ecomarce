'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API delivery delay
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
            toast.success('Reset guidelines sent to email address');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="flex-1 flex flex-col justify-center items-center py-20 px-4 bg-gray-50/50 dark:bg-black">

                <div className="max-w-md w-full mx-auto bg-white dark:bg-zinc-950 p-8 sm:p-10 border border-gray-150 dark:border-zinc-900 shadow-sm">

                    <div className="text-center mb-8">
                        <span className="text-[10px] tracking-[0.25em] font-semibold text-gray-400 uppercase font-bold block mb-1">
                            Veloura Recovery
                        </span>
                        <h1 className="text-2xl font-light tracking-wide uppercase text-black dark:text-white">
                            Forgot Password
                        </h1>
                        <p className="text-xs text-gray-500 mt-2 font-light leading-relaxed">
                            {!isSent
                                ? 'Enter your registered email address below, and we will send you guidelines to reset your account password.'
                                : 'Reset link sent! Plase inspect your inbox folder.'}
                        </p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold block mb-1">
                                    Email Address
                                </label>
                                <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black animate-none">
                                    <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full text-xs pl-10 pr-4 py-3 bg-transparent outline-none text-black dark:text-white placeholder-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>EMAILING DIRECTIONS...</span>
                                    </>
                                ) : (
                                    <span>SEND RESET INSTRUCTIONS</span>
                                )}
                            </button>

                        </form>
                    ) : (
                        <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 text-center rounded-[2px] mb-6">
                            <p className="text-xs text-green-700 dark:text-green-300 font-medium uppercase tracking-wide">
                                Instructions dispatched to {email}.
                            </p>
                        </div>
                    )}

                    {/* Links back to login */}
                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-900 mt-8 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Login</span>
                        </Link>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
