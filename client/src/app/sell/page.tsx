'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
<<<<<<< HEAD
import PremiumButton from '@/components/ui/PremiumButton';
import PillHeader from '@/components/landing/PillHeader';
import MotionBackground from '@/components/landing/MotionBackground';
=======
import { Button } from '@/components/ui/Base';
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
import {
    Car,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Camera,
    MapPin,
    Tags,
<<<<<<< HEAD
    ShieldCheck
=======
    ShieldCheck,
    Loader2
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: 2020,
        condition: 'good',
        mileage_km: 0,
        price: 0,
        location: 'Lagos',
        color: '',
        vin: ''
    });

    useEffect(() => {
<<<<<<< HEAD
=======
        // Load data from valuation if available
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        const saved = sessionStorage.getItem('pending_listing');
        if (saved) {
            const data = JSON.parse(saved);
            setFormData(prev => ({
                ...prev,
                make: data.make,
                model: data.model,
                year: data.year,
                condition: data.condition,
                mileage_km: data.mileage_km,
                price: data.estimated_value
            }));
<<<<<<< HEAD
=======
            // Clear it so it doesn't persist forever
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
            sessionStorage.removeItem('pending_listing');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            await apiFetch('/vehicles', {
                method: 'POST',
                token,
                body: formData
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/vehicles');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to list vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
<<<<<<< HEAD
            <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden flex items-center justify-center pt-24 pb-20 px-6">
                <MotionBackground />
                <PillHeader />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 md:p-16 text-center max-w-lg relative z-10"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-heading font-extrabold mb-4 text-slate-900 tracking-tight">Listing Initiated.</h1>
                    <p className="text-slate-500 font-subheading text-sm mb-8 leading-relaxed">
                        Your {formData.year} {formData.make} {formData.model} has been added to our catalog.
                        Redirecting to your portfolio...
                    </p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
=======
            <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg"
                >
                    <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-onyx">Listing Created!</h1>
                    <p className="text-onyx-light font-medium mb-8">
                        Your {formData.year} {formData.make} {formData.model} has been listed successfully.
                        Redirecting you to the inventory...
                    </p>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3 }}
<<<<<<< HEAD
                            className="h-full bg-emerald-500"
                        />
                    </div>
                </motion.div>
            </main>
=======
                            className="h-full bg-emerald"
                        />
                    </div>
                </motion.div>
            </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        );
    }

    return (
<<<<<<< HEAD
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden pt-32 pb-20">
            <MotionBackground />
            <PillHeader />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-burgundy mb-4"
                    >
                        <Car size={20} />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Asset Listing Protocol</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-900 mb-3"
                    >
                        List Your Asset.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-subheading text-sm"
                    >
                        Provide precise details to initiate the sales protocol.
                    </motion.p>
=======
        <main className="min-h-screen bg-canvas pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-10">
                    <div className="flex items-center space-x-3 text-burgundy mb-2">
                        <Car size={24} />
                        <span className="font-bold uppercase tracking-widest text-xs">Vehicle Listing</span>
                    </div>
                    <h1 className="text-4xl font-black">List Your Vehicle</h1>
                    <p className="text-onyx-light font-medium mt-2">Complete the details below to list your car for sale.</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Column */}
                    <div className="lg:col-span-2">
<<<<<<< HEAD
                        <motion.form
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            onSubmit={handleSubmit}
                            className="glass-card p-8 md:p-10 space-y-8"
                        >
                            {/* Basic Info */}
                            <section className="space-y-6">
                                <h2 className="text-xl font-heading font-extrabold flex items-center text-slate-900">
                                    <span className="w-8 h-8 rounded-[10px] bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs mr-3 shadow-inner">1</span>
                                    Vehicle Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="premium-label">Make</label>
=======
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-8">
                            {/* Basic Info */}
                            <section className="space-y-6">
                                <h2 className="text-xl font-black flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-onyx text-white flex items-center justify-center text-sm mr-3">1</span>
                                    Vehicle Details
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Make</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="text"
                                            value={formData.make}
                                            onChange={e => setFormData({ ...formData, make: e.target.value })}
<<<<<<< HEAD
                                            className="premium-input bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Model</label>
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Model</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="text"
                                            value={formData.model}
                                            onChange={e => setFormData({ ...formData, model: e.target.value })}
<<<<<<< HEAD
                                            className="premium-input bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Year</label>
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Year</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
<<<<<<< HEAD
                                            className="premium-input bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Mileage (KM)</label>
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Mileage (KM)</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="number"
                                            value={formData.mileage_km}
                                            onChange={e => setFormData({ ...formData, mileage_km: parseInt(e.target.value) })}
<<<<<<< HEAD
                                            className="premium-input bg-white"
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Specific Info */}
<<<<<<< HEAD
                            <section className="space-y-6 pt-6 border-t border-slate-100">
                                <h2 className="text-xl font-heading font-extrabold flex items-center text-slate-900">
                                    <span className="w-8 h-8 rounded-[10px] bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs mr-3 shadow-inner">2</span>
                                    Specifications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="premium-label">VIN (Optional)</label>
