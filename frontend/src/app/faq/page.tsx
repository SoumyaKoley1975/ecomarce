'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQPage() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const faqs = [
        {
            category: 'Shipping & Delivery',
            question: 'Do you offer international shipping?',
            answer: 'Yes. We offer standard and express worldwide delivery. Free standard delivery is automatically applied to orders over $150. Custom tax and duty charges vary by jurisdiction and are pre-calculated during the checkout process.'
        },
        {
            category: 'Shipping & Delivery',
            question: 'How long will it take to receive my order?',
            answer: 'Standard shipments take 3-6 business days within the United States. International shipments take 5-10 business days. Priority Express deliveries are dispatched within 24 hours of order confirmation.'
        },
        {
            category: 'Returns & Exchanges',
            question: 'What is your return policy?',
            answer: 'We offer complimentary returns within 30 days of shipment receipt. Garments must be unworn, unwashed, and carry original brand tags. Pre-paid shipping labels can be downloaded from your order history panel.'
        },
        {
            category: 'Sizing & Fabrics',
            question: 'How do I choose the correct size?',
            answer: 'Our silhouettes are designed to be slightly relaxed conforming to minimalist Scandinavian fits. Broadly, we recommend choosing your standard true-to-size fit. Detailed dimensions for chest length, shoulder seams, and sleeve draping are provided on each product details page.'
        },
        {
            category: 'Sizing & Fabrics',
            question: 'Where are your fabrics sourced?',
            answer: 'We source organic Supima cotton from pesticide-free cooperative farms in California, biological linen from Normandy, and cruelty-free organic wool from ethical farmers in New Zealand.'
        },
        {
            category: 'Payments & Security',
            question: 'Which payment methods do you support?',
            answer: 'We accept major card payments (Visa, MasterCard, American Express) processed securely via Stripe. We also support regional payments (such as UPI and NetBanking in India) via Razorpay, as well as Cash on Delivery (COD).'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex-1">

                {/* Title */}
                <div className="text-center mb-16">
                    <HelpCircle className="w-12 h-12 text-[#B3A078] mx-auto mb-4 stroke-[1]" />
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">Help Desk</span>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-wide uppercase mt-1">Frequently Asked Questions</h1>
                    <p className="text-xs text-gray-550 dark:text-gray-400 font-light mt-3">
                        Search general guidelines on collections sizing, returns policies, payments security, and ship timelines.
                    </p>
                </div>

                {/* FAQ list */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-150 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-5 text-left text-xs uppercase tracking-wider font-semibold text-black dark:text-white"
                            >
                                <span className="flex items-center space-x-3">
                                    <span className="text-[9px] uppercase tracking-widest text-[#B3A078] border border-[#B3A078]/30 px-2 py-0.5 rounded-[1px]">
                                        {faq.category}
                                    </span>
                                    <span>{faq.question}</span>
                                </span>
                                {openIdx === idx ? <ChevronUp className="w-4 h-4 text-gray-450" /> : <ChevronDown className="w-4 h-4 text-gray-455" />}
                            </button>

                            {openIdx === idx && (
                                <div className="p-5 pt-0 border-t border-gray-50 dark:border-zinc-900">
                                    <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed font-light mt-3">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </main>

            <Footer />
        </div>
    );
}
