'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navLinks } from './Navbar';
import { MessageCircle, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-cinema text-white py-24 px-6 border-t border-white/5">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Image
                            src="/logo.png"
                            alt="Autogaard"
                            width={180}
                            height={40}
                            className="brightness-0 invert mb-8"
                        />
                        <p className="text-white/40 text-sm leading-relaxed mb-10">
                            Removing friction between people and their cars. Founded 2023, based in Ikorodu, Lagos.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-burgundy transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-burgundy transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-burgundy transition-all">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services/buying-selling" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Buying & Selling</Link></li>
                            <li><Link href="/services/inspections" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Inspections</Link></li>
                            <li><Link href="/services/paperwork" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Paperwork</Link></li>
                            <li><Link href="/services/technology" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Technology</Link></li>
                            <li><Link href="/services/restoration" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Restoration</Link></li>
                            <li><Link href="/services/logistics" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Logistics</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Get In Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <MapPin size={20} className="text-burgundy shrink-0" />
                                <span className="text-sm text-white/60">Ikorodu, Lagos, Nigeria.</span>
                            </li>
                            <li className="flex gap-4">
                                <Phone size={20} className="text-burgundy shrink-0" />
                                <span className="text-sm text-white/60">+234 802 993 3575</span>
                            </li>
                            <li className="flex gap-4">
                                <Mail size={20} className="text-burgundy shrink-0" />
                                <span className="text-sm text-white/60">support@autogaard.com</span>
                            </li>
                        </ul>
                        <a
                            href="https://wa.me/2348029933575"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-10 flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform w-fit"
                        >
                            <MessageCircle size={18} /> Chat on WhatsApp
                        </a>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                        © 2026 Autogaard Autoconcierge. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white">Terms</Link>
                        <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
