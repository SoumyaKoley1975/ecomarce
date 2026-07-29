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
import { User, Mail, Key, Loader, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const redirect = searchParams.get('redirect') || '';
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userInfo) {
            router.push(redirect ? `/${redirect}` : '/');
        }
    }, [userInfo, redirect, router]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill out all credentials.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/users/register', { name, email, password });
            dispatch(setCredentials(response.data));
            toast.success('Account created successfully!');
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
                <span className="text-[10px] tracking-[0.25em] font-semibold text-gray-400 uppercase">Create Account</span>
                <h1 className="text-2xl font-light tracking-wide uppercase text-black dark:text-white mt-1">Register</h1>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">

                {/* Full Name */}
                <div>
                    <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold block mb-1">
                        Display Name
                    </label>
                    <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                        <User className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Username"
                            className="w-full text-xs pl-10 pr-4 py-3 bg-transparent outline-none text-black dark:text-white placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold block mb-1">
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
                            className="w-full text-xs pl-10 pr-4 py-3 bg-transparent outline-none text-black dark:text-white placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="text-[10px] tracking-wider uppercase text-gray-555 font-bold block mb-1">
                        Password (Min 6 chars)
                    </label>
                    <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                        <Key className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full text-xs pl-10 pr-4 py-3 bg-transparent outline-none text-black dark:text-white placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold block mb-1">
                        Confirm Password
                    </label>
                    <div className="relative flex items-center border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                        <Key className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
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
                            <span>CREATING ACCOUNT...</span>
                        </>
                    ) : (
                        <>
                            <span>CREATE ACCOUNT</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

            </form>

            {/* Redirects to Login */}
            <div className="pt-8 border-t border-gray-105 dark:border-zinc-900 mt-8 text-center text-xs">
                <span className="text-gray-405 font-light">Already have an account?</span>{' '}
                <Link
                    href={`/login${redirect ? `?redirect=${redirect}` : ''}`}
                    className="font-bold hover:underline uppercase tracking-wide text-black dark:text-white"
                >
                    Sign In
                </Link>
            </div>

        </div>
    );
}

export default function RegisterPage() {
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
                    <RegisterFormContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
