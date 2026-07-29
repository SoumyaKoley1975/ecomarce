'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { handleApiError } from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Loader, Shield, Lock, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const {
        cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountPrice,
        totalPrice,
        coupon
    } = useSelector((state: RootState) => state.cart);

    const [isLoading, setIsLoading] = useState(false);

    // Address Forms state
    const [addressName, setAddressName] = useState(userInfo?.name || '');
    const [addressPhone, setAddressPhone] = useState('');
    const [addressStreet, setAddressStreet] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressState, setAddressState] = useState('');
    const [addressPostalCode, setAddressPostalCode] = useState('');
    const [addressCountry, setAddressCountry] = useState('United States');
    const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | null>(null);

    // Payment select
    const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay' | 'cod'>('stripe');

    useEffect(() => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty. Add items first.');
            router.push('/cart');
        }
    }, [cartItems, router]);

    // Load saved user address book details if they exist
    useEffect(() => {
        if (userInfo && userInfo.addressBook && userInfo.addressBook.length > 0) {
            // default selection
            const defIdx = userInfo.addressBook.findIndex((addr: any) => addr.isDefault);
            const activeIdx = defIdx !== -1 ? defIdx : 0;
            setSelectedAddressIdx(activeIdx);
            applySavedAddress(userInfo.addressBook[activeIdx]);
        }
    }, [userInfo]);

    const applySavedAddress = (addr: any) => {
        setAddressName(addr.name);
        setAddressPhone(addr.phone);
        setAddressStreet(addr.street);
        setAddressCity(addr.city);
        setAddressState(addr.state);
        setAddressPostalCode(addr.postalCode);
        setAddressCountry(addr.country);
    };

    const handleSavedAddressPicker = (idx: number) => {
        if (userInfo?.addressBook) {
            setSelectedAddressIdx(idx);
            applySavedAddress(userInfo.addressBook[idx]);
        }
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!addressName || !addressPhone || !addressStreet || !addressCity || !addressState || !addressPostalCode) {
            toast.error('Please fill out all address details.');
            return;
        }

        if (!userInfo) {
            toast.error('Account login required to proceed to checkout.');
            router.push('/login?redirect=checkout');
            return;
        }

        setIsLoading(true);

        const shippingAddress = {
            name: addressName,
            phone: addressPhone,
            street: addressStreet,
            city: addressCity,
            state: addressState,
            postalCode: addressPostalCode,
            country: addressCountry
        };

        // Format cartItems for backend order creation
        const orderItems = cartItems.map(item => ({
            product: item.product,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
        }));

        try {
            if (paymentGateway === 'cod') {
                // Create COD order directly
                const orderRes = await api.post('/orders', {
                    orderItems,
                    shippingAddress,
                    paymentMethod: 'COD',
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    discountPrice,
                    totalPrice
                });

                dispatch(clearCart());
                toast.success('Order placed successfully via COD!');
                router.push(`/order-success?id=${orderRes.data._id}&gateway=cod`);
            }
            else if (paymentGateway === 'stripe') {
                // Create stripe checkout session
                const sessionRes = await api.post('/payments/stripe/create-checkout-session', {
                    orderItems,
                    discountPrice,
                    taxPrice,
                    shippingPrice
                });

                const { id, url, mock } = sessionRes.data;

                if (mock) {
                    // If mockup response, simulate order locally on Node db and redirect manually
                    const orderRes = await api.post('/orders', {
                        orderItems,
                        shippingAddress,
                        paymentMethod: 'Stripe',
                        itemsPrice,
                        taxPrice,
                        shippingPrice,
                        discountPrice,
                        totalPrice,
                        paymentResult: { id, status: 'succeeded', gateway: 'stripe' }
                    });
                    dispatch(clearCart());
                    toast.success('Simulated Stripe Payment Completed!');
                    router.push(`/order-success?id=${orderRes.data._id}&gateway=stripe&session_id=${id}`);
                } else {
                    // Redirect user to Stripe portal
                    window.location.href = url;
                }
            }
            else if (paymentGateway === 'razorpay') {
                // Create Razorpay Order in Rupees
                // 1 USD = 83 INR approximate conversion rate for test simplicity
                const totalInINR = Math.round(totalPrice * 83);
                const rzOrderRes = await api.post('/payments/razorpay/create-order', {
                    amount: totalInINR
                });

                const { id: rzOrderId, amount, currency, mock } = rzOrderRes.data;

                if (mock) {
                    // Simulate Razorpay order placement
                    const orderRes = await api.post('/orders', {
                        orderItems,
                        shippingAddress,
                        paymentMethod: 'Razorpay',
                        itemsPrice,
                        taxPrice,
                        shippingPrice,
                        discountPrice,
                        totalPrice,
                        paymentResult: { id: rzOrderId, status: 'paid', gateway: 'razorpay' }
                    });
                    dispatch(clearCart());
                    toast.success('Simulated Razorpay Payment Completed!');
                    router.push(`/order-success?id=${orderRes.data._id}&gateway=razorpay`);
                } else {
                    // Open standard razorpay checkout frame
                    const options = {
                        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
                        amount: amount,
                        currency: currency,
                        name: 'Veloura Studio',
                        description: 'Order Payment',
                        order_id: rzOrderId,
                        handler: async function (response: any) {
                            try {
                                // Verify signature
                                await api.post('/payments/razorpay/verify', {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                });

                                // Create Order on DB
                                const dbOrder = await api.post('/orders', {
                                    orderItems,
                                    shippingAddress,
                                    paymentMethod: 'Razorpay',
                                    itemsPrice,
                                    taxPrice,
                                    shippingPrice,
                                    discountPrice,
                                    totalPrice,
                                    paymentResult: {
                                        id: response.razorpay_payment_id,
                                        status: 'paid',
                                        gateway: 'razorpay'
                                    }
                                });

                                dispatch(clearCart());
                                toast.success('Razorpay Payment success!');
                                router.push(`/order-success?id=${dbOrder.data._id}&gateway=razorpay`);
                            } catch (verifyErr) {
                                toast.error('Signature verification failed');
                            }
                        },
                        prefill: {
                            name: userInfo.name,
                            email: userInfo.email,
                            contact: addressPhone
                        },
                        theme: {
                            color: '#000000'
                        }
                    };

                    // Load checkout.js
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.async = true;
                    script.onload = () => {
                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                    };
                    document.body.appendChild(script);
                }
            }
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">

                {/* Header */}
                <div className="border-b border-gray-100 dark:border-zinc-900 pb-6 mb-10">
                    <h1 className="text-2xl font-light uppercase tracking-widest text-gray-400 block mb-1">Check Out Secure</h1>
                    <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                        Secure checkout gateway
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: Address Forms & Payment method */}
                    <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-10">

                        {/* Address pickers */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white flex items-center">
                                <span className="bg-black text-white dark:bg-white dark:text-black w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] mr-2">1</span>
                                Shipping Address
                            </h3>

                            {/* Saved Address Cards */}
                            {userInfo && userInfo.addressBook && userInfo.addressBook.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-zinc-900">
                                    {userInfo.addressBook.map((addr: any, idx: number) => (
                                        <div
                                            key={addr._id || idx}
                                            onClick={() => handleSavedAddressPicker(idx)}
                                            className={`p-4 border cursor-pointer flex flex-col justify-between transition-colors ${selectedAddressIdx === idx
                                                    ? 'border-black dark:border-white bg-gray-50/50 dark:bg-zinc-900/25'
                                                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                                                }`}
                                        >
                                            <div>
                                                <div className="flex justify-between items-center text-xs font-semibold text-black dark:text-white mb-2">
                                                    <span className="uppercase">{addr.name}</span>
                                                    {addr.isDefault && <span className="text-[9px] bg-neutral-200 dark:bg-zinc-800 px-1 py-0.5 rounded-[1px]">DEFAULT</span>}
                                                </div>
                                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-light leading-normal">
                                                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                                                </p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium block mt-2 mt-4">{addr.phone}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Manual input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressName}
                                        onChange={(e) => setAddressName(e.target.value)}
                                        placeholder="Recipient Name"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={addressPhone}
                                        onChange={(e) => setAddressPhone(e.target.value)}
                                        placeholder="E.g. +1 555-0199"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressStreet}
                                        onChange={(e) => setAddressStreet(e.target.value)}
                                        placeholder="Apartment, suite, unit, building number"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressCity}
                                        onChange={(e) => setAddressCity(e.target.value)}
                                        placeholder="E.g. Los Angeles"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        State / Province
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressState}
                                        onChange={(e) => setAddressState(e.target.value)}
                                        placeholder="E.g. California"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressPostalCode}
                                        onChange={(e) => setAddressPostalCode(e.target.value)}
                                        placeholder="Zip code"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Country
                                    </label>
                                    <select
                                        value={addressCountry}
                                        onChange={(e) => setAddressCountry(e.target.value)}
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-3 outline-none focus:border-black text-black dark:text-white cursor-pointer"
                                    >
                                        <option value="United States">United States</option>
                                        <option value="India">India</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Germany">Germany</option>
                                    </select>
                                </div>

                            </div>

                        </div>

                        {/* Payment pickers */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white flex items-center">
                                <span className="bg-black text-white dark:bg-white dark:text-black w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] mr-2">2</span>
                                Payment Options
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                {/* Credit Card / Stripe */}
                                <div
                                    onClick={() => setPaymentGateway('stripe')}
                                    className={`p-5 border cursor-pointer flex flex-col justify-between transition-all ${paymentGateway === 'stripe'
                                            ? 'border-black dark:border-white bg-gray-50/50 dark:bg-zinc-900/20 shadow-sm'
                                            : 'border-gray-200 dark:border-zinc-805 hover:bg-neutral-50 dark:hover:bg-zinc-900'
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6 text-gray-400 mb-3" />
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Card Payment</h4>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-light">Visa, Master via Stripe</p>
                                    </div>
                                </div>

                                {/* Razorpay */}
                                <div
                                    onClick={() => setPaymentGateway('razorpay')}
                                    className={`p-5 border cursor-pointer flex flex-col justify-between transition-all ${paymentGateway === 'razorpay'
                                            ? 'border-black dark:border-white bg-gray-50/50 dark:bg-zinc-900/20 shadow-sm'
                                            : 'border-gray-200 dark:border-zinc-805 hover:bg-neutral-50 dark:hover:bg-zinc-900'
                                        }`}
                                >
                                    <span className="text-xs font-bold border border-gray-400 px-1 rounded-sm w-fit text-gray-650 h-5 flex items-center mb-3">RP</span>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Razorpay</h4>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-light">NetBanking / UPI</p>
                                    </div>
                                </div>

                                {/* Cash on Delivery */}
                                <div
                                    onClick={() => setPaymentGateway('cod')}
                                    className={`p-5 border cursor-pointer flex flex-col justify-between transition-all ${paymentGateway === 'cod'
                                            ? 'border-black dark:border-white bg-gray-50/50 dark:bg-zinc-900/20 shadow-sm'
                                            : 'border-gray-200 dark:border-zinc-805 hover:bg-neutral-50 dark:hover:bg-zinc-900'
                                        }`}
                                >
                                    <Shield className="w-6 h-6 text-gray-400 mb-3" />
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">COD</h4>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-light">Cash on Delivery</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Checkouts triggers */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-4.5 text-xs font-bold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>VERIFYING PAYMENT...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>PAY AND SUBMIT ORDER (${totalPrice.toFixed(2)})</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                    {/* RIGHT: Order Details panel summary */}
                    <div className="lg:col-span-5 bg-gray-50/50 dark:bg-zinc-950/40 p-6 border border-gray-100 dark:border-zinc-900 space-y-6">

                        <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white border-b border-gray-100 dark:border-zinc-900 pb-3">
                            Items Ordered
                        </h3>

                        {/* Cart Items view list */}
                        <div className="divide-y divide-gray-100 dark:divide-zinc-900 max-h-60 overflow-y-auto">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="py-3.5 flex items-center justify-between first:pt-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-12 bg-gray-50 dark:bg-zinc-900 overflow-hidden relative border border-gray-100 dark:border-zinc-800">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white line-clamp-1 max-w-[150px]">{item.name}</h4>
                                            <p className="text-[9px] text-gray-400 block mt-0.5">
                                                QTY: {item.quantity} {item.size ? `/ SIZE: ${item.size}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-black dark:text-white">
                                        ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Cost Breakdowns */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 space-y-3.5 text-xs">

                            <div className="flex justify-between items-center text-gray-500">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-semibold text-black dark:text-white">${itemsPrice.toFixed(2)}</span>
                            </div>

                            {discountPrice > 0 && (
                                <div className="flex justify-between items-center text-red-500">
                                    <span className="font-medium">Promo Discount</span>
                                    <span className="font-bold">-${discountPrice.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-gray-500">
                                <span className="font-medium">Sales Tax</span>
                                <span className="font-semibold text-black dark:text-white">${taxPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-gray-500 pb-3 border-b border-gray-100 dark:border-zinc-900">
                                <span className="font-medium">Shipping Cost</span>
                                <span className="font-semibold text-black dark:text-white">
                                    {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm font-semibold tracking-wider pt-1 pb-3">
                                <span className="uppercase text-black dark:text-white">Total Amount</span>
                                <span className="text-base font-bold text-black dark:text-white">${totalPrice.toFixed(2)}</span>
                            </div>

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
