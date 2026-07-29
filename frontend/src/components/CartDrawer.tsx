'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const dispatch = useDispatch();
    const { cartItems, totalPrice, itemsPrice } = useSelector((state: RootState) => state.cart);

    const handleQtyChange = (product: string, size: string | undefined, color: string | undefined, qty: number) => {
        dispatch(updateQuantity({ product, size, color, quantity: qty }));
    };

    const handleRemove = (product: string, size?: string, color?: string) => {
        dispatch(removeFromCart({ product, size, color }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-50 transition-opacity"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
                        className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-zinc-950 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <ShoppingBag className="w-5 h-5 text-black dark:text-white" />
                                <span className="text-sm font-semibold tracking-widest uppercase text-black dark:text-white">Shopping Cart</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:opacity-70 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100 dark:divide-zinc-900">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-4 stroke-[1]" />
                                    <p className="text-sm tracking-wide text-gray-500 dark:text-gray-400 mb-6">Your shopping cart is currently empty.</p>
                                    <button
                                        onClick={onClose}
                                        className="inline-block bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-8 py-3 text-xs tracking-widest uppercase transition-opacity"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item, idx) => (
                                    <div key={`${item.product}-${item.size}-${item.color}-${idx}`} className="py-5 flex space-x-4">
                                        {/* Image */}
                                        <div className="w-20 h-24 bg-gray-50 dark:bg-zinc-900 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-800 relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h4 className="text-xs uppercase tracking-wider font-medium text-black dark:text-white line-clamp-1">
                                                        {item.name}
                                                    </h4>
                                                    <span className="text-xs font-semibold text-black dark:text-white pl-2">
                                                        ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                    SKU: {item.sku}
                                                </p>
                                                {item.size || item.color ? (
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {item.size && (
                                                            <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-1.5 py-0.5 uppercase">
                                                                SIZE: {item.size}
                                                            </span>
                                                        )}
                                                        {item.color && (
                                                            <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-1.5 py-0.5 uppercase">
                                                                COLOR: {item.color}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex border border-gray-200 dark:border-zinc-800">
                                                    <button
                                                        onClick={() => handleQtyChange(item.product, item.size, item.color, item.quantity - 1)}
                                                        className="px-2.5 py-1 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 text-black dark:text-white"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 text-xs font-medium text-black dark:text-white flex items-center justify-center min-w-8">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQtyChange(item.product, item.size, item.color, item.quantity + 1)}
                                                        className="px-2.5 py-1 text-xs hover:bg-gray-50 dark:hover:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 text-black dark:text-white"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item.product, item.size, item.color)}
                                                    className="text-gray-400 hover:text-red-500 p-1 flex items-center transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Summary */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-zinc-900 p-6 space-y-4 bg-gray-50/50 dark:bg-zinc-900/30">
                                <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-black dark:text-white font-bold">${itemsPrice.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400">Taxes, discounts, and shipping cost are computed at checkout.</p>
                                <div className="pt-2 flex flex-col space-y-3">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-3.5 text-xs font-semibold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                                    >
                                        <span>Check Out</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="w-full border border-gray-200 dark:border-zinc-800 text-center hover:bg-gray-50 dark:hover:bg-zinc-900 py-3 text-xs tracking-widest uppercase transition-colors text-black dark:text-white font-medium"
                                    >
                                        View Bag
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
