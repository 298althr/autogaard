'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, Heart, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
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

            {/* The Mission */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="type-h2 mb-6">Why we exist.</h2>
                            <p className="text-secondary leading-relaxed mb-6">
                                For most Nigerians, a car is the second most expensive asset they will ever buy. 
                                Yet, the market is filled with hidden defects, fake documentation, and unreliable mechanics.
                            </p>
                            <p className="text-secondary leading-relaxed">
                                We believe car ownership should be a source of pride, not stress. 
                                Our mission is to promote maintenance awareness and help every Nigerian 
                                drive with absolute peace of mind.
                            </p>
                        </div>
                        <div className="bg-surface border border-border-subtle p-12 rounded-[3rem] relative">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-burgundy/5 rounded-full flex items-center justify-center">
                                <ShieldCheck size={48} className="text-burgundy" />
                            </div>
                            <h3 className="type-h3 mb-4">Founded 2023</h3>
                            <p className="text-sm text-muted italic">
                                "Our goal isn't just to fix cars; it's to fix the relationship between people and their vehicles."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 bg-surface border-y border-border-subtle">
                <div className="max-w-7xl mx-auto">
                    <h2 className="type-h2 text-center mb-16">The Autogaard Way.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Zap className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Avoid Costly Mistakes</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                We help you see the hidden defects in used cars before you pay a single Naira.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Users className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Human & Relatable</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                We speak your language. No institutional jargon, just honest advice from real experts.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <Heart className="text-burgundy" size={28} />
                            </div>
                            <h3 className="type-h3 mb-4">Drive with Confidence</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                We stay with you through every stage of ownership, from inspection to maintenance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-cinema text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <h2 className="type-h2 mb-4">Based in Ikorodu, Lagos.</h2>
                    <p className="text-white/50 mb-10">Serving car owners across Lagos and Nigeria with transparency.</p>
                    <a 
                        href="https://wa.me/2348029933575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <MessageCircle size={20} />
                        Get in Touch on WhatsApp
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
