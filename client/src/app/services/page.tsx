'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Search,
    ShieldCheck,
    FileText,
    Zap,
    Paintbrush,
    Truck,
    ArrowRight,
    MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_GROUPS = [
    {
        title: 'Buying & Selling Support',
        slug: 'buying-selling',
        icon: Search,
        description: 'Expert guidance to ensure you make the right moves in the market.',
        features: ['Smart Selection', 'Fair Value Analysis', 'Sales Concierge'],
        color: 'from-blue-500/20 to-indigo-500/20',
    },
    {
        title: 'Health & Safety Inspections',
        slug: 'inspections',
        icon: ShieldCheck,
        description: 'Knowing exactly what’s happening under the hood with expert diagnostics.',
        features: ['Engine Health Scan', '120-Point Audit', 'History Checks'],
        color: 'from-emerald-500/20 to-teal-500/20',
    },
    {
        title: 'Paperwork & Compliance',
        slug: 'paperwork',
        icon: FileText,
        description: 'Staying legal and road-ready without the stress of bureaucracy.',
        features: ['Registration Renewals', 'Roadworthiness', 'Police Registry'],
        color: 'from-amber-500/20 to-orange-500/20',
    },
    {
        title: 'Efficiency & Technology',
        slug: 'technology',
        icon: Zap,
        description: 'Upgrading your driving experience for the modern age with smart tech.',
        features: ['CNG Conversions', 'AC Optimization', 'Security Tech'],
        color: 'from-cyan-500/20 to-blue-500/20',
    },
    {
        title: 'Professional Restoration',
        slug: 'restoration',
        icon: Paintbrush,
        description: 'Keeping your vehicle looking and feeling factory-fresh with elite care.',
        features: ['Master Repainting', 'Ceramic Protection', 'Deep Detailing'],
        color: 'from-purple-500/20 to-pink-500/20',
    },
    {
        title: 'Logistics & Protection',
        slug: 'logistics',
        icon: Truck,
        description: 'Moving and protecting your assets with care across Nigeria.',
        features: ['Port Clearing', 'Secured Transport', 'Comprehensive Insurance'],
        color: 'from-rose-500/20 to-burgundy-500/20',
    },
];

export default function ServicesHub() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Simplified reveal that doesn't rely on complex scroll triggers for visibility
        // Ensuring all cards are 100% visible after the initial load
        gsap.from('.service-card', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power4.out',
            clearProps: 'all' // Crucial: removes all GSAP-applied styles after animation completes
        });
    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="bg-page min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-cinema text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="type-display mb-6">
                            Expert Solutions.<br />
                            <span className="text-white/40">Total Confidence.</span>
                        </h1>
                        <p className="type-body-lg text-white/60 max-w-2xl mx-auto mb-10">
                            We remove the friction between people and their cars. From the first purchase to 
                            daily maintenance and eventual sale, Autogaard is your trusted partner.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 px-6 relative z-20 bg-page">
                <div className="max-w-7xl mx-auto">
                    <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SERVICE_GROUPS.map((group) => (
                            <Link 
                                key={group.slug} 
                                href={`/services/${group.slug}`}
                                className="service-card group block p-10 rounded-[2.5rem] bg-surface border border-border-subtle hover:border-burgundy/40 transition-all duration-500 hover:shadow-2xl hover:shadow-burgundy/5 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-page border border-border-subtle flex items-center justify-center mb-8 group-hover:bg-burgundy group-hover:text-white group-hover:border-burgundy transition-all duration-500">
                                        <group.icon className="text-burgundy group-hover:text-white" size={32} />
                                    </div>
                                    
                                    <h3 className="type-h3 mb-4 text-[#0F172A] group-hover:text-burgundy transition-colors">{group.title}</h3>
                                    <p className="text-[#475569] text-sm leading-relaxed mb-8 h-12 overflow-hidden">
                                        {group.description}
                                    </p>
                                    
                                    <div className="space-y-4 mb-10">
                                        {group.features.map(f => (
                                            <div key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#94A3B8] group-hover:text-[#0F172A] transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-burgundy/30 group-hover:bg-burgundy transition-colors" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-burgundy font-black text-[10px] uppercase tracking-[0.2em]">
                                        Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Strip */}
            <section className="py-24 px-6 bg-cinema text-white border-y border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-burgundy/20 to-transparent opacity-50" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="type-h2 mb-6 text-white">Need immediate assistance?</h2>
                    <p className="text-white/60 mb-12 max-w-2xl mx-auto">
                        Our car advisors are available on WhatsApp to answer your questions 
                        and help you choose the right service for your vehicle's needs.
                    </p>
                    <a
                        href="https://wa.me/2348029933575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-[#25D366] text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#1ea855] transition-all hover:scale-105 shadow-2xl shadow-green-500/20"
                    >
                        <MessageCircle size={24} />
                        Consult with an Expert
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    );
}
