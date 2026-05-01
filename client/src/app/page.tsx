'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    MessageCircle,
    ArrowRight,
    ShieldCheck,
    Zap,
    Search,
    FileText,
    Wrench,
    Paintbrush,
    Truck,
    CheckCircle2,
    Star,
    Plus,
} from 'lucide-react';
import Navbar, { navLinks } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';
import { LoadingSpinner } from '@/components/Loading';

gsap.registerPlugin(ScrollTrigger);

// ─── CINEMATIC REVEAL ─────────────────────────────────────────────────────────
function CinematicReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    return (
        <div className="overflow-hidden py-2">
            <motion.span
                initial={{ y: '100%', rotateX: -40, opacity: 0 }}
                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 100, 
                    damping: 20,
                    delay: delay 
                }}
                className={`block will-change-transform ${className ?? ''}`}
            >
                {text}
            </motion.span>
        </div>
    );
}

// ─── TILT CARD ─────────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
    }
    function handleMouseLeave() {
        if (cardRef.current) {
            cardRef.current.style.transition = 'transform 0.3s ease';
            cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        }
    }
    return (
        <div
            ref={cardRef}
            className={`will-change-transform ${className ?? ''}`}
            style={{ transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
    {
        type: 'image',
        url: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606713/autogaard/assets/ag013.jpg',
        headline: 'Buy Better.',
        sub: 'Avoid costly mistakes before money changes hands.',
        duration: 3000
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
        headline: 'Maintain Smarter.',
        sub: 'Stay ahead of breakdowns. Protect your investment.',
        duration: 3000
    },
    {
        type: 'video',
        url: 'https://res.cloudinary.com/dt6n4pnjb/video/upload/v1777608775/autogaard/assets/videos/agvid003.mp4',
        headline: 'High-Fidelity.',
        sub: 'Precision diagnostics for the modern driver.',
        duration: 5000
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=80',
        headline: 'Sell Better.',
        sub: 'Get the right price. We prepare and position your car.',
        duration: 3000
    },
    {
        type: 'video',
        url: 'https://res.cloudinary.com/dt6n4pnjb/video/upload/v1777608713/autogaard/assets/videos/agvid001.mp4',
        headline: 'Autogaard.',
        sub: 'From Lagos to anywhere. We handle it for you.',
        duration: 7000
    },
];

const SERVICE_GROUPS = [
    {
        title: 'Buying & Selling',
        slug: 'buying-selling',
        icon: Search,
        desc: 'Smart Selection, Valuation, and Sales Concierge.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777610157/autogaard/assets/ag020.jpg',
    },
    {
        title: 'Inspections',
        slug: 'inspections',
        icon: Wrench,
        desc: 'Engine Scans, 120-Point Audits, and Background Checks.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777610165/autogaard/assets/ag021.jpg',
    },
    {
        title: 'Paperwork',
        slug: 'paperwork',
        icon: FileText,
        desc: 'Renewals, Roadworthiness, and Police CMR Clearance.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606812/autogaard/assets/ag016.jpg',
    },
    {
        title: 'Efficiency & Tech',
        slug: 'technology',
        icon: Zap,
        desc: 'CNG Conversion, AC Optimisation, and Security Tech.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606466/autogaard/assets/ag004.jpg',
    },
    {
        title: 'Restoration',
        slug: 'restoration',
        icon: Paintbrush,
        desc: 'Professional Repaint, Detailing, and Ceramic Shield.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606550/autogaard/assets/ag008.jpg',
    },
    {
        title: 'Logistics',
        slug: 'logistics',
        icon: Truck,
        desc: 'Port Clearing, Haulage, and Global Shipping.',
        image: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606487/autogaard/assets/ag005.jpg',
    },
];

const VEHICLE_SAMPLES = [
    {
        make: 'Toyota',
        model: 'Camry',
        bodyType: 'Sedan',
        years: '2018 – 2024',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
        make: 'Honda',
        model: 'Accord',
        bodyType: 'Sedan',
        years: '2017 – 2023',
        image: 'https://images.unsplash.com/photo-1634737581963-5a22ba471961?w=800&auto=format&fit=crop&q=80',
    },
    {
        make: 'Toyota',
        model: 'Highlander',
        bodyType: 'SUV',
        years: '2016 – 2024',
        image: 'https://images.unsplash.com/photo-1610855143470-0967a7348972?w=800&auto=format&fit=crop&q=80',
    },
];

const TESTIMONIALS = [
    {
        name: 'Seun A.',
        location: 'Lekki, Lagos',
        text: 'Before I signed anything on my Camry purchase, Autogaard ran the full audit. They found a hidden engine fault the dealer never mentioned. Saved me over ₦400k.',
        rating: 5,
    },
    {
        name: 'Chidi O.',
        location: 'Abuja',
        text: 'The CNG conversion was smooth and professional. My fuel costs dropped by more than half. Wish I had done it sooner.',
        rating: 5,
    },
    {
        name: 'Temi B.',
        location: 'Ikorodu, Lagos',
        text: 'They handled my vehicle registration renewal from start to finish. Picked up the documents, sorted the papers, delivered everything back. Zero stress.',
        rating: 5,
    },
];

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
    const containerRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const slidesContainerRef = useRef<HTMLDivElement>(null);

    // Waitlist form state
    const [waitlist, setWaitlist] = useState({ name: '', email: '', phone: '' });
    const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'done'>('idle');

    // Slideshow state
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        }, HERO_SLIDES[slideIndex].duration);
        return () => clearTimeout(timer);
    }, [slideIndex]);

    useGSAP(() => {
        // Regular scroll animations for lower sections
        gsap.utils.toArray<HTMLElement>('.pillar-card').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 60,
                scale: 0.9,
                duration: 1.2,
                delay: i * 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                },
            });
        });

        gsap.utils.toArray<HTMLElement>('.service-card').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 80,
                rotateY: 15,
                duration: 1,
                delay: (i % 3) * 0.15,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 92%',
                },
            });
        });

        gsap.utils.toArray<HTMLElement>('.vehicle-card').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                x: i % 2 === 0 ? -30 : 30,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                },
            });
        });

        gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                scale: 0.95,
                y: 20,
                duration: 0.8,
                delay: (i % 3) * 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                },
            });
        });
    }, { scope: containerRef });

    async function handleWaitlistSubmit() {
        if (!waitlist.name || !waitlist.email || !waitlist.phone) return;
        setWaitlistStatus('loading');
        try {
            await apiFetch('/leads/waitlist', {
                method: 'POST',
                body: waitlist,
            });
            setWaitlistStatus('done');
        } catch {
            setWaitlistStatus('done'); 
        }
    }

    return (
        <main ref={containerRef} className="relative bg-page selection:bg-burgundy selection:text-white">
            <Navbar />

            {/* HERO - AUTOMATED SLIDESHOW */}
            <section
                ref={heroRef}
                className="relative h-screen w-full overflow-hidden bg-black"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slideIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {HERO_SLIDES[slideIndex].type === 'video' ? (
                            <video
                                src={HERO_SLIDES[slideIndex].url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div 
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${HERO_SLIDES[slideIndex].url}')` }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-cinema via-cinema/40 to-transparent" />
                        <div className="absolute inset-0 bg-black/20" />

                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6">
                            <div className="max-w-4xl">
                                <CinematicReveal 
                                    text={HERO_SLIDES[slideIndex].headline} 
                                    className="text-6xl md:text-9xl font-heading font-extrabold text-white tracking-tighter leading-[0.8]"
                                />
                                
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-lg md:text-2xl font-body font-light text-white/90 max-w-2xl mx-auto mt-8 mb-12"
                                >
                                    {HERO_SLIDES[slideIndex].sub}
                                </motion.p>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                >
                                    <Link href="/services" className="btn-primary px-12 py-6 w-full sm:w-auto shadow-2xl shadow-burgundy/40 hover:scale-105 active:scale-95 transition-all">
                                        Explore Services
                                    </Link>
                                    <a
                                        href="https://wa.me/2348029933575"
                                        className="btn-outline border-white/20 text-white backdrop-blur-md bg-white/5 px-12 py-6 w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-white hover:text-cinema active:scale-95 transition-all"
                                    >
                                        <MessageCircle size={20} /> Chat With Advisor
                                    </a>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-50">
                    {HERO_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            className={`h-1 rounded-full transition-all duration-700 ${
                                i === slideIndex ? 'bg-burgundy w-16' : 'bg-white/20 w-4 hover:bg-white/40'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="relative z-10 bg-page section-padding section-x shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.1)]">
                <div className="container-xl">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="type-caption text-burgundy mb-4 block">How we help</span>
                            <h2 className="type-h2 text-primary mb-8">
                                Your trusted car advisor <br />at every stage.
                            </h2>
                            <p className="type-body-lg text-secondary mb-12">
                                We remove the friction between people and their cars. Whether you're buying your
                                first vehicle, maintaining your current one, or preparing to sell, we give you
                                the expertise to make the right call.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { t: 'Buy Right', d: 'Avoid costly mistakes with pre-purchase inspections.' },
                                    { t: 'Drive Well', d: 'Stay ahead of repairs with professional health checks.' },
                                    { t: 'Sell Better', d: 'Get the true value of your car in any market.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-burgundy-subtle flex items-center justify-center text-burgundy flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="type-h3 text-primary">{item.t}</h4>
                                            <p className="text-secondary">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div
                                    className="pillar-card aspect-[3/4] rounded-[2rem] bg-cover bg-center overflow-hidden"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80')`,
                                    }}
                                />
                                <div className="pillar-card aspect-square rounded-[2rem] bg-burgundy flex flex-col items-center justify-center text-white p-8 text-center">
                                    <span className="text-4xl font-bold mb-2">2023</span>
                                    <span className="type-caption opacity-80">Founded in Lagos</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="pillar-card aspect-square rounded-[2rem] bg-onyx flex flex-col items-center justify-center text-white p-8 text-center">
                                    <span className="text-4xl font-bold mb-2">17+</span>
                                    <span className="type-caption opacity-80">Core Services</span>
                                </div>
                                <div
                                    className="pillar-card aspect-[3/4] rounded-[2rem] bg-cover bg-center overflow-hidden"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80')`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="relative z-20 bg-surface section-padding section-x">
                <div className="container-xl">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="type-caption text-burgundy mb-4 block">Service Directory</span>
                        <h2 className="type-h2 text-primary mb-6">Expertise for every need.</h2>
                        <p className="type-body-lg text-secondary">
                            Six specialised groups covering documentation, performance, and total vehicle
                            management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SERVICE_GROUPS.map((group) => (
                            <Link key={group.slug} href={`/services/${group.slug}`}>
                                <TiltCard className="service-card group h-full bg-surface border border-border-subtle rounded-[2.5rem] overflow-hidden hover:border-burgundy/30 transition-all duration-500 hover:shadow-2xl hover:shadow-burgundy/5">
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                        <Image 
                                            src={group.image} 
                                            alt={group.title} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    
                                    <div className="p-10">
                                        <div className="w-12 h-12 rounded-2xl bg-burgundy/5 text-burgundy flex items-center justify-center mb-6 group-hover:bg-burgundy group-hover:text-white transition-all duration-500">
                                            <group.icon size={24} />
                                        </div>
                                        <h3 className="type-h3 text-primary mb-4">{group.title}</h3>
                                        <p className="text-secondary text-sm mb-8 leading-relaxed h-12 overflow-hidden">{group.desc}</p>
                                        <div className="flex items-center gap-2 text-burgundy font-black text-[10px] uppercase tracking-[0.2em]">
                                            Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
                                        </div>
                                    </div>
                                </TiltCard>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* VEHICLE CATALOG TEASER */}
            <section className="relative z-30 bg-cinema section-padding section-x">
                <div className="container-xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <span className="type-caption text-white/50 mb-4 block">
                                Vehicle Catalog
                            </span>
                            <h2 className="type-h2 text-white">Browse Our Featured Vehicles.</h2>
                            <p className="text-white/60 text-lg mt-4 max-w-xl">
                                An educational guide to the top 30 cars Nigerians drive every day — specs,
                                history, and what to watch out for.
                            </p>
                        </div>
                        <Link
                            href="/vehicles"
                            className="btn-outline border-white/20 text-white hover:bg-white hover:text-cinema whitespace-nowrap self-start md:self-auto"
                        >
                            View All Vehicles
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {VEHICLE_SAMPLES.map((v, i) => (
                            <Link key={i} href="/vehicles">
                                <div className="vehicle-card group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${v.image}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1 block">
                                            {v.bodyType} · {v.years}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-white">
                                            {v.make} {v.model}
                                        </h3>
                                    </div>
                                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowRight size={16} className="text-white" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUATION & COMPARE STRIP */}
            <section className="relative z-40 bg-page py-24 section-x">
                <div className="container-xl flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl">
                        <h2 className="type-h2 text-primary mb-4">Know the true value of your car.</h2>
                        <p className="type-body-lg text-secondary">
                            Get a data-backed market valuation so you never overpay or undersell. Or compare
                            two cars side-by-side before you decide.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/valuation" className="btn-primary w-full sm:w-auto px-12 py-5">
                            Get Valuation
                        </Link>
                        <Link
                            href="/compare"
                            className="btn-outline w-full sm:w-auto px-12 py-5"
                        >
                            Compare Cars
                        </Link>
                    </div>
                </div>
            </section>

            {/* AUTOCONCIERGE PREVIEW */}
            <section className="relative z-50 bg-cinema py-32 px-6 overflow-hidden">
                {/* Cinematic Background Elements */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-burgundy/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                                <span className="w-2 h-2 rounded-full bg-burgundy animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Coming Soon — 2026</span>
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                                Autogaard<br />
                                <span className="text-burgundy">Autoconcierge.</span>
                            </h2>
                            
                            <p className="type-body-lg text-white/60 mb-12 max-w-lg leading-relaxed">
                                Our upcoming AI-driven app. Contactless diagnostics, real-time health scores, 
                                and one-tap service booking directly from your phone.
                            </p>

                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <Zap className="text-burgundy" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Real-time</div>
                                        <div className="text-white/40 text-[10px] uppercase font-black tracking-widest">Diagnostics</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <ShieldCheck className="text-blue-400" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Secured</div>
                                        <div className="text-white/40 text-[10px] uppercase font-black tracking-widest">Health Log</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* The "Glassmorphic" Waitlist Card */}
                            <div className="p-10 md:p-16 rounded-[4rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-burgundy to-transparent opacity-50 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-1000" />
                                
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-4">Secure Early Access</h3>
                                    <p className="text-white/40 text-sm mb-12 font-medium">Join the elite circle of beta testers and receive a lifetime service discount.</p>

                                    {waitlistStatus === 'done' ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] text-center"
                                        >
                                            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
                                            <div className="text-emerald-500 font-bold mb-2">You're on the list!</div>
                                            <div className="text-emerald-500/60 text-xs">We'll notify you via email when the engine is ready.</div>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={waitlist.name}
                                                    onChange={(e) => setWaitlist(w => ({ ...w, name: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-burgundy transition-all focus:bg-white/[0.08]"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email</label>
                                                    <input
                                                        type="email"
                                                        value={waitlist.email}
                                                        onChange={(e) => setWaitlist(w => ({ ...w, email: e.target.value }))}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-burgundy transition-all focus:bg-white/[0.08]"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={waitlist.phone}
                                                        onChange={(e) => setWaitlist(w => ({ ...w, phone: e.target.value }))}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-white/20 focus:outline-none focus:border-burgundy transition-all focus:bg-white/[0.08]"
                                                        placeholder="080 000 0000"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleWaitlistSubmit}
                                                disabled={waitlistStatus === 'loading'}
                                                className="w-full h-[70px] bg-white text-cinema rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-burgundy hover:text-white transition-all shadow-2xl disabled:opacity-50"
                                            >
                                                {waitlistStatus === 'loading' ? <LoadingSpinner size="sm" /> : 'Join Waitlist'}
                                                {waitlistStatus !== 'loading' && <ArrowRight size={18} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Abstract Scan Line Decoration */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="w-full h-[1px] bg-white/10 absolute top-1/3 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                    <div className="w-full h-[1px] bg-white/10 absolute top-2/3 shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* WHY AUTOGAARD */}
            <section className="relative z-60 bg-surface section-padding section-x">
                <div className="container-xl">
                    <div className="text-center mb-20">
                        <span className="type-caption text-burgundy mb-4 block">Since 2023</span>
                        <h2 className="type-h2 text-primary">Why choose Autogaard?</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: ShieldCheck,
                                t: 'Avoid Costly Mistakes',
                                d: 'Our audits catch hidden faults before money changes hands. We have helped buyers save millions in avoidable repairs.',
                            },
                            {
                                icon: Wrench,
                                t: 'Reduce Surprise Repairs',
                                d: 'Regular health checks keep you ahead of breakdowns. Less shock, less spending, fewer days off the road.',
                            },
                            {
                                icon: ArrowRight,
                                t: 'Sell With Confidence',
                                d: 'We give your car a fair, honest market value so you walk away knowing you got the right price.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy mx-auto mb-6">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="type-h3 text-primary mb-4">{item.t}</h3>
                                <p className="text-secondary">{item.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="relative z-70 bg-page section-padding section-x">
                <div className="container-xl">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <span className="type-caption text-burgundy mb-4 block">Real Stories</span>
                        <h2 className="type-h2 text-primary">What our customers say.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="testimonial-card card p-8 flex flex-col gap-6">
                                <div className="flex gap-1">
                                    {Array.from({ length: t.rating }).map((_, s) => (
                                        <Star
                                            key={s}
                                            size={16}
                                            className="text-burgundy fill-burgundy"
                                        />
                                    ))}
                                </div>
                                <p className="text-secondary leading-relaxed flex-1">"{t.text}"</p>
                                <div>
                                    <p className="font-bold text-primary">{t.name}</p>
                                    <p className="text-[12px] text-secondary uppercase tracking-wider">
                                        {t.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="relative z-80">
                <Footer />
            </div>
        </main>
    );
}
