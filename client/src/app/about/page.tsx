'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Zap, 
    Users, 
    Heart, 
    MessageCircle, 
    Plus, 
    Minus, 
    Send, 
    CheckCircle2, 
    MapPin, 
    Phone, 
    Mail 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

const FAQS = [
    {
        question: "What does Autogaard actually do?",
        answer: "We are your automotive peace-of-mind partners. We help you inspect used cars before you buy, value your current car accurately, and provide professional maintenance and repair services at our workshop in Ikorodu."
    },
    {
        question: "Is your valuation engine accurate for Nigeria?",
        answer: "Yes. Unlike global engines that use US/UK data, our system is trained on local Nigerian market data, taking into account 'Tokunbo' entry dates, Nigerian road conditions, and local resale popularity."
    },
    {
        question: "Where is your workshop located?",
        answer: "Our main workshop is located in Ikorodu, Lagos. We serve clients from across the city who value transparency and professional expertise over 'trial and error' mechanics."
    },
    {
        question: "How do I book an inspection?",
        answer: "You can book directly via our Services Hub or send us a message on WhatsApp. We send a professional to the vehicle's location anywhere in Lagos to perform a high-fidelity check."
    },
    {
        question: "Can you help me buy a car from the US?",
        answer: "Yes, we provide purchase support for foreign used vehicles (Tokunbo). We handle the verification and inspection process to ensure you don't buy a 'salvage' or flooded car."
    }
];

export default function AboutPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
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

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="type-display mb-6">Removing Friction.</h1>
                        <p className="type-body-lg text-white/50 max-w-2xl mx-auto">
                            Autogaard was founded in 2023 to bridge the gap between people and their cars 
                            in the challenging Nigerian market.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-surface border-y border-border-subtle">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Zap className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Avoid Mistakes</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                We help you see hidden defects in used cars before you pay a single Naira.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Users className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Relatable Advice</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                No institutional jargon, just honest advice from real experts who know Nigeria.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Heart className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Pure Confidence</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                We stay with you through every stage, from inspection to professional maintenance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="type-h2 mb-4">Common Questions.</h2>
                        <p className="text-muted text-sm">Everything you need to know about AutoGaard intelligence.</p>
                    </div>
                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => (
                            <div key={idx} className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-page transition-colors"
                                >
                                    <span className="font-bold text-primary text-sm">{faq.question}</span>
                                    {openIndex === idx ? <Minus size={18} className="text-burgundy" /> : <Plus size={18} className="text-muted" />}
                                </button>
                                <AnimatePresence>
                                    {openIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-8 pb-8"
                                        >
                                            <p className="text-secondary text-[11px] leading-relaxed italic">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-6 bg-cinema text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="type-h2 mb-6">Expert Consultation.</h2>
                            <p className="text-white/50 mb-12 leading-relaxed">
                                Whether you need an inspection, a repair, or just some advice, our advisors are here to help.
                            </p>
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-burgundy shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Workshop</p>
                                        <p className="font-bold">Ikorodu, Lagos, Nigeria</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-burgundy shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp</p>
                                        <p className="font-bold">+234 802 993 3575</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                            {status === 'done' ? (
                                <div className="text-center py-12">
                                    <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-6" />
                                    <h3 className="type-h3">Inquiry Sent.</h3>
                                    <p className="text-white/60 text-xs mt-2">We'll respond within 24 hours.</p>
                                    <button onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black uppercase tracking-widest text-burgundy underline">Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-burgundy transition-all"
                                            placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-burgundy transition-all"
                                            placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-burgundy transition-all"
                                        placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-burgundy transition-all min-h-[120px]"
                                        placeholder="Tell us about your vehicle needs..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                                    />
                                    <button 
                                        type="submit" disabled={status === 'loading'}
                                        className="w-full bg-white text-cinema py-5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-burgundy hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {status === 'loading' ? 'Sending...' : <><Send size={16} /> Request Brief</>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
