'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MotionBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F8FAFC]">
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Simple static color shapes for performance */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-burgundy/5 rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100 rounded-full opacity-50 blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            {/* Static Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
    );
};

export default MotionBackground;
