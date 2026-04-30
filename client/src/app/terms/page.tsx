'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <main className="bg-page min-h-screen">
            <Navbar />
            
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="type-display mb-4">Terms & Conditions.</h1>
                    <p className="text-white/50 text-sm md:text-lg">The legal framework for our professional automotive services.</p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-12 text-secondary">
                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">1. Agreement to Terms</h2>
                            <p className="text-sm leading-relaxed">
                                By accessing or using AutoGaard's website and services, you agree to be bound by these Terms and Conditions. If you do not agree, you must not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">2. Service Disclaimer</h2>
                            <p className="text-sm leading-relaxed mb-4">
                                AutoGaard provides automotive intelligence and advisory services. While we strive for absolute accuracy:
                            </p>
                            <ul className="list-disc pl-6 text-sm space-y-2">
                                <li>Valuation estimates are based on market data and are not guaranteed sale prices.</li>
                                <li>Inspections are professional assessments of a vehicle's state at a specific time.</li>
                                <li>Workshop repairs are subject to separate warranty terms provided at the time of service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">3. User Obligations</h2>
                            <p className="text-sm leading-relaxed">
                                You agree to provide accurate information when using our smart tools and to use our services for lawful purposes only.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">4. Intellectual Property</h2>
                            <p className="text-sm leading-relaxed">
                                All content, data, and software used on this platform are the property of AutoGaard and are protected by international copyright laws.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
