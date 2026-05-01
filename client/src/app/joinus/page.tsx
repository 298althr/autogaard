'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Wrench, 
    Truck, 
    ShieldCheck, 
    CheckCircle2, 
    ArrowRight,
    Globe,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Briefcase
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { apiFetch } from '@/lib/api';

const SPECIALTIES = [
    { title: 'Mechanics & Tech', icon: Wrench, desc: 'Precision engine and electrical diagnostics.' },
    { title: 'Logistics Specialists', icon: Truck, desc: 'Haulage, port clearing, and delivery experts.' },
    { title: 'Legal & Documentation', icon: ShieldCheck, desc: 'Registration, CMR, and legal advisors.' },
    { title: 'Restoration Artists', icon: Briefcase, desc: 'Detailing, bodywork, and aesthetic masters.' }
];

export default function JoinUs() {
    const [form, setForm] = useState({
        full_name: '',
        service_address: '',
        email: '',
        phone: '',
        service_description: '',
        website: '',
        social_media: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await apiFetch('/leads/service_provider', {
                method: 'POST',
                body: form
            });
            if (res.success) {
                setStatus('success');
                setForm({
                    full_name: '',
                    service_address: '',
                    email: '',
                    phone: '',
                    service_description: '',
                    website: '',
                    social_media: ''
                });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    }

    return (
        <main className="relative bg-page min-h-screen selection:bg-burgundy selection:text-white">
            <Navbar />

            {/* CINEMATIC HERO */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-black">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 grayscale"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606682/autogaard/assets/ag012.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[1px] bg-burgundy" />
                            <span className="text-burgundy font-black uppercase tracking-[0.3em] text-[10px]">Specialist Network</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-heading font-extrabold text-white tracking-tighter leading-[0.9] mb-8">
                            Elite Partners <br /><span className="text-burgundy">Join AutoGaard.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 font-body font-light leading-relaxed mb-10 max-w-2xl">
                            We are building Nigeria's most trusted automotive intelligence network. If you deliver world-class service, we want you in our ecosystem.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SPECIALTIES GRID */}
            <section className="py-24 px-6 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {SPECIALTIES.map((spec, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 bg-page border border-border-subtle rounded-[2.5rem] hover:border-burgundy/30 transition-all duration-500 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-burgundy/5 text-burgundy flex items-center justify-center mb-6 group-hover:bg-burgundy group-hover:text-white transition-all duration-500">
                                    <spec.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{spec.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{spec.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM SECTION */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="type-h2 mb-8">Registration Hub.</h2>
                            <p className="text-secondary mb-12 leading-relaxed">
                                Fill out the form to initiate the onboarding process. Our intelligence team will review your application and conduct a physical verification of your service centre.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 p-8 bg-surface rounded-3xl border border-border-subtle">
                                    <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center shrink-0 text-burgundy">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Physical Verification</h4>
                                        <p className="text-xs text-secondary leading-relaxed">All partners undergo a site audit to ensure they meet the AutoGaard standard.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 p-8 bg-surface rounded-3xl border border-border-subtle">
                                    <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center shrink-0 text-burgundy">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Exclusive Lead Flow</h4>
                                        <p className="text-xs text-secondary leading-relaxed">Verified partners receive high-intent leads directly from the AutoGaard platform.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-border-subtle p-10 rounded-[3rem] shadow-2xl shadow-black/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-burgundy/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-20"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">Application Received.</h3>
                                    <p className="text-secondary max-w-sm mx-auto mb-10">
                                        Our network coordinators will reach out within 48 hours for the next phase.
                                    </p>
                                    <button 
                                        onClick={() => setStatus('idle')}
                                        className="text-burgundy font-black uppercase tracking-widest text-xs"
                                    >
                                        Register Another Specialist
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Full Name *</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    required
                                                    type="text"
                                                    placeholder="e.g. John Doe"
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.full_name}
                                                    onChange={e => setForm({...form, full_name: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    required
                                                    type="email"
                                                    placeholder="j.doe@workshop.com"
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.email}
                                                    onChange={e => setForm({...form, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Phone Number *</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    required
                                                    type="tel"
                                                    placeholder="+234 ..."
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.phone}
                                                    onChange={e => setForm({...form, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Service Address *</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    required
                                                    type="text"
                                                    placeholder="Lagos, Nigeria"
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.service_address}
                                                    onChange={e => setForm({...form, service_address: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Description of Services *</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            placeholder="Detail your specialisations and experience..."
                                            className="w-full bg-page border border-border-subtle rounded-2xl py-4 px-6 text-sm focus:border-burgundy transition-all resize-none"
                                            value={form.service_description}
                                            onChange={e => setForm({...form, service_description: e.target.value})}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Website (Optional)</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    type="url"
                                                    placeholder="https://..."
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.website}
                                                    onChange={e => setForm({...form, website: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Social Media (Optional)</label>
                                            <div className="relative">
                                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                                <input 
                                                    type="text"
                                                    placeholder="@username"
                                                    className="w-full bg-page border border-border-subtle rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-burgundy transition-all"
                                                    value={form.social_media}
                                                    onChange={e => setForm({...form, social_media: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={status === 'loading'}
                                        type="submit"
                                        className="btn-primary w-full py-6 rounded-2xl shadow-xl shadow-burgundy/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {status === 'loading' ? 'Processing Hub...' : 'Submit Specialist Application'}
                                        <ArrowRight size={20} />
                                    </button>

                                    {status === 'error' && (
                                        <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">
                                            Submission Error. Please verify your data.
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
