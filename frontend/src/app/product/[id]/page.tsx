'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlistItem } from '@/store/slices/wishlistSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { handleApiError } from '@/utils/api';
import {
    Heart,
    ShoppingBag,
    Star,
    ChevronRight,
    Loader,
    Sparkles,
    Eye,
    Share2,
    Check,
    Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
    // Resolve params using React.use() to avoid Next.js warnings about dynamic APIs
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const router = useRouter();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isWishlisted = wishlistItems.some((item) => item._id === productId);

    const [product, setProduct] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Selector choices states
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [zoomEnabled, setZoomEnabled] = useState(false);
    const [zoomStyle, setZoomStyle] = useState({});

    // Review Form States
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Recently Viewed tracker
    const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

    useEffect(() => {
        async function loadProductDetails() {
            setIsLoading(true);
            try {
                const prodRes = await api.get(`/products/${productId}`);
                setProduct(prodRes.data);

                if (prodRes.data?.sizes?.length > 0) {
                    setSelectedSize(prodRes.data.sizes[0]);
                }

                // Fetch reviews
                const reviewsRes = await api.get(`/reviews/${productId}`);
                setReviews(reviewsRes.data || []);

                // Fetch similar
                const similarRes = await api.get(`/products/${productId}/similar`);
                setSimilarProducts(similarRes.data || []);

                // Track recently viewed list
                trackRecentlyViewed(prodRes.data);
            } catch (err) {
                console.warn('Unable to query detailed API, load static mocks', err);
                // Load fallback details
                const mockDetail = {
                    _id: productId,
                    name: 'Minimalist Relaxed Fit Trench Coat',
                    description: 'Double-breasted long trench coat crafted from a water-repellent organic cotton blend. Features side pockets, adjustable button cuffs, and a classic tie belt. Inspired by clean Scandinavian design. Perfect for transitioning seasons.',
                    price: 189.00,
                    discountPrice: 159.00,
                    images: [
                        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop'
                    ],
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    category: 'men',
                    subCategory: 'outerwear',
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: [
                        { name: 'Khaki Beige', hex: '#C3B091' },
                        { name: 'Obsidian Black', hex: '#111111' }
                    ],
                    stock: 12,
                    sku: `VEL-M-TC-${productId.slice(0, 4).toUpperCase()}`,
                    brand: 'Veloura Core',
                    ratings: 4.8,
                    numReviews: 12
                };
                setProduct(mockDetail);
                setSelectedSize(mockDetail.sizes[0]);

                const mockReviews = [
                    { _id: 'r1', name: 'Alex Mercer', rating: 5, comment: 'Drapes beautifully. Sits perfectly. Well engineered.' },
                    { _id: 'r2', name: 'Sandra L.', rating: 4, comment: 'Nice and clean finish. Sizing is true to fit.' }
                ];
                setReviews(mockReviews);

                const mockSimilar = [
                    {
                        _id: 'similar1',
                        name: 'Heavyweight Supima Cotton Tee',
                        price: 39.00,
                        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'],
                        category: 'men',
                        sizes: ['S', 'M', 'L'],
                        colors: [{ name: 'White', hex: '#FFFFFF' }],
                        stock: 12,
                        sku: 'VEL-M-TEE-002',
                        brand: 'Veloura Basics'
                    }
                ];
                setSimilarProducts(mockSimilar);
                trackRecentlyViewed(mockDetail);
            } finally {
                setIsLoading(false);
            }
        }

        loadProductDetails();
    }, [productId]);

    const trackRecentlyViewed = (currentProd: any) => {
        if (typeof window === 'undefined') return;
        const historyStr = sessionStorage.getItem('recentlyViewed');
        let history: any[] = [];
        if (historyStr) {
            try {
                history = JSON.parse(historyStr);
            } catch (e) {
                history = [];
            }
        }
        // Remove duplication and cap at 4 products
        history = history.filter(item => item._id !== currentProd._id);
        history.unshift({
            _id: currentProd._id,
            name: currentProd.name,
            price: currentProd.price,
            discountPrice: currentProd.discountPrice,
            images: currentProd.images,
            brand: currentProd.brand,
            category: currentProd.category,
            sizes: currentProd.sizes,
            colors: currentProd.colors,
            stock: currentProd.stock,
            sku: currentProd.sku
        });
        const finalized = history.slice(0, 4);
        setRecentlyViewed(finalized);
        sessionStorage.setItem('recentlyViewed', JSON.stringify(finalized));
    };

    useEffect(() => {
        // Load recently viewed lists on load
        if (typeof window !== 'undefined') {
            const historyStr = sessionStorage.getItem('recentlyViewed');
            if (historyStr) {
                try {
                    const parsed = JSON.parse(historyStr);
                    // filter out the current product itself
                    setRecentlyViewed(parsed.filter((p: any) => p._id !== productId));
                } catch (e) {
                    // ignore
                }
            }
        }
    }, [productId]);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Share link copied to clipboard!');
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(1.8)'
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: 'center center',
            transform: 'scale(1)'
        });
        setZoomEnabled(false);
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        dispatch(toggleWishlistItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            images: product.images,
            stock: product.stock,
            sku: product.sku,
            category: product.category
        }));
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleAddToCart = (redirectCheckout = false) => {
        if (!product) return;
        if (product.stock === 0) {
            toast.error('Out of stock');
            return;
        }

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity,
            size: selectedSize,
            color: product.colors[selectedColorIdx]?.name || 'Default',
            image: product.images[0],
            stock: product.stock,
            sku: product.sku
        }));

        toast.success(`${product.name} added to cart!`);
        if (redirectCheckout) {
            router.push('/checkout');
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error('Please login first to submit a product review.');
            router.push('/login');
            return;
        }

        setIsSubmittingReview(true);
        try {
            await api.post('/reviews', {
                productId,
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Review submitted successfully!');
            setReviewComment('');

            // Reload reviews
            const updated = await api.get(`/reviews/${productId}`);
            setReviews(updated.data || []);
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                    <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                    <span className="text-xs uppercase tracking-widest">Unveiling details...</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
                    <p className="text-sm text-gray-500 uppercase tracking-widest">Product details could not be found.</p>
                    <button onClick={() => router.push('/')} className="mt-4 bg-black text-white px-6 py-2">
                        Back to homepage
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black">

                {/* Breadcrumb path */}
                <nav className="flex items-center space-x-2 text-[10px] tracking-widest uppercase text-gray-400 mb-10 font-medium">
                    <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <Link href={`/collections/${product.category}`} className="hover:text-black dark:hover:text-white transition-colors">
                        {product.category}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    <span className="text-black dark:text-white line-clamp-1">{product.name}</span>
                </nav>

                {/* Product Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-gray-150 dark:border-zinc-900">

                    {/* LEFT: Multi Image Gallery */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">

                        {/* Pickers column (Desktop) */}
                        <div className="md:col-span-2 hidden md:flex md:flex-col space-y-3.5 order-2 md:order-1">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`aspect-[3/4] w-full overflow-hidden bg-gray-50 border transition-all ${activeImageIdx === idx
                                        ? 'border-black dark:border-white scale-98'
                                        : 'border-gray-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`${product.name} view ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Active Display Panel (With Magnifier mouse track zoom) */}
                        <div className="md:col-span-10 order-1 md:order-2">
                            <div
                                className="relative aspect-[3/4] w-full bg-gray-50 border border-gray-100 dark:border-zinc-900 overflow-hidden cursor-zoom-in"
                                onMouseEnter={() => setZoomEnabled(true)}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.images[activeImageIdx]}
                                    alt={product.name}
                                    style={zoomEnabled ? zoomStyle : { transform: 'scale(1)' }}
                                    className="w-full h-full object-cover transition-transform duration-100 ease-out"
                                />

                                {/* Sale Badge */}
                                {product.discountPrice > 0 && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
                                        Sale
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: Product Specs information */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Header info */}
                        <div>
                            <span className="text-[10px] tracking-[0.25em] font-semibold text-gray-400 uppercase block mb-1">
                                {product.brand} | {product.sku}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-light uppercase tracking-wide text-black dark:text-white leading-tight">
                                {product.name}
                            </h1>

                            {/* Ratings star */}
                            <div className="flex items-center space-x-2 mt-3 text-xs">
                                <div className="flex items-center text-yellow-500 font-semibold gap-1">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    <span>{product.ratings?.toFixed(1) || '0.0'}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500 tracking-wide uppercase text-[10px] font-bold">
                                    {reviews.length} Verified Reviews
                                </span>
                            </div>
                        </div>

                        {/* Price list item */}
                        <div className="py-4 border-y border-gray-100 dark:border-zinc-900 select-none">
                            {product.discountPrice > 0 ? (
                                <div className="flex items-baseline space-x-3">
                                    <span className="text-2xl font-bold text-red-500">${product.discountPrice.toFixed(2)}</span>
                                    <span className="text-sm font-light text-gray-400 line-through">${product.price.toFixed(2)}</span>
                                    <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">
                                        (Save ${(product.price - product.discountPrice).toFixed(0)})
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-semibold text-black dark:text-white">${product.price.toFixed(2)}</span>
                            )}
                        </div>

                        {/* Product description */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                            {product.description}
                        </p>

                        {/* Color Swatch Selector */}
                        {product.colors?.length > 0 && (
                            <div>
                                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block mb-2.5">
                                    COLOR: {product.colors[selectedColorIdx]?.name}
                                </span>
                                <div className="flex space-x-3">
                                    {product.colors.map((c: any, idx: number) => (
                                        <button
                                            key={c.name}
                                            onClick={() => setSelectedColorIdx(idx)}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${selectedColorIdx === idx
                                                ? 'border-black dark:border-white scale-110'
                                                : 'border-transparent'
                                                }`}
                                            style={{ backgroundColor: c.hex }}
                                            title={c.name}
                                        >
                                            {selectedColorIdx === idx && (
                                                <Check className="w-4 h-4 text-white mix-blend-difference" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size list picker */}
                        {product.sizes?.length > 0 && (
                            <div>
                                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block mb-2.5">
                                    SELECT SIZE: {selectedSize}
                                </span>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.sizes.map((s: string) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`min-w-[45px] h-10 px-3 border text-center text-xs tracking-wider transition-colors uppercase ${selectedSize === s
                                                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-extrabold'
                                                : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-black dark:hover:border-white'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity and Availability Box */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block mb-2.5">
                                    QUANTITY
                                </span>
                                <div className="flex border border-gray-200 dark:border-zinc-800 w-32 max-w-full">
                                    <button
                                        disabled={quantity <= 1}
                                        onClick={() => setQuantity(quantity - 1)}
                                        className="px-3 py-2 text-xs font-bold leading-none disabled:opacity-30 text-black dark:text-white"
                                    >
                                        -
                                    </button>
                                    <span className="flex-1 text-center py-2 text-xs font-medium text-black dark:text-white flex items-center justify-center">
                                        {quantity}
                                    </span>
                                    <button
                                        disabled={quantity >= product.stock}
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 text-xs font-bold leading-none disabled:opacity-30 text-black dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end">
                                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 block mb-2">
                                    AVAILABILITY
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wider ${product.stock > 3
                                    ? 'text-green-600'
                                    : product.stock > 0
                                        ? 'text-amber-500 animate-pulse'
                                        : 'text-red-500'
                                    }`}>
                                    {product.stock > 3
                                        ? 'In Stock'
                                        : product.stock > 0
                                            ? `Only ${product.stock} left`
                                            : 'SOLD OUT'}
                                </span>
                            </div>
                        </div>

                        {/* Video Support link */}
                        {product.videoUrl && (
                            <div className="pt-2">
                                <a
                                    href={product.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 text-xs tracking-wider uppercase font-semibold text-gray-650 hover:text-black dark:hover:text-white transition-colors"
                                >
                                    <Play className="w-4 h-4" />
                                    <span>Watch Product Video Demo</span>
                                </a>
                            </div>
                        )}

                        {/* Checkouts Actions */}
                        <div className="pt-4 flex flex-col space-y-3">

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleAddToCart(false)}
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-4 text-xs font-bold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>ADD TO BAG</span>
                                </button>

                                <button
                                    onClick={handleWishlistToggle}
                                    className={`p-4 border ${isWishlisted
                                        ? 'border-red-500 bg-red-50/10 text-red-500'
                                        : 'border-gray-200 dark:border-zinc-800 text-gray-400 hover:text-black dark:hover:text-white'
                                        }`}
                                    title={isWishlisted ? 'Removed from wishlist' : 'Add to wishlist'}
                                >
                                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                                </button>
                            </div>

                            <button
                                onClick={() => handleAddToCart(true)}
                                disabled={product.stock === 0}
                                className="w-full border border-black dark:border-white py-4 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-neutral-50 dark:hover:bg-zinc-900 text-black dark:text-white"
                            >
                                BUY IT NOW
                            </button>

                        </div>

                        {/* Share and other details */}
                        <div className="pt-6 border-t border-gray-100 dark:border-zinc-900 flex justify-between items-center text-[10px] tracking-widest uppercase text-gray-400 font-medium">
                            <span>SKU: {product.sku}</span>
                            <button
                                onClick={handleShare}
                                className="hover:text-black dark:hover:text-white flex items-center space-x-1"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>SHARE PRODUCT</span>
                            </button>
                        </div>

                    </div>

                </div>

                {/* Similar Products Carousel */}
                {similarProducts.length > 0 && (
                    <section className="py-16">
                        <div className="mb-10">
                            <h2 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">You may also like</h2>
                            <h3 className="text-xl font-light tracking-widest uppercase mt-2">SIMILAR DESIGN ITEMS</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recently Viewed Products */}
                {recentlyViewed.length > 0 && (
                    <section className="py-8 border-t border-gray-150 dark:border-zinc-900">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">History Details</h2>
                                <h3 className="text-xl font-light tracking-widest uppercase mt-2">Recently Viewed</h3>
                            </div>
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('recentlyViewed');
                                    setRecentlyViewed([]);
                                    toast.success('Browsing history cleared');
                                }}
                                className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black dark:hover:text-white underline font-semibold"
                            >
                                Clear History
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recentlyViewed.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews Section & Rating Form */}
                <section className="py-16 border-t border-gray-150 dark:border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Reviews List */}
                    <div className="lg:col-span-7 space-y-6">
                        <h3 className="text-lg font-semibold tracking-widest uppercase mb-6 text-black dark:text-white">
                            Customer Reviews ({reviews.length})
                        </h3>

                        {reviews.length === 0 ? (
                            <p className="text-xs text-gray-500 font-light italic">No reviews yet for this product. Be the first to review it!</p>
                        ) : (
                            <div className="space-y-6 divide-y divide-gray-100 dark:divide-zinc-900">
                                {reviews.map((r, idx) => (
                                    <div key={r._id || idx} className="pt-6 first:pt-0">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">{r.name}</h4>
                                            <div className="flex space-x-1 text-xs text-yellow-500">
                                                {[...Array(r.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[9px] text-gray-400 block mt-1">
                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Verified Buyer'}
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-450 leading-relaxed font-light mt-3">
                                            {r.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Write a Review Form */}
                    <div className="lg:col-span-5 bg-gray-50/50 dark:bg-zinc-950/40 p-8 border border-gray-100 dark:border-zinc-900">
                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-black dark:text-white">
                            Write a review
                        </h3>

                        <form onSubmit={handleReviewSubmit} className="space-y-4">

                            {/* Rating selection */}
                            <div>
                                <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-2">
                                    Overall Rating
                                </label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star className={`w-6 h-6 ${reviewRating >= star
                                                ? 'fill-yellow-550 text-yellow-550'
                                                : 'text-gray-300 dark:text-zinc-700'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Comment text */}
                            <div>
                                <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-2">
                                    Review Text
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share details of your experience with this purchase size, quality, and fit..."
                                    className="w-full text-xs font-light border border-gray-250 dark:border-zinc-800 bg-white dark:bg-black p-3.5 text-black dark:text-white outline-none focus:border-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingReview}
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-3.5 text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
                            >
                                {isSubmittingReview ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>SUBMITTING...</span>
                                    </>
                                ) : (
                                    <span>POST REVIEW</span>
                                )}
                            </button>

                        </form>

                    </div>

                </section>

            </main>

            <Footer />
        </>
    );
}
