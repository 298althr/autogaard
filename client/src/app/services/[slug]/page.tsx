'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle2, 
    MessageCircle, 
    ShieldCheck, 
    Zap, 
    Search, 
    FileText, 
    Paintbrush, 
    Truck,
    ArrowRight,
    Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICE_DETAILS: Record<string, any> = {
    'buying-selling': {
        title: 'Buying & Selling Support',
        icon: Search,
        description: 'Expert guidance to ensure you make the right moves in the automotive market.',
        heroImage: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606812/autogaard/assets/ag016.jpg',
        subServices: [
            {
                name: 'Smart Selection Support',
                desc: 'We help you navigate the market to find the perfect vehicle that fits your lifestyle and budget, ensuring you avoid "lemons" and hidden mechanical traps.'
            },
            {
                name: 'Fair Value Analysis',
                desc: 'Get real-time, data-backed market valuations so you never overpay when buying or undersell when it’s time to move on to your next car.'
            },
            {
                name: 'Purchase & Sales Concierge',
                desc: 'We handle the entire transaction process—from professional negotiation to closing the deal—making buying or selling a car as easy as ordering a meal.'
            }
        ]
    },
    'inspections': {
        title: 'Health & Safety Inspections',
        icon: ShieldCheck,
        description: 'Knowing exactly what’s happening under the hood with professional diagnostic audits.',
        heroImage: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606466/autogaard/assets/ag004.jpg',
        subServices: [
            {
                name: 'Engine Health Scan',
                desc: 'A deep digital dive into your car’s computer system to identify and clear hidden faults before they turn into expensive repairs.'
            },
            {
                name: '120-Point Master Audit',
                desc: 'Our most thorough bumper-to-bumper physical check-up, covering everything from the suspension and brakes to the electrical systems.'
            },
            {
                name: 'History & Background Check',
                desc: 'We verify the global records of any vehicle to uncover past accidents, flood damage, or mileage fraud before you commit.'
            }
        ]
    },
    'paperwork': {
        title: 'Paperwork & Compliance',
        icon: FileText,
        description: 'Staying legal and road-ready without the stress of bureaucracy.',
        heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600',
        subServices: [
            {
                name: 'Registration Renewals',
                desc: 'We take the weight off your shoulders by handling your annual license renewals and permits from start to finish.'
            },
            {
                name: 'Roadworthiness Certification',
                desc: 'Full assistance with official inspections and securing your digital certificates so you\'re always on the right side of the law.'
            },
            {
                name: 'Police Registry (CMR) Check',
                desc: 'Ensuring your vehicle is properly verified and cleared with the national motor registry for total legal peace of mind.'
            }
        ]
    },
    'technology': {
        title: 'Efficiency & Technology',
        icon: Zap,
        description: 'Upgrading your driving experience for the modern age with smart tech.',
        heroImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1600',
        subServices: [
            {
                name: 'Eco-Friendly CNG Conversion',
                desc: 'Reduce your fuel costs by up to 70% with our high-end, automated gas conversion systems that pay for themselves in months.'
            },
            {
                name: 'AC Refresh & Optimization',
                desc: 'Restore your car’s original cooling power with professional gas refills, leak detection, and deep filter sterilization.'
            },
            {
                name: 'Advanced Security & Tech Suite',
                desc: 'Stay connected and protected with precision GPS tracking, biometric security, and premium 4K dashboard interfaces.'
            }
        ]
    },
    'restoration': {
        title: 'Professional Restoration',
        icon: Paintbrush,
        description: 'Keeping your vehicle looking and feeling factory-fresh with elite care.',
        heroImage: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606550/autogaard/assets/ag008.jpg',
        subServices: [
            {
                name: 'Master Class Repainting',
                desc: 'High-gloss, computer-matched baking oven paint services that give your car a showroom finish with a long-term warranty.'
            },
            {
                name: 'Detailing & Ceramic Protection',
                desc: 'Deep interior/exterior restoration and a hard-shell nano-ceramic coating that protects your paint from the elements for years.'
            }
        ]
    },
    'logistics': {
        title: 'Logistics & Protection',
        icon: Truck,
        description: 'Moving and protecting your assets with care across Nigeria and beyond.',
        heroImage: 'https://res.cloudinary.com/dt6n4pnjb/image/upload/v1777606487/autogaard/assets/ag005.jpg',
        subServices: [
            {
                name: 'Port Clearing Support',
                desc: 'Fast-track your vehicle’s release from the port with expert handling of customs duties and terminal paperwork.'
            },
            {
                name: 'Secured Car Transport',
                desc: 'Professional interstate haulage via secured flatbeds or closed containers to get your car home safely and on time.'
            },
            {
                name: 'Interstate & Global Shipping',
                desc: 'Professional car carrier transport for secure delivery across Nigeria or international shipping for imported assets.'
            },
            {
                name: 'Comprehensive Insurance',
                desc: 'All-risk protection that covers you against accidents, theft, fire, and flood damage, backed by Nigeria\'s top-tier providers.'
            }
        ]
    }
};

