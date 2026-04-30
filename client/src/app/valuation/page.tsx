'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { 
    Sparkles, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle, 
    MessageCircle,
    Send
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/Loading';

const STEPS = [
    { id: 'vehicle', title: 'Vehicle Details' },
    { id: 'condition', title: 'Condition' },
    { id: 'contact', title: 'Contact Info' },
    { id: 'done', title: 'Request Sent' }
];

function ValuationContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        make: searchParams.get('make') || '',
        model: searchParams.get('model') || '',
        trim: '',
        year: 2020,
        transmission: 'automatic',
        mileage_km: 50000,
        year_of_entry: 2024,
        accident_history: false,
        condition: 'good'
    });
    
    // Lead form state
    const [leadData, setLeadData] = useState({ name: '', whatsapp: '', email: '', location: '', intent: 'valuation' });
    const [leadStatus, setLeadStatus] = useState<'idle' | 'loading' | 'done'>('idle');

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [engineSearch, setEngineSearch] = useState('');

    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [engines, setEngines] = useState<any[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingEngines, setLoadingEngines] = useState(false);

    const [selectedMakeId, setSelectedMakeId] = useState<string | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    useEffect(() => {
        apiFetch('/catalog/brands').then(res => {
            if (res.data) setBrands(res.data);
        }).catch(console.error);

        // If pre-filled, jump to condition step
        if (searchParams.get('make') && searchParams.get('model')) {
            setStep(1);
        }
    }, []);

    useEffect(() => {
        if (!selectedMakeId) return;
        setModels([]);
        setEngines([]);
        setFormData(prev => ({ ...prev, model: '', trim: '' }));
        setSelectedModelId(null);
        setLoadingModels(true);
        apiFetch(`/catalog/models?makeId=${selectedMakeId}`).then(res => {
            if (res.data) setModels(res.data);
        }).catch(console.error).finally(() => setLoadingModels(false));
    }, [selectedMakeId]);

    useEffect(() => {
        if (!selectedModelId) return;
        setEngines([]);
        setFormData(prev => ({ ...prev, trim: '' }));
        setLoadingEngines(true);
        apiFetch(`/catalog/engines?modelId=${selectedModelId}`).then(res => {
            if (res.data) setEngines(res.data);
        }).catch(console.error).finally(() => setLoadingEngines(false));
    }, [selectedModelId]);

    const nextStep = () => {
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const prevStep = () => {
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmitRequest = async () => {
        setLoading(true);
        setError('');
        try {
            const dataToSend = { 
                ...formData, 
                ...leadData,
                vehicle_make: formData.make,
                vehicle_model: formData.model
            };
            await apiFetch('/leads/valuation', {
                method: 'POST',
                body: dataToSend
            });
            nextStep();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-page min-h-screen">
            <Navbar />

            {/* Header Area */}
            <section className="pt-32 pb-16 px-6 bg-cinema text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="type-display mb-4">Smart Valuation.</h1>
                    <p className="type-body-lg text-white/50">
                        Get a fair market estimate based on real Nigerian sales data and AI analysis.
                    </p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Progress Tracker */}
                <div className="flex justify-between mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border-subtle -translate-y-1/2 z-0" />
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= i ? 'var(--burgundy)' : 'var(--surface)',
                                    borderColor: step >= i ? 'var(--burgundy)' : 'var(--border-subtle)',
                                    color: step >= i ? '#ffffff' : 'var(--text-muted)'
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-colors"
                            >
                                {step > i ? <CheckCircle2 size={18} /> : i + 1}
                            </motion.div>
                            <span className={`mt-4 text-[10px] font-bold uppercase tracking-widest text-center max-w-[60px] sm:max-w-none ${step >= i ? 'text-burgundy' : 'text-muted'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5">
                    {step === 0 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="premium-label">Make</label>
                                    <select
                                        value={selectedMakeId || ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setSelectedMakeId(val);
                                            const bName = brands.find(b => b.id.toString() === val)?.name || '';
                                            setFormData({ ...formData, make: bName });
                                        }}
                                        className="premium-input"
                                    >
                                        <option value="">Select Make</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="premium-label">Model</label>
                                    <input 
                                        type="text"
                                        placeholder="Search model..."
                                        value={modelSearch}
                                        onChange={e => setModelSearch(e.target.value)}
                                        className="premium-input mb-4"
                                    />
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingModels ? (
                                            Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />
                                            ))
                                        ) : models.filter(m => m.name.toLowerCase().includes(modelSearch.toLowerCase())).map((m) => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, model: m.name });
                                                    setSelectedModelId(m.id);
                                                }}
                                                className={`p-4 rounded-2xl border text-sm font-semibold transition-all ${
                                                    formData.model === m.name 
                                                        ? 'bg-burgundy border-burgundy text-white shadow-lg shadow-burgundy/20' 
                                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                                                }`}
                                            >
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="premium-label">Year</label>
                                    <select 
                                        value={formData.year} 
                                        onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} 
                                        className="premium-input"
                                    >
                                        {Array.from({ length: 25 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="premium-label">Mileage (KM)</label>
                                    <input 
                                        type="number" 
                                        value={formData.mileage_km} 
                                        onChange={e => setFormData({ ...formData, mileage_km: parseInt(e.target.value) })} 
                                        className="premium-input" 
                                    />
                                </div>
                                <div>
                                    <label className="premium-label">Transmission</label>
                                    <select 
                                        value={formData.transmission} 
                                        onChange={e => setFormData({ ...formData, transmission: e.target.value })} 
                                        className="premium-input"
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 pt-6 px-4">
                                    <input 
                                        type="checkbox" 
                                        id="accident" 
                                        checked={formData.accident_history} 
                                        onChange={e => setFormData({ ...formData, accident_history: e.target.checked })} 
                                        className="w-5 h-5 accent-burgundy" 
                                    />
                                    <label htmlFor="accident" className="text-[10px] font-bold uppercase tracking-widest text-muted">Accident History?</label>
                                </div>
                                <div>
                                    <label className="premium-label">Trim / Variant</label>
                                    <input 
                                        type="text"
                                        placeholder="Search trim..."
                                        value={engineSearch}
                                        onChange={e => setEngineSearch(e.target.value)}
                                        className="premium-input mb-4"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingEngines ? (
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />
                                            ))
                                        ) : engines.filter(e => e.name.toLowerCase().includes(engineSearch.toLowerCase())).map((e) => (
                                            <button
                                                key={e.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, trim: e.name })}
                                                className={`p-6 rounded-2xl border text-left transition-all ${
                                                    formData.trim === e.name 
                                                        ? 'bg-burgundy border-burgundy text-white shadow-lg shadow-burgundy/20' 
                                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-white'
                                                }`}
                                            >
                                                <div className="font-bold mb-1">{e.name}</div>
                                                <div className="text-[10px] uppercase tracking-widest opacity-60">
                                                    {e.specs?.name || 'Standard Variant'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button 
                                    onClick={nextStep} 
                                    disabled={!formData.make || !formData.model}
                                    className="bg-burgundy text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-burgundy-dark transition-all disabled:opacity-50"
                                >
                                    Next Step <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="text-center mb-10">
                                <h2 className="type-h2 mb-2">How is the condition?</h2>
                                <p className="text-muted text-sm">Be honest for the most accurate market price.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {['excellent', 'good', 'fair', 'poor'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setFormData({ ...formData, condition: c })}
                                        className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${formData.condition === c ? 'border-burgundy bg-burgundy/5' : 'border-border-subtle hover:border-burgundy/20'}`}
                                    >
                                        <div>
                                            <p className="font-bold capitalize text-lg">{c}</p>
                                            <p className="text-xs text-muted mt-1">
                                                {c === 'excellent' && 'Like new, no mechanical or visual defects.'}
                                                {c === 'good' && 'Minor wear, well-maintained.'}
                                                {c === 'fair' && 'Visible wear, might need minor repairs.'}
                                                {c === 'poor' && 'Significant wear or mechanical issues.'}
                                            </p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.condition === c ? 'border-burgundy bg-burgundy' : 'border-border-subtle'}`}>
                                            {formData.condition === c && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between pt-6">
                                <button onClick={prevStep} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary flex items-center gap-2">
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button 
                                    onClick={nextStep} 
                                    className="bg-burgundy text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-burgundy-dark transition-all"
                                >
                                    Next Step <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center mb-10">
                                <h2 className="type-h2 mb-2">Almost there!</h2>
                                <p className="text-muted text-sm">Where should we send your professional valuation?</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="premium-label">Full Name</label>
                                        <input 
                                            type="text"
                                            placeholder="Your Name"
                                            value={leadData.name}
                                            onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                            className="premium-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">WhatsApp Number</label>
                                        <input 
                                            type="tel"
                                            placeholder="+234 ..."
                                            value={leadData.whatsapp}
                                            onChange={e => setLeadData({ ...leadData, whatsapp: e.target.value })}
                                            className="premium-input"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="premium-label">Email Address</label>
                                    <input 
                                        type="email"
                                        placeholder="email@example.com"
                                        value={leadData.email}
                                        onChange={e => setLeadData({ ...leadData, email: e.target.value })}
                                        className="premium-input"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs flex items-center gap-2">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}

                            <div className="flex justify-between pt-6">
                                <button onClick={prevStep} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary flex items-center gap-2">
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <button 
                                    onClick={handleSubmitRequest} 
                                    disabled={loading || !leadData.name || !leadData.whatsapp}
                                    className="bg-burgundy text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-burgundy-dark transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Request Valuation'} <Send size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="type-h2 mb-4">Request Received.</h2>
                            <p className="type-body text-secondary mb-12 max-w-sm mx-auto">
                                Our advisors are now reviewing your vehicle details. 
                                You will receive your professional market valuation via <strong>WhatsApp</strong> and <strong>Email</strong> shortly.
                            </p>

                            <button 
                                onClick={() => window.location.href = '/'}
                                className="bg-cinema text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-page hover:text-primary transition-all border border-transparent hover:border-border-subtle"
                            >
                                Return to Homepage
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}

export default function ValuationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        }>
            <ValuationContent />
        </Suspense>
    );
}
