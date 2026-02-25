'use client';

<<<<<<< HEAD
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Target, Layers, Cpu, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import MotionBackground from '@/components/landing/MotionBackground';
import PillHeader from '@/components/landing/PillHeader';
import FeatureCard from '@/components/landing/FeatureCard';
import AILoader from '@/components/landing/AILoader';

export default function Home() {
    const [headlineIndex, setHeadlineIndex] = React.useState(0);
    const headlines = ["VALUATIONS", "LIQUIDITY", "AUCTIONS"];
    const subtexts = ["IN 60 SECONDS.", "IN 60 SECONDS.", "IN REAL-TIME."];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setHeadlineIndex((prev) => (prev + 1) % headlines.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [headlines.length]);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden">
            <MotionBackground />
            <PillHeader />

            {/* Hero Section - Product First */}
            <section
                className="relative pt-32 pb-20 md:pt-60 md:pb-40 px-6 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://res.cloudinary.com/dt6n4pnjb/image/upload/v1771840184/modern-background-with-white-round-lines_wuz5nm.jpg')` }}
            >
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>

                <div className="max-w-screen-xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full bg-slate-900/5 text-slate-900 text-[10px] font-bold tracking-widest uppercase mb-8 border border-slate-900/10">
                            The Next Evolution of Car Commerce
                        </span>

                        <div className="relative h-[120px] md:h-[240px] flex items-center justify-center overflow-hidden mb-8">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={headlineIndex}
                                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-[2.75rem] md:text-[7.5rem] font-extrabold tracking-tighter leading-[0.9] text-slate-900 absolute"
                                >
                                    {headlines[headlineIndex]} <br />
                                    <span className="text-slate-400">{subtexts[headlineIndex]}</span>
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        <p className="relative z-10 max-w-xl mx-auto text-base md:text-xl text-slate-500 font-body leading-relaxed mb-12">
                            Autogaard leverages deep-learning AI to provide forensic-level valuations. No calls. No friction. Just precise liquidity.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link href="/valuation" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-full font-subheading font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center group shadow-2xl shadow-slate-900/20 active:scale-95">
                                Get Instant Value <Zap className="ml-2 group-hover:scale-110 transition-transform fill-current" size={20} />
                            </Link>
                            <Link href="/vehicles" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-full font-subheading font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center group active:scale-95">
                                Browse Marketplace <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Minimalist Tech Preview Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-20 md:mt-32 max-w-4xl mx-auto rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden hidden md:block"
                    >
                        <div className="p-3 border-b border-slate-100/50 flex items-center gap-2 px-8">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                            </div>
                            <div className="mx-auto text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Engine Performance v2.0</div>
                        </div>
                        <div className="p-12 flex items-center justify-between gap-12 text-left">
                            <div className="space-y-6 flex-1">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-burgundy uppercase tracking-widest flex items-center gap-2">
                                        Processing <AILoader />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">Nigeria Localized Dataset</div>
                                </div>
                                <div className="bg-slate-900/5 p-4 rounded-2xl border border-slate-900/5 font-mono text-[10px] text-slate-400 leading-relaxed">
                                    {`ValuationAnalysis({ 
  vin: "JH23...92",
  market_delta: 1.04,
  liquidity_rating: "A+"
})`}
                                </div>
                            </div>
                            <div className="w-px h-24 bg-slate-100" />
                            <div className="flex-1 text-center">
                                <div className="text-5xl font-heading font-extrabold text-slate-900 mb-1 tracking-tighter">98.4%</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Valuation Accuracy</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Product Narrative - Minimalist Grid */}
            <section className="py-24 md:py-40 px-6">
                <div className="max-w-screen-xl mx-auto">
                    <motion.div
                        {...fadeInUp}
                        className="mb-16 md:mb-24 max-w-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
                            The first automotive <br />
                            <span className="text-slate-400">operating system.</span>
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed font-body">
                            We didn't build just another classifieds site. We built a high-frequency engine that handles the forensic, financial, and legal friction of trading vehicles.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        <FeatureCard
                            title="Escrow Protocol"
                            description="Your funds remain locked in your digital wallet until you approve the inspection. Zero-risk transactions between verified users."
                            icon={<ShieldCheck size={28} />}
                        />
                        <FeatureCard
                            title="Real-Time Bidding"
                            description="Low-latency auction engine. Bid and monitor in real-time with automated anti-snipe protection and market transparency."
                            icon={<Target size={28} />}
                        />
                        <FeatureCard
                            title="5% Margin Flat"
                            description="Transparent pricing. No hidden charges, no middleman markup. We only win when you successfully trade your asset."
                            icon={<Layers size={28} />}
                        />
