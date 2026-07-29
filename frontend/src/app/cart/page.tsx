'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon } from '@/store/slices/cartSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, ShoppingBag, ArrowRight, Tag, X, HelpCircle, Truck } from 'lucide-react';
import api, { handleApiError } from '@/utils/api';
import toast from 'react-hot-toast';

export default function CartPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        cartItems,
        coupon,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountPrice,
        totalPrice
    } = useSelector((state: RootState) => state.cart);

    const [couponCode, setCouponCode] = useState('');
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    const handleQtyChange = (product: string, size: string | undefined, color: string | undefined, qty: number) => {
        dispatch(updateQuantity({ product, size, color, quantity: qty }));
    };

    const handleRemove = (product: string, size?: string, color?: string) => {
        dispatch(removeFromCart({ product, size, color }));
        toast.success('Item removed from cart');
    };

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setIsValidatingCoupon(true);
        try {
            const response = await api.post('/coupons/validate', {
                code: couponCode.trim(),
                cartTotal: itemsPrice
            });

            const { code, discountType, discountAmount, message } = response.data;
            dispatch(applyCoupon({ code, discountType, discountAmount }));
            toast.success(message || 'Coupon code applied!');
            setCouponCode('');
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        toast.success('Coupon removed');
    };

    // Estimated delivery details (standard 4-6 business days)
    const getDeliveryEstimate = () => {
        const today = new Date();
        const minDeliv = new Date(today);
        minDeliv.setDate(today.getDate() + 3);
        const maxDeliv = new Date(today);
        maxDeliv.setDate(today.getDate() + 6);

        const options: ReplaceSourceOptions = { month: 'short', day: 'numeric' };
        return `${minDeliv.toLocaleDateString('en-US', options as any)} - ${maxDeliv.toLocaleDateString('en-US', options as any)}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">

                {/* Header */}
                <div className="border-b border-gray-100 dark:border-zinc-900 pb-6 mb-10">
                    <h1 className="text-2xl font-light uppercase tracking-widest text-gray-400 block mb-1">Shopping Bag</h1>
                    <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                        Cart Summary ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items)
                    </h2>
                </div>

                {cartItems.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-6 stroke-[1]" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white mb-2">Your Bag is Empty</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                            Before you can check out, you must search and select premium garments into your shopping cart.
                        </p>
                        <Link
                            href="/"
                            className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity"
                        >
                            START SHOPPING
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* LEFT: Items List */}
                        <div className="lg:col-span-8 space-y-6">

                            <div className="divide-y divide-gray-100 dark:divide-zinc-900">
                                {cartItems.map((item, idx) => (
                                    <div key={`${item.product}-${item.size}-${item.color}-${idx}`} className="py-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 first:pt-0">

                                        {/* Visual Thumb */}
                                        <div className="w-24 h-32 bg-gray-50 dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-zinc-800 flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>

                                        {/* Specifications */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <Link href={`/product/${item.product}`} className="hover:underline">
                                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <span className="text-sm font-semibold text-black dark:text-white pl-2">
                                                    ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                SKU: {item.sku}
                                            </p>

                                            <div className="flex items-center space-x-3 text-[10px] pt-1">
                                                {item.size && (
                                                    <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 px-2 py-0.5 uppercase font-medium">
                                                        SIZE: {item.size}
                                                    </span>
                                                )}
                                                {item.color && (
                                                    <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 px-2 py-0.5 uppercase font-medium">
                                                        COLOR: {item.color}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions and inputs controls */}
                                        <div className="flex items-center justify-between sm:justify-end sm:space-x-8 mt-4 sm:mt-0">

                                            {/* Quantity input counters */}
                                            <div className="flex border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
                                                <button
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => handleQtyChange(item.product, item.size, item.color, item.quantity - 1)}
                                                    className="px-2.5 py-1.5 text-xs font-semibold disabled:opacity-30 text-black dark:text-white"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1.5 text-xs text-black dark:text-white font-medium flex items-center justify-center min-w-8 select-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    disabled={item.quantity >= item.stock}
                                                    onClick={() => handleQtyChange(item.product, item.size, item.color, item.quantity + 1)}
                                                    className="px-2.5 py-1.5 text-xs font-semibold disabled:opacity-30 text-black dark:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Trash Delete symbol */}
                                            <button
                                                onClick={() => handleRemove(item.product, item.size, item.color)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Delivery estimated notice */}
                            <div className="p-4 border border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-950/20 flex items-start space-x-3.5 mt-8">
                                <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Estimated Delivery Details</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-normal font-light">
                                        Your order qualifies for Standard Shipping. Expected carrier delivery date: <span className="font-semibold text-black dark:text-white">{getDeliveryEstimate()}</span>.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: Totals Side panel */}
                        <div className="lg:col-span-4 bg-gray-50/50 dark:bg-zinc-950/40 p-6 border border-gray-100 dark:border-zinc-900 space-y-6">

                            <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-3">
                                Order Summary
                            </h3>

                            {/* Pricing Breakdowns */}
                            <div className="space-y-4 text-xs">

                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="font-medium uppercase tracking-wide">Original Price</span>
                                    <span className="font-semibold text-black dark:text-white">${itemsPrice.toFixed(2)}</span>
                                </div>

                                {discountPrice > 0 && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span className="font-medium uppercase tracking-wide">Discount Applied</span>
                                        <span className="font-bold">-${discountPrice.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-gray-500">
                                    <span className="font-medium uppercase tracking-wide flex items-center">
                                        Estimated Tax
                                        <span title="Flat 8% of original total">
                                            <HelpCircle className="w-3.5 h-3.5 ml-1 text-gray-300" />
                                        </span>
                                    </span>
                                    <span className="font-semibold text-black dark:text-white">${taxPrice.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-500 pb-4 border-b border-gray-100 dark:border-zinc-900">
                                    <span className="font-medium uppercase tracking-wide">Estimated Shipping</span>
                                    <span className="font-semibold text-black dark:text-white">
                                        {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm font-semibold tracking-wider pt-2">
                                    <span className="uppercase text-black dark:text-white">Estimated Total</span>
                                    <span className="text-lg font-bold text-black dark:text-white">${totalPrice.toFixed(2)}</span>
                                </div>

                            </div>

                            {/* Coupon inputs box */}
                            <div>
                                {coupon ? (
                                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider mb-2">
                                        <span className="flex items-center">
                                            <Tag className="w-4 h-4 mr-2" />
                                            Promo: {coupon.code}
                                        </span>
                                        <button onClick={handleRemoveCoupon} className="hover:opacity-75">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyCoupon} className="flex border border-gray-250 dark:border-zinc-800 bg-white dark:bg-black">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="ENTER PROMO CODE"
                                            className="w-full text-[10px] tracking-widest uppercase bg-transparent outline-none border-none p-3 text-black dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isValidatingCoupon}
                                            className="px-4 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity border-l border-gray-200 dark:border-zinc-800"
                                        >
                                            APPLY
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Checkout actions */}
                            <div className="pt-2">
                                <Link
                                    href="/checkout"
                                    className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-4 text-xs font-semibold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                                >
                                    <span>PROCEED TO CHECKOUT</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <div className="mt-3 text-center">
                                    <Link
                                        href="/"
                                        className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black dark:hover:text-white underline font-semibold"
                                    >
                                        CONTINUE SHOPPING
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
interface ReplaceSourceOptions {
    month?: 'short' | 'long' | 'numeric' | '2-digit';
    day?: 'numeric' | '2-digit';
}
