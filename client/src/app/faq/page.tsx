'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    },
    {
        question: "Why should I trust Autogaard?",
        answer: "Since 2023, we've helped hundreds of Nigerians avoid buying 'lemons'. Our business is built on transparency—we give you the raw facts about your car, even if it's bad news."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="bg-page min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-24 px-6 bg-cinema text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="type-display mb-4">Common Questions.</h1>
                    <p className="type-body-lg text-white/50">
                        Everything you need to know about our services and how we work.
                    </p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div 
                            key={idx}
                            className="bg-surface border border-border-subtle rounded-3xl overflow-hidden"
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-page transition-colors"
                            >
                                <span className="font-bold text-primary">{faq.question}</span>
                                {openIndex === idx ? <Minus size={20} className="text-burgundy" /> : <Plus size={20} className="text-muted" />}
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-8 pb-8"
                                    >
                                        <p className="text-secondary text-sm leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-24 px-6 text-center">
                <p className="text-muted text-xs font-bold uppercase tracking-widest mb-6">Still have questions?</p>
                <a 
                    href="https://wa.me/2348029933575"
                    className="inline-flex items-center gap-3 text-[#25D366] font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    <MessageCircle size={20} />
                    Chat with an Advisor
                </a>
            </section>

            <Footer />
        </main>
    );
}
