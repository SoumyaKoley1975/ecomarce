'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex-1 space-y-8 font-light text-xs sm:text-sm text-gray-550 dark:text-gray-405 leading-relaxed">

                <div className="text-center pb-6 border-b border-gray-100 dark:border-zinc-900 mb-10">
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">Privacy Desk</span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase mt-1">Privacy Policy</h1>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase">Last Updated: January 2026</p>
                </div>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">1. Information Collection</h2>
                    <p>
                        Veloura Studio respects the privacy of our customers. We collect basic information necessary to fulfill orders, process transactions, and maintain your account details. This includes name, billing and shipping addresses, phone number, email address, password hashes, and checkout settings.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">2. Cookies and Browsing Preferences</h2>
                    <p>
                        We use cookie mechanisms and session storage objects to remember items placed in your shopping bag, track recently viewed clothing items, and optimize site navigation speed. You can opt outward of cookies via your individual browser parameters.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">3. Data Security and Compliance</h2>
                    <p>
                        Payment transactions are processed securely via PCI-DSS compliant providers Stripe and Razorpay. We do not store full credit card credentials or bank numbers locally. Veloura Studio complies with GDPR and CCPA requirements for data erasure and access requests.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">4. Contacting Data Protection Officer</h2>
                    <p>
                        For inquiries relating to account data extraction, updates, or profile removal requests, write to: privacy@veloura.com.
                    </p>
                </section>

            </main>

            <Footer />
        </div>
    );
}
