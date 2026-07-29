'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import api from '@/utils/api';
import { Search, Loader } from 'lucide-react';

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState('newest');

    useEffect(() => {
        async function performSearch() {
            setIsLoading(true);
            try {
                const response = await api.get(`/products?search=${encodeURIComponent(query)}&sort=${sortOption}`);
                setProducts(response.data.products || []);
            } catch (err) {
                console.warn('API search failed, mock empty.', err);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        }
        if (query) {
            performSearch();
        } else {
            setProducts([]);
            setIsLoading(false);
        }
    }, [query, sortOption]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Title */}
            <div className="border-b border-gray-100 dark:border-zinc-900 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between">
                <div>
                    <h1 className="text-2xl font-light uppercase tracking-widest text-[#9e9e9e] block mb-1">Search Store</h1>
                    <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                        Results for: &quot;{query}&quot;
                    </h2>
                </div>

                {products.length > 0 && (
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border border-gray-250 dark:border-zinc-800 px-4 py-2 text-xs uppercase tracking-widest font-bold bg-white dark:bg-black mt-6 sm:mt-0 text-black dark:text-white outline-none cursor-pointer"
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="best-selling">Best Seller</option>
                    </select>
                )}
            </div>

            {isLoading ? (
                <div className="h-[40vh] flex flex-col justify-center items-center text-gray-500">
                    <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                    <span className="text-xs uppercase tracking-widest">Searching catalog...</span>
                </div>
            ) : products.length === 0 ? (
                <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                    <Search className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-4 stroke-[1]" />
                    <p className="text-sm text-gray-500 uppercase tracking-widest">No matching results found.</p>
                    <p className="text-xs text-gray-400 mt-2">Check the spelling, try searching generic terms like &apos;coat&apos;, &apos;dress&apos;, or &apos;shirt&apos;, or explore collections.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}

        </main>
    );
}

export default function SearchResultsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                    <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                    <span className="text-xs uppercase tracking-widest">Loading...</span>
                </div>
            }>
                <SearchResultsContent />
            </Suspense>
            <Footer />
        </div>
    );
}
