'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
);

export const LoadingSpinner = ({ size = 'md', color = 'burgundy' }: { size?: 'sm' | 'md' | 'lg', color?: 'burgundy' | 'white' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };
    
    const colors = {
        burgundy: 'border-burgundy/20 border-t-burgundy',
        white: 'border-white/20 border-t-white'
    };

    return (
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
    );
};

export const PageLoader = () => (
    <div className="fixed inset-0 z-[999] bg-page flex flex-col items-center justify-center gap-6">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="w-16 h-16 rounded-2xl bg-burgundy/10 flex items-center justify-center border border-burgundy/20"
        >
            <div className="w-8 h-8 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">Autogaard</h3>
            <p className="text-xs text-muted animate-pulse">Initializing Expert Engine...</p>
        </div>
    </div>
);

export const ComparisonSkeleton = () => (
    <div className="bg-surface border border-border-subtle rounded-[3.5rem] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[160px_1fr] border-b border-border-subtle">
            <div className="p-8 border-r border-border-subtle bg-page" />
            <div className="grid grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-8 border-r border-border-subtle last:border-r-0">
                        <Skeleton className="aspect-[16/9] mb-6 rounded-[2rem]" />
                        <Skeleton className="h-2 w-1/3 mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-6" />
                        <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </div>
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="grid grid-cols-[160px_1fr] border-b border-border-subtle">
                <div className="p-8 border-r border-border-subtle" />
                <div className="grid grid-cols-4">
                    {[1, 2, 3, 4].map(j => (
                        <div key={j} className="p-8 border-r border-border-subtle last:border-r-0 flex justify-center">
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
