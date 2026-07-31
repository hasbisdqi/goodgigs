import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Gauge, MessageSquare, Phone, MoreHorizontal, Briefcase } from 'lucide-react';

interface MissionControlProps {
    gig: {
        id: number;
        title: string;
        status: string;
        company: string;
        location: string;
        salary: string;
    };
    worker: {
        id: number;
        name: string;
        role: string;
        avatar: string;
        phone: string;
    };
}

export default function MissionControl({ gig, worker }: MissionControlProps) {
    return (
        <div className="bg-surface-bright text-on-surface font-body-md selection:bg-primary-fixed-dim overflow-hidden h-screen flex flex-col">
            <Head title="Mission Control | Goodgigs" />

            {/* Header Section */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16">
                <div className="flex items-center gap-3">
                    <Link href={`/employer/dashboard`} className="p-2 -ml-2 hover:bg-surface-container rounded-full transition-colors active:scale-95 text-on-surface-variant hover:text-primary">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">Mission Control</h1>
                        <p className="font-label-sm text-label-sm text-primary tracking-wide">Live Tracking</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-xl border border-secondary/20 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="font-label-md text-label-md font-semibold tracking-wide uppercase">Active</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative mt-16 flex flex-col">
                {/* Full screen map background placeholder */}
                <div className="absolute inset-0 bg-[#e5e3df] z-0 overflow-hidden">
                    {/* Simulated Map Texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)`,
                        backgroundSize: `40px 40px`,
                        backgroundPosition: `0 0, 20px 20px`
                    }}></div>
                    
                    {/* Route line simulation */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                        <path d="M 100 800 Q 200 400 200 200" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 12" className="animate-pulse" />
                    </svg>

                    {/* Worker Location Marker */}
                    <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="bg-surface px-4 py-2 rounded-2xl shadow-lg border-2 border-primary mb-2 flex items-center gap-2 animate-bounce">
                            <Briefcase className="text-primary w-5 h-5" />
                            <span className="font-label-md text-label-md font-bold text-on-surface">En route</span>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-primary bg-primary-container p-1 shadow-xl relative">
                            <img src={worker.avatar} alt="Worker" className="w-full h-full rounded-full object-cover" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary text-on-secondary rounded-full border-2 border-surface flex items-center justify-center">
                                <Gauge size={12} />
                            </div>
                        </div>
                    </div>

                    {/* Destination Marker */}
                    <div className="absolute bottom-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-4 border-surface bg-error text-on-error shadow-xl flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <div className="bg-surface/90 backdrop-blur px-3 py-1 rounded-xl shadow mt-2 border border-outline-variant/30">
                            <span className="font-label-sm text-label-sm font-bold text-on-surface text-center block leading-tight">{gig.location}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Sheet UI */}
                <div className="relative z-10 mt-auto bg-surface rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-outline-variant/20 pb-safe">
                    {/* Drag Handle */}
                    <div className="w-full flex justify-center pt-4 pb-2">
                        <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
                    </div>

                    <div className="px-6 pb-8">
                        {/* Status Header */}
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">{gig.title}</h2>
                                <p className="text-on-surface-variant font-body-md">Gig Worker is en route to location</p>
                            </div>
                        </div>

                        {/* Worker Info Card */}
                        <div className="bg-surface-container rounded-[1.5rem] p-4 flex items-center justify-between mb-6 border border-outline-variant/30 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface shadow-sm">
                                    <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-title-md text-title-md font-bold text-on-surface leading-tight">{worker.name}</h3>
                                    <p className="font-label-md text-label-md text-primary mt-0.5">{worker.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <a href={`tel:${worker.phone}`} className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95 shadow-sm border border-outline-variant/20">
                                    <Phone size={20} />
                                </a>
                                <Link href={`/messages/${worker.id}`} className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:brightness-110 transition-colors active:scale-95 shadow-sm">
                                    <MessageSquare size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="px-2">
                            <div className="relative border-l-2 border-outline-variant/30 pl-6 pb-6">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-4 border-surface shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-on-primary" />
                                </div>
                                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">Assigned</h4>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Gig has been assigned to worker</p>
                            </div>
                            
                            <div className="relative border-l-2 border-outline-variant/30 pl-6 pb-6">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center border-4 border-surface shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-on-secondary animate-pulse" />
                                </div>
                                <h4 className="font-label-lg text-label-lg font-bold text-on-surface text-secondary">In Transit</h4>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Worker is heading to the location</p>
                            </div>
                            
                            <div className="relative pl-6">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center border-4 border-surface">
                                    <div className="w-1.5 h-1.5 rounded-full bg-outline" />
                                </div>
                                <h4 className="font-label-lg text-label-lg font-medium text-outline">Arrival</h4>
                                <p className="font-label-sm text-label-sm text-outline-variant">Waiting for check-in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
