'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, MessageCircle, User, LogOut, ShieldCheck, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from 'next-themes';
import { apiFetch } from '@/lib/api';

export const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: 'About', href: '/about' },
    { name: 'Join Us', href: '/joinus' },
];

const Navbar = ({ scrollThreshold = 60 }: { scrollThreshold?: number }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showCookieBanner, setShowCookieBanner] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > scrollThreshold);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Check for cookie consent
        const consent = localStorage.getItem('autogaard_cookie_consent');
        if (!consent) {
            setTimeout(() => setShowCookieBanner(true), 2000);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('autogaard_cookie_consent', 'true');
        setShowCookieBanner(false);
    };

    const trackWhatsApp = async () => {
        try {
            await apiFetch('/leads/track-click', {
                method: 'POST',
                body: { type: 'whatsapp', label: 'navbar_chat_button' }
            });
        } catch (e) {
            // Silently fail, don't block the user
        }
    };

    // Logo: always white over hero, then white in dark / original in light
    const logoFilter = !isScrolled
        ? 'brightness(0) invert(1)'
        : theme === 'dark' ? 'brightness(0) invert(1)' : 'none';

    // Nav link colour: force white over hero image, then use CSS token when scrolled
    const linkColour = !isScrolled ? '#ffffff' : 'var(--nav-text)';

    return (
        <nav className={`nav-bar ${isScrolled ? 'nav-scrolled' : ''}`}>
            <div
                className="w-full max-w-[1440px] mx-auto px-5 md:px-10 flex items-center justify-between"
                style={{ height: '80px' }}
            >
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 transition-all duration-300">
                    <Image
                        src="/logo.png"
                        alt="Autogaard"
                        width={160}
                        height={36}
                        className="object-contain"
                        style={{ filter: logoFilter }}
                        priority
                    />
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[12px] font-bold uppercase tracking-[0.15em] opacity-80 hover:opacity-100 transition-all hover:translate-y-[-1px]"
                            style={{ color: linkColour }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Archived for Presentation */}
                    {/* <ThemeToggle /> */}

                    <a
                        href="https://wa.me/2348029933575"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={trackWhatsApp}
                        className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wider hover:bg-[#1ea855] transition-all hover:scale-105 shadow-lg shadow-green-500/20 active:scale-95"
                    >
                        <MessageCircle size={16} />
                        <span className="hidden lg:inline">Chat With Us</span>
                    </a>

                    {/* Admin profile — only visible when logged in */}
                    {user && (
                        <div className="hidden xl:flex items-center gap-4 ml-2 pl-4 border-l border-[var(--border-subtle)]">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider opacity-70 hover:opacity-100"
                                style={{ color: linkColour }}
                            >
                                <User size={14} /> {user.display_name?.split(' ')[0] || 'Admin'}
                            </Link>
                            <button
                                onClick={logout}
                                className="opacity-40 hover:opacity-100 transition-opacity"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        style={{ color: linkColour }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu — motion.div so AnimatePresence exit actually fires */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden absolute top-full left-0 right-0 border-t border-[var(--nav-border)] shadow-2xl overflow-hidden"
                        style={{
                            background: 'var(--nav-bg)',
                            backdropFilter: 'blur(16px)',
                            color: 'var(--nav-text)',
                        }}
                    >
                        <div className="p-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl font-extrabold uppercase tracking-widest border-b border-[var(--border-subtle)] pb-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    href="/profile"
                                    className="text-xl font-extrabold uppercase tracking-widest opacity-60"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Admin Profile
                                </Link>
                            )}
                            {/* WhatsApp in mobile menu for convenience */}
                            <a
                                href="https://wa.me/2348029933575"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-full text-[13px] font-bold uppercase tracking-wider mt-2"
                            >
                                <MessageCircle size={18} />
                                Chat With Us on WhatsApp
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Cookie Banner */}
            <AnimatePresence>
                {showCookieBanner && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-sm z-[1000]"
                    >
                        <div className="bg-cinema border border-white/20 p-8 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-12 h-12 bg-burgundy rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-burgundy/20">
                                    <ShieldCheck className="text-white" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1.5">Elite Privacy</h4>
                                    <p className="text-white/70 text-[11px] leading-relaxed">
                                        We use premium tracking to optimize your advisory experience. Review our <Link href="/privacy" className="text-white underline font-bold">Privacy Policy</Link> for details.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={acceptCookies}
                                    className="flex-1 bg-white text-cinema py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-burgundy hover:text-white transition-all active:scale-95 shadow-xl"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={() => setShowCookieBanner(false)}
                                    className="px-6 py-4 border border-white/20 text-white/60 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
