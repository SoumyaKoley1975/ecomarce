'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Clock, Phone, MapPin, Loader, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            toast.error('Please fill out all fields.');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Your message has been received! Our support representatives will contact you shortly.');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        }, 1200);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">

                {/* Title */}
                <div className="text-center max-w-xl mx-auto mb-16">
                    <span className="text-[10px] tracking-[0.3em] font-semibold text-gray-400 uppercase font-bold">Get In Touch</span>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-wide uppercase mt-2">Contact Veloura</h1>
                    <p className="text-xs text-gray-500 font-light mt-3 leading-relaxed">
                        Have questions about collection sizing, returns processing, or design fabrics? Drop us a line. We are here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT: Info columns */}
                    <div className="lg:col-span-5 space-y-8">
                        <h2 className="text-xl font-light uppercase tracking-widest border-b border-gray-100 dark:border-zinc-900 pb-3">
                            Veloura Studio
                        </h2>

                        <div className="space-y-6">

                            {/* Address */}
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Studio Office</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-450 mt-1 font-light leading-relaxed">
                                        100 Fashion Avenue, Suite 500<br />
                                        New York, NY 10001
                                    </p>
                                </div>
                            </div>

                            {/* Call */}
                            <div className="flex items-start space-x-4">
                                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Direct Line</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-450 mt-1 font-light leading-relaxed">
                                        Customer Care: +1 (800) VEL-OURA<br />
                                        Whale / Press: +1 (800) 555-0190
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start space-x-4">
                                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white font-bold">Electronic Mail</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-450 mt-1 font-light leading-relaxed">
                                        Customer Care: Support@veloura.com<br />
                                        General: Studio@veloura.com
                                    </p>
                                </div>
                            </div>

                            {/* Clock */}
                            <div className="flex items-start space-x-4">
                                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">Operation Hours</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-455 mt-1 font-light leading-relaxed">
                                        Monday - Friday: 9am - 6pm EST<br />
                                        Saturday: 10am - 4pm EST<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT: Contact Submit Form */}
                    <div className="lg:col-span-7 bg-gray-50/50 dark:bg-zinc-950/40 p-8 sm:p-10 border border-gray-100 dark:border-zinc-900">
                        <h2 className="text-xl font-light uppercase tracking-widest text-black dark:text-white mb-6">
                            Send Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
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
                                        placeholder="name@example.com"
                                        className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="How can we assist you?"
                                    className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] tracking-wider uppercase text-gray-500 font-bold block mb-1">
                                    Message Details
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us more about your questions..."
                                    className="w-full text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-3.5 py-2.5 outline-none focus:border-black text-black dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 py-4 text-xs font-semibold tracking-widest uppercase transition-opacity flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>TRANSMITTING MESSAGE...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>SEND MESSAGE</span>
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
