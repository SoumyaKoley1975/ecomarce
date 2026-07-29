'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearWishlist } from '@/store/slices/wishlistSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const handleClear = () => {
        dispatch(clearWishlist());
        toast.success('Wishlist cleared successfully');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">

                {/* Header */}
                <div className="border-b border-gray-100 dark:border-zinc-900 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-light uppercase tracking-widest text-gray-400 block mb-1">My Account</h1>
                        <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                            My Favorites Wishlist
                        </h2>
                    </div>

                    {wishlistItems.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="inline-flex items-center space-x-2 text-xs tracking-widest uppercase font-bold text-red-500 border border-red-500/20 px-4 py-2 bg-red-50/5 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors mt-4 sm:mt-0"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Wishlist</span>
                        </button>
                    )}
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <Heart className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-6 stroke-[1]" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white mb-2">No Loved Items Yet</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                            Tap the heart icon on any products to add them directly to your wishlist, so they are saved here for review later.
                        </p>
                        <Link
                            href="/"
                            className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity"
                        >
                            BROWSE CATALOG
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {wishlistItems.map((prod) => (
                            <ProductCard key={prod._id} product={prod as any} />
                        ))}
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
