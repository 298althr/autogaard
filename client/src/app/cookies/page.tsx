'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookiesPage() {
    return (
        <main className="bg-page min-h-screen">
            <Navbar />
            
            <section className="pt-32 pb-24 px-6 bg-cinema text-white relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="type-display mb-4">Cookie Policy.</h1>
                    <p className="text-white/50 text-sm md:text-lg">How we use tracking technologies to optimize your experience.</p>
                </div>
            </section>

            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-12 text-secondary">
                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">1. What are cookies?</h2>
                            <p className="text-sm leading-relaxed">
                                Cookies are small text files stored on your device that help us recognize your preferences and provide a seamless automotive intelligence experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">2. How we use them</h2>
                            <ul className="list-disc pl-6 text-sm space-y-4">
                                <li><strong>Essential Cookies:</strong> Necessary for the website to function, including security and authentication.</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our smart valuation and comparison tools.</li>
                                <li><strong>Functional Cookies:</strong> Remember your vehicle comparison queue and preferences.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest mb-6">3. Managing Consent</h2>
                            <p className="text-sm leading-relaxed">
                                You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our intelligence tools.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
