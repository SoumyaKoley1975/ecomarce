'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleWishlistItem } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Color {
    name: string;
    hex: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    sku: string;
    brand: string;
    category: string;
    sizes: string[];
    colors: Color[];
    ratings?: number;
    numReviews?: number;
    newArrival?: boolean;
    bestSeller?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isWishlisted = wishlistItems.some((item) => item._id === product._id);

    const [hovered, setHovered] = useState(false);
    const [activeColorIdx, setActiveColorIdx] = useState(0);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

        if (isWishlisted) {
            toast.success('Removed from wishlist');
        } else {
            toast.success('Added to wishlist');
        }
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            toast.error('Out of stock');
            return;
        }

        const defaultSize = product.sizes[0] || 'M';
        const defaultColor = product.colors[activeColorIdx]?.name || 'Default';

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity: 1,
            size: defaultSize,
            color: defaultColor,
            image: product.images[0],
            stock: product.stock,
            sku: product.sku
        }));

        toast.success('Added to bag');
    };

    const hasDiscount = product.discountPrice && product.discountPrice > 0;

    return (
        <div
            className="group relative flex flex-col bg-white dark:bg-black overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            {/* Product Image Area */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-900">

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5">
                    {hasDiscount && (
                        <span className="bg-red-500 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                            Sale
                        </span>
                    )}
                    {product.newArrival && (
                        <span className="bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                            New
                        </span>
                    )}
                    {product.bestSeller && (
                        <span className="bg-zinc-150 border border-black/10 dark:bg-zinc-800 text-black dark:text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-md text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* Primary/Secondary Image Swap */}
                <Link href={`/product/${product._id}`} className="block h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={hovered && product.images[1] ? product.images[1] : product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                    />
                </Link>

                {/* Sizes overlay on hover */}
                {hovered && product.sizes.length > 0 && (
                    <div className="absolute bottom-12 inset-x-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm py-2 text-center transition-all duration-300 hidden md:block">
                        <span className="text-[10px] tracking-widest uppercase text-gray-500 block mb-1">Available Sizes</span>
                        <div className="flex justify-center space-x-2 text-[10px] font-bold text-black dark:text-white">
                            {product.sizes.map((s) => (
                                <span key={s}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Add To Cart Button */}
                <button
                    onClick={handleQuickAdd}
                    disabled={product.stock === 0}
                    className="absolute bottom-0 inset-x-0 w-full bg-black text-white dark:bg-white dark:text-black py-3 text-xs tracking-widest uppercase font-semibold text-center opacity-0 group-hover:opacity-100 translation-opacity duration-300 flex items-center justify-center space-x-2"
                >
                    {product.stock === 0 ? (
                        <span>SOLD OUT</span>
                    ) : (
                        <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>QUICK ADD</span>
                        </>
                    )}
                </button>

            </div>

            {/* Info Card Description */}
            <div className="pt-4 pb-2 flex flex-col flex-1 bg-white dark:bg-black">

                {/* Color Switchers */}
                {product.colors.length > 1 && (
                    <div className="flex space-x-1.5 mb-2">
                        {product.colors.map((color, idx) => (
                            <button
                                key={color.name}
                                onClick={() => setActiveColorIdx(idx)}
                                className={`w-3.5 h-3.5 rounded-full border transition-all ${activeColorIdx === idx
                                        ? 'border-black dark:border-white scale-110'
                                        : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                    </div>
                )}

                {/* Title */}
                <Link href={`/product/${product._id}`} className="hover:underline">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-black dark:text-white line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Brand */}
                <span className="text-[10px] uppercase text-gray-400 tracking-widest mt-1">{product.brand}</span>

                {/* Rating and Price row */}
                <div className="flex items-center justify-between mt-3 font-semibold text-xs">

                    {/* Price */}
                    <div className="flex items-center space-x-2 text-sm">
                        {hasDiscount ? (
                            <>
                                <span className="text-red-500 font-bold">${product.discountPrice?.toFixed(2)}</span>
                                <span className="text-gray-400 line-through font-light text-xs">${product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-black dark:text-white">${product.price.toFixed(2)}</span>
                        )}
                    </div>

                    {/* Aggregate Rating Star */}
                    {product.ratings !== undefined && product.ratings > 0 ? (
                        <div className="flex items-center space-x-0.8 text-yellow-500 font-bold text-[10px]">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            <span>{product.ratings.toFixed(1)}</span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-gray-450 dark:text-gray-500">No reviews</span>
                    )}

                </div>

            </div>

        </div>
    );
}
