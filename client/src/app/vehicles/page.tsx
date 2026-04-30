'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
    Search, 
    Filter, 
    ArrowRight, 
    Star, 
    TrendingUp, 
    ShieldCheck,
    Plus,
    X,
    ArrowLeftRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch, getOptimizedImageUrl } from '@/lib/api';
import { useComparison } from '@/context/ComparisonContext';
import { Skeleton, LoadingSpinner } from '@/components/Loading';

gsap.registerPlugin(ScrollTrigger);

export default function VehicleCatalog() {
    const { comparisonIds, addToComparison, removeFromComparison, isInComparison } = useComparison();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [filter, setFilter] = useState({ make: '', body_type: '' });
    const [brands, setBrands] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const LIMIT = 12;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setOffset(0);
        fetchVehicles(true);
    }, [filter, debouncedSearch]);

    // Fetch unique brands for filter
    useEffect(() => {
        apiFetch('/catalog/brands').then(res => {
            if (res.success && res.data) {
                setBrands(res.data.map((b: any) => b.name));
            }
        }).catch(console.error);
    }, []);

    async function fetchVehicles(reset = false) {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        try {
            const currentOffset = reset ? 0 : offset;
            const queryParams: any = {
                ...filter,
                limit: LIMIT.toString(),
                offset: currentOffset.toString()
            };
            if (debouncedSearch) queryParams.search = debouncedSearch;
            
            const params = new URLSearchParams(queryParams);
            const res = await apiFetch(`/vehicles/catalog?${params}`);
            
            if (res.success) {
                if (reset) {
                    setVehicles(res.data);
                } else {
                    setVehicles(prev => [...prev, ...res.data]);
                }
                setTotal(res.total);
            }
        } catch (err) {
            console.error('Failed to fetch vehicles');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const loadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
    };

    useEffect(() => {
        if (offset > 0) {
            fetchVehicles(false);
        }
    }, [offset]);

    useGSAP(() => {
        if (!loading && vehicles.length > 0) {
            const unrevealed = containerRef.current?.querySelectorAll('.vehicle-card:not(.revealed)');
            if (unrevealed && unrevealed.length > 0) {
                gsap.fromTo(unrevealed, 
                    { opacity: 0, scale: 0.95, y: 20 },
                    { 
                        opacity: 1, 
                        scale: 1, 
                        y: 0, 
                        duration: 0.6, 
                        stagger: 0.1,
                        ease: 'power4.out',
                        onComplete: () => {
                            unrevealed.forEach(el => el.classList.add('revealed'));
                        }
                    }
                );
            }
        }
    }, { scope: containerRef, dependencies: [loading, vehicles] });

    return (
        <main ref={containerRef} className="bg-page min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cinema via-cinema/60 to-transparent" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="type-display mb-6">Expert Insight.<br/>Market Mastery.</h1>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <p className="type-body text-white/60 max-w-2xl leading-relaxed">
                                Navigate the Nigerian automotive landscape with professional data on 
                                resale value, maintenance reliability, and direct import pricing.
                            </p>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" size={16} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Expert Verified Data</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Market Intelligence Tools */}
            <section className="py-20 px-6 bg-page">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Link href="/vehicles/compare" className="group p-8 md:p-12 rounded-[2.5rem] bg-white border border-border-subtle hover:border-burgundy transition-all shadow-xl shadow-black/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-burgundy/5 rounded-bl-[100%] transition-all group-hover:bg-burgundy/10" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-burgundy/10 rounded-2xl flex items-center justify-center text-burgundy mb-8 group-hover:scale-110 transition-transform">
                                    <ArrowLeftRight size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Comparison Matrix</h3>
                                <p className="text-sm text-muted leading-relaxed max-w-sm mb-8">
                                    Analyze reliability scores and resale rankings side-by-side for up to 4 models to find your perfect match.
                                </p>
                                <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-burgundy">
                                    Launch Analysis <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>

                        <Link href="/vehicles/valuation" className="group p-8 md:p-12 rounded-[2.5rem] bg-cinema text-white border border-white/5 hover:border-burgundy/30 transition-all shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[100%] transition-all group-hover:bg-burgundy/20" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">Smart Valuation</h3>
                                <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-8">
                                    Get an instant, fair market estimate based on real Nigerian sales data and professional AI analysis.
                                </p>
                                <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                                    Value My Vehicle <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-10 px-6 border-b border-border-subtle bg-surface sticky top-[80px] z-40 backdrop-blur-xl bg-surface/90">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-10">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-burgundy transition-all duration-300" size={18} />
                            <input 
                                type="text"
                                placeholder="Search the expert database..."
                                className="w-full bg-page border border-border-subtle rounded-3xl pl-16 pr-8 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-burgundy/5 focus:border-burgundy/50 transition-all shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex items-center gap-3 text-muted shrink-0">
                                <Filter size={14} className="text-burgundy" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Curated Library</span>
                            </div>
                            
                            <div className="flex gap-3 p-1 bg-page/50 border border-border-subtle rounded-full overflow-x-auto no-scrollbar max-w-full">
                                <button
                                    onClick={() => setFilter(prev => ({ ...prev, make: '' }))}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!filter.make ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20' : 'text-slate-400 hover:text-primary'}`}
                                >
                                    All Makes
                                </button>
                                {brands.map(make => (
                                    <button
                                        key={make}
                                        onClick={() => setFilter(prev => ({ ...prev, make: prev.make === make ? '' : make }))}
                                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter.make === make ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20' : 'text-slate-400 hover:text-primary'}`}
                                    >
                                        {make}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <select 
                                    className="bg-page/50 border border-border-subtle rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-burgundy/20 cursor-pointer appearance-none text-slate-500"
                                    value={filter.body_type}
                                    onChange={e => setFilter({...filter, body_type: e.target.value})}
                                >
                                    <option value="">Body Styles</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Minivan">Minivan</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                                
                                <div className="pl-6 border-l border-border-subtle">
                                    <div className="text-[10px] font-black text-burgundy uppercase tracking-[0.2em]">
                                        {total} <span className="text-slate-400">Entries</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="rounded-[2.5rem] bg-surface border border-border-subtle overflow-hidden">
                                    <Skeleton className="aspect-[16/10] rounded-none" />
                                    <div className="p-8 space-y-4">
                                        <Skeleton className="h-6 w-2/3 rounded-full" />
                                        <Skeleton className="h-4 w-full rounded-full" />
                                        <Skeleton className="h-10 w-full rounded-full mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {vehicles.map((v) => (
                                    <Link 
                                        key={v.id} 
                                        href={`/vehicles/${v.slug}`}
                                        className="vehicle-card group relative block bg-surface rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                                    >
                                        <div className="aspect-[16/9] relative overflow-hidden bg-page">
                                            <Image 
                                                src={getOptimizedImageUrl(v.image_url)} 
                                                alt={`${v.make} ${v.model}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                            />
                                            
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-cinema/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                                                        {v.resell_rank}/10 Resale
                                                    </span>
                                                </div>
                                                <div className="bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                                                    <ShieldCheck size={10} className="text-white" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                                                        Elite Reliability
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="absolute top-4 right-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        isInComparison(v.id) ? removeFromComparison(v.id) : addToComparison(v.id);
                                                    }}
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isInComparison(v.id) ? 'bg-burgundy border-burgundy text-white shadow-lg shadow-burgundy/40' : 'bg-white/20 border-white/20 text-white hover:bg-white hover:text-slate-900'}`}
                                                >
                                                    {isInComparison(v.id) ? <X size={16} /> : <Plus size={16} />}
                                                </button>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                            
                                            <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between group-hover:bg-white/20 transition-all">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg leading-none mb-1">{v.make} {v.model}</h3>
                                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{v.year_start} — {v.year_end || 'Present'}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden md:flex p-6 items-center justify-between border-t border-border-subtle bg-white/50">
                                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">{v.body_type} · {v.fuel_type}</span>
                                            <span className="text-[9px] font-black text-burgundy uppercase tracking-[0.2em]">Expert Insight Available</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {vehicles.length < total && (
                                <div className="mt-20 flex justify-center">
                                    <button 
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="bg-burgundy text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-3"
                                    >
                                        {loadingMore ? <LoadingSpinner size="sm" color="white" /> : 'Load More Vehicles'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Comparison Tray Overlay */}
            {comparisonIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-6">
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-cinema/95 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4 pl-2">
                            <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center text-white text-xs font-black">
                                {comparisonIds.length}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ready to Compare</span>
                                <span className="text-xs font-bold text-white">Vehicles in your queue</span>
                            </div>
                        </div>

                        <Link 
                            href={`/vehicles/compare?ids=${comparisonIds.join(',')}`}
                            className="bg-white text-cinema px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-burgundy hover:text-white transition-all shadow-xl"
                        >
                            <ArrowLeftRight size={14} /> Compare Now
                        </Link>
                    </motion.div>
                </div>
            )}

            <Footer />
        </main>
    );
}
