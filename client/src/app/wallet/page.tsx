'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
<<<<<<< HEAD
import PremiumButton from '@/components/ui/PremiumButton';
import PillHeader from '@/components/landing/PillHeader';
import MotionBackground from '@/components/landing/MotionBackground';
import {
    Wallet,
    Plus,
    History,
    ShieldCheck,
    Clock,
=======
import {
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    ShieldCheck,
    Clock,
    XCircle,
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
    CheckCircle2,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FundWalletModal from '@/components/wallet/FundWalletModal';
import TransactionRow from '@/components/wallet/TransactionRow';

export default function WalletPage() {
    const { user, token } = useAuth();
    const [balanceData, setBalanceData] = useState<any>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFundModal, setShowFundModal] = useState(false);

    const fetchData = React.useCallback(async () => {
        if (!token) return;
        try {
            const [balRes, txRes] = await Promise.all([
                apiFetch('/wallet/balance', { token }),
                apiFetch('/wallet/transactions', { token })
            ]);
            setBalanceData(balRes.data);
            setTransactions(txRes.data);
        } catch (err) {
            console.error('Failed to fetch wallet data:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        const verifyPayment = async (ref: string, amt: string) => {
            try {
                await apiFetch('/wallet/fund/verify', {
                    method: 'POST',
                    token,
                    body: { reference: ref, amount: amt }
                });
                window.history.replaceState({}, document.title, window.location.pathname);
                fetchData();
            } catch (err) {
                console.error('Verification failed', err);
                fetchData();
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        const amount = urlParams.get('amount');

        if (ref && amount && token) {
            verifyPayment(ref, amount);
        } else {
            fetchData();
        }
    }, [token, fetchData]);

    useEffect(() => {
        if (!token) return;

        const hasProcessing = transactions.some((tx: any) => tx.status === 'processing');
        if (!hasProcessing) return;

        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, [token, transactions, fetchData]);

    if (loading) {
        return (
<<<<<<< HEAD
            <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-900/5 text-slate-900 rounded-full flex items-center justify-center animate-pulse mb-6">
                    <Wallet size={24} />
                </div>
            </main>
=======
            <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy"></div>
            </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
        );
    }

    return (
<<<<<<< HEAD
        <main className="relative min-h-screen selection:bg-burgundy selection:text-white bg-[#F8FAFC] overflow-x-hidden pt-32 pb-20 px-6">
            <MotionBackground />
            <PillHeader />

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center space-x-2 text-burgundy font-bold uppercase tracking-widest text-[10px] mb-3">
                            <Wallet size={16} />
                            <span>Capital Reserves</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-3">Treasury.</h1>
                        <p className="text-slate-500 font-subheading text-sm leading-relaxed">Oversee liquid assets and escrow allocations.</p>
                    </motion.div>
=======
        <main className="min-h-screen bg-canvas pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4">
                <header className="mb-10">
                    <h1 className="text-4xl font-black mb-2">My Wallet</h1>
                    <p className="text-onyx-light font-medium">Manage your funds and track your bidding power.</p>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance Card */}
<<<<<<< HEAD
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-slate-900 text-white p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl group"
                        >
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
                                <Wallet size={160} />
                            </div>

                            <div className="relative z-10">
                                <span className="text-white/50 font-bold uppercase tracking-[0.2em] text-[10px] block mb-2 font-subheading">Total Liquidity</span>
                                <h2 className="text-5xl md:text-6xl font-heading font-extrabold mb-10 tracking-tight">
                                    ₦{balanceData?.balance?.toLocaleString() || '0.00'}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                                        <div className="flex items-center text-white/50 text-[10px] font-bold uppercase mb-2 tracking-widest font-subheading">
                                            <Lock size={12} className="mr-1.5" /> Escrow Allocated
                                        </div>
                                        <div className="text-2xl font-heading font-extrabold text-white">₦{balanceData?.held?.toLocaleString() || '0.00'}</div>
                                    </div>
                                    <div className="bg-emerald-500/10 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/20">
                                        <div className="flex items-center text-emerald-400 text-[10px] font-bold uppercase mb-2 tracking-widest font-subheading">
                                            Deployable Capital
                                        </div>
                                        <div className="text-2xl font-heading font-extrabold text-emerald-50">₦{balanceData?.balance?.toLocaleString() || '0.00'}</div>
=======
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-onyx text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-onyx/20"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Wallet size={120} />
                            </div>

                            <div className="relative z-10">
                                <span className="text-white/60 font-medium uppercase tracking-widest text-xs">Total Balance</span>
                                <h2 className="text-5xl font-black mt-2 mb-8">
                                    ₦ {balanceData?.balance?.toLocaleString() || '0.00'}
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                                        <div className="flex items-center text-white/60 text-xs font-bold uppercase mb-1">
                                            <Lock size={12} className="mr-1" /> Held for Bids
                                        </div>
                                        <div className="text-xl font-bold">₦ {balanceData?.held?.toLocaleString() || '0.00'}</div>
                                    </div>
                                    <div className="bg-burgundy/20 backdrop-blur-md p-4 rounded-2xl border border-burgundy/30">
                                        <div className="flex items-center text-burgundy-light text-xs font-bold uppercase mb-1">
                                            Available to Bid
                                        </div>
                                        <div className="text-xl font-bold">₦ {balanceData?.balance?.toLocaleString() || '0.00'}</div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
<<<<<<< HEAD
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-card p-8 md:p-10"
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
                                        <History size={18} />
                                    </div>
                                    <h3 className="text-xl font-heading font-extrabold text-slate-900">Ledger</h3>
                                </div>
                            </div>

                            <div className="space-y-2">
=======
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-onyx/5 rounded-xl flex items-center justify-center text-onyx">
                                        <History size={20} />
                                    </div>
                                    <h3 className="text-xl font-black">Recent Transactions</h3>
                                </div>
                            </div>

                            <div className="space-y-1">
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                                {transactions.length > 0 ? (
                                    transactions.map((tx: any) => (
                                        <TransactionRow key={tx.id} transaction={tx} />
                                    ))
                                ) : (
<<<<<<< HEAD
                                    <div className="py-24 text-center">
                                        <History className="mx-auto mb-4 text-slate-300" size={32} />
                                        <p className="text-slate-500 font-subheading text-sm font-medium">No ledger entries detected.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
=======
                                    <div className="py-20 text-center">
                                        <p className="text-onyx-light font-medium italic">No transactions found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
<<<<<<< HEAD
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <PremiumButton
                                onClick={() => setShowFundModal(true)}
                                className="w-full py-6 text-lg"
                                icon={Plus}
                                tooltip="Add Liquid Capital"
                            >
                                Inject Capital
                            </PremiumButton>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] shadow-sm"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50 shrink-0">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-extrabold text-slate-900 uppercase text-xs tracking-tight mb-1.5 flex flex-col">
                                        <span>Cryptographic</span>
                                        <span>Security</span>
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-body">
                                        Transactions secured via bank-grade encryption endpoints. Escrow integrated directly with the settlement engine.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="glass-card p-8"
                        >
                            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-slate-400 font-subheading">Security Posture</h4>
                            <ul className="space-y-5">
                                <li className="flex items-center space-x-3 text-[11px] font-bold text-slate-700">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="font-subheading uppercase tracking-wider">Multi-Factor Auth Active</span>
                                </li>
                                <li className="flex items-center space-x-3 text-[11px] font-bold text-slate-700">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="font-subheading uppercase tracking-wider">Real-Time Ledger Alerts</span>
                                </li>
                                <li className="flex items-center space-x-3 text-[11px] font-bold text-slate-400 opacity-60">
                                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                                        <Clock size={14} />
                                    </div>
                                    <span className="font-subheading uppercase tracking-wider">Multi-Sig Settlement (Beta)</span>
                                </li>
                            </ul>
                        </motion.div>
=======
                        <button
                            onClick={() => setShowFundModal(true)}
                            className="w-full bg-burgundy hover:bg-burgundy-light text-white p-6 rounded-3xl flex items-center justify-center space-x-3 transition-all shadow-xl shadow-burgundy/20 group"
                        >
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="text-xl font-bold">Fund Wallet</span>
                        </button>

                        <div className="bg-emerald/5 border border-emerald/10 p-6 rounded-3xl">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald shadow-sm">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-onyx uppercase text-sm tracking-tight mb-1">Secured by Paystack</h4>
                                    <p className="text-xs text-onyx-light leading-relaxed">
                                        All transactions are encrypted and processed through Nigeria&apos;s leading payment gateway.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
                            <h4 className="font-black mb-4 uppercase text-xs tracking-widest text-onyx-light">Wallet Security</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-3 text-sm font-medium">
                                    <CheckCircle2 size={16} className="text-emerald" />
                                    <span>2FA Protection Enabled</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm font-medium">
                                    <CheckCircle2 size={16} className="text-emerald" />
                                    <span>Instant Transaction Alerts</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm font-medium opacity-50">
                                    <Clock size={16} className="text-onyx" />
                                    <span>Multi-sig Settlement (Soon)</span>
                                </li>
                            </ul>
                        </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showFundModal && (
                    <FundWalletModal
                        onClose={() => setShowFundModal(false)}
                        onSuccess={() => {
                            setShowFundModal(false);
                            fetchData();
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
