'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mic, MicOff, Search, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Voice Search states
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    // Setup Web Speech API for voice search
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false;
                rec.interimResults = false;
                rec.lang = 'en-US';

                rec.onstart = () => setIsListening(true);
                rec.onend = () => setIsListening(false);
                rec.onerror = () => setIsListening(false);

                rec.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setQuery(transcript);
                    triggerRealtimeSearch(transcript);
                };

                setRecognition(rec);
            }
        }
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            setQuery('');
            setSuggestions([]);
        }
    }, [isOpen]);

    const triggerRealtimeSearch = async (searchTerm: string) => {
        if (searchTerm.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/products?search=${encodeURIComponent(searchTerm)}&pageSize=5`);
            setSuggestions(response.data.products || []);
        } catch (error) {
            console.error('Error fetching search suggestions', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            triggerRealtimeSearch(query);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const startListening = () => {
        if (recognition) {
            try {
                recognition.start();
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('Speech recognition is not supported in this browser. Try Chrome or Safari.');
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onClose();
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        onClose();
        router.push(`/product/${productId}`);
    };

    const popularSearches = ['Trench Coat', 'Organic Cotton', 'Slip Dress', 'Knit Sweater', 'Denim', 'Winter Puffer'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-white dark:bg-black z-50 overflow-y-auto"
                >
                    {/* Top Bar Actions */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-gray-100 dark:border-zinc-900">
                        <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-gray-400">Search Catalog</span>
                        <button
                            onClick={onClose}
                            className="p-1 hover:opacity-75 transition-opacity text-black dark:text-white"
                            aria-label="Close search overlay"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                        {/* Search Input Box */}
                        <form onSubmit={handleSearchSubmit} className="relative border-b-2 border-black dark:border-white pb-3 flex items-center">
                            <Search className="w-6 h-6 text-gray-400 mr-4" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full text-xl sm:text-3xl font-light uppercase tracking-wider bg-transparent outline-none border-none placeholder-gray-300 dark:placeholder-zinc-800 text-black dark:text-white"
                            />

                            <div className="flex items-center space-x-3">
                                {isLoading && <Loader className="w-5 h-5 animate-spin text-gray-400" />}

                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-2 rounded-full transition-colors ${isListening
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-zinc-400'
                                        }`}
                                    title="Voice Search"
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>

                        {isListening && (
                            <p className="text-center text-xs tracking-wider text-red-500 uppercase mt-4 animate-pulse">
                                Listening... speak clearly now.
                            </p>
                        )}

                        {/* Popular Searches */}
                        {query.trim().length === 0 && (
                            <div className="mt-12">
                                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Suggested Searches</h4>
                                <div className="flex flex-wrap gap-2">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setQuery(term);
                                                inputRef.current?.focus();
                                            }}
                                            className="px-4 py-2 border border-gray-100 dark:border-zinc-800 hover:border-black dark:hover:border-white text-xs tracking-wider uppercase transition-colors text-black dark:text-white"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* suggestions container */}
                        {query.trim().length > 0 && suggestions.length > 0 && (
                            <div className="mt-12 divide-y divide-gray-100 dark:divide-zinc-900">
                                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Products Found</h4>
                                {suggestions.map((product) => (
                                    <div
                                        key={product._id}
                                        onClick={() => handleSuggestionClick(product._id)}
                                        className="py-4 flex items-center justify-between cursor-pointer group hover:bg-gray-50 dark:hover:bg-zinc-950 px-2 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-16 bg-gray-50 dark:bg-zinc-900 overflow-hidden relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium uppercase tracking-wider text-black dark:text-white group-hover:underline">
                                                    {product.name}
                                                </h5>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest">{product.brand}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-black dark:text-white">
                                            ${product.price}
                                        </span>
                                    </div>
                                ))}

                                <div className="pt-6 text-center">
                                    <button
                                        onClick={handleSearchSubmit}
                                        className="text-xs tracking-widest uppercase text-black dark:text-white font-bold hover:underline"
                                    >
                                        View all matching results ({suggestions.length})
                                    </button>
                                </div>
                            </div>
                        )}

                        {query.trim().length > 0 && suggestions.length === 0 && !isLoading && (
                            <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-sm">No products matched &quot;{query}&quot;</p>
                                <p className="text-xs mt-2">Try looking for terms like &apos;trench coat&apos;, &apos;dress&apos;, or &apos;sweater&apos;.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
