'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateProfile, logout } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { handleApiError } from '@/utils/api';
import { User, MapPin, Key, Plus, Trash2, Check, Loader, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    // Form Basic Info state
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

    // Address books state
    const [addressBook, setAddressBook] = useState<any[]>([]);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // New Address Form state
    const [showAddAddrForm, setShowAddAddrForm] = useState(false);
    const [newAddrName, setNewAddrName] = useState('');
    const [newAddrPhone, setNewAddrPhone] = useState('');
    const [newAddrStreet, setNewAddrStreet] = useState('');
    const [newAddrCity, setNewAddrCity] = useState('');
    const [newAddrState, setNewAddrState] = useState('');
    const [newAddrPostal, setNewAddrPostal] = useState('');
    const [newAddrCountry, setNewAddrCountry] = useState('United States');
    const [newAddrDefault, setNewAddrDefault] = useState(true);
    const [isAddingAddr, setIsAddingAddr] = useState(false);

    // Load profile addresses
    const loadUserProfileDetails = async () => {
        try {
            const response = await api.get('/users/profile');
            setAddressBook(response.data.addressBook || []);
        } catch (err) {
            console.warn('API Profile lookups failed. Defaulting to empty address book.');
            setAddressBook([]);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    useEffect(() => {
        if (!userInfo) {
            toast.error('Please login to view your profile.');
            router.push('/login?redirect=profile');
            return;
        }
        loadUserProfileDetails();
    }, [userInfo, router]);

    const handleUpdateBasicInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsUpdatingInfo(true);
        try {
            const response = await api.put('/users/profile', {
                name,
                email,
                password: password || undefined
            });

            dispatch(updateProfile(response.data));
            toast.success('Basic profile updated successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsUpdatingInfo(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddrName || !newAddrPhone || !newAddrStreet || !newAddrCity || !newAddrState || !newAddrPostal) {
            toast.error('Please complete all address details.');
            return;
        }

        setIsAddingAddr(true);
        try {
            const newAddressPayload = {
                name: newAddrName,
                phone: newAddrPhone,
                street: newAddrStreet,
                city: newAddrCity,
                state: newAddrState,
                postalCode: newAddrPostal,
                country: newAddrCountry,
                isDefault: newAddrDefault
            };

            const response = await api.post('/users/address', newAddressPayload);

            // Update local address state
            setAddressBook(response.data.addressBook || []);

            // Clear forms
            setNewAddrName('');
            setNewAddrPhone('');
            setNewAddrStreet('');
            setNewAddrCity('');
            setNewAddrState('');
            setNewAddrPostal('');
            setNewAddrDefault(true);
            setShowAddAddrForm(false);
            toast.success('Address destination added!');
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setIsAddingAddr(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const response = await api.delete(`/users/address/${addressId}`);
            setAddressBook(response.data.addressBook || []);
            toast.success('Address removed');
        } catch (err: any) {
            toast.error(handleApiError(err));
        }
    };

    const handleSetDefaultAddress = async (addressId: string) => {
        try {
            const response = await api.put(`/users/address/${addressId}/default`);
            setAddressBook(response.data.addressBook || []);
            toast.success('Default address updated');
        } catch (err: any) {
            toast.error(handleApiError(err));
        }
    };

    const handleLogoutClick = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">

                {/* Header */}
                <div className="border-b border-gray-150 dark:border-zinc-900 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-light uppercase tracking-widest text-gray-500 block mb-1">My Dashboard</h1>
                        <h2 className="text-3xl font-light tracking-wide uppercase text-black dark:text-white">
                            Veloura Profile Settings
                        </h2>
                    </div>

                    <button
                        onClick={handleLogoutClick}
                        className="inline-flex items-center space-x-2 text-xs tracking-widest uppercase font-bold text-red-500 border border-red-500/20 px-4 py-2 bg-red-50/5 hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors mt-4 sm:mt-0"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: Info updates */}
                    <div className="lg:col-span-5 space-y-10">

                        <div className="bg-gray-50/50 dark:bg-zinc-950/40 p-8 border border-gray-100 dark:border-zinc-900">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white mb-6 flex items-center">
                                <User className="w-4.5 h-4.5 mr-2 stroke-[1.8]" />
                                Security & Account Info
                            </h3>

                            <form onSubmit={handleUpdateBasicInfo} className="space-y-4">

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full text-xs border border-gray-205 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full text-xs border border-gray-205 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        New Password (Leave blank to keep same)
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimal 6 characters"
                                        className="w-full text-xs border border-gray-205 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Verify password"
                                        className="w-full text-xs border border-gray-205 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingInfo}
                                        className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-90 flex items-center justify-center space-x-2"
                                    >
                                        {isUpdatingInfo ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                <span>UPDATING INFO...</span>
                                            </>
                                        ) : (
                                            <span>UPDATE ACCOUNT</span>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>

                    {/* RIGHT: Address book cards list */}
                    <div className="lg:col-span-7 space-y-8">

                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-900">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white flex items-center">
                                <MapPin className="w-4.5 h-4.5 mr-2 stroke-[1.8]" />
                                Address Book ({addressBook.length})
                            </h3>
                            <button
                                onClick={() => setShowAddAddrForm(!showAddAddrForm)}
                                className="inline-flex items-center space-x-1.5 text-xs tracking-widest uppercase font-bold text-black dark:text-white hover:opacity-70 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Destination</span>
                            </button>
                        </div>

                        {/* Form to add address */}
                        {showAddAddrForm && (
                            <form onSubmit={handleAddAddress} className="p-6 border border-gray-200 dark:border-zinc-850 bg-gray-50/20 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">New Address Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-505 font-bold block mb-1">Display Name</label>
                                        <input type="text" required value={newAddrName} onChange={(e) => setNewAddrName(e.target.value)} placeholder="E.g. Home, Work" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-550 font-bold block mb-1">Address Phone</label>
                                        <input type="tel" required value={newAddrPhone} onChange={(e) => setNewAddrPhone(e.target.value)} placeholder="E.g. +1 555-900" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">Street Address</label>
                                        <input type="text" required value={newAddrStreet} onChange={(e) => setNewAddrStreet(e.target.value)} placeholder="Street number & name" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">City</label>
                                        <input type="text" required value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} placeholder="City" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">State / Region</label>
                                        <input type="text" required value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} placeholder="State" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">Postal Code</label>
                                        <input type="text" required value={newAddrPostal} onChange={(e) => setNewAddrPostal(e.target.value)} placeholder="Zip code" className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">Country</label>
                                        <input type="text" required value={newAddrCountry} onChange={(e) => setNewAddrCountry(e.target.value)} className="w-[100%] text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white" />
                                    </div>

                                    <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="set_default"
                                            checked={newAddrDefault}
                                            onChange={(e) => setNewAddrDefault(e.target.checked)}
                                            className="rounded border-gray-300 accent-black w-4 h-4"
                                        />
                                        <label htmlFor="set_default" className="text-xs uppercase tracking-wider text-gray-500 font-medium cursor-pointer">
                                            Configure as primary default destination
                                        </label>
                                    </div>

                                </div>

                                <div className="flex space-x-3 pt-3">
                                    <button
                                        type="submit"
                                        disabled={isAddingAddr}
                                        className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center"
                                    >
                                        {isAddingAddr ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                                        <span>Save Address</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddAddrForm(false)}
                                        className="border border-gray-200 hover:bg-neutral-50 px-6 py-3 text-xs font-bold tracking-widest uppercase text-black"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        )}

                        {isLoadingProfile ? (
                            <div className="h-[20vh] flex flex-col justify-center items-center text-gray-400">
                                <Loader className="w-6 h-6 animate-spin text-black dark:text-white mb-2" />
                                <span className="text-[10px] uppercase tracking-widest">Loading addresses...</span>
                            </div>
                        ) : addressBook.length === 0 ? (
                            <div className="text-center py-12 border border-dotted border-gray-200 p-6 bg-gray-50/20">
                                <p className="text-xs text-gray-550 dark:text-gray-400 uppercase tracking-widest font-light">No saved shipping addresses found.</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-light">Add address layouts to speed up checking out.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {addressBook.map((addr) => (
                                    <div
                                        key={addr._id}
                                        className="p-5 border border-gray-150 dark:border-zinc-850 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center text-xs font-bold text-black dark:text-white mb-3">
                                                <span className="uppercase">{addr.name}</span>
                                                {addr.isDefault && (
                                                    <span className="inline-flex items-center text-[9px] bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-bold px-2 py-0.5 uppercase tracking-wide">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Primary Default
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-[11px] text-gray-500 dark:text-gray-405 leading-relaxed font-light">
                                                {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pt-5 mt-4 border-t border-gray-50 dark:border-zinc-900">
                                            <span className="text-[10px] text-gray-400 font-medium">{addr.phone}</span>

                                            <div className="flex space-x-3 text-xs">
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefaultAddress(addr._id)}
                                                        className="text-gray-400 hover:text-black dark:hover:text-white uppercase font-bold text-[9px] tracking-wider"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAddress(addr._id)}
                                                    className="text-red-500 hover:text-red-750 flex items-center"
                                                    title="Delete address"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
