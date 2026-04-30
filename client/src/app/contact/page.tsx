'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MessageCircle,
    MapPin,
    Phone,
    Mail,
    Send,
    CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        try {
            await apiFetch('/leads/contact', {
                method: 'POST',
                body: formData,
            });
            setStatus('done');
        } catch (err) {
            setStatus('idle');
        }
    }

    return (
        <main className="bg-page min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="type-display mb-4 text-center">Get in touch.</h1>
                    <p className="type-body-lg text-white/50 text-center max-w-2xl mx-auto">
                        Whether you need an inspection, a repair, or just some advice, we're here to help.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-surface border border-border-subtle p-12 rounded-[3rem] shadow-xl shadow-black/5">
                        {status === 'done' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="type-h3 mb-2">Message Sent</h3>
                                <p className="text-secondary text-sm">We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-xs font-bold uppercase tracking-widest text-burgundy"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="premium-label">Your Name</label>
                                        <input
                                            type="text" required
                                            className="premium-input"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Email Address</label>
                                        <input
                                            type="email" required
                                            className="premium-input"
                                            placeholder="name@email.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="premium-label">Phone Number</label>
                                    <input
                                        type="tel" required
                                        className="premium-input"
                                        placeholder="080 1234 5678"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="premium-label">How can we help?</label>
                                    <textarea
                                        required
                                        className="premium-input min-h-[150px] resize-none py-4"
                                        placeholder="Tell us what you need..."
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-burgundy text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-burgundy-dark transition-all"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                    <Send size={14} />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <div className="space-y-12">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-burgundy/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-burgundy" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Our Workshop</h4>
                                    <p className="text-primary font-bold">Ikorodu, Lagos, Nigeria.</p>
                                    <p className="text-sm text-secondary">Visit us for professional repairs and servicing.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-burgundy/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Phone className="text-burgundy" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Call or WhatsApp</h4>
                                    <p className="text-primary font-bold">+234 802 993 3575</p>
                                    <p className="text-sm text-secondary">Available Mon—Sat, 9am—6pm.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-burgundy/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail className="text-burgundy" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">Email Us</h4>
                                    <p className="text-primary font-bold">support@autogaard.com</p>
                                    <p className="text-sm text-secondary">We'll respond within 24 hours.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-16 border-t border-border-subtle">
                            <a
                                href="https://wa.me/2348029933575"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 text-[#25D366] font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
                            >
                                <MessageCircle size={24} />
                                Chat instantly on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
