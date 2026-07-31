import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Gauge, MessageSquare, Phone, MoreHorizontal, Briefcase, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApprove = () => {
        setIsSubmitting(true);
        router.post(`/gigs/${gig.id}/approve`, {}, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    const handleReview = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post(`/gigs/${gig.id}/review`, { rating, comment }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <div className="bg-surface-bright text-on-surface font-body-md selection:bg-primary-fixed-dim overflow-hidden h-screen flex flex-col">
            <Head title="Mission Control | Goodgigs" />

            {/* Header Section */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-4 h-16">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-container rounded-full transition-colors active:scale-95 text-on-surface-variant hover:text-primary">
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
                <MapContainer 
                    center={gig.coordinates.worker as [number, number]} 
                    zoom={14} 
                    zoomControl={false}
                    className="absolute inset-0 z-0 h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {/* Worker Location Marker */}
                    <Marker 
                        position={gig.coordinates.worker as [number, number]}
                        icon={L.divIcon({
                            className: 'custom-marker',
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="bg-primary px-4 py-1 rounded-full shadow-lg border-2 border-white mb-2 flex items-center justify-center">
                                        <span class="font-label-md text-label-md font-bold text-white">En route</span>
                                    </div>
                                    <div class="w-14 h-14 rounded-full border-4 border-primary bg-primary-container p-0.5 shadow-xl relative">
                                        <img src="${worker.avatar}" alt="Worker" class="w-full h-full rounded-full object-cover" />
                                    </div>
                                </div>
                            `,
                            iconSize: [80, 100],
                            iconAnchor: [40, 50]
                        })} 
                    />

                    {/* Destination Marker */}
                    <Marker 
                        position={gig.coordinates.job as [number, number]}
                        icon={L.divIcon({
                            className: 'custom-marker',
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="w-10 h-10 rounded-full border-4 border-white bg-error text-on-error shadow-xl flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                                    </div>
                                    <div class="bg-gray-900 px-3 py-1 rounded-xl shadow mt-2">
                                        <span class="text-white font-label-sm text-[11px] font-bold text-center block leading-tight">${gig.location}</span>
                                    </div>
                                </div>
                            `,
                            iconSize: [100, 70],
                            iconAnchor: [50, 35]
                        })} 
                    />
                </MapContainer>

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

                        {/* Status Timeline / Actions */}
                        <div className="px-2">
                            {gig.status === 'assigned' && (
                                <>
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
                                        <h4 className="font-label-lg text-label-lg font-bold text-on-surface text-secondary">Waiting to Start</h4>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">Worker is preparing to start the gig</p>
                                    </div>
                                </>
                            )}

                            {gig.status === 'in_progress' && (
                                <div className="relative border-l-2 border-outline-variant/30 pl-6 pb-6">
                                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-4 border-surface shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse" />
                                    </div>
                                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface text-primary">In Progress</h4>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">Worker is currently executing the gig</p>
                                </div>
                            )}

                            {gig.status === 'reviewing' && (
                                <div className="mt-4 flex flex-col gap-4">
                                    <div className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-start gap-3 border border-primary/20">
                                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={20} />
                                        <div>
                                            <h4 className="font-title-md font-bold">Worker has completed the gig!</h4>
                                            <p className="font-body-sm mt-1 opacity-90">Please review their work and approve to release payment.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleApprove}
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-on-primary font-label-lg py-4 rounded-full font-bold shadow-sm active:scale-95 transition-all disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Approving...' : 'Approve & Pay'}
                                    </button>
                                </div>
                            )}

                            {gig.status === 'completed' && (
                                <div className="mt-4">
                                    <div className="bg-success-container/30 text-success p-4 rounded-xl flex items-center gap-3 border border-success/20 mb-6">
                                        <CheckCircle size={24} />
                                        <span className="font-title-md font-bold">Gig Approved & Paid</span>
                                    </div>
                                    
                                    <form onSubmit={handleReview} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/50">
                                        <h4 className="font-title-md font-bold text-on-surface mb-3">Leave a Review</h4>
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star 
                                                        size={28} 
                                                        className={`${star <= rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-outline-variant'} transition-colors`} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea 
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="How was the worker's performance?"
                                            className="w-full bg-surface border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24 mb-4"
                                        ></textarea>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-secondary text-on-secondary font-label-md py-3 rounded-xl font-bold shadow-sm active:scale-95 transition-all disabled:opacity-70"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
