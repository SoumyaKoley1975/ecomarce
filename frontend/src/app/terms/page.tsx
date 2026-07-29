'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex-1 space-y-8 font-light text-xs sm:text-sm text-gray-550 dark:text-gray-405 leading-relaxed">

                <div className="text-center pb-6 border-b border-gray-100 dark:border-zinc-900 mb-10">
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">Client Desk</span>
                    <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase mt-1">Terms & Conditions</h1>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase">Last Updated: January 2026</p>
                </div>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">1. Store Transactions</h2>
                    <p>
                        By purchasing garments on Veloura Studio, you agree to pay the prices quoted at checkout, including applicable flat sales taxes and calculated shipping fees. We reserve the right to cancel orders arising from erroneous inventory levels, verification failures, or coupon exploitation.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">2. Shipping and Customs</h2>
                    <p>
                        Estimated delivery dates are based on standard carrier schedules and are not strictly guaranteed. Customers are responsible for any destination customs assessments, import duties, or local entry taxations.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">3. Returns and Refunds</h2>
                    <p>
                        All return requests must be logged online within 30 days of receiving the item. Products must sit in pristine condition with brand labels intact. Refunds will be issued back to your original payment method.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">4. Coupon and Discount vouchers</h2>
                    <p>
                        Voucher discounts apply to eligible products and have expiration dates. Coupons cannot be stacked or exchanged for cash unless specifically authorized by our team.
                    </p>
                </section>

            </main>

            <Footer />
        </div>
    );
}
