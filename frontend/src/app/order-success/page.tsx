'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { CheckCircle, Truck, Package, Calendar, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') || 'mock_order_123';
    const gateway = searchParams.get('gateway') || 'Stripe';

    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadOrderDetails() {
            setIsLoading(true);
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                console.warn('API lookup failed, loading mock order details.');
                // Fallback mockup
                const mockOrder = {
                    _id: orderId,
                    createdAt: new Date().toISOString(),
                    paymentMethod: gateway.toUpperCase(),
                    shippingPrice: 0,
                    taxPrice: 12.00,
                    totalPrice: 171.00,
                    isPaid: true,
                    shippingAddress: {
                        name: 'John Doe',
                        street: '100 Main St Apt 4B',
                        city: 'New York',
                        state: 'NY',
                        postalCode: '10001',
                        country: 'United States'
                    },
                    orderItems: [
                        {
                            name: 'Minimalist Relaxed Fit Trench Coat',
                            quantity: 1,
                            price: 159.00,
                            size: 'M',
                            color: 'Beige'
                        }
                    ]
                };
                setOrder(mockOrder);
            } finally {
                setIsLoading(false);
            }
        }
        if (orderId) {
            loadOrderDetails();
        }
    }, [orderId, gateway]);

    const getEstimatedArrivalDate = () => {
        if (!order) return '';
        const date = new Date(order.createdAt);
        date.setDate(date.getDate() + 4);
        const options: ReplaceSourceOptions = { weekday: 'long', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options as any);
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center text-gray-500">
                <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                <span className="text-xs uppercase tracking-widest animate-pulse">Confirming order transaction...</span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-[60vh] flex flex-col justify-center items-center text-center p-6">
                <p className="text-sm text-gray-500 uppercase tracking-widest">Order details could not be parsed.</p>
                <Link href="/" className="mt-4 bg-black text-white px-6 py-2 text-xs uppercase tracking-widest font-bold">
                    Go back home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 bg-white dark:bg-black text-black dark:text-white">

            {/* Visual Tick Icon */}
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                >
                    <CheckCircle className="w-16 h-16 text-green-500 fill-green-50/20" />
                </motion.div>
                <div>
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase">Transaction Confirmed</span>
                    <h1 className="text-3xl font-light tracking-wide uppercase mt-1">Thank you for your order!</h1>
                    <p className="text-xs text-gray-550 dark:text-gray-400 mt-2 font-light">
                        Order <span className="font-semibold text-black dark:text-white">#{order._id}</span> has been successfully placed.
                    </p>
                </div>
            </div>

            {/* Main information Grid */}
            <div className="bg-gray-50/50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-900 divide-y divide-gray-100 dark:divide-zinc-905">

                {/* Estimated Date banner */}
                <div className="p-6 flex items-start space-x-4">
                    <Truck className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Estimated Date of Arrival</h3>
                        <p className="text-sm font-semibold text-green-600 mt-1">{getEstimatedArrivalDate()}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-light">
                            You will receive custom shipping updates via email.
                        </p>
                    </div>
                </div>

                {/* Shipping details info */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-gray-400 mb-3 block">Shipping Address</h4>
                        <p className="font-semibold uppercase text-black dark:text-white mb-1.5">{order.shippingAddress.name}</p>
                        <p className="text-gray-550 dark:text-gray-400 leading-relaxed font-light">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                            {order.shippingAddress.country}
                        </p>
                        <span className="text-gray-450 block mt-2 font-medium">{order.shippingAddress.phone}</span>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-gray-400 mb-3 block">Payment Details</h4>
                        <div className="space-y-1.5 text-gray-550 dark:text-gray-400 font-light">
                            <p>Method: <span className="font-semibold text-black dark:text-white uppercase">{order.paymentMethod}</span></p>
                            <p>Status: <span className="font-semibold text-green-600 uppercase">{order.isPaid ? 'PAID' : 'PENDING'}</span></p>
                            <p className="pt-2 border-t border-gray-100 dark:border-zinc-900 mt-2 text-sm font-bold text-black dark:text-white">
                                Total Amount Paid: ${order.totalPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order items lists info */}
                <div className="p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-405 block">Garments Summary</h4>
                    <div className="divide-y divide-gray-100 dark:divide-zinc-900">
                        {order.orderItems.map((item: any, idx: number) => (
                            <div key={idx} className="py-3 flex items-center justify-between first:pt-0">
                                <div className="space-y-0.5">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">{item.name}</h5>
                                    <p className="text-[10px] text-gray-450 uppercase font-medium tracking-wide">
                                        QTY: {item.quantity} {item.size ? `/ SIZE: ${item.size}` : ''} {item.color ? `/ COLOR: ${item.color}` : ''}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-black dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Redirects buttons triggers */}
            <div className="pt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                    href="/"
                    className="w-48 text-center bg-black text-white dark:bg-white dark:text-black py-4 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
                >
                    CONTINUE SHOPPING
                </Link>
                <Link
                    href="/orders"
                    className="w-48 text-center border border-black dark:border-white py-4 text-xs font-bold tracking-widest uppercase text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900"
                >
                    VIEW MY ORDERS
                </Link>
            </div>

        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex flex-col justify-center items-center text-gray-505">
                    <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                    <span className="text-xs uppercase tracking-widest">Loading...</span>
                </div>
            }>
                <OrderSuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}

interface ReplaceSourceOptions {
    weekday?: 'long' | 'short' | 'narrow';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
}
