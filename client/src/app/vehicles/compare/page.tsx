'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch, getOptimizedImageUrl } from '@/lib/api';
import { useComparison } from '@/context/ComparisonContext';
import { 
    Plus, 
    X, 
    Search, 
    ArrowLeftRight, 
    Trash2, 
    Share2, 
    MessageCircle,
    CheckCircle2,
    Send,
    Star,
    ShieldCheck,
    ChevronRight,
    ChevronDown,
    Filter,
    Zap,
    Gauge,
    Trophy,
    Crown,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ComparisonSkeleton, LoadingSpinner } from '@/components/Loading';

export default function ComparePage() {
    const { comparisonIds: selectedIds, addToComparison, removeFromComparison, clearComparison } = useComparison();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    
    // Selection Flow State
    const [step, setStep] = useState<'search' | 'selector'>('search');
    const [makes, setMakes] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [selection, setSelection] = useState({ make: '', model: '' });
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    // Lead form state
    const [leadData, setLeadData] = useState({ name: '', phone: '', location: '', preferred: '' });
    const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'done'>('idle');

    // Winner Calculation
    const getWinner = () => {
        if (vehicles.length < 2) return null;
        return [...vehicles].sort((a, b) => 
            ((b.reliability_score || 0) + (b.resell_rank || 0)) - 
            ((a.reliability_score || 0) + (a.resell_rank || 0))
        )[0];
    };
    const winner = getWinner();

    // Initial load for makes
    useEffect(() => {
        const loadMakes = async () => {
            try {
                const res = await apiFetch('/catalog/brands');
                if (res.success) setMakes(res.data);
            } catch (e) { console.error(e); }
        };
        loadMakes();
    }, []);

    // Fetch comparison data whenever IDs change
    const fetchComparisonData = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            setVehicles([]);
            return;
        }
        setIsDataLoading(true);
        try {
            const res = await apiFetch(`/catalog/compare?ids=${ids.join(',')}`);
            if (res.success && Array.isArray(res.data)) {
                setVehicles(res.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsDataLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComparisonData(selectedIds);
    }, [selectedIds, fetchComparisonData]);

    const handleMakeSelect = async (make: string) => {
        setSelection({ make, model: '' });
        if (!make) {
            setModels([]);
            return;
        }
        try {
            const res = await apiFetch(`/catalog/models?make=${make}`);
            if (res.success) setModels(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await apiFetch(`/catalog/models?q=${query}`);
            if (res.success) setSearchResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddFromSelector = () => {
        if (selection.model) {
            addToComparison(selection.model);
            setSelection({ make: '', model: '' });
            setModels([]);
        }
    };

    const handleEmptySlotClick = () => {
        setStep('search');
        setTimeout(() => {
            searchInputRef.current?.focus();
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }, 100);
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeadStatus('loading');
        try {
            await apiFetch('/leads/comparison', {
                method: 'POST',
                body: {
                    ...leadData,
                    vehicles_compared: vehicles.map(v => `${v.make} ${v.model}`).join(', '),
                    preferred_choice: leadData.preferred || 'None selected'
                },
            });
            setLeadStatus('done');
        } catch (err) {
            setLeadStatus('idle');
        }
    };

    const renderSpecRow = (label: string, field: string, icon?: React.ReactNode) => {
        return (
            <div className="grid grid-cols-[160px_1fr] border-b border-border-subtle group/row hover:bg-page transition-all">
                <div className="p-8 border-r border-border-subtle bg-surface/50 sticky left-0 z-10 flex items-center gap-3">
                    {icon && <span className="text-burgundy opacity-50 group-hover/row:opacity-100 transition-opacity">{icon}</span>}
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">{label}</span>
                </div>
                <div className="grid grid-cols-4 items-stretch">
                    {vehicles.map((v) => (
                        <div key={v.id} className={`p-8 text-sm font-bold border-r border-border-subtle last:border-r-0 flex items-center justify-center text-center transition-all ${winner?.id === v.id ? 'bg-burgundy/5' : ''}`}>
                            {field === 'reliability_score' || field === 'resell_rank' ? (
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`text-lg ${winner?.id === v.id ? 'text-burgundy' : 'text-primary'}`}>{v[field] || 0}/10</span>
                                    <div className="w-12 h-1 bg-page rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-burgundy" 
                                            style={{ width: `${(v[field] || 0) * 10}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className={winner?.id === v.id ? 'text-burgundy' : 'text-secondary'}>{v[field] || '—'}</span>
                            )}
                        </div>
                    ))}
                    {Array.from({ length: 4 - vehicles.length }).map((_, i) => (
                        <div key={i} className="bg-surface/10 border-r border-border-subtle last:border-r-0" />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <main className="bg-page min-h-screen pb-20">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-32 px-6 bg-cinema text-white relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606423/autogaard/assets/ag002.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema via-transparent to-cinema/60" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-burgundy/20 flex items-center justify-center border border-burgundy/30">
                            <ArrowLeftRight className="text-burgundy" size={24} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">Expert Comparison</h4>
                    </div>
                    <h1 className="type-display mb-6">Objective Analysis.</h1>
                    <p className="type-body-lg text-white/50 max-w-2xl leading-relaxed">
                        Contrast performance, reliability, and resale metrics side-by-side to make 
                        an informed decision for the Nigerian market.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                {/* Selection Tray */}
                <div className="bg-surface border border-border-subtle rounded-[3.5rem] p-6 shadow-3xl flex flex-col gap-8 mb-12">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-6 px-4">
                        <div className="flex gap-8">
                            <button 
                                onClick={() => setStep('search')}
                                className={`text-[10px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${step === 'search' ? 'border-burgundy text-primary' : 'border-transparent text-muted hover:text-primary'}`}
                            >
                                Quick Search
                            </button>
                            <button 
                                onClick={() => setStep('selector')}
                                className={`text-[10px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${step === 'selector' ? 'border-burgundy text-primary' : 'border-transparent text-muted hover:text-primary'}`}
                            >
                                Smart Selector
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={clearComparison} className="p-4 rounded-full hover:bg-red-50 text-muted hover:text-red-500 transition-all border border-border-subtle" title="Clear All">
                                <Trash2 size={16} />
                            </button>
                            <button className="p-4 rounded-full hover:bg-page text-muted hover:text-burgundy transition-all border border-border-subtle">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pb-4">
                        {step === 'search' ? (
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
                                <input 
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Type vehicle make or model (e.g. Toyota Camry)..."
                                    className="w-full bg-page border border-border-subtle rounded-[2rem] pl-16 pr-8 py-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-burgundy/5 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                
                                <AnimatePresence>
                                    {searchResults.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-4 bg-surface border border-border-subtle rounded-[2.5rem] shadow-3xl z-50 p-4 max-h-[400px] overflow-y-auto no-scrollbar"
                                        >
                                            {searchResults.map(res => (
                                                <button 
                                                    key={res.id}
                                                    onClick={() => { addToComparison(res.id); setSearchQuery(''); setSearchResults([]); }}
                                                    className="w-full text-left p-4 hover:bg-page rounded-2xl flex items-center justify-between group transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-20 h-12 bg-page rounded-xl overflow-hidden relative">
                                                            <Image src={getOptimizedImageUrl(res.photos)} alt={res.name} fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-burgundy tracking-widest">{res.brand_name}</p>
                                                            <p className="font-bold text-sm">{res.name}</p>
                                                        </div>
                                                    </div>
                                                    <Plus size={20} className="text-muted group-hover:text-burgundy transition-colors" />
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted px-2">1. Choose Make</label>
                                    <div className="relative">
                                        <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-burgundy" size={16} />
                                        <select 
                                            className="w-full bg-page border border-border-subtle rounded-2xl pl-14 pr-6 py-4 text-sm font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-burgundy/5"
                                            value={selection.make}
                                            onChange={(e) => handleMakeSelect(e.target.value)}
                                        >
                                            <option value="">Select Brand</option>
                                            {makes.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className={`space-y-3 transition-opacity ${!selection.make ? 'opacity-30' : ''}`}>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted px-2">2. Choose Model</label>
                                    <div className="relative">
                                        <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-burgundy" size={16} />
                                        <select 
                                            className="w-full bg-page border border-border-subtle rounded-2xl pl-14 pr-6 py-4 text-sm font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-burgundy/5"
                                            value={selection.model}
                                            onChange={(e) => setSelection({ ...selection, model: e.target.value })}
                                        >
                                            <option value="">Select Model</option>
                                            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <button 
                                        type="button"
                                        onClick={handleAddFromSelector}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${selection.model ? 'bg-cinema text-white shadow-xl shadow-black/20 hover:scale-[1.02]' : 'bg-page border border-border-subtle text-muted opacity-50 cursor-not-allowed'}`}
                                    >
                                        <Plus size={16} /> Add to Analysis
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Advisor Guidance Tip */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="p-4 rounded-2xl bg-burgundy/5 border border-burgundy/10 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center shrink-0">
                            <Zap className="text-white" size={16} />
                        </div>
                        <p className="text-[10px] md:text-[11px] text-burgundy font-bold leading-relaxed">
                            <span className="uppercase">Elite Tip:</span> Our Expert Matrix analyzes over 50 data points per vehicle. The "Reliability" score reflects Nigerian road maintenance data, while "Resale" indicates market liquidity in Lagos/Abuja.
                        </p>
                    </div>
                </div>

                {/* Comparison Grid */}
                {isDataLoading ? (
                    <ComparisonSkeleton />
                ) : vehicles.length > 0 ? (
                    <div className="bg-surface border border-border-subtle rounded-[3.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto no-scrollbar">
                            <div className="min-w-[1000px]">
                                {/* Header Row */}
                                <div className="grid grid-cols-[60px_1fr] md:grid-cols-[160px_1fr] border-b border-border-subtle bg-page/50">
                                    <div className="p-4 md:p-8 flex items-center justify-center border-r border-border-subtle bg-page sticky left-0 z-20">
                                        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted rotate-180 [writing-mode:vertical-lr]">Expert Matrix</div>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        {vehicles.map(v => (
                                            <div key={v.id} className={`p-8 border-r border-border-subtle last:border-r-0 relative group transition-all ${winner?.id === v.id ? 'bg-burgundy/5 ring-2 ring-inset ring-burgundy/20' : ''}`}>
                                                {winner?.id === v.id && (
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-burgundy text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 z-30 shadow-lg shadow-burgundy/20">
                                                        <Trophy size={12} /> Expert Winner
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => removeFromComparison(v.id)}
                                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 shadow-sm z-30"
                                                >
                                                    <X size={14} />
                                                </button>
                                                <div className="aspect-[16/9] relative rounded-[2rem] overflow-hidden mb-6 border border-border-subtle shadow-lg bg-page">
                                                    <Image src={getOptimizedImageUrl(v.image_url)} alt={v.model} fill className="object-cover" />
                                                </div>
                                                <p className="text-[9px] font-black uppercase text-burgundy tracking-widest mb-1">{v.make}</p>
                                                <h3 className="text-lg font-black truncate mb-6">{v.model}</h3>
                                                <div className="flex flex-col gap-2">
                                                    <Link 
                                                        href={`/vehicles/${v.slug || `${v.make.toLowerCase()}-${v.model.toLowerCase()}`}`}
                                                        className={`w-full py-3 rounded-full text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all ${winner?.id === v.id ? 'bg-burgundy text-white shadow-xl shadow-burgundy/20' : 'bg-cinema text-white hover:bg-black'}`}
                                                    >
                                                        Deep Dive <ChevronRight size={12} />
                                                    </Link>
                                                    <Link 
                                                        href={`/leads?type=reservation&make=${v.make}&model=${v.model}`}
                                                        className="w-full py-3 border border-border-subtle text-secondary rounded-full text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-page transition-all"
                                                    >
                                                        <Lock size={12} className="text-burgundy" /> Reserve Unit
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        {Array.from({ length: 4 - vehicles.length }).map((_, i) => (
                                            <button 
                                                key={i} 
                                                onClick={handleEmptySlotClick}
                                                className="flex flex-col items-center justify-center border-r border-border-subtle last:border-r-0 bg-page/30 opacity-40 hover:opacity-100 hover:bg-page transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted flex items-center justify-center mb-4 group-hover:border-burgundy group-hover:bg-burgundy/5 transition-all">
                                                    <Plus size={32} className="text-muted group-hover:text-burgundy" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-burgundy">Add Vehicle</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Body Rows */}
                                {renderSpecRow('Reliability', 'reliability_score', <ShieldCheck size={14} />)}
                                {renderSpecRow('Resale Ranking', 'resell_rank', <Star size={14} />)}
                                {renderSpecRow('Body Style', 'body_type', <Gauge size={14} />)}
                                {renderSpecRow('Fuel System', 'fuel_type', <Zap size={14} />)}
                                
                                <div className="grid grid-cols-[60px_1fr] md:grid-cols-[160px_1fr] border-b border-border-subtle group/row hover:bg-page transition-all">
                                    <div className="p-4 md:p-8 border-r border-border-subtle bg-surface/50 sticky left-0 z-10 flex flex-col md:flex-row items-center gap-2 md:gap-3">
                                        <MessageCircle size={14} className="text-burgundy opacity-50" />
                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted text-center md:text-left">Verdict</span>
                                    </div>
                                    <div className="grid grid-cols-4 items-stretch">
                                        {vehicles.map((v) => (
                                            <div key={v.id} className={`p-8 text-[11px] font-medium border-r border-border-subtle last:border-r-0 italic leading-relaxed transition-all ${winner?.id === v.id ? 'bg-burgundy/5 text-burgundy font-bold' : 'text-secondary/70'}`}>
                                                {winner?.id === v.id && <Crown size={12} className="inline mr-2 mb-1" />}
                                                {v.expert_insight || v.description || 'Expert brief not available.'}
                                            </div>
                                        ))}
                                        {Array.from({ length: 4 - vehicles.length }).map((_, i) => (
                                            <div key={i} className="bg-surface/10 border-r border-border-subtle last:border-r-0" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Conversion Footer */}
                        <div className="p-16 md:p-24 bg-cinema text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                            <div className="max-w-4xl mx-auto relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                    <div>
                                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Winner Identified</span>
                                        </div>
                                        <h2 className="type-h2 mb-6">Found your match?</h2>
                                        <p className="text-white/70 mb-10 leading-relaxed">
                                            Our algorithmic analysis suggests {winner ? `the ${winner.make} ${winner.model}` : 'one of these models'} is the best choice for reliability and resale value in Nigeria today. 
                                            Request a professional inspection or reserve a high-quality Tokunbo unit now.
                                        </p>
                                        <div className="flex gap-4">
                                            <button className="flex-1 py-5 bg-white text-[#0F172A] rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-white/5 hover:bg-burgundy-light hover:text-white transition-all">
                                                Speak to an Advisor
                                            </button>
                                            <a href="https://wa.me/2348029933575" className="flex-1 py-5 border border-white/20 rounded-full font-black uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                                                <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp Now
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-10 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10">
                                        {leadStatus === 'done' ? (
                                            <div className="py-12 text-center">
                                                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                                                <h3 className="type-h3">Consultation Booked</h3>
                                                <p className="text-white/60 text-sm mt-2">An expert will review your comparison and call you shortly.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleLeadSubmit} className="space-y-6">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Request Professional Brief</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input 
                                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-burgundy transition-all"
                                                        placeholder="Name" required
                                                        value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
                                                    />
                                                    <input 
                                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-burgundy transition-all"
                                                        placeholder="Phone" required
                                                        value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})}
                                                    />
                                                </div>
                                                <select 
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-burgundy appearance-none"
                                                    value={leadData.preferred} onChange={e => setLeadData({...leadData, preferred: e.target.value})}
                                                >
                                                    <option value="" className="bg-cinema">Which car are you leaning towards?</option>
                                                    {vehicles.map(v => <option key={v.id} value={`${v.make} ${v.model}`} className="bg-cinema">{v.make} {v.model}</option>)}
                                                </select>
                                                <button 
                                                    type="submit"
                                                    disabled={leadStatus === 'loading'}
                                                    className="w-full h-[60px] bg-white text-[#0F172A] rounded-full font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-burgundy-light hover:text-white transition-all shadow-xl disabled:opacity-50"
                                                >
                                                    {leadStatus === 'loading' ? <LoadingSpinner size="sm" /> : 'Get Expert Callback'}
                                                    {leadStatus !== 'loading' && <Send size={14} />}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-40 text-center bg-surface border-2 border-dashed border-border-subtle rounded-[4rem] shadow-inner">
                        <div className="w-28 h-28 bg-page rounded-full flex items-center justify-center mx-auto mb-10 text-muted shadow-lg">
                            <ArrowLeftRight size={40} className="animate-pulse opacity-10" />
                        </div>
                        <h2 className="type-h3 mb-4">Select Vehicles to Compare</h2>
                        <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
                            Use the Search or Smart Selector above to add up to 4 vehicles for 
                            a professional side-by-side analysis.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
