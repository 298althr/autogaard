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
    { id: 'vehicle', title: 'Vehicle' },
    { id: 'condition', title: 'Condition' },
    { id: 'results', title: 'Value' }
];

function ValuationContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        make: searchParams.get('make') || '',
        model: searchParams.get('model') || '',
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
        setFormData(prev => ({ ...prev, model: '' }));
        setSelectedModelId(null);
        setLoadingModels(true);
        apiFetch(`/catalog/models?makeId=${selectedMakeId}`).then(res => {
            if (res.data) setModels(res.data);
        }).catch(console.error).finally(() => setLoadingModels(false));
    }, [selectedMakeId]);

    useEffect(() => {
        if (!selectedModelId) return;
        // Fast-track: automatically proceed when model is picked
        const model = models.find(m => m.id === selectedModelId);
        if (model) {
            setFormData(prev => ({ ...prev, model: model.name }));
            setTimeout(() => setStep(1), 300);
        }
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
            <section className="pt-40 pb-24 px-6 bg-cinema text-white relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606386/autogaard/assets/ag001.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema via-transparent to-cinema/60" />
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
                <div className="bg-surface border border-border-subtle rounded-3xl p-6 md:p-12 shadow-xl shadow-black/5">
                    {step === 0 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
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
                                        className="premium-input h-12 py-0 text-xs"
                                    >
                                        <option value="">Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="premium-label">Year</label>
                                    <select 
                                        value={formData.year} 
                                        onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} 
                                        className="premium-input h-12 py-0 text-xs"
                                    >
                                        {Array.from({ length: 25 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="premium-label">Select Model</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                    {loadingModels ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
                                        ))
                                    ) : models.map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, model: m.name });
                                                setSelectedModelId(m.id);
                                            }}
                                            className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${
                                                formData.model === m.name 
                                                    ? 'bg-burgundy border-burgundy text-white shadow-md' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                            }`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => nextStep()}
                                disabled={!formData.model}
                                className="w-full bg-burgundy text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-burgundy/20 disabled:opacity-50 active:scale-95 transition-transform"
                            >
                                Continue to Condition
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="premium-label">Mileage (KM)</label>
                                    <input 
                                        type="number" 
                                        value={formData.mileage_km} 
                                        onChange={e => setFormData({ ...formData, mileage_km: parseInt(e.target.value) })} 
                                        className="premium-input h-12"
                                        placeholder="e.g. 50000"
                                    />
                                </div>
                                <div>
                                    <label className="premium-label">Condition</label>
                                    <select 
                                        value={formData.condition} 
                                        onChange={e => setFormData({ ...formData, condition: e.target.value })} 
                                        className="premium-input h-12"
                                    >
                                        <option value="excellent">Excellent</option>
                                        <option value="good">Good</option>
                                        <option value="fair">Fair</option>
                                        <option value="poor">Poor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <input 
                                    type="checkbox" 
                                    id="acc-history"
                                    checked={formData.accident_history}
                                    onChange={e => setFormData({ ...formData, accident_history: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-burgundy focus:ring-burgundy"
                                />
                                <label htmlFor="acc-history" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accident History?</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={prevStep} className="flex-1 py-4 border border-border-subtle text-secondary rounded-xl font-black uppercase tracking-widest text-[10px]">
                                    Back
                                </button>
                                <button onClick={nextStep} className="flex-[2] bg-burgundy text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg">
                                    Next: Get Report
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-emerald-500" size={32} />
                                </div>
                                <h3 className="text-lg font-black">Data Confirmed.</h3>
                                <p className="text-xs text-muted mt-1">Where should we send your valuation report?</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="premium-label">Name</label>
                                    <input 
                                        className="premium-input h-12"
                                        placeholder="Full Name"
                                        value={leadData.name}
                                        onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="premium-label">WhatsApp Number</label>
                                    <input 
                                        className="premium-input h-12"
                                        placeholder="+234..."
                                        value={leadData.whatsapp}
                                        onChange={e => setLeadData({ ...leadData, whatsapp: e.target.value })}
                                    />
                                </div>
                                <button 
                                    onClick={handleSubmitRequest}
                                    disabled={loading || !leadData.whatsapp}
                                    className="w-full bg-cinema text-white py-5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                >
                                    {loading ? <LoadingSpinner size="sm" color="white" /> : <><Send size={16} /> Send My Valuation</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black mb-2">Request Sent.</h2>
                            <p className="text-xs text-secondary leading-relaxed mb-10 max-w-[240px] mx-auto">
                                Our experts are reviewing your <strong>{formData.make} {formData.model}</strong>. Watch your WhatsApp for the report.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 border border-border-subtle text-secondary rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                Done
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
