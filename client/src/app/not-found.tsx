'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <main className="bg-page min-h-screen flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-burgundy rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy rounded-full blur-[100px]" />
                </div>

                <div className="max-w-xl w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="text-[12rem] font-black text-burgundy/10 leading-none select-none mb-4">
                            404
                        </div>
                        
                        <h1 className="type-h1 mb-6">Route Lost.</h1>
                        <p className="type-body text-secondary mb-12 max-w-md mx-auto">
                            The page you are looking for has been moved, removed, or never existed in our catalog. 
                            Let's get you back on track.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                href="/"
                                className="w-full sm:w-auto bg-burgundy text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Home size={16} /> Return Home
                            </Link>
                            <Link 
                                href="/services"
                                className="w-full sm:w-auto bg-surface border border-border-subtle text-primary px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-page transition-colors"
                            >
                                <Search size={16} /> Explore Services
                            </Link>
                        </div>

                        <button 
                            onClick={() => window.history.back()}
                            className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-burgundy transition-colors flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={12} /> Go Back
                        </button>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
