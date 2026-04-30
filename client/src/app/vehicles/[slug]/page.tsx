'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useComparison } from '@/context/ComparisonContext';
import { 
    ArrowLeft, 
    ShieldCheck, 
    Star, 
    Zap, 
    Gauge, 
    Fuel, 
    MessageCircle,
    CheckCircle2,
    Send,
    AlertCircle,
    Wrench,
    TrendingUp,
    ShieldAlert,
    ArrowRight,
    ArrowLeftRight,
    Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch, getOptimizedImageUrl } from '@/lib/api';
import { Skeleton, LoadingSpinner, PageLoader } from '@/components/Loading';

export default function VehicleDetail() {
    const { addToComparison, isInComparison, removeFromComparison } = useComparison();
    const params = useParams();
    const slug = params.slug as string;
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [formData, setFormData] = useState({ name: '', phone: '', location: '', notes: '' });

    useEffect(() => {
        if (slug) fetchVehicle();
    }, [slug]);

    async function fetchVehicle() {
        try {
            await apiFetch(`/catalog/brands`); // Warm up
            const data = await apiFetch(`/vehicles/catalog/${slug}`);
            if (data.success) {
                setVehicle(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch vehicle');
        } finally {
            setLoading(false);
        }
    }

    async function handleInquiry(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        try {
            await apiFetch('/leads/vehicle_inquiry', {
                method: 'POST',
                body: {
                    ...formData,
                    vehicle_id: vehicle?.id,
                    notes: `Inquiry for ${vehicle?.make} ${vehicle?.model}. User notes: ${formData.notes}`
                },
            });
            setStatus('done');
        } catch (err) {
            setStatus('idle');
        }
    }

    if (loading) return (
        <div className="bg-page min-h-screen">
            <Navbar />
            <div className="pt-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-12">
                        <Skeleton className="aspect-[16/10] rounded-[3rem]" />
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-[2rem]" />)}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <Skeleton className="h-20 rounded-3xl w-3/4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-14 flex-1 rounded-full" />
                            <Skeleton className="h-14 flex-1 rounded-full" />
                        </div>
                        <Skeleton className="h-64 rounded-[3rem]" />
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (!vehicle) return (
        <div className="p-20 text-center bg-page min-h-screen flex flex-col items-center justify-center">
            <ShieldAlert size={60} className="text-burgundy mb-6" />
            <h2 className="type-h2 mb-4">Vehicle Not Found</h2>
            <p className="text-muted mb-10">The expert entry for this model has moved or does not exist.</p>
            <Link href="/vehicles" className="bg-burgundy text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
                Back to Catalog
            </Link>
        </div>
    );

    return (
        <main className="bg-page min-h-screen pb-20">
            <Navbar />

            {/* Back button */}
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <Link 
                    href="/vehicles" 
                    className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to Catalog
                </Link>
            </div>

            {/* Content Grid */}
            <section className="pt-10 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-[16/10] relative rounded-[3rem] overflow-hidden shadow-2xl mb-12"
                    >
                        <Image 
                            src={getOptimizedImageUrl(vehicle.image_url)} 
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="p-6 rounded-[2rem] bg-surface border border-border-subtle text-center">
                            <Star size={20} className="mx-auto mb-3 text-amber-500 fill-amber-500" />
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Resell</div>
                            <div className="text-xl font-bold">{vehicle.resell_rank}/10</div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-surface border border-border-subtle text-center">
                            <Gauge size={20} className="mx-auto mb-3 text-blue-500" />
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Body</div>
                            <div className="text-sm font-bold uppercase">{vehicle.body_type}</div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-surface border border-border-subtle text-center">
                            <Fuel size={20} className="mx-auto mb-3 text-emerald-500" />
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Fuel</div>
                            <div className="text-sm font-bold uppercase">{vehicle.fuel_type}</div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-surface border border-border-subtle text-center">
                            <ShieldCheck size={20} className="mx-auto mb-3 text-burgundy" />
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Market</div>
                            <div className="text-sm font-bold uppercase">Nigeria</div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="type-h1">{vehicle.make} {vehicle.model}</h1>
                            <div className="bg-burgundy/10 text-burgundy px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Expert Pick
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-8">
                            Era: {vehicle.year_start} — {vehicle.year_end || 'Present'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-6 rounded-[2rem] bg-cinema text-white">
                                <div className="text-[9px] font-black uppercase tracking-widest text-burgundy mb-2">Foreign Used</div>
                                <div className="text-xl font-bold">N{vehicle.price_tokunbo_min}M - N{vehicle.price_tokunbo_max}M</div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-surface border border-border-subtle">
                                <div className="text-[9px] font-black uppercase tracking-widest text-muted mb-2">Nigerian Used</div>
                                <div className="text-xl font-bold text-secondary">N{vehicle.price_nigerian_min}M - N{vehicle.price_nigerian_max}M</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => isInComparison(vehicle.id) ? removeFromComparison(vehicle.id) : addToComparison(vehicle.id)}
                                className={`flex-1 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all ${isInComparison(vehicle.id) ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20' : 'bg-page border border-border-subtle text-secondary hover:border-burgundy'}`}
                            >
                                {isInComparison(vehicle.id) ? <Check size={16} /> : <ArrowLeftRight size={16} />}
                                {isInComparison(vehicle.id) ? 'Added to Compare' : 'Add to Compare'}
                            </button>
                            <Link 
                                href={`/valuation?make=${vehicle.make}&model=${vehicle.model}`}
                                className="flex-1 py-5 bg-cinema text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all"
                            >
                                <TrendingUp size={16} />
                                Get Valuation
                            </Link>
                        </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-surface border border-border-subtle">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-burgundy mb-8 flex items-center gap-3">
                            <MessageCircle size={16} /> Expert Consultation
                        </h4>
                        {status === 'done' ? (
                            <div className="text-center py-10 bg-emerald-50 rounded-3xl border border-emerald-100">
                                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
                                <p className="text-sm font-bold text-emerald-900">Inquiry Sent Successfully</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquiry} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        className="w-full bg-page border border-border-subtle rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                                        placeholder="Your Name" required
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                    <input 
                                        className="w-full bg-page border border-border-subtle rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20"
                                        placeholder="Phone" required
                                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <textarea 
                                    className="w-full bg-page border border-border-subtle rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 min-h-[100px]"
                                    placeholder="Any specific questions about this model?"
                                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                                />
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="w-full bg-burgundy text-white py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-burgundy-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {status === 'loading' ? <LoadingSpinner size="sm" color="white" /> : 'Request Expert Brief'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Expert Insight Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        <div className="lg:col-span-2 space-y-16">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center">
                                        <ShieldCheck className="text-burgundy" size={24} />
                                    </div>
                                    <h2 className="type-h2">Expert Insight</h2>
                                </div>
                                <p className="type-body-lg text-secondary leading-relaxed max-w-3xl">
                                    {vehicle.expert_insight}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 rounded-[3rem] bg-emerald-50 border border-emerald-100/50">
                                    <div className="flex items-center gap-3 mb-6 text-emerald-700">
                                        <TrendingUp size={20} />
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em]">Key Strengths</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {(vehicle.key_strengths || []).map((s: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-emerald-900/70 text-sm font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-10 rounded-[3rem] bg-rose-50 border border-rose-100/50">
                                    <div className="flex items-center gap-3 mb-6 text-rose-700">
                                        <ShieldAlert size={20} />
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em]">Trade-offs</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        {(vehicle.trade_offs || []).map((t: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-rose-900/70 text-sm font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="p-10 rounded-[3rem] bg-page border border-border-subtle">
                                <div className="flex items-center gap-3 mb-8 text-burgundy">
                                    <Wrench size={20} />
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">Maintenance Plan</h4>
                                </div>
                                <div className="space-y-6">
                                    {(vehicle.maintenance_tips || []).map((m: string, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-burgundy" />
                                            </div>
                                            <p className="text-xs font-bold text-secondary leading-relaxed">{m}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 rounded-[3rem] bg-cinema text-white overflow-hidden relative">
                                <div className="relative z-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy mb-6">Common Issues</h4>
                                    <div className="space-y-4 mb-8">
                                        {(vehicle.common_issues || []).map((issue: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 text-white/70 text-[10px] font-bold">
                                                <div className="w-1 h-1 rounded-full bg-burgundy mt-1.5" />
                                                {issue}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 bg-white text-cinema rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-burgundy hover:text-white transition-all">
                                        Full Repair Guide
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternatives Section */}
            {vehicle.alternatives && vehicle.alternatives.length > 0 && (
                <section className="py-24 px-6 bg-page border-t border-border-subtle">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-burgundy mb-4">Expert Comparison</h4>
                                <h2 className="type-h2">Similar Alternatives</h2>
                            </div>
                            <p className="text-muted text-sm max-w-md">
                                Based on reliability rankings and market positioning, these are the top contenders to the {vehicle.make} {vehicle.model}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {vehicle.alternatives.map((alt: any) => (
                                <Link 
                                    key={alt.id} 
                                    href={`/vehicles/${alt.slug}`}
                                    className="group block bg-surface rounded-[2.5rem] overflow-hidden border border-border-subtle hover:shadow-2xl transition-all"
                                >
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                        <Image 
                                            src={getOptimizedImageUrl(alt.image_url)} 
                                            alt={`${alt.make} ${alt.model}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-cinema/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Resale: {alt.resell_rank}/10</span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg">{alt.make} {alt.model}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mt-1">View Deep Dive</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-page border border-border-subtle flex items-center justify-center group-hover:bg-burgundy group-hover:text-white transition-all">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