export default function ServiceDetail() {
    const params = useParams();
    const slug = params.slug as string;
    
    const service = useMemo(() => SERVICE_DETAILS[slug], [slug]);

    if (!service) {
        return (
            <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6 text-center">
                <Navbar />
                <h1 className="type-h1 mb-4">Service Not Found</h1>
                <p className="text-secondary mb-8">The service you're looking for doesn't exist in our current directory.</p>
                <Link href="/services" className="bg-burgundy text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Return to Services
                </Link>
                <Footer />
            </div>
        );
    }

    return (
        <main className="bg-page min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${service.heroImage}')` }}
                />
                <div className="absolute inset-0 bg-cinema/70 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema via-cinema/40 to-transparent" />
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link 
                            href="/services" 
                            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            <ArrowLeft size={14} /> Back to Directory
                        </Link>
                        <div className="w-20 h-20 rounded-3xl bg-burgundy flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-burgundy/40">
                            <service.icon size={40} className="text-white" />
                        </div>
                        <h1 className="type-display text-white mb-6">{service.title}</h1>
                        <p className="type-body-lg text-white/70 max-w-2xl mx-auto">
                            {service.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sub-services Grid */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {service.subServices.map((sub: any, idx: number) => (
                            <motion.div 
                                key={sub.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-10 rounded-[3rem] bg-surface border border-border-subtle hover:border-burgundy/30 transition-all duration-500 hover:shadow-2xl hover:shadow-burgundy/5"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center mb-8 group-hover:bg-burgundy group-hover:text-white transition-all duration-500">
                                    <CheckCircle2 size={24} className="text-burgundy group-hover:text-white" />
                                </div>
                                <h3 className="type-h3 mb-6 text-[#0F172A] group-hover:text-burgundy transition-colors">{sub.name}</h3>
                                <p className="text-[#475569] text-sm leading-relaxed mb-8">
                                    {sub.desc}
                                </p>
                                <div className="flex items-center gap-4 pt-6 border-t border-border-subtle">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-page border-2 border-surface flex items-center justify-center">
                                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted">Expert Rated</span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Consultation Card */}
                        <div className="lg:col-span-1 rounded-[3rem] bg-cinema p-10 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-burgundy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 h-full flex flex-col">
                                <h3 className="type-h3 mb-6">Custom Brief Required?</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-12 flex-1">
                                    If you have a complex automotive need that spans multiple services, 
                                    speak directly to an advisor for a tailored solution.
                                </p>
                                <a 
                                    href="https://wa.me/2348029933575"
                                    className="w-full py-5 bg-white text-[#0F172A] rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-burgundy hover:text-white transition-all shadow-xl"
                                >
                                    <MessageCircle size={20} /> Chat with Advisor
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Autogaard Strip */}
            <section className="py-24 px-6 bg-surface border-y border-border-subtle">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center shrink-0">
                                <ShieldCheck className="text-burgundy" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Zero Friction</h4>
                                <p className="text-sm text-secondary">We handle the bureaucracy and technical complexity for you.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center shrink-0">
                                <Search className="text-burgundy" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Expert Vetted</h4>
                                <p className="text-sm text-secondary">Every service is executed by certified professionals.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-burgundy/5 flex items-center justify-center shrink-0">
                                <Zap className="text-burgundy" size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Fast Results</h4>
                                <p className="text-sm text-secondary">Our systems are optimized for speed and transparency.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
