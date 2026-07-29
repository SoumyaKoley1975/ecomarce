'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import {
    ShoppingBag,
    Heart,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    LogOut,
    LayoutDashboard,
    Sun,
    Moon
} from 'lucide-react';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import toast from 'react-hot-toast';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Detect scroll to make navbar compact
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Theme support
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else if (systemPrefersDark) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        toast.success(`${nextTheme === 'light' ? 'Light' : 'Dark'} mode activated`, {
            style: {
                background: nextTheme === 'light' ? '#ffffff' : '#1a1a1a',
                color: nextTheme === 'light' ? '#111111' : '#ffffff',
            }
        });
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        router.push('/');
    };

    const navLinks = [
        { name: 'Men', href: '/collections/men' },
        { name: 'Women', href: '/collections/women' },
        { name: 'Kids', href: '/collections/kids' },
        { name: 'New Arrivals', href: '/collections/new' },
        { name: 'Best Sellers', href: '/collections/best' },
        { name: 'Sale', href: '/collections/sale', className: 'text-red-500 font-medium' },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 py-3'
                    : 'bg-white dark:bg-black border-b border-transparent py-5'
                    }`}
                suppressHydrationWarning
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex-1 flex justify-start">
                            <Link
                                href="/"
                                className="text-2xl font-bold tracking-[0.25em] text-black dark:text-white hover:opacity-85 transition-opacity"
                            >
                                VELOURA
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex space-x-8 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm tracking-widest uppercase transition-colors hover:text-black dark:hover:text-white ${pathname === link.href
                                        ? 'text-black dark:text-white font-semibold border-b border-black dark:border-white pb-1'
                                        : 'text-gray-500 dark:text-gray-400'
                                        } ${link.className || ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Icons Actions */}
                        <div className="flex-1 flex items-center justify-end space-x-6">

                            {/* Search Toggle */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1 hover:opacity-70 text-black dark:text-white transition-opacity"
                                aria-label="Search"
                                suppressHydrationWarning
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-1 hover:opacity-70 text-black dark:text-white transition-opacity hidden sm:block"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </button>

                            {/* Wishlist Link */}
                            <Link
                                href="/wishlist"
                                className="p-1 hover:opacity-70 text-black dark:text-white relative transition-opacity"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* User Dropdown / Login */}
                            <div className="relative group hidden sm:block">
                                {userInfo ? (
                                    <button className="flex items-center space-x-1 p-1 text-black dark:text-white hover:opacity-70 transition-opacity">
                                        <User className="w-5 h-5" />
                                        <span className="text-xs uppercase tracking-wider max-w-[80px] truncate">{userInfo.name.split(' ')[0]}</span>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="p-1 hover:opacity-70 text-black dark:text-white transition-opacity"
                                        aria-label="Account"
                                    >
                                        <User className="w-5 h-5" />
                                    </Link>
                                )}

                                {/* Dropdown Menu on Hover */}
                                {userInfo && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                                        {userInfo.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center space-x-2 px-4 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-2 px-4 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="flex items-center space-x-2 px-4 py-2.5 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Order History</span>
                                        </Link>
                                        <hr className="border-gray-100 dark:border-zinc-800 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cart Drawer Toggle */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-1 hover:opacity-70 text-black dark:text-white relative transition-opacity"
                                aria-label="Cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white dark:bg-white dark:text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </button>

                            {/* Mobile hamburger menu */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-1 hover:opacity-70 text-black dark:text-white transition-opacity md:hidden"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-black w-full border-t border-gray-100 dark:border-zinc-900 transition-all duration-300 px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block text-xs tracking-widest uppercase py-2 border-b border-gray-50 dark:border-zinc-900 text-gray-700 dark:text-gray-300 ${link.className || ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="py-2 flex justify-between items-center">
                            {userInfo ? (
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs uppercase tracking-widest">{userInfo.name}</span>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs uppercase tracking-widest font-semibold flex items-center space-x-2 text-black dark:text-white"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Log in</span>
                                </Link>
                            )}
                            <button
                                onClick={toggleTheme}
                                className="text-xs uppercase tracking-wider border border-gray-200 dark:border-zinc-800 px-3 py-1 flex items-center space-x-1"
                            >
                                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                                <span>Theme</span>
                            </button>
                        </div>
                        {userInfo && (
                            <div className="pt-2 flex flex-col space-y-1">
                                {userInfo.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-xs uppercase tracking-widest text-slate-500 py-1.5"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs uppercase tracking-widest text-slate-500 py-1.5"
                                >
                                    My Profile
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs uppercase tracking-widest text-slate-500 py-1.5"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-xs uppercase tracking-widest text-red-500 text-left py-1.5 flex items-center space-x-1"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Slide-out Cart Panel */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Advanced Instant Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
