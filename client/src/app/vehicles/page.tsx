'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import VehicleCard from '@/components/VehicleCard';
<<<<<<< HEAD
import { Search, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MotionBackground from '@/components/landing/MotionBackground';
import PillHeader from '@/components/landing/PillHeader';
import PremiumButton from '@/components/ui/PremiumButton';
=======
import { Search, SlidersHorizontal } from 'lucide-react';
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28

export default function BrowseVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');

    const [filters, setFilters] = useState({
        make: '',
        model: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        status: '',
        sort: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const defaultSort = status === 'in_auction' ? 'popularity' : 'recommended';

        setFilters(prev => ({
            ...prev,
            status: status || '',
            sort: defaultSort
        }));

        fetchVehicles(status || '', defaultSort);
    }, []);

    async function fetchVehicles(forcedStatus?: string, forcedSort?: string) {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            const activeFilters = {
                ...filters,
                status: forcedStatus !== undefined ? forcedStatus : filters.status,
                sort: forcedSort !== undefined ? forcedSort : filters.sort
            };

            Object.entries(activeFilters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value.toString());
            });
            if (search) queryParams.append('search', search);

            const response = await apiFetch(`/vehicles?${queryParams.toString()}`);
            setVehicles(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }

    const clearFilters = () => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const defaultSort = status === 'in_auction' ? 'popularity' : 'recommended';

        setFilters({
            make: '',
            model: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
            status: status || '',
            sort: defaultSort
        });
        setSearch('');
        fetchVehicles(status || '', defaultSort);
    };

    return (
<<<<<<< HEAD
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden pt-32 pb-20">
            <MotionBackground />
            <PillHeader />

            {/* Header & Main Controls */}
            <div className="relative z-30 mb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-slate-900 mb-2">
                            {filters.status === 'in_auction' ? 'Live Auctions.' : 'Marketplace Portfolio.'}
                        </h1>
                        <p className="text-slate-500 font-subheading text-sm">Discover and bid on premium curated vehicles.</p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-burgundy transition-colors" size={20} />
=======
        <div className="min-h-screen bg-canvas pb-20">
            {/* Header & Main Controls */}
            <div className="bg-white border-b border-gray-100 pt-10 pb-6 relative z-30">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-black mb-8">
                        {filters.status === 'in_auction' ? 'Live Auctions' : 'Browse Inventory'}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-burgundy transition-colors" size={20} />
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                            <input
                                type="text"
                                placeholder="Search by make, model, or year..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchVehicles()}
<<<<<<< HEAD
                                className="w-full pl-14 pr-6 py-4 rounded-full bg-white/80 backdrop-blur-md border border-white/40 focus:ring-4 focus:ring-burgundy/10 focus:border-burgundy/30 outline-none transition-all shadow-lg shadow-slate-900/5 text-slate-900 font-body text-sm placeholder:text-slate-400"
                            />
                        </div>

                        <PremiumButton
                            onClick={() => setShowFilters(true)}
                            variant="primary"
                            icon={SlidersHorizontal}
                            tooltip="Open advanced filters"
                        >
                            Filters
                        </PremiumButton>
=======
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-burgundy outline-none transition-all shadow-sm"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center justify-center space-x-2 px-6 py-4 bg-onyx text-white rounded-2xl hover:bg-onyx-dark transition-all shadow-lg active:scale-95 flex-shrink-0"
                        >
                            <SlidersHorizontal size={20} />
                            <span className="font-bold">Filters</span>
                        </button>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>

                    {/* Filter Modal Overlay */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowFilters(false)}
<<<<<<< HEAD
                                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
=======
                                    className="fixed inset-0 bg-onyx/40 backdrop-blur-sm z-[100]"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                />
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
<<<<<<< HEAD
                                    className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col pt-8 pb-10"
                                >
                                    <div className="flex items-center justify-between px-8 mb-8 border-b border-slate-100 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-heading font-extrabold text-slate-900">Refine Search</h2>
                                            <p className="text-xs font-subheading text-slate-400">Target your precise specifications.</p>
                                        </div>
                                        <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
=======
                                    className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl p-8 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-2xl font-black">Refine Search</h2>
                                        <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            <X size={24} />
                                        </button>
                                    </div>

<<<<<<< HEAD
                                    <div className="flex-1 space-y-8 overflow-y-auto px-8 custom-scrollbar">
                                        <div className="space-y-3">
                                            <label className="premium-label ml-0">Sorting Strategy</label>
                                            <div className="grid grid-cols-2 gap-3">
=======
                                    <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-widest text-onyx-light">Sorting Strategy</label>
                                            <div className="grid grid-cols-2 gap-2">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                {['recommended', 'popularity'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setFilters({ ...filters, sort: s })}
<<<<<<< HEAD
                                                        className={`py-3 rounded-2xl border font-subheading font-bold text-xs bg-white capitalize transition-all ${filters.sort === s ? 'border-burgundy bg-burgundy/5 text-burgundy shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
=======
                                                        className={`py-3 rounded-xl border-2 font-bold capitalize transition-all ${filters.sort === s ? 'border-burgundy bg-burgundy/5 text-burgundy' : 'border-gray-100 text-onyx-light hover:border-gray-200'
                                                            }`}
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
<<<<<<< HEAD
                                            <label className="premium-label ml-0">Manufacturer</label>
=======
                                            <label className="text-xs font-black uppercase tracking-widest text-onyx-light">Manufacturer</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            <input
                                                type="text"
                                                placeholder="e.g. Toyota"
                                                value={filters.make}
                                                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
<<<<<<< HEAD
                                                className="premium-input bg-slate-50"
=======
                                                className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-burgundy"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            />
                                        </div>

                                        <div className="space-y-3">
<<<<<<< HEAD
                                            <label className="premium-label ml-0">Vehicle Condition</label>
                                            <select
                                                value={filters.condition}
                                                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                                className="premium-input bg-slate-50 appearance-none"
=======
                                            <label className="text-xs font-black uppercase tracking-widest text-onyx-light">Vehicle Condition</label>
                                            <select
                                                value={filters.condition}
                                                onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                                                className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-burgundy appearance-none"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            >
                                                <option value="">Any Condition</option>
                                                <option value="foreign_used">Foreign Used (Tokunbo)</option>
                                                <option value="nigeria_used">Nigeria Used</option>
                                                <option value="new">Brand New</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
<<<<<<< HEAD
                                            <label className="premium-label ml-0">Price Range (₦)</label>
=======
                                            <label className="text-xs font-black uppercase tracking-widest text-onyx-light">Price Range (₦)</label>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={filters.minPrice}
                                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
<<<<<<< HEAD
                                                    className="premium-input bg-slate-50"
=======
                                                    className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-burgundy"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={filters.maxPrice}
                                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
<<<<<<< HEAD
                                                    className="premium-input bg-slate-50"
=======
                                                    className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-burgundy"
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                />
                                            </div>
                                        </div>
                                    </div>

<<<<<<< HEAD
                                    <div className="pt-8 px-8 flex gap-4 bg-white border-t border-slate-100 mt-auto">
                                        <PremiumButton variant="outline" onClick={clearFilters} className="flex-1">
                                            Reset
                                        </PremiumButton>
                                        <PremiumButton
                                            onClick={() => { fetchVehicles(); setShowFilters(false); }}
                                            className="flex-[2]"
                                            tooltip="Apply specific filters"
                                        >
                                            Show Results
                                        </PremiumButton>
=======
                                    <div className="pt-8 flex gap-4">
                                        <button
                                            onClick={clearFilters}
                                            className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => { fetchVehicles(); setShowFilters(false); }}
                                            className="flex-[2] py-4 bg-burgundy text-white rounded-2xl font-bold shadow-xl shadow-burgundy/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Show Results
                                        </button>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results Grid */}
<<<<<<< HEAD
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white/50 backdrop-blur-md rounded-[2rem] aspect-[4/5] animate-pulse border border-white shadow-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto text-center py-20 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white px-8">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-heading font-extrabold mb-2 text-slate-900">Network Error</h3>
                        <p className="text-slate-500 text-sm mb-8 font-body">We couldn&apos;t reach the Autogaard server. Please check your connection and try again.</p>
                        <PremiumButton
                            onClick={() => { fetchVehicles(); }}
                            className="w-full"
                        >
                            Retry Connection
                        </PremiumButton>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <p className="text-slate-500 font-subheading font-bold text-sm">Showing {vehicles.length} high-quality vehicles</p>
                                <div className="mt-3 flex gap-2">
                                    {filters.sort && <span className="premium-pill text-[10px] font-bold uppercase tracking-widest text-slate-600 border-slate-200">{filters.sort}</span>}
                                    {filters.condition && <span className="premium-pill text-[10px] font-bold uppercase tracking-widest text-burgundy bg-burgundy/5 border-burgundy/10">{filters.condition.replace('_', ' ')}</span>}
                                </div>
                            </div>
                            {filters.status === 'in_auction' && (
                                <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-md text-emerald-600 px-5 py-2.5 rounded-full border border-emerald-500/20 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Now</span>
                                </div>
                            )}
                        </div>

=======
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl aspect-[4/5] animate-pulse border border-gray-50 shadow-sm" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100 px-8">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black mb-2">Network Error</h3>
                        <p className="text-onyx-light text-sm mb-8">We couldn&apos;t reach the AutoConcierge server. Please check your connection and try again.</p>
                        <button
                            onClick={() => {
                                // Try fallback to 127.0.0.1 if failed
                                if (!window.location.hostname.includes('127.0.0.1')) {
                                    console.warn('Retrying with direct IP...');
                                }
                                fetchVehicles();
                            }}
                            className="bg-burgundy text-white w-full py-4 rounded-2xl font-bold shadow-lg shadow-burgundy/20"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <p className="text-onyx-light font-bold">Showing {vehicles.length} high-quality vehicles</p>
                                <div className="mt-2 flex gap-2">
                                    {filters.sort && <span className="text-[10px] bg-onyx text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">{filters.sort}</span>}
                                    {filters.condition && <span className="text-[10px] bg-burgundy text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">{filters.condition.replace('_', ' ')}</span>}
                                </div>
                            </div>
                            {filters.status === 'in_auction' && (
                                <div className="flex items-center space-x-2 bg-emerald/10 text-emerald-600 px-4 py-2 rounded-full border border-emerald/10 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest">Live Now</span>
                                </div>
                            )}
                        </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {vehicles.map((v: any) => (
                                <VehicleCard key={v.id} vehicle={v} />
                            ))}
                        </div>

                        {vehicles.length === 0 && (
<<<<<<< HEAD
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-xl px-8"
                            >
                                <div className="w-20 h-20 bg-slate-900/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-slate-400" />
                                </div>
                                <p className="text-3xl font-heading font-extrabold text-slate-900 mb-3 tracking-tight">No matching vehicles.</p>
                                <p className="text-slate-500 max-w-sm mx-auto mb-10 font-subheading">Adjust your criteria or reset filters to explore the rest of the portfolio.</p>
                                <PremiumButton onClick={clearFilters} variant="outline">
                                    Clear all filters
                                </PremiumButton>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </main>
    );
}

=======
                            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 px-8">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={40} className="text-gray-200" />
                                </div>
                                <p className="text-2xl font-black text-onyx mb-2">No matching vehicles</p>
                                <p className="text-onyx-light max-w-xs mx-auto mb-10">Adjust your criteria or reset filters to find what you&apos;re looking for.</p>
                                <button onClick={clearFilters} className="bg-onyx text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
