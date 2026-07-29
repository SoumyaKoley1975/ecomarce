'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 space-y-20">

                {/* Hero Section */}
                <section className="text-center max-w-3xl mx-auto space-y-6">
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">About Veloura</span>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-[0.1em] uppercase leading-tight">
                        Design Built to Stand the Test of Time
                    </h1>
                    <p className="text-sm text-gray-550 dark:text-gray-400 font-light leading-relaxed max-w-xl mx-auto uppercase tracking-widest text-xs">
                        Established in Copenhagen. Curated for the modern citizen.
                    </p>
                </section>

                {/* Brand story details row */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[4/3] bg-gray-50 border border-gray-150 dark:border-zinc-900 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                            alt="Veloura design space overview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light uppercase tracking-widest leading-snug">
                            Material Integrity & Construct
                        </h2>
                        <p className="text-sm font-light text-gray-500 leading-relaxed font-light">
                            Veloura was founded with a singular conviction: luxury is not about excess, it is about refinement. We look at the contemporary closet with an architectural eye, discarding temporary trends in search of absolute structural elegance.
                        </p>
                        <p className="text-sm font-light text-gray-500 leading-relaxed font-light">
                            Every detail has been parsed—from the reinforcement lines in our stitching, to the weight of our buttons. Every fiber is sourced through fair trade farms utilizing non-depleted soil practices. We build clothing not for a season, but for a lifetime.
                        </p>
                    </div>
                </section>

                {/* Sustainability target perks */}
                <section className="bg-gray-50/50 dark:bg-zinc-950/20 p-10 sm:p-16 border border-gray-105 dark:border-zinc-900">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

                        <div className="space-y-3">
                            <span className="text-3xl font-extralight tracking-widest text-[#B3A078] block">100%</span>
                            <h4 className="text-xs uppercase tracking-widest font-bold">Organic Cotton</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                                Only GOTS-certified long-staple organic cotton. No chemical defoliants, reduced water footprints.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <span className="text-3xl font-extralight tracking-widest text-[#B3A078] block">0 Carbon</span>
                            <h4 className="text-xs uppercase tracking-widest font-bold">Carbon-Neutral Workplaces</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                                Entire transport pipeline offset using Verified Carbon Standard credits. Solar powered mills.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <span className="text-3xl font-extralight tracking-widest text-[#B3A078] block">30yrs</span>
                            <h4 className="text-xs uppercase tracking-widest font-bold">Stitch Longevity</h4>
                            <p className="text-xs text-gray-550 dark:text-gray-400 font-light leading-relaxed max-w-xs mx-auto">
                                Engineered double-seams cuffs tested to withstand 100+ machine cycles with zero warp.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Store locator anchor */}
                <section id="stores" className="space-y-8 pb-10">
                    <div className="text-center">
                        <h3 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">Studio Locations</h3>
                        <h2 className="text-2xl font-light uppercase tracking-widest mt-1">Visit our Boutiques</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="p-6 border border-gray-150 dark:border-zinc-900 bg-white dark:bg-zinc-950/20">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Veloura Copenhagen</h4>
                            <p className="text-xs text-gray-550 dark:text-gray-400 mt-2 font-light leading-relaxed">
                                Nyhavn 10A, Frederiksberg<br />
                                Copenhagen, Denmark
                            </p>
                        </div>

                        <div className="p-6 border border-gray-150 dark:border-zinc-900 bg-white dark:bg-zinc-950/20">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Veloura New York</h4>
                            <p className="text-xs text-gray-505 dark:text-gray-400 mt-2 font-light leading-relaxed">
                                100 Fashion Avenue, Suite 500<br />
                                New York, NY 10001
                            </p>
                        </div>

                        <div className="p-6 border border-gray-150 dark:border-zinc-900 bg-white dark:bg-zinc-950/20">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Veloura Tokyo</h4>
                            <p className="text-xs text-gray-505 dark:text-gray-400 mt-2 font-light leading-relaxed">
                                3 Chome-10-8 Omotesando, Shibuya<br />
                                Tokyo, Japan
                            </p>
                        </div>

                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
