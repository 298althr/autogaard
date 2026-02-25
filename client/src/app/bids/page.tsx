'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
<<<<<<< HEAD
import PillHeader from '@/components/landing/PillHeader';
import MotionBackground from '@/components/landing/MotionBackground';
import PremiumButton from '@/components/ui/PremiumButton';
=======
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
import {
    Gavel,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
<<<<<<< HEAD
=======
    ShoppingBag,
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function BidsPage() {
    const { token } = useAuth();
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBids = async () => {
            if (!token) return;
            try {
                const res = await apiFetch('/me/bids', { token });
                setBids(res.data);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBids();
    }, [token]);

    return (
<<<<<<< HEAD
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden pt-32 pb-20 px-6">
            <MotionBackground />
            <PillHeader />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center space-x-2 text-burgundy font-bold uppercase tracking-widest text-[10px] mb-3">
                            <History size={16} />
                            <span>Activity Tracker</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">Active Bids.</h1>
                        <p className="text-slate-500 font-subheading text-sm mt-3 leading-relaxed">Track your market positioning and participation history.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-slate-200"
                    >
                        <Link href="/garage" className="px-6 py-2.5 text-slate-500 hover:text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors">Acquired</Link>
                        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">Active Bids</button>
                    </motion.div>
                </header>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center space-x-3 text-red-600 text-xs font-bold font-subheading">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                {loading ? (
                    <div className="py-32 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-900/5 text-slate-900 rounded-full flex items-center justify-center animate-pulse mb-6">
                            <History size={24} />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Fetching Records...</p>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-subheading">Vehicle Detail</th>
                                        <th className="p-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-subheading">Status</th>
                                        <th className="p-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-subheading">Market Position</th>
                                        <th className="p-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-subheading text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
=======
        <main className="min-h-screen bg-canvas pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center space-x-2 text-burgundy font-black uppercase tracking-widest text-[10px] mb-2">
                            <History size={14} />
                            <span>Activity Tracker</span>
                        </div>
                        <h1 className="text-5xl font-black text-onyx">My Bids</h1>
                        <p className="text-onyx-light font-medium mt-1">Track your active bids and participation history.</p>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                        <Link href="/garage" className="px-6 py-2 text-onyx-light hover:text-onyx rounded-xl text-xs font-black uppercase tracking-widest">Won</Link>
                        <button className="px-6 py-2 bg-onyx text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Active Bids</button>
                    </div>
                </header>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center space-x-3 text-red-600 font-bold">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin mb-4" />
                        <p className="text-onyx-light font-bold uppercase tracking-widest text-xs">Fetching Records...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-canvas/50">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-onyx-light">Vehicle Detail</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-onyx-light">Status</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-onyx-light">Bidding State</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-onyx-light text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                    <AnimatePresence mode="popLayout">
                                        {bids.map((bid) => (
                                            <motion.tr
                                                key={bid.auction_id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
<<<<<<< HEAD
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/30 transition-colors group"
                                            >
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                                                            <img src={bid.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1]" alt={bid.model} />
                                                        </div>
                                                        <div>
                                                            <div className="font-heading font-extrabold text-slate-900 text-lg tracking-tight leading-tight">{bid.year} {bid.make} {bid.model}</div>
                                                            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">
=======
                                                className="hover:bg-canvas/30 transition-colors group"
                                            >
                                                <td className="p-8">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                                            <img src={bid.images[0]} className="w-full h-full object-cover" alt={bid.model} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-onyx text-lg">{bid.year} {bid.make} {bid.model}</div>
                                                            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-onyx-light mt-1">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                                <Clock size={12} className="text-burgundy" />
                                                                <span>Participated {new Date(bid.bid_time).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8">
<<<<<<< HEAD
                                                    <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm border ${bid.auction_status === 'live' ? 'bg-burgundy/5 text-burgundy border-burgundy/10 animate-pulse' : 'bg-slate-50 text-slate-500 border-slate-100'
=======
                                                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${bid.auction_status === 'live' ? 'bg-burgundy/10 text-burgundy animate-pulse' : 'bg-onyx/5 text-onyx-light'
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                        }`}>
                                                        <span>{bid.auction_status}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8">
<<<<<<< HEAD
                                                    <div className="space-y-1.5">
                                                        <div className="text-xl font-heading font-extrabold text-slate-900 flex items-center tracking-tight">
                                                            <span className="text-xs text-slate-400 mr-1.5">₦</span>
                                                            {bid.current_price.toLocaleString()}
                                                        </div>
                                                        <div className={`flex items-center space-x-1.5 text-[8px] font-bold uppercase tracking-[0.2em] ${bid.is_winning ? 'text-emerald-500' : 'text-orange-500'
                                                            }`}>
                                                            {bid.is_winning ? (
                                                                <>
                                                                    <CheckCircle2 size={12} className="bg-emerald-50 rounded-full" />
                                                                    <span>Primary Position</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle size={12} className="bg-orange-50 rounded-full" />
=======
                                                    <div className="space-y-1">
                                                        <div className="text-lg font-black text-onyx flex items-center">
                                                            <span className="text-xs text-onyx-light mr-1">₦</span>
                                                            {bid.current_price.toLocaleString()}
                                                        </div>
                                                        <div className={`flex items-center space-x-1 text-[8px] font-black uppercase tracking-[0.2em] ${bid.is_winning ? 'text-emerald' : 'text-red-500'
                                                            }`}>
                                                            {bid.is_winning ? (
                                                                <>
                                                                    <CheckCircle2 size={10} />
                                                                    <span>Currently Highest</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle size={10} />
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                                    <span>Outbid</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right">
<<<<<<< HEAD
                                                    <Link href={bid.auction_status === 'live' ? `/auctions/${bid.auction_id}` : `/vehicles/${bid.auction_id}`}>
                                                        <PremiumButton
                                                            variant="outline"
                                                            size="sm"
                                                            icon={ArrowUpRight}
                                                            tooltip={bid.auction_status === 'live' ? 'Enter Trading Floor' : 'View Market Result'}
                                                        >
                                                            {bid.auction_status === 'live' ? 'Go to Room' : 'View Result'}
                                                        </PremiumButton>
=======
                                                    <Link
                                                        href={bid.auction_status === 'live' ? `/auctions/${bid.auction_id}` : `/vehicles/${bid.auction_id}`}
                                                        className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-onyx group-hover:text-burgundy transition-colors"
                                                    >
                                                        <span>{bid.auction_status === 'live' ? 'Go to Room' : 'View Result'}</span>
                                                        <ArrowUpRight size={14} />
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>

                                    {bids.length === 0 && (
                                        <tr>
<<<<<<< HEAD
                                            <td colSpan={4} className="p-24 text-center">
                                                <Gavel size={40} className="mx-auto mb-6 text-slate-300" />
                                                <h3 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight mb-2">No Bidding History.</h3>
                                                <p className="text-sm text-slate-500 font-subheading">You have not initiated any market positions.</p>
                                                <Link href="/vehicles">
                                                    <PremiumButton className="mt-8" icon={Gavel}>Explore Markets</PremiumButton>
                                                </Link>
=======
                                            <td colSpan={4} className="p-20 text-center">
                                                <Gavel size={48} className="mx-auto mb-4 text-onyx-light opacity-20" />
                                                <h3 className="text-xl font-black text-onyx">No Bidding History</h3>
                                                <p className="text-sm text-onyx-light font-medium">You haven't placed any bids yet.</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
<<<<<<< HEAD
                    </motion.div>
=======
                    </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                )}
            </div>
        </main>
    );
}
