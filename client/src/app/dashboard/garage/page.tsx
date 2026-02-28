'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Warehouse,
    Plus,
    Car,
    Activity,
    Tag,
    Wrench,
    ShieldCheck,
    ChevronRight,
    Search,
    Eye,
    EyeOff,
    Info,
    ArrowUpRight,
    ArrowRight,
    Zap,
    History,
    FileText,
    ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useGarage, useSales } from '@/hooks/useGarage';
import WorkshopHubs from '@/components/garage/WorkshopHubs';
import { getAssetUrl, apiFetch, getVehicleImages } from '@/lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function GaragePage() {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<'vault' | 'services' | 'sales'>('vault');

    const { vehicles, loading: garageLoading, refetch } = useGarage(token);
    const { sales, loading: salesLoading } = useSales(token);

    if (!user) return null;

    const togglePrivacy = async (id: string, current: boolean) => {
        try {
            await apiFetch(`/vehicles/${id}/privacy`, {
                token,
                method: 'PATCH',
                body: { is_private: !current }
            });
            refetch();
        } catch (err: any) {
            console.error('Privacy update failed', err);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-8 pb-32"
        >
            {/* Immersive Premium Header */}
            <motion.div variants={itemVariants} className="relative h-60 md:h-80 rounded-[3rem] overflow-hidden bg-onyx shadow-2xl shadow-onyx/30 group">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-onyx via-onyx/90 to-burgundy/20 z-10" />
                <div className="absolute inset-0 opacity-20 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_rgba(128,0,32,0.4),transparent_50%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_rgba(148,163,184,0.1),transparent_50%)]" />
                </div>

                {/* Car Silhouette / Grid Pattern */}
                <div className="absolute inset-0 z-5 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-8 h-8 rounded-full bg-burgundy/20 flex items-center justify-center border border-burgundy/30">
                            <Warehouse size={14} className="text-burgundy" />
                        </div>
                        <span className="text-burgundy font-black text-[10px] uppercase tracking-[0.4em]">Asset Custody Protocol</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-heading font-black text-white tracking-tighter mb-4"
                    >
                        The <span className="text-burgundy">Garage.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/50 text-xs md:text-sm font-subheading font-medium max-w-lg leading-relaxed uppercase tracking-widest"
                    >
                        Precision management of your automotive portfolio, verification status, and concierge maintenance protocols.
                    </motion.p>
                </div>

                <div className="absolute bottom-8 right-8 z-30 hidden md:flex gap-4">
                    <Link href="/dashboard/compare" className="bg-white/5 backdrop-blur-md hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2">
                        <ArrowLeftRight size={14} /> Compare Assets
                    </Link>
                    <Link href="/dashboard/valuation/wizard" className="bg-burgundy hover:bg-burgundy-light text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-burgundy/30 flex items-center gap-2">
                        <Plus size={16} /> Register Asset
                    </Link>
                </div>
            </motion.div>

            {/* Quick Actions for Mobile - Redesigned */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 md:hidden px-2">
                <Link href="/dashboard/market" className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center gap-3 group active:scale-95 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-burgundy/10 group-hover:text-burgundy transition-colors">
                        <Search size={22} className="text-slate-400 group-hover:text-burgundy" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Discover</span>
                </Link>
                <Link href="/dashboard/valuation/wizard" className="bg-onyx p-6 rounded-[2.5rem] shadow-xl shadow-onyx/20 flex flex-col items-center gap-3 active:scale-95 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Plus size={22} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Register</span>
                </Link>
            </motion.div>

            {/* Premium Tab Navigation - High Contrast */}
            <motion.div variants={itemVariants} className="flex items-center justify-center px-2">
                <nav className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-[2.5rem] w-full max-w-xl shadow-inner border border-white/50">
                    {[
                        { id: 'vault', label: 'Vault', icon: Warehouse },
                        { id: 'services', label: 'Concierge', icon: Wrench },
                        { id: 'sales', label: 'Listings', icon: Tag }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white text-onyx shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] scale-[1.02] z-10' : 'text-slate-400 hover:text-onyx'}`}
                        >
                            <tab.icon size={16} className={activeTab === tab.id ? 'text-burgundy' : ''} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </motion.div>

            {/* Tab Content */}
            <div className="pt-4 px-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'vault' && (
                        <motion.div
                            key="vault"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                                    Total Portfolio Assets ({vehicles.length})
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-onyx transition-colors">
                                        <History size={18} />
                                    </button>
                                </div>
                            </div>

                            {garageLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => <div key={i} className="aspect-[16/11] bg-slate-50 rounded-[3rem] animate-pulse border border-slate-100" />)}
                                </div>
                            ) : vehicles.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {vehicles.map(v => (
                                        <VehicleCard
                                            key={v.id}
                                            vehicle={v}
                                            onTogglePrivacy={() => togglePrivacy(v.id, v.is_private)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<Car size={48} />}
                                    title="Vault Idle."
                                    desc="You haven't added any vehicles to your custody yet. Register your first asset or explore the market."
                                    actionUrl="/dashboard/market"
                                    actionLabel="Browse Marketplace"
                                />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'services' && (
                        <motion.div
                            key="services"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            <div className="text-center max-w-xl mx-auto py-12">
                                <div className="inline-flex items-center gap-2 bg-burgundy/5 px-4 py-2 rounded-full mb-6">
                                    <Wrench size={14} className="text-burgundy" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-burgundy">Service Protocols</span>
                                </div>
                                <h2 className="text-4xl font-heading font-black text-onyx tracking-tight mb-4">Concierge Level Care.</h2>
                                <p className="text-sm text-slate-400 font-medium font-subheading uppercase tracking-widest leading-relaxed">
                                    Deploy specialized diagnostics and maintenance tasks to preserve your vehicle's lifecycle and market valuation.
                                </p>
                            </div>
                            <WorkshopHubs />
                        </motion.div>
                    )}

                    {activeTab === 'sales' && (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-burgundy" />
                                    Active Liquidation Pipeline ({sales.length})
                                </h3>
                            </div>
                            {salesLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => <div key={i} className="aspect-[16/11] bg-slate-50 rounded-[3rem] animate-pulse border border-slate-100" />)}
                                </div>
                            ) : sales.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {sales.map(s => <SaleCard key={s.id} sale={s} />)}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<Tag size={48} />}
                                    title="Pipeline Clear."
                                    desc="You are not currently liquidating any of your assets. Use our valuation tool to start a listing."
                                    actionUrl="/dashboard/valuation/wizard"
                                    actionLabel="List an Asset"
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function VehicleCard({ vehicle, onTogglePrivacy }: { vehicle: any, onTogglePrivacy: () => void }) {
    const images = getVehicleImages(vehicle.images);
    const displayImage = getAssetUrl(images[0]);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] transition-all duration-700"
        >
            <div className="relative aspect-[16/11] bg-slate-50 overflow-hidden p-3">
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative shadow-inner">
                    {images.length > 0 ? (
                        <img
                            src={displayImage}
                            alt={vehicle.model}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-100/50">
                            <Car size={48} strokeWidth={1} />
                        </div>
                    )}

                    {/* Privacy Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                        <button
                            onClick={(e) => { e.preventDefault(); onTogglePrivacy(); }}
                            className={`p-3 rounded-2xl backdrop-blur-xl transition-all shadow-xl ${vehicle.is_private ? 'bg-onyx/90 text-white' : 'bg-white/80 text-onyx hover:bg-white border border-white/20'}`}
                        >
                            {vehicle.is_private ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Status Badge */}
                    {vehicle.active_auction_status && (
                        <div className="absolute top-4 left-4 z-20">
                            <span className="bg-emerald text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center shadow-2xl backdrop-blur-lg">
                                <Activity size={10} className="mr-2 animate-pulse" />
                                {vehicle.active_auction_status}
                            </span>
                        </div>
                    )}

                    {/* Inspect Overlay */}
                    <div className="absolute inset-0 bg-onyx/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                        <Link href={`/vehicles/${vehicle.id}`} className="w-full max-w-[180px] bg-white text-onyx py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-burgundy hover:text-white flex items-center justify-center gap-2">
                            Inspect Asset <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 grayscale group-hover:grayscale-0 transition-all">
                            <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center">
                                <Zap size={10} className="text-burgundy" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-burgundy">{vehicle.make}</span>
                        </div>
                        <h4 className="text-2xl font-heading font-black text-onyx truncate tracking-tight">{vehicle.model}</h4>
                    </div>
                    <div className="w-12 h-12 bg-emerald/5 rounded-2xl flex items-center justify-center text-emerald border border-emerald/10 shadow-sm shadow-emerald/5">
                        <ShieldCheck size={24} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-burgundy/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Year</span>
                        </div>
                        <span className="text-xs font-black text-onyx">{vehicle.year}</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-burgundy/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Grade</span>
                        </div>
                        <span className="text-xs font-black text-onyx">{vehicle.condition?.replace('_', ' ') || 'A+'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Evaluation</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-onyx/40">₦</span>
                            <span className="text-xl font-heading font-black text-onyx tracking-tighter">{(vehicle.price || 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/dashboard/garage/services/diagnostics?id=${vehicle.id}`}
                            className="w-12 h-12 bg-slate-100 hover:bg-onyx text-slate-400 hover:text-white rounded-[1rem] transition-all flex items-center justify-center border border-slate-200 shadow-sm group/btn"
                            title="Schedule Maintenance"
                        >
                            <Wrench size={18} className="group-hover/btn:rotate-12 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function SaleCard({ sale }: { sale: any }) {
    const images = Array.isArray(sale.images) ? sale.images : (typeof sale.images === 'string' ? JSON.parse(sale.images) : []);
    const displayImage = getAssetUrl(images[0]);

    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm p-4 group hover:shadow-2xl transition-all duration-700">
            <div className="relative aspect-[16/11] bg-slate-50 rounded-[2.2rem] overflow-hidden mb-6 shadow-inner">
                {images.length > 0 ? (
                    <img src={displayImage} alt={sale.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Car size={48} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-onyx/90 backdrop-blur-xl p-4 rounded-2xl text-white flex justify-between items-center border border-white/10 shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50 mb-0.5">Asset Type</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{sale.type}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50 mb-0.5">Valuation</span>
                        <span className="text-[11px] font-black tracking-tight">₦{sale.price?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-3 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-burgundy mb-1">{sale.make}</p>
                        <h5 className="font-heading font-black text-onyx truncate text-lg tracking-tight">{sale.model}</h5>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${sale.status === 'active' ? 'bg-emerald/5 text-emerald border-emerald/10' : 'bg-burgundy/5 text-burgundy border-burgundy/10'}`}>
                        {sale.stage?.replace('_', ' ') || 'Processing'}
                    </span>
                </div>

                <Link
                    href={sale.type === 'escrow' ? `/dashboard/escrow/${sale.id}` : `/auctions/${sale.id}`}
                    className="w-full py-4 bg-slate-50 hover:bg-onyx hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all group/btn"
                >
                    Manage Protocol <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

function EmptyState({ icon, title, desc, actionUrl, actionLabel }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[4rem] p-12 py-24 text-center flex flex-col items-center shadow-inner"
        >
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                {icon}
            </div>
            <h3 className="text-3xl font-heading font-black text-onyx tracking-tighter mb-4">{title}</h3>
            <p className="text-sm text-slate-400 font-medium font-subheading uppercase tracking-[0.15em] mb-10 max-w-sm leading-relaxed">{desc}</p>
            <Link href={actionUrl} className="bg-onyx text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-onyx/20 hover:bg-burgundy hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                {actionLabel} <ArrowRight size={18} />
            </Link>
        </motion.div>
    );
}
