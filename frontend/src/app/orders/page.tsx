'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { handleApiError } from '@/utils/api';
import { Loader, Clipboard, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const router = useRouter();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            toast.error('Please login to view your order history.');
            router.push('/login?redirect=orders');
            return;
        }

        async function loadOrders() {
            setIsLoading(true);
            try {
                const response = await api.get('/orders/myorders');
                setOrders(response.data || []);
            } catch (err) {
                console.warn('API custom order parsing failed, user may have no orders', err);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        }
        loadOrders();
    }, [userInfo, router]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">

                {/* Header */}
                <div className="border-b border-gray-150 dark:border-zinc-900 pb-6 mb-10">
                    <h1 className="text-2xl font-light uppercase tracking-widest text-gray-500 block mb-1">My Account</h1>
                    <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                        Order Purchase History
                    </h2>
                </div>

                {isLoading ? (
                    <div className="h-[40vh] flex flex-col justify-center items-center text-gray-500">
                        <Loader className="w-8 h-8 animate-spin text-black dark:text-white mb-2" />
                        <span className="text-xs uppercase tracking-widest">Parsing orders list...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <Clipboard className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-6 stroke-[1]" />
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-black dark:text-white mb-2">No Past Orders Found</h3>
                        <p className="text-xs text-gray-550 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
                            You haven&apos;t completed any purchases with Veloura Studio yet. Look at our curated clothing items to get started.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-opacity"
                        >
                            EXPLORE PRODUCTS
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* Orders Table styled block */}
                        <div className="overflow-x-auto border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950/20">
                            <table className="w-full text-left text-xs">

                                <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-400 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100 dark:border-zinc-900">
                                    <tr>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Purchase Date</th>
                                        <th className="p-4">Paid Total</th>
                                        <th className="p-4">Payment Method</th>
                                        <th className="p-4">Status Details</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-900 text-black dark:text-white">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                                            <td className="p-4 font-mono font-medium">{order._id}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="p-4 font-semibold">${order.totalPrice.toFixed(2)}</td>
                                            <td className="p-4 uppercase">{order.paymentMethod}</td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-2.5">
                                                    <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${order.isPaid
                                                            ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                                                            : 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-705'
                                                        }`}>
                                                        {order.isPaid ? 'PAID' : 'AWAITING PAYMENT'}
                                                    </span>

                                                    <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${order.isDelivered
                                                            ? 'bg-blue-105 dark:bg-blue-950/30 text-blue-700'
                                                            : 'bg-zinc-150 dark:bg-zinc-800 text-gray-650 dark:text-zinc-350'
                                                        }`}>
                                                        {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => router.push(`/order-success?id=${order._id}&gateway=${order.paymentMethod}`)}
                                                    className="inline-flex items-center space-x-1 hover:underline text-xs tracking-wider uppercase font-bold text-black dark:text-white"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Detail</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
