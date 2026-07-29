'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Globe, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            toast.success('Thank you for subscribing to Veloura updates.');
            setEmail('');
        }
    };

    const footerLinks = {
        collections: [
            { name: 'Men Wear', href: '/collections/men' },
            { name: 'Women Wear', href: '/collections/women' },
            { name: 'Kids Wear', href: '/collections/kids' },
            { name: 'New Arrivals', href: '/collections/new' },
            { name: 'Best Sellers', href: '/collections/best' },
            { name: 'Sale Catalog', href: '/collections/sale' }
        ],
        support: [
            { name: 'Contact Us', href: '/contact' },
            { name: 'About Us', href: '/about' },
            { name: 'Help & FAQs', href: '/faq' },
            { name: 'Shipping & Returns', href: '/faq#shipping' },
            { name: 'Store Locator', href: '/about#stores' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms & Conditions', href: '/terms' },
            { name: 'Payment Security', href: '/terms#security' },
            { name: 'Cookie Settings', href: '#' }
        ]
    };

    return (
        <footer className="bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-zinc-900 pt-16 pb-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-gray-100 dark:border-zinc-900">

                    {/* Brand Story */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-[0.25em] uppercase">VELOURA</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-sm">
                            Crafting premium essentials with a focus on modern minimalism, luxury fabrics, and sustainable manufacturing practices. Inspired by Scandinavian clarity and Japanese longevity.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="hover:opacity-75 transition-opacity text-gray-400 hover:text-black dark:hover:text-white" aria-label="Instagram">
                                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="hover:opacity-75 transition-opacity text-gray-400 hover:text-black dark:hover:text-white" aria-label="Facebook">
                                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="hover:opacity-75 transition-opacity text-gray-400 hover:text-black dark:hover:text-white" aria-label="Twitter">
                                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter subscription */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-xs uppercase tracking-widest font-semibold">Join the Newsletter</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light max-w-md">
                            Receive updates on seasonal collections, private sales, and cultural curations from our editorial team.
                        </p>
                        <form onSubmit={handleSubscribe} className="max-w-md flex border-b border-black dark:border-white pb-1 pt-2 items-center">
                            <Mail className="w-4 h-4 text-gray-450 mr-3 flex-shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="YOUR EMAIL ROUTE"
                                required
                                className="w-full text-xs font-light tracking-widest uppercase bg-transparent outline-none border-none placeholder-gray-400"
                            />
                            <button type="submit" className="p-1 hover:opacity-70 text-black dark:text-white transition-opacity" aria-label="Submit newsletter subscription">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Middle section: Links columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
                    <div>
                        <h5 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-450 dark:text-gray-400 mb-5">Collections</h5>
                        <ul className="space-y-3">
                            {footerLinks.collections.map((lnk) => (
                                <li key={lnk.name}>
                                    <Link href={lnk.href} className="text-xs font-light text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                        {lnk.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-450 dark:text-gray-400 mb-5">Support</h5>
                        <ul className="space-y-3">
                            {footerLinks.support.map((lnk) => (
                                <li key={lnk.name}>
                                    <Link href={lnk.href} className="text-xs font-light text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                        {lnk.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-450 dark:text-gray-400 mb-5">Legal & Policy</h5>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((lnk) => (
                                <li key={lnk.name}>
                                    <Link href={lnk.href} className="text-xs font-light text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                        {lnk.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h5 className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-450 dark:text-gray-400 mb-5">Veloura Studio</h5>
                        <p className="text-xs text-gray-550 dark:text-gray-400 font-light leading-relaxed">
                            100 Fashion Avenue, Suite 500<br />
                            New York, NY 10001<br />
                            <span className="font-medium mt-2 block">studio@veloura.com</span>
                            <span className="font-medium block">+1 (800) VEL-OURA</span>
                        </p>
                    </div>
                </div>

                {/* Bottom section: Legal details + language */}
                <div className="pt-8 border-t border-gray-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                    <div className="flex items-center space-x-6 text-[10px] tracking-wider text-gray-450 font-light uppercase">
                        <span>© {new Date().getFullYear()} VELOURA. ALL RIGHTS RESERVED.</span>
                        <span className="hidden sm:inline">|</span>
                        <span className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            English (US) / USD ($)
                        </span>
                    </div>

                    {/* Payment Gateways Mocks */}
                    <div className="flex items-center space-x-4 opacity-50 dark:opacity-75">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Secured payments via</span>
                        <div className="flex space-x-2 text-gray-600 dark:text-zinc-400">
                            <span title="Stripe card payment">
                                <CreditCard className="w-5 h-5" />
                            </span>
                            <span className="text-xs font-bold leading-none tracking-widest uppercase border border-gray-400 px-1.5 py-0.5 rounded-[2px]" title="Razorpay integrations">
                                RP
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </footer>
    );
}
