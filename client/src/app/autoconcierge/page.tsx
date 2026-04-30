'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { apiFetch } from '@/lib/api';

export default function ConciergePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [email, setEmail] = useState('');

    async function handleWaitlist(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        try {
            await apiFetch('/leads/waitlist', {
                method: 'POST',
                body: { email, type: 'autoconcierge_waitlist' },
            });
            setStatus('done');
        } catch (err) {
            setStatus('idle');
        }
    }

    return (
        <main className="bg-cinema min-h-screen text-white">
            <Navbar />

            <div className="pt-48 pb-24 px-6 max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
                >
                    <Sparkles size={14} className="text-burgundy" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-burgundy">Coming Soon</span>
                </motion.div>

                <h1 className="type-display mb-6">AutoConcierge.</h1>
                <p className="type-body-lg text-white/50 max-w-2xl mx-auto mb-16">
                    Hands-free car management. From fueling and cleaning to servicing and documentation, 
                    we handle everything so you just drive.
                </p>

                <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-12 rounded-[3rem] backdrop-blur-xl">
                    {status === 'done' ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h3 className="type-h3 mb-2">You're on the list.</h3>
                            <p className="text-sm text-white/40">We'll notify you as soon as we launch the pilot program.</p>
                        </motion.div>
                    ) : (
                        <>
                            <h3 className="type-h3 mb-4">Join the Waitlist</h3>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-10">Limited spaces available for Phase 1.</p>
                            
                            <form onSubmit={handleWaitlist} className="space-y-4">
                                <input 
                                    type="email" required
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/50 transition-all"
                                    placeholder="yourname@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-burgundy text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-burgundy-light transition-all"
                                >
                                    {status === 'loading' ? 'Joining...' : 'Get Early Access'}
                                    <Send size={14} />
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-left opacity-60">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-burgundy mb-4">Maintenance</h4>
                        <p className="text-sm leading-relaxed">Scheduled pickups for servicing at our professional workshop.</p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-burgundy mb-4">Compliance</h4>
                        <p className="text-sm leading-relaxed">Automatic renewals for insurance, roadworthiness, and papers.</p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-burgundy mb-4">Convenience</h4>
                        <p className="text-sm leading-relaxed">Weekly detailing and fuel top-ups at your home or office.</p>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-burgundy/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <footer className="py-20 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 relative z-10">
                AutoConcierge · Exclusive Pilot
            </footer>
        </main>
    );
}
