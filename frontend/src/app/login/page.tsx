'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { handleApiError } from '@/utils/api';
import { Mail, Key, Loader, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const redirect = searchParams.get('redirect') || '';
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            router.push(redirect ? `/${redirect}` : '/');
        }
    }, [userInfo, redirect, router]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter all credentials.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/users/login', { email, password });
            dispatch(setCredentials(response.data));
            toast.success('Logged in successfully!');
            router.push(redirect ? `/${redirect}` : '/');
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto bg-white dark:bg-zinc-950 p-8 sm:p-10 border border-gray-150 dark:border-zinc-900 shadow-sm">

            {/* Title */}
            <div className="text-center mb-8">
                <span className="text-[10px] tracking-[0.25em] font-semibold text-gray-400 uppercase">Registered Customers</span>
                <h1 className="text-2xl font-light tracking-wide uppercase text-black dark:text-white mt-1">Sign In</h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">

                {/* Email Address */}
                <div>
                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                        Email Address
                    </label>
                    <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                        <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full text-xs pl-10 pr-4 py-3 outline-none bg-transparent text-black dark:text-white placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-[9px] tracking-widest uppercase font-semibold text-gray-400 hover:text-black dark:hover:text-white underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                        <Key className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full text-xs pl-10 pr-4 py-3 outline-none bg-transparent text-black dark:text-white placeholder-gray-300"
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
                            <span>AUTHENTICATING...</span>
                        </>
                    ) : (
                        <>
                            <span>SIGN IN</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

            </form>

            {/* Redirects to Register */}
            <div className="pt-8 border-t border-gray-100 dark:border-zinc-900 mt-8 text-center text-xs">
                <span className="text-gray-405 font-light">New to Veloura Studio?</span>{' '}
                <Link
                    href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
                    className="font-bold hover:underline uppercase tracking-wide text-black dark:text-white"
                >
                    Create Account
                </Link>
            </div>

        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />
            <main className="flex-1 flex flex-col justify-center items-center py-16 px-4 bg-gray-50/50 dark:bg-black">
                <Suspense fallback={
                    <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                        <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                        <span className="text-xs uppercase tracking-widest">Loading...</span>
                    </div>
                }>
                    <LoginFormContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
