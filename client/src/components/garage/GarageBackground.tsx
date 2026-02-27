'use client';

import React from 'react';
import { motion } from 'framer-motion';

const GarageBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0D10]">
            {/* Base futuristic garage texture */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/luxury_virtual_garage_bg.png')" }}
            />

            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-burgundy/10" />

            {/* Animated Grid for "Digital Twin" feel */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px]"
            />

            {/* Glowing Orbs */}
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-burgundy/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Scanning Line Effect */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-0 opacity-30"
            />
        </div>
    );
};

export default GarageBackground;
