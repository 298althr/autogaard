'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuction } from '@/hooks/useAuction';
import { useWallet } from '@/hooks/useWallet';
import { AuctionTimer } from '@/components/auction/AuctionTimer';
import { BidFeed } from '@/components/auction/BidFeed';
import { BidPanel } from '@/components/auction/BidPanel';
<<<<<<< HEAD
import { BidHistoryModal } from '@/components/auction/BidHistoryModal';
import PillHeader from '@/components/landing/PillHeader';
import MotionBackground from '@/components/landing/MotionBackground';
import PremiumButton from '@/components/ui/PremiumButton';
=======
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
import {
    AlertCircle,
    ChevronLeft,
    Share2,
    Heart,
    Info,
    MapPin,
    Calendar,
    Activity,
    ShieldCheck,
<<<<<<< HEAD
    Gavel
=======
    CarFront
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuctionRoomPage() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const { auction, loading, error, placeBid } = useAuction(id as string, token);
    const { wallet } = useWallet();
<<<<<<< HEAD
    const [showHistoryModal, setShowHistoryModal] = React.useState(false);

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-900/5 text-slate-900 rounded-full flex items-center justify-center animate-pulse mb-6">
                <Gavel size={24} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Vault...</p>
=======

    if (loading) return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin mb-6" />
            <p className="text-onyx-light font-black uppercase tracking-widest text-xs">Entering Auction Room...</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        </div>
    );

    if (error || !auction) return (
<<<<<<< HEAD
        <div className="min-h-screen bg-[#F8FAFC] pt-32 flex flex-col items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card shadow-xl p-10 text-center max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-heading font-extrabold text-slate-900 mb-3 tracking-tight">Market Unavailable.</h1>
                <p className="text-sm font-subheading text-slate-500 mb-10 leading-relaxed">{error || 'This asset may have been removed or the auction has concluded.'}</p>
                <Link href="/vehicles">
                    <PremiumButton className="w-full">Return to Markets</PremiumButton>
                </Link>
            </motion.div>
=======
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center p-4">
            <div className="bg-red-50 text-red-500 p-8 rounded-[3rem] text-center max-w-md border border-red-100">
                <AlertCircle className="mx-auto mb-4" size={48} />
                <h1 className="text-2xl font-black mb-2">Auction Unavailable</h1>
                <p className="font-medium text-red-400 mb-6">{error || 'This auction might have ended or does not exist.'}</p>
                <Link href="/vehicles" className="inline-block px-8 py-3 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Return home</Link>
            </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        </div>
    );

    return (
<<<<<<< HEAD
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden pt-32 pb-20 px-6">
            <MotionBackground />
            <PillHeader />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Link */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Link href="/vehicles" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-subheading">Back to Markets</span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Vehicle Details (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="glass-card p-4 relative overflow-hidden group"
                        >
                            <div className="aspect-[16/9] w-full rounded-[2rem] bg-slate-100 overflow-hidden relative shadow-inner">
                                <img
                                    src={auction.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000'}
                                    alt={auction.model}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                                />
                                <div className="absolute top-6 left-6 flex space-x-3">
                                    <div className="px-5 py-2.5 bg-burgundy/90 backdrop-blur-md text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg animate-pulse">
                                        Active Market
                                    </div>
                                    <div className="px-5 py-2.5 bg-white/90 backdrop-blur-md text-slate-900 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg flex items-center space-x-2">
                                        <Gavel size={12} className="text-burgundy" />
                                        <span>{auction.bid_count} Participants</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="p-3.5 bg-white/90 backdrop-blur-md text-slate-700 rounded-full shadow-xl hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110"><Heart size={18} /></button>
                                    <button className="p-3.5 bg-white/90 backdrop-blur-md text-slate-700 rounded-full shadow-xl hover:bg-slate-900 hover:text-white transition-all transform hover:scale-110"><Share2 size={18} /></button>
                                </div>
                            </div>
                        </motion.section>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-card p-8 md:p-12"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{auction.year} {auction.make} <br className="hidden md:block" />{auction.model}</h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 font-bold text-[10px] uppercase tracking-widest font-subheading border border-slate-100 shadow-sm">
                                            <MapPin size={12} className="text-burgundy" />
                                            <span>{auction.location || 'Escrow Facility'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 font-bold text-[10px] uppercase tracking-widest font-subheading border border-slate-100 shadow-sm">
                                            <Calendar size={12} className="text-burgundy" />
                                            <span>Listed {new Date(auction.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 font-bold text-[10px] uppercase tracking-widest font-subheading border border-slate-100 shadow-sm">
                                            <Activity size={12} className="text-burgundy" />
=======
        <main className="min-h-screen bg-canvas pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Link */}
                <Link href="/vehicles" className="inline-flex items-center space-x-2 text-onyx-light hover:text-burgundy transition-colors mb-8 group">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to catalog</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Vehicle Details (7 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[3.5rem] p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="aspect-[16/9] w-full rounded-[2.5rem] bg-gray-100 overflow-hidden relative group">
                                <img
                                    src={auction.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2000'}
                                    alt={auction.model}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-6 left-6 flex space-x-2">
                                    <div className="px-5 py-2 bg-burgundy text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        Live Auction
                                    </div>
                                    <div className="px-5 py-2 bg-white/90 backdrop-blur-md text-onyx rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                                        {auction.bid_count} Bids
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-3 bg-white text-onyx rounded-full shadow-xl hover:bg-burgundy hover:text-white transition-all"><Heart size={18} /></button>
                                    <button className="p-3 bg-white text-onyx rounded-full shadow-xl hover:bg-burgundy hover:text-white transition-all"><Share2 size={18} /></button>
                                </div>
                            </div>
                        </section>

                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-5xl font-black text-onyx mb-3">{auction.year} {auction.make} {auction.model}</h1>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-canvas rounded-xl text-onyx-light font-bold text-xs border border-gray-50">
                                            <MapPin size={14} className="text-burgundy" />
                                            <span>{auction.location || 'Lagos, Nigeria'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-canvas rounded-xl text-onyx-light font-bold text-xs border border-gray-50">
                                            <Calendar size={14} className="text-burgundy" />
                                            <span>Listed {new Date(auction.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-canvas rounded-xl text-onyx-light font-bold text-xs border border-gray-50">
                                            <Activity size={14} className="text-burgundy" />
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            <span>{auction.mileage_km?.toLocaleString()} km</span>
                                        </div>
                                    </div>
                                </div>
<<<<<<< HEAD
                                <div className="flex flex-col items-end shrink-0">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 font-subheading">Market Closes In</div>
                                    <div className="scale-110 origin-right">
                                        <AuctionTimer endTime={auction.end_time} />
                                    </div>
=======
                                <div className="flex flex-col items-end">
                                    <div className="text-[10px] font-black text-onyx-light uppercase tracking-widest mb-1">Time Remaining</div>
                                    <AuctionTimer endTime={auction.end_time} />
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
<<<<<<< HEAD
                                    <h3 className="font-bold text-slate-900 uppercase tracking-[0.2em] text-[10px] flex items-center space-x-3 font-subheading mb-8">
                                        <ShieldCheck size={16} className="text-burgundy" />
                                        <span>Asset Overview</span>
                                    </h3>
                                    <div className="space-y-1">
                                        {Object.entries(auction.specs || {}).map(([key, val]: any) => (
                                            <div key={key} className="flex justify-between items-center py-4 border-b border-slate-50 group hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{key}</span>
                                                <span className="text-sm font-heading font-bold text-slate-900">{val}</span>
=======
                                    <h3 className="font-black text-onyx uppercase tracking-widest text-xs flex items-center space-x-2">
                                        <ShieldCheck size={16} className="text-burgundy" />
                                        <span>Vehicle Overview</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(auction.specs || {}).map(([key, val]: any) => (
                                            <div key={key} className="flex justify-between items-center py-3 border-b border-gray-50">
                                                <span className="text-[11px] font-bold text-onyx-light uppercase tracking-widest">{key}</span>
                                                <span className="text-sm font-black text-onyx">{val}</span>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
<<<<<<< HEAD
                                    <h3 className="font-bold text-slate-900 uppercase tracking-[0.2em] text-[10px] flex items-center space-x-3 font-subheading mb-8">
                                        <Info size={16} className="text-burgundy" />
                                        <span>Market Protocols</span>
                                    </h3>
                                    <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-xs font-medium text-slate-500 leading-relaxed space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                            <p className="font-body"><strong>Capital Requirement:</strong> 20% refundable liquid capital required to initiate market position.</p>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                            <p className="font-body"><strong>Anti-Snipe Protection:</strong> Trading activity within final 2 minutes triggers automatic 2-minute market extension.</p>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                            <p className="font-body"><strong>Settlement:</strong> Winning market position requires complete settlement within 48 standard hours.</p>
=======
                                    <h3 className="font-black text-onyx uppercase tracking-widest text-xs flex items-center space-x-2">
                                        <Info size={16} className="text-burgundy" />
                                        <span>Auction terms</span>
                                    </h3>
                                    <div className="p-6 bg-canvas rounded-3xl border border-gray-100 text-xs font-medium text-onyx-light leading-relaxed space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                                            <p>20% refundable deposit required to place any bid.</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                                            <p>Anti-snipe: Any bid in last 2 mins extends deadline by 2 mins.</p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-burgundy mt-1.5 shrink-0" />
                                            <p>Winning bidder must settle full payment within 48 hours.</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                        </div>
                                    </div>
                                </div>
                            </div>
<<<<<<< HEAD
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Bidding (4 cols) */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <BidPanel
                                currentPrice={auction.current_price}
                                bidIncrement={auction.bid_increment}
                                depositPct={auction.deposit_pct}
                                walletBalance={wallet?.available || 0}
                                onBid={placeBid}
                                onViewHistory={() => setShowHistoryModal(true)}
                                disabled={auction.status !== 'live'}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                            <BidFeed bids={auction.bids || []} />
                        </motion.div>
                    </div>
                </div>
            </div>

            <BidHistoryModal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                auctionId={id as string}
                token={token}
            />
=======
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Bidding (5 cols) */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24">
                        <BidPanel
                            currentPrice={auction.current_price}
                            bidIncrement={auction.bid_increment}
                            depositPct={auction.deposit_pct}
                            walletBalance={wallet?.available || 0}
                            onBid={placeBid}
                            disabled={auction.status !== 'live'}
                        />

                        <BidFeed bids={auction.bids || []} />
                    </div>
                </div>
            </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        </main>
    );
}