=======
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import VehicleCard from '@/components/VehicleCard';
import { ArrowRight, Zap, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
    const [liveVehicles, setLiveVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [headlineIndex, setHeadlineIndex] = useState(0);
    const headlines = ["SMARTER.", "FASTER.", "SAFER.", "TOGETHER."];

    useEffect(() => {
        async function fetchLive() {
            try {
                const response = await apiFetch('/vehicles?status=in_auction');
                setLiveVehicles(response.data.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchLive();

        const timer = setInterval(() => {
            setHeadlineIndex((prev) => (prev + 1) % headlines.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-surface text-content-primary overflow-x-hidden selection:bg-burgundy selection:text-white pb-0">

            {/* MINIMALIST HERO SECTION (16:9 FULL SCREEN) */}
            <section className="relative w-full h-[calc(100dvh-4rem)] min-h-[600px] flex flex-col justify-between pt-10 md:pt-16 bg-surface-50 overflow-hidden">
                {/* Background Vector / Illustration */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none translate-y-[10vh] md:translate-y-0 scale-150 md:scale-100 origin-bottom md:origin-center mix-blend-multiply">
                    <Image
                        src="/hero-vector.png"
                        alt="Background Vector"
                        fill
                        className="object-contain md:object-right-bottom object-bottom max-w-[1200px] ml-auto mr-auto lg:mr-0 opacity-90 drop-shadow-xl"
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface-50 to-transparent" />
                </div>

                {/* Hero Content - Top Left aligned for minimalism */}
                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-10 md:pt-[10dvh] flex flex-col items-center md:items-start text-center md:text-left h-full">

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-[3.5rem] leading-[1] md:text-[6rem] lg:text-[7.5rem] font-heading font-extrabold tracking-tighter text-content-primary">
                            BUY&DRIVE <br />
                            <span className="inline-flex relative min-h-[60px] md:min-h-[140px] items-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={headlines[headlineIndex]}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="text-burgundy absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 whitespace-nowrap drop-shadow-sm"
                                    >
                                        {headlines[headlineIndex]}
                                    </motion.span>
                                </AnimatePresence>
                                <span className="invisible pointer-events-none">TOGETHER.</span>
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-6 md:mt-8 text-lg md:text-2xl text-content-secondary max-w-xl font-body leading-relaxed md:bg-white/40 md:p-4 rounded-2xl md:backdrop-blur-sm"
                    >
                        Experience Nigeria&apos;s clean, transparent vehicle marketplace. Fair valuations, forensic checks, zero noise.
                    </motion.p>
                </div>

                {/* Bottom Floating Dashboard/Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative z-20 w-full max-w-[1600px] mx-auto px-6 pb-8 md:pb-12"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-surface-200 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-6 w-[95%] md:w-fit ml-auto mr-auto md:ml-0 md:mr-0 min-w-0 md:min-w-[600px]">
                        <div className="flex gap-8 md:gap-12 w-full md:w-auto px-2 md:px-4">
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-content-muted">Find Your Next Asset</label>
                                <p className="text-base md:text-lg font-bold text-content-primary">Browse Inventory</p>
                            </div>
                            <div className="space-y-1 border-l border-surface-200 pl-8 hidden lg:block">
                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-content-muted">Market Action</label>
                                <p className="text-base md:text-lg font-bold text-content-primary">Live Auctions Active</p>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Link href="/vehicles" className="flex-1 md:flex-none btn-primary shadow-xl shadow-burgundy/10 hover:-translate-y-1 group flex items-center justify-center whitespace-nowrap">
                                Explore <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                            <Link href="/valuation" className="bg-surface-50 border border-surface-200 hover:bg-surface-100 text-burgundy p-4 rounded-xl transition-all w-14 flex items-center justify-center flex-shrink-0 group">
                                <Zap size={20} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* TRUST SECTION - Minimalist Grids */}
            <section className="py-24 md:py-32 bg-white flex justify-center border-t border-surface-100">
                <div className="max-w-[1400px] w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                    <div className="text-center md:text-left p-6 md:p-0">
                        <div className="bg-surface-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm border border-surface-100">
                            <ShieldCheck size={28} className="text-burgundy" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading text-content-primary tracking-tight">Forensic Audits</h3>
                        <p className="text-content-secondary leading-relaxed font-body">No guesswork. Every listing undergoes a 250-point engineering assessment verified by local experts.</p>
                    </div>
                    <div className="text-center md:text-left p-6 md:p-0">
                        <div className="bg-surface-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm border border-surface-100">
                            <Zap size={28} className="text-burgundy" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading text-content-primary tracking-tight">AI Valuation</h3>
                        <p className="text-content-secondary leading-relaxed font-body">Instantly access fair-market valuations based on real-time local data, protecting you from inflated prices.</p>
                    </div>
                    <div className="text-center md:text-left p-6 md:p-0">
                        <div className="bg-surface-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm border border-surface-100">
                            <CheckCircle2 size={28} className="text-burgundy" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading text-content-primary tracking-tight">Zero Tolerance</h3>
                        <p className="text-content-secondary leading-relaxed font-body">Scam-free escrow payments. Funds are securely locked in your digital wallet until terms are fulfilled.</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* The Edge Section */}
            <section className="py-24 md:py-40 px-6 overflow-hidden">
                <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <motion.div {...fadeInUp} className="flex-1 space-y-10">
                        <h2 className="text-3xl md:text-6xl font-heading font-extrabold tracking-tighter text-slate-900 leading-[1]">
                            How we surpass <br />
                            <span className="text-slate-400">the legacy market.</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                { title: 'AI Forensic Valuation', desc: 'Precise automated pricing based on local inventory data benchmarks.', icon: Cpu },
                                { title: 'Liquidity Rankings', desc: 'Know exactly how fast your car will sell before you even list it.', icon: TrendingUp },
                                { title: 'Forensic Audits', desc: 'Every vehicle in our catalog passes a 250-point engineering assessment.', icon: BarChart3 }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-10 h-10 rounded-full bg-burgundy/5 flex items-center justify-center text-burgundy flex-shrink-0 mt-1 group-hover:bg-burgundy group-hover:text-white transition-all duration-300">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-heading font-bold text-slate-900 text-xl mb-1 tracking-tight">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed font-body">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex-1 w-full"
                    >
                        <div className="bg-slate-900 p-10 md:p-20 rounded-[3rem] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:rotate-12">
                                <ShieldCheck size={280} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-burgundy-light font-bold tracking-[0.2em] uppercase text-[10px] mb-6 block">Security Protocol</span>
                                <h3 className="text-3xl md:text-5xl font-heading font-extrabold mb-8 tracking-tighter leading-tight">Trade with total <br />autonomy.</h3>
                                <p className="text-slate-400 mb-12 leading-relaxed max-w-sm font-body text-base">
                                    Your identity and funds are protected by bank-grade encryption and KYC verification. We build the trust so you can build your fleet.
                                </p>
                                <Link href="/register" className="inline-flex items-center text-white font-bold group text-lg">
                                    Start Verification <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 md:py-60 px-6 text-center">
                <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-[9rem] font-heading font-extrabold tracking-tighter text-slate-900 mb-12 leading-[0.8] mix-blend-multiply opacity-10">
                        OWN YOUR MARKET.
                    </h2>
                    <h2 className="text-4xl md:text-7xl font-heading font-extrabold tracking-tighter text-slate-900 mb-12 leading-tight">
                        Experience the <br />Future of Trading.
                    </h2>
                    <Link href="/register" className="bg-burgundy text-white px-14 py-6 rounded-full font-subheading font-bold text-xl hover:bg-burgundy-light transition-all hover:scale-105 inline-flex items-center shadow-2xl shadow-burgundy/30 active:scale-95">
                        Create Free Account <ArrowRight className="ml-3" size={24} />
                    </Link>
                    <p className="mt-10 text-slate-400 text-sm font-subheading font-bold tracking-widest uppercase">No monthly fees. 5% flat commission.</p>
                </motion.div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-12 px-6 border-t border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6 max-w-screen-xl mx-auto">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">© 2026 Autogaard — Nigeria&apos;s AI Automotive OS</p>
                <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
                    <Link href="/contact" className="hover:text-slate-900 transition-colors">Support</Link>
                </div>
            </footer>
        </main>
    );
}

=======
            {/* LIVE AUCTIONS */}
            <section className="py-24 md:py-40 bg-surface-50 border-t border-surface-100">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-widest text-burgundy block mb-4">Discover Deals</span>
                            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-content-primary tracking-tighter">Active Auctions.</h2>
                        </div>
                        <Link href="/vehicles?status=in_auction" className="text-burgundy font-bold hover:text-burgundy-light transition-colors flex items-center group uppercase tracking-widest text-sm">
                            View all items <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-[4/3] bg-surface-100 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {liveVehicles.map((v: any) => (
                                    <VehicleCard key={v.id} vehicle={v} />
                                ))}
                                {liveVehicles.length === 0 && (
                                    <div className="col-span-full py-24 text-center border-2 border-dashed border-surface-200 rounded-[2rem] bg-white">
                                        <p className="text-content-secondary text-lg font-bold">No active auctions at the moment.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="py-32 md:py-48 bg-white border-t border-surface-100 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-surface-50 w-full rounded-[100%] scale-[2] translate-y-[80%] opacity-50" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 text-content-primary">Start your journey.</h2>
                    <p className="text-lg md:text-xl text-content-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-body">Join thousands of verified buyers and sellers experiencing the ultimate automotive trading platform.</p>
                    <Link href="/register" className="btn-primary inline-flex items-center text-lg px-10 py-5 shadow-2xl shadow-burgundy/20 hover:scale-105">
                        Create Free Account <ArrowRight size={20} className="ml-3" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
