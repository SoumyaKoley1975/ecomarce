'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import api, { handleApiError } from '@/utils/api';
import { SlidersHorizontal, ChevronRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageProps {
    params: Promise<{ category: string }>;
}

export default function CollectionPage({ params }: PageProps) {
    // Resolve params using React.use() to avoid Next.js warnings about dynamic APIs
    const resolvedParams = use(params);
    const category = resolvedParams.category;

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters state
    const [showFilters, setShowFilters] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Title selector based on URL category segment
    const getCollectionTitle = () => {
        switch (category) {
            case 'men': return "Men's Collection";
            case 'women': return "Women's Collection";
            case 'kids': return "Kids' Collection";
            case 'new': return 'New Arrivals';
            case 'best': return 'Best Sellers';
            case 'sale': return 'Special Sale';
            default: return 'Veloura Collections';
        }
    };

    const getBreadcrumbTitle = () => {
        switch (category) {
            case 'men': return 'Men';
            case 'women': return 'Women';
            case 'kids': return 'Kids';
            case 'new': return 'New Arrivals';
            case 'best': return 'Best Sellers';
            case 'sale': return 'Sale';
            default: return 'Collections';
        }
    };

    useEffect(() => {
        async function loadFilteredProducts() {
            setIsLoading(true);
            try {
                let endpoint = `/products?pageSize=12&page=${page}&sort=${selectedSort}`;

                // Map category parameter
                if (category === 'men' || category === 'women' || category === 'kids') {
                    endpoint += `&category=${category}`;
                } else if (category === 'new') {
                    endpoint += `&sort=newest`;
                } else if (category === 'best') {
                    endpoint += `&sort=best-selling`;
                } else if (category === 'sale') {
                    endpoint += `&discount=true`;
                }

                if (selectedBrand) endpoint += `&brand=${encodeURIComponent(selectedBrand)}`;
                if (selectedColor) endpoint += `&color=${encodeURIComponent(selectedColor)}`;
                if (selectedSize) endpoint += `&size=${encodeURIComponent(selectedSize)}`;
                if (minPrice) endpoint += `&minPrice=${minPrice}`;
                if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;

                const response = await api.get(endpoint);
                setProducts(response.data.products || []);
                setTotalPages(response.data.pages || 1);
            } catch (err) {
                console.warn('API lookup failed, seeding mocks.', err);
                // Load fallback mocks depending on categories
                const mockFallback = [
                    {
                        _id: '1',
                        name: 'Minimalist Relaxed Fit Trench Coat',
                        price: 189.00,
                        discountPrice: 159.00,
                        images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop'],
                        category: 'men',
                        sizes: ['S', 'M', 'L'],
                        colors: [{ name: 'Beige', hex: '#C3B091' }],
                        stock: 10,
                        sku: 'VEL-M-TC-001',
                        brand: 'Veloura Core',
                        ratings: 4.8,
                        numReviews: 12
                    },
                    {
                        _id: '2',
                        name: 'Silk Blend Asymmetric Slip Dress',
                        price: 145.00,
                        images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop'],
                        category: 'women',
                        sizes: ['XS', 'S', 'M'],
                        colors: [{ name: 'Champagne', hex: '#F1E9D2' }],
                        stock: 8,
                        sku: 'VEL-W-SD-004',
                        brand: 'Veloura Evening',
                        ratings: 4.9,
                        numReviews: 18
                    }
                ];
                // Filter mockFallback by category simply
                if (category === 'men') {
                    setProducts(mockFallback.filter(p => p.category === 'men'));
                } else if (category === 'women') {
                    setProducts(mockFallback.filter(p => p.category === 'women'));
                } else {
                    setProducts(mockFallback);
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadFilteredProducts();
    }, [category, page, selectedBrand, selectedColor, selectedSize, minPrice, maxPrice, selectedSort]);

    const handleResetFilters = () => {
        setSelectedBrand('');
        setSelectedColor('');
        setSelectedSize('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedSort('newest');
        setPage(1);
        toast.success('Filters cleared');
    };

    const brands = ['Veloura Core', 'Veloura Basics', 'Veloura Denim', 'Veloura Evening', 'Veloura Knits'];
    const colors = [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Beige', hex: '#C3B091' },
        { name: 'Gray', hex: '#708090' },
        { name: 'Navy', hex: '#1E3F66' }
    ];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black">

                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-[10px] tracking-widest uppercase text-gray-400 mb-8 font-medium">
                    <a href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</a>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <span>Collections</span>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <span className="text-black dark:text-white">{getBreadcrumbTitle()}</span>
                </nav>

                {/* Page Title & Count Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-gray-100 dark:border-zinc-900 mb-10">
                    <div>
                        <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-black dark:text-white">
                            {getCollectionTitle()}
                        </h1>
                        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase">
                            {products.length} Products Found in Catalog
                        </p>
                    </div>

                    {/* Filtering Actions */}
                    <div className="flex items-center space-x-4 mt-6 md:mt-0">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 border border-gray-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-black dark:text-white"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-black dark:text-white" />
                            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>

                        <select
                            value={selectedSort}
                            onChange={(e) => {
                                setSelectedSort(e.target.value);
                                setPage(1);
                            }}
                            className="border border-gray-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold tracking-widest uppercase bg-white dark:bg-black outline-none cursor-pointer text-black dark:text-white"
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="best-selling">Best Selling</option>
                            <option value="highest-rated">Highest Rated</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Filters Sidebar Drawer (Desktop & Mobile toggled) */}
                    {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                        <div className={`space-y-8 lg:block ${showFilters ? 'block' : 'hidden'}`}>

                            {/* Brand Filter */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3.5">Brand</h4>
                                <div className="space-y-2">
                                    {brands.map((b) => (
                                        <label key={b} className="flex items-center space-x-2 text-xs tracking-wider text-gray-650 dark:text-gray-400 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrand === b}
                                                onChange={() => {
                                                    setSelectedBrand(selectedBrand === b ? '' : b);
                                                    setPage(1);
                                                }}
                                                className="rounded border-gray-300 accent-black dark:accent-white focus:ring-0 w-4 h-4"
                                            />
                                            <span>{b}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Color Filter */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3.5">Color</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {colors.map((c) => (
                                        <button
                                            key={c.name}
                                            onClick={() => {
                                                setSelectedColor(selectedColor === c.name ? '' : c.name);
                                                setPage(1);
                                            }}
                                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${selectedColor === c.name
                                                    ? 'border-black dark:border-white scale-120'
                                                    : 'border-transparent'
                                                }`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        >
                                            {selectedColor === c.name && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3.5">Size</h4>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setSelectedSize(selectedSize === s ? '' : s);
                                                setPage(1);
                                            }}
                                            className={`min-w-[40px] px-2 py-1.5 border text-center text-xs uppercase tracking-wide transition-colors ${selectedSize === s
                                                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold'
                                                    : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-black dark:hover:border-white'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3.5">Price Range</h4>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min ($)"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-black dark:text-white outline-none"
                                    />
                                    <span className="text-gray-300">-</span>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max ($)"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-black dark:text-white outline-none"
                                    />
                                </div>
                            </div>

                            {/* Clear button */}
                            <button
                                onClick={handleResetFilters}
                                className="w-full text-center border border-gray-200 dark:border-zinc-850 hover:bg-neutral-50 dark:hover:bg-zinc-900 py-3 text-xs font-bold tracking-widest uppercase transition-colors text-black dark:text-white"
                            >
                                Clear All Filters
                            </button>

                        </div>
                    )}

                    {/* Products Catalog Grid */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="h-[40vh] flex flex-col justify-center items-center text-gray-400">
                                <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                                <span className="text-xs uppercase tracking-widest">Loading catalog...</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="h-[40vh] flex flex-col justify-center items-center text-center p-8 bg-gray-50 dark:bg-zinc-950/20 border border-dotted border-gray-250 dark:border-zinc-850">
                                <p className="text-sm text-gray-500 uppercase tracking-widest">No products match your active filters.</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-6 bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:opacity-90"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                    {products.map((prod) => (
                                        <ProductCard key={prod._id} product={prod} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center space-x-3 mt-16 pt-8 border-t border-gray-100 dark:border-zinc-900">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                            className="px-4 py-2 border border-gray-200 dark:border-zinc-800 disabled:opacity-40 text-xs font-bold tracking-widest uppercase hover:bg-gray-55 dark:hover:bg-zinc-900 text-black dark:text-white"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white px-2">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                            className="px-4 py-2 border border-gray-200 dark:border-zinc-800 disabled:opacity-40 text-xs font-bold tracking-widest uppercase hover:bg-gray-55 dark:hover:bg-zinc-900 text-black dark:text-white"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}
