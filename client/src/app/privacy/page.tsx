'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <main className="bg-page min-h-screen">
            <Navbar />
            
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="type-display mb-4">Privacy Policy.</h1>
                    <p className="text-white/50 text-sm md:text-lg">How we protect your data and respect your rights.</p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto prose prose-slate">
                    <div className="space-y-12 text-secondary">
                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">1. Introduction</h2>
                            <p className="text-sm leading-relaxed">
                                At AutoGaard, we respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you use our automotive advisory and intelligence services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">2. Data We Collect</h2>
                            <p className="text-sm leading-relaxed mb-4">
                                We process personal data necessary to provide our services, including:
                            </p>
                            <ul className="list-disc pl-6 text-sm space-y-2">
                                <li>Identity Data (Name, contact details)</li>
                                <li>Vehicle Data (VIN, mileage, condition reports)</li>
                                <li>Usage Data (How you use our smart tools)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">3. Your Rights</h2>
                            <p className="text-sm leading-relaxed mb-4">
                                Under Nigerian data protection laws, you have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-sm space-y-2">
                                <li>Request access to your personal data.</li>
                                <li>Request correction or deletion of your data.</li>
                                <li>Withdraw your consent at any time.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">4. Contact Us</h2>
                            <p className="text-sm leading-relaxed">
                                If you have questions about this policy or wish to exercise your rights, contact our Data Protection Officer at support@autogaard.com.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
