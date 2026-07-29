'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import api from '@/utils/api';
import { ArrowRight, Star, ArrowUpRight, Shield, RefreshCcw, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock catalog for instant static fallback if server is offline
const MOCK_PRODUCTS = [
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
    numReviews: 12,
    newArrival: true,
    bestSeller: true
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
    numReviews: 18,
    newArrival: true,
    bestSeller: true
  },
  {
    _id: '3',
    name: 'Heavyweight Supima Cotton Tee',
    price: 39.00,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'],
    category: 'men',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Pure White', hex: '#FFFFFF' }],
    stock: 20,
    sku: 'VEL-M-TEE-002',
    brand: 'Veloura Basics',
    ratings: 4.7,
    numReviews: 24,
    bestSeller: true
  },
  {
    _id: '4',
    name: 'Oversized Wool Blend Knit Sweater',
    price: 98.00,
    discountPrice: 79.00,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'],
    category: 'women',
    sizes: ['S', 'M'],
    colors: [{ name: 'Cream', hex: '#FFFFF0' }],
    stock: 12,
    sku: 'VEL-W-KS-005',
    brand: 'Veloura Knits',
    ratings: 4.5,
    numReviews: 14,
    newArrival: true
  }
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'new' | 'best' | 'sale'>('new');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products/featured');
        const { featured, bestSellers, newArrivals } = response.data;

        let targetProducts = [];
        if (activeTab === 'new') targetProducts = newArrivals || [];
        else if (activeTab === 'best') targetProducts = bestSellers || [];
        else targetProducts = featured || [];

        if (targetProducts.length > 0) {
          setProducts(targetProducts);
        } else {
          // fallback
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.warn('API error, using mock data:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [activeTab]);

  const instagramImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop'
  ];

  const testimonials = [
    {
      name: 'Eleanor Vance',
      role: 'Creative Director',
      comment: 'VELOURA has completely changed my wardrobe strategy. The quality of the trench coat rivaled items I own that cost three times as much. Absolute minimalist perfection.',
      rating: 5
    },
    {
      name: 'Marcus Thorne',
      role: 'Architect',
      comment: 'Their Supima Tees are the only shirts I wear now. Perfect weights, structural neck linings that do not warp after a wash, and subtle earth colors.',
      rating: 5
    },
    {
      name: 'Serena Patel',
      role: 'Fashion Consultant',
      comment: 'Clean cuts, fast delivery, and premium packaging. Opening the silk slip dress felt like unboxing a Parisian boutique purchase.',
      rating: 5
    }
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] bg-zinc-900 overflow-hidden flex items-center justify-center">
        {/* Background Image Overlay with smooth fade */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop')` }}>
        </div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content Container */}
        <div className="relative text-center text-white px-4 max-w-4xl max-h-screen">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.4em] font-semibold text-gray-200"
          >
            Spring / Summer 2026 Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-7xl font-light tracking-[0.18em] uppercase my-6"
          >
            DEFINED BY UTILITY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm tracking-widest font-light text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed uppercase"
          >
            Premium garments designed to age gracefully. Minimal silhouettes, organic fabrics, luxury constructs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5"
          >
            <Link
              href="/collections/men"
              className="bg-white text-black hover:bg-neutral-100 transition-colors w-48 py-4 text-xs font-bold tracking-widest uppercase"
            >
              SHOP MEN
            </Link>
            <Link
              href="/collections/women"
              className="border border-white text-white hover:bg-white hover:text-black transition-all w-48 py-4 text-xs font-bold tracking-widest uppercase"
            >
              SHOP WOMEN
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 text-center">
            <h2 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">Featured Collections</h2>
            <h3 className="text-2xl font-light tracking-widest uppercase mt-2">Curated Fashion Sections</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Women Collection */}
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-zinc-900 group overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop')` }}>
              </div>
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-300">01 / Edition</span>
                <h4 className="text-xl tracking-widest uppercase font-light mt-1">Women</h4>
                <Link href="/collections/women" className="mt-4 inline-flex items-center text-xs font-bold tracking-widest uppercase hover:underline">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Men Collection */}
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-zinc-900 group overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop')` }}>
              </div>
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-300">02 / Design</span>
                <h4 className="text-xl tracking-widest uppercase font-light mt-1">Men</h4>
                <Link href="/collections/men" className="mt-4 inline-flex items-center text-xs font-bold tracking-widest uppercase hover:underline">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Kids Collection */}
            <div className="relative aspect-[4/5] bg-gray-100 dark:bg-zinc-900 group overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop')` }}>
              </div>
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-300">03 / Comfort</span>
                <h4 className="text-xl tracking-widest uppercase font-light mt-1">Kids</h4>
                <Link href="/collections/kids" className="mt-4 inline-flex items-center text-xs font-bold tracking-widest uppercase hover:underline">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Catalog Tabs & Trending Products */}
      <section className="py-20 bg-gray-50/50 dark:bg-zinc-950/40 border-y border-gray-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">Season Picks</h2>
              <h3 className="text-2xl font-light tracking-widest uppercase mt-2">SHOP DYNAMIC CATALOG</h3>
            </div>

            {/* Catalog Tabs selection */}
            <div className="flex space-x-6 mt-6 md:mt-0 font-medium text-xs tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('new')}
                className={`pb-1 transition-colors ${activeTab === 'new' ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('best')}
                className={`pb-1 transition-colors ${activeTab === 'best' ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`pb-1 transition-colors ${activeTab === 'sale' ? 'text-black dark:text-white border-b-2 border-black dark:border-white font-bold' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
              >
                Flash Sale
              </button>
            </div>
          </div>

          {/* Catalog items display list */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((itm) => (
              <ProductCard key={itm._id} product={itm} />
            ))}
          </div>

          <div className="pt-16 text-center">
            <Link
              href={`/collections/${activeTab === 'new' ? 'new' : activeTab === 'best' ? 'best' : 'sale'}`}
              className="inline-flex items-center space-x-2 text-xs tracking-[0.25rem] font-bold uppercase pb-1 border-b-2 border-black dark:border-white hover:opacity-70 transition-opacity text-black dark:text-white"
            >
              <span>VIEW ENTIRE CATALOG</span>
              <ArrowRight className="w-4 h-4 text-black dark:text-white" />
            </Link>
          </div>

        </div>
      </section>

      {/* Brand Story block */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 aspect-[16/10] bg-gray-105 dark:bg-zinc-900 overflow-hidden relative border border-gray-100 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                alt="Veloura design house studio"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">Brand Legacy</span>
              <h3 className="text-3xl font-light tracking-wide uppercase leading-tight text-black dark:text-white">
                WE BELIEVE IN EXTRAORDINARY MATERIAL IN GRACEFUL SILHOUETTES
              </h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed font-light">
                Veloura was founded in Copenhagen with a single-minded mandate: to eliminate the clutter in contemporary dress. We select the finest natural materials—Long-staple Supima cotton, biological wool, and pure mulberry silk—and shape them into structural wear that stands the test of time.
              </p>
              <p className="text-sm font-light text-gray-500 leading-relaxed font-light">
                Our workshop strictly limits carbon output. Each piece is hand-inspected with deep attention to tailors seams, buttons lining, and hem strength. Simple. Pure. Veloura.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity"
                >
                  READ OUR STORY
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Values Perks */}
      <section className="py-16 bg-gray-50/50 dark:bg-zinc-950/20 border-t border-gray-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div className="flex flex-col items-center p-4">
              <Truck className="w-8 h-8 text-gray-400 mb-4 stroke-[1]" />
              <h4 className="text-xs uppercase tracking-widest font-semibold mb-2 text-black dark:text-white">Complimentary Delivery</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs font-light">Enjoy free express shipping on orders exceeding $150. Packaged in premium recyclable gift wraps.</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <RefreshCcw className="w-8 h-8 text-gray-400 mb-4 stroke-[1]" />
              <h4 className="text-xs uppercase tracking-widest font-semibold mb-2 text-black dark:text-white">Simplified Returns</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs font-light">Don&apos;t fit your style? Request return online within 30 days of receiving your item with pre-paid shipping labels.</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <Shield className="w-8 h-8 text-gray-400 mb-4 stroke-[1]" />
              <h4 className="text-xs uppercase tracking-widest font-semibold mb-2 text-black dark:text-white">Secure Encrypted Payments</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs font-light">Fully PCI-DSS compliant gateways via Stripe and Razorpay. Complete security for checkout transacting.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">Testimonials</h2>
            <h3 className="text-2xl font-light tracking-widest uppercase mt-2">What they say about us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4 text-xs text-yellow-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-light italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-zinc-900">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white">{t.name}</h4>
                  <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-1 block">{t.role}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Instagram Gallery grid */}
      <section className="py-0">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
          {instagramImages.map((src, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100 dark:bg-zinc-950 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Veloura styling editorial review ${idx}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs uppercase tracking-[0.25em] font-semibold">@VELOURASTUDIO</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