=======
                            <section className="space-y-6 pt-4 border-t border-gray-50">
                                <h2 className="text-xl font-black flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-onyx text-white flex items-center justify-center text-sm mr-3">2</span>
                                    Specifications
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">VIN (Optional)</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="text"
                                            value={formData.vin}
                                            onChange={e => setFormData({ ...formData, vin: e.target.value })}
<<<<<<< HEAD
                                            placeholder="17-digit ID"
                                            className="premium-input bg-white uppercase placeholder:normal-case"
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Color</label>
=======
                                            placeholder="17-digit vehicle ID"
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium uppercase"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Color</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                                            placeholder="e.g. Metallic Black"
<<<<<<< HEAD
                                            className="premium-input bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="premium-label">Location</label>
                                        <select
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="premium-input bg-white appearance-none"
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Location</label>
                                        <select
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy transition-all outline-none font-medium"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        >
                                            <option value="Lagos">Lagos</option>
                                            <option value="Abuja">Abuja</option>
                                            <option value="Port Harcourt">Port Harcourt</option>
                                            <option value="Ibadan">Ibadan</option>
                                            <option value="Kano">Kano</option>
                                        </select>
                                    </div>
<<<<<<< HEAD
                                    <div>
                                        <label className="premium-label">Asking Price (₦)</label>
=======
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-onyx-light ml-1">Asking Price (₦)</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
<<<<<<< HEAD
                                            className="premium-input bg-emerald-50 text-emerald-700 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-black text-lg shadow-inner"
=======
                                            className="w-full px-5 py-3.5 rounded-2xl bg-emerald/5 text-emerald border-2 border-emerald/10 focus:ring-2 focus:ring-emerald transition-all outline-none font-black text-lg"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {error && (
<<<<<<< HEAD
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-2 border border-red-100 text-xs font-bold font-subheading">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div className="pt-4">
                                <PremiumButton
                                    type="submit"
                                    isLoading={loading}
                                    className="w-full"
                                    icon={ArrowRight}
                                    tooltip="Initiate smart contract listing"
                                >
                                    Publish Asset
                                </PremiumButton>
                            </div>
                        </motion.form>
=======
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center space-x-2 border border-red-100">
                                    <AlertCircle size={18} />
                                    <span className="text-sm font-bold">{error}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 text-lg rounded-2xl shadow-xl shadow-burgundy/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" /> Publishing...
                                    </>
                                ) : (
                                    <>
                                        List Vehicle Now <ArrowRight className="ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>

                    {/* Sidebar / Tips */}
                    <div className="space-y-6">
<<<<<<< HEAD
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                            className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                            <h3 className="text-xl font-heading font-extrabold mb-6">Listing Intelligence</h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 text-burgundy-light shadow-inner">
                                        <Camera size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-300">Visuals</h4>
                                        <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-body">Attach high-fidelity imagery via terminal post-creation.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 text-burgundy-light shadow-inner">
                                        <Tags size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-300">Liquidity</h4>
                                        <p className="text-xs text-white/50 mt-1.5 leading-relaxed font-body">Engine suggested ₦{formData.price.toLocaleString()}. Proximity increases closure velocity by 40%.</p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                            className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start space-x-4 shadow-sm"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0 border border-emerald-50">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight mb-1">Accelerated Review</h4>
                                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                                    Verified identities bypass standard escrow queue. Visibility in under 30 minutes.
                                </p>
                            </div>
                        </motion.div>
=======
                        <div className="bg-onyx text-white p-8 rounded-[2.5rem] shadow-xl">
                            <h3 className="text-xl font-black mb-6">Listing Tips</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Camera className="text-burgundy-light" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Photos Matter</h4>
                                        <p className="text-xs text-white/60 mt-1 leading-relaxed">You can add photos to your listing from your dashboard after creation.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Tags className="text-burgundy-light" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Be Competitive</h4>
                                        <p className="text-xs text-white/60 mt-1 leading-relaxed">Our AI suggested ₦{formData.price.toLocaleString()}. Listings close to AI valuation sell 40% faster.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-emerald/5 border border-emerald/10 p-6 rounded-[2rem] flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald shadow-sm shrink-0">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-onyx uppercase text-xs tracking-tight mb-1">Fast Review</h4>
                                <p className="text-[10px] text-onyx-light leading-relaxed font-medium">
                                    Verified users enjoy instant listing. Your car will be visible in the marketplace within 30 minutes.
                                </p>
                            </div>
                        </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>
                </div>
            </div>
        </main>
    );
}
