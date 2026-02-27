'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    FileText,
    ShieldCheck,
    Truck,
    Zap,
    Paintbrush,
    Wrench,
    History
} from 'lucide-react';
import Link from 'next/link';

const hubs = [
    {
        id: 'diagnostics',
        title: 'Diagnostics Hub',
        description: 'Engine scans, 120-point inspections, and VIN history audits.',
        icon: Activity,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        link: '/garage/services/diagnostics'
    },
    {
        id: 'registration',
        title: 'Registration Vault',
        description: 'License renewal, ownership transfer, and plate management.',
        icon: FileText,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        link: '/garage/services/registration'
    },
    {
        id: 'insurance',
        title: 'Insurance & Protection',
        description: 'Comprehensive coverage, third-party plans, and add-ons.',
        icon: ShieldCheck,
        color: 'text-burgundy',
        bg: 'bg-burgundy/5',
        link: '/garage/services/insurance'
    },
    {
        id: 'logistics',
        title: 'Logistics & Haulage',
        description: 'Customs duty calculator, port clearing, and interstate transport.',
        icon: Truck,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        link: '/garage/services/logistics'
    },
    {
        id: 'performance',
        title: 'Performance & Upgrade',
        description: 'CNG conversions, security tech, and AC optimization.',
        icon: Zap,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        link: '/garage/services/performance'
    },
    {
        id: 'refurbishment',
        title: 'Refurbishment Lab',
        description: 'Professional paint services, detailing, and restoration.',
        icon: Paintbrush,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        link: '/garage/services/refurbishment'
    }
];

export default function WorkshopHubs() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubs.map((hub, index) => (
                <motion.div
                    key={hub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                >
                    <Link href={hub.link}>
                        <div className="glass-card p-6 h-full border border-slate-100 hover:border-burgundy/20 hover:shadow-xl transition-all duration-500 flex flex-col items-start text-left">
                            <div className={`w-14 h-14 ${hub.bg} ${hub.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                <hub.icon size={28} />
                            </div>
                            <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2 tracking-tight uppercase tracking-wider">{hub.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{hub.description}</p>

                            <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-burgundy group-hover:gap-2 transition-all">
                                <span>Deploy Protocol</span>
                                <Wrench size={12} className="ml-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}

            {/* Service History Shortcut */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="col-span-full mt-8"
            >
                <Link href="/garage/services/history">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-800 transition-colors shadow-2xl shadow-slate-900/20">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                <History size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-heading font-extrabold text-white tracking-tight italic">Service Dossier.</h3>
                                <p className="text-slate-400 text-sm font-medium">Review past interventions and vehicle health scores.</p>
                            </div>
                        </div>
                        <div className="px-8 py-3 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                            View Universal History
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
