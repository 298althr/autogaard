'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Warehouse, Plus, ArrowRight, Car, Activity, Tag, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useGarage, useSales } from '@/hooks/useGarage';

export default function GaragePage() {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<'vault' | 'sales' | 'valuations'>('vault');

    const { vehicles, loading: garageLoading } = useGarage(token);
    const { sales, loading: salesLoading } = useSales(token);

    if (!user) return null;

    const renderVehicleCard = (v: any) => (
        <motion.div
            layout
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="relative aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                {v.images?.[0] ? (
                    <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">
                        No Image Available
                    </div>
                )}
                {v.active_auction_status && (
                    <div className="absolute top-3 left-3 flex space-x-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center shadow-lg">
                            <Activity size={12} className="mr-1" />
                            {v.active_auction_status}
                        </span>
                    </div>
                )}
            </div>

            <div className="px-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-black text-onyx text-lg tracking-tight leading-tight">{v.make} {v.model}</h3>
                        <p className="text-xs font-bold text-onyx-light uppercase tracking-widest">{v.year} • {v.type || 'Passenger'}</p>
                    </div>
                    {v.active_auction_id && (
                        <Link href={`/auctions/${v.active_auction_id}`} className="p-2 bg-gray-50 text-onyx hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors">
                            <Activity size={18} />
                        </Link>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <ShieldCheck size={12} className="mr-1" />
                        Verified Asset
                    </span>
                    <Link href={`/vehicles/${v.id}`} className="text-xs font-bold text-burgundy flex items-center hover:underline">
                        Details <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );

    const renderSaleCard = (s: any) => (
        <motion.div
            layout
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="relative aspect-[16/10] bg-gray-50 rounded-2xl overflow-hidden mb-4">
                {s.images?.[0] ? (
                    <img src={s.images[0]} alt={`${s.make} ${s.model}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Car size={32} />
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-onyx text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center shadow-lg">
                    <ShoppingBag size={12} className="mr-1" />
                    {s.type === 'escrow' ? 'Sold / Escrow' : 'Auction'}
                </div>
            </div>

            <div className="px-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-black text-onyx text-lg tracking-tight">{s.make} {s.model}</h3>
                        <p className="text-xs font-bold text-onyx-light uppercase tracking-widest">
                            {s.type === 'escrow' ? `Buyer: ${s.counterpart_name}` : 'Market Listing'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-black text-emerald-600 leading-none">₦{(s.price || 0).toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{s.stage?.replace('_', ' ') || 'Active'}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <Clock size={12} className="mr-1" />
                        Last Active {new Date(s.updated_at).toLocaleDateString()}
                    </span>
                    {s.type === 'escrow' ? (
                        <Link href={`/dashboard/escrow/${s.id}`} className="text-xs font-bold text-burgundy flex items-center hover:underline">
                            Manage Escrow <ArrowRight size={14} className="ml-1" />
                        </Link>
                    ) : (
                        <Link href={`/auctions/${s.id}`} className="text-xs font-bold text-emerald-600 flex items-center hover:underline">
                            View Auction <ArrowRight size={14} className="ml-1" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 px-2">
                <div>
                    <div className="flex items-center space-x-2 text-burgundy font-bold uppercase tracking-widest text-[10px] mb-2">
                        <Warehouse size={16} />
                        <span>Asset Portfolio</span>
                    </div>
                    <h1 className="text-3xl font-black text-onyx tracking-tight">Your Garage</h1>
                    <p className="text-sm font-medium text-onyx-light mt-1">Manage vehicles you own, track sales, or monitor valuations.</p>
                </div>
                <div className="flex space-x-3">
                    <Link href="/dashboard/market" className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-onyx px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                        <Car size={18} />
                        <span>Buy Asset</span>
                    </Link>
                    <Link href="/valuation/wizard" className="flex items-center space-x-2 bg-burgundy hover:bg-burgundy/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-burgundy/20">
                        <Plus size={18} />
                        <span>Sell / Register</span>
                    </Link>
                </div>
            </div>

            {/* Segmented Tabs */}
            <div className="bg-white p-1.5 rounded-2xl flex space-x-1 border border-gray-100 shadow-sm max-w-lg">
                <button
                    onClick={() => setActiveTab('vault')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'vault' ? 'bg-burgundy text-white shadow-md' : 'text-onyx-light hover:bg-gray-50'}`}
                >
                    <Warehouse size={16} />
                    <span>My Vault ({vehicles.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'sales' ? 'bg-burgundy text-white shadow-md' : 'text-onyx-light hover:bg-gray-50'}`}
                >
                    <Tag size={16} />
                    <span>My Sales ({sales.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('valuations')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 ${activeTab === 'valuations' ? 'bg-burgundy text-white shadow-md' : 'text-onyx-light hover:bg-gray-50'}`}
                >
                    <Activity size={16} />
                    <span>Valuations</span>
                </button>
            </div>

            {/* Asset Grid area */}
            <div className="min-h-[40vh] pt-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'vault' && (
                        <motion.div
                            key="vault"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full"
                        >
                            {garageLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="bg-gray-50 h-64 rounded-3xl" />)}
                                </div>
                            ) : vehicles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {vehicles.map(renderVehicleCard)}
                                </div>
                            ) : (
                                <div className="bg-white border text-center border-gray-100 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[40vh]">
                                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                                        <Car size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-onyx mb-2">Your Vault is Empty</h3>
                                    <p className="text-sm font-medium text-onyx-light max-w-md mx-auto mb-6">You don't have any vehicles in your private vault. Win an auction or register an asset to see them here.</p>
                                    <Link href="/dashboard/market" className="text-burgundy font-bold text-sm flex items-center hover:underline">Browse Market Listings <ArrowRight size={16} className="ml-1" /></Link>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'sales' && (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full"
                        >
                            {salesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="bg-gray-50 h-64 rounded-3xl" />)}
                                </div>
                            ) : sales.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sales.map(renderSaleCard)}
                                </div>
                            ) : (
                                <div className="bg-white border text-center border-gray-100 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[40vh]">
                                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                                        <Tag size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-onyx mb-2">No Active Sales</h3>
                                    <p className="text-sm font-medium text-onyx-light max-w-md mx-auto mb-6">You are not currently selling any vehicles. List an asset to track it here.</p>
                                    <Link href="/valuation/wizard" className="text-burgundy font-bold text-sm flex items-center hover:underline">List an Asset <ArrowRight size={16} className="ml-1" /></Link>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'valuations' && (
                        <motion.div
                            key="valuations"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white border text-center border-gray-100 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[40vh]"
                        >
                            <div className="w-20 h-20 bg-burgundy/5 text-burgundy/40 rounded-full flex items-center justify-center mb-4">
                                <Activity size={40} />
                            </div>
                            <h3 className="text-xl font-black text-onyx mb-2">Predictive Valuations</h3>
                            <p className="text-sm font-medium text-onyx-light max-w-md mx-auto mb-6">Monitor the liquid value of your fleet using our AI-driven market data engine.</p>
                            <Link href="/valuation/wizard" className="bg-burgundy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-burgundy/90 transition-colors shadow-lg shadow-burgundy/20">Value a Vehicle Now</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
