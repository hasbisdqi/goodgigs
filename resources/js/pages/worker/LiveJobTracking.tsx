import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Navigation, MapPin, Gauge, MessageSquare, Phone, MoreHorizontal, Play, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LiveJobTrackingProps {
    job: {
        id: number;
        type: string;
        number: string;
        eta_mins: number;
        eta_time: string;
        distance_remaining: string;
        traffic_status: string;
        client: {
            name: string;
            avatar: string;
            location: string;
        };
    };
}

export default function LiveJobTracking({ job }: LiveJobTrackingProps) {
    // Slider state
    const [sliderX, setSliderX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    // Calculate maximum slide distance
    const maxSlide = containerRef.current && knobRef.current 
        ? containerRef.current.offsetWidth - knobRef.current.offsetWidth - 16 // 16px for padding
        : 300;

    const handleStart = (clientX: number) => {
        if (isCompleted || isLoading) return;
        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging) return;
        
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            let newX = clientX - containerRect.left - (knobRef.current?.offsetWidth || 56) / 2;
            
            // Constrain
            newX = Math.max(0, Math.min(newX, maxSlide));
            setSliderX(newX);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (sliderX >= maxSlide * 0.9) {
            // Trigger completion
            setSliderX(maxSlide);
            completeAction();
        } else {
            // Snap back
            setSliderX(0);
        }
    };

    // Attach global listeners for smooth mouse dragging (outside the knob)
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onMouseUp = () => handleEnd();
        
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const onTouchEnd = () => handleEnd();

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, sliderX, maxSlide]);

    const completeAction = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsCompleted(true);
            toast.success('Job Started Successfully!');
        }, 1000);
    };

    return (
        <div className="bg-surface-bright text-on-surface font-body-md selection:bg-primary-fixed-dim overflow-hidden h-screen flex flex-col">
            <Head title="Live Job Tracking | GigConnect" />

            {/* Header Section */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-container-padding-mobile h-16">
                <div className="flex items-center gap-stack-md">
                    <Link href="/worker/dashboard" className="active:scale-95 transition-transform p-2">
                        <ArrowLeft className="text-primary" size={24} />
                    </Link>
                    <div>
                        <h1 className="font-headline-md text-[18px] md:text-headline-md font-bold text-primary">{job.client.name}</h1>
                        <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                            {job.type} <span className="w-1 h-1 bg-outline rounded-full"></span> Job #{job.number}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" alt={job.client.name} src={job.client.avatar} />
                    </div>
                </div>
            </header>

            {/* Main Tracking Canvas */}
            <main className="flex-grow relative bg-surface-dim pt-16">
                {/* Map Placeholder */}
                <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACZr95Vn4r83n3mcWhxuU3QMmsTUwJGKLYdzuZ8tA328tQeDNMO8sihKZRfJWtjQmWt5XKF9MIMJt0JbkWg_eBROY6XHI3bTX5kyUIeVrZY9fNF3YJgDAzuQXpeqBo0koRYr3WgXFBqF2RDHvff5Ybr_XMVil3_hn9DhyVZCRVOVKYwV2yUmNoJ8IRVcU0adNHszRUtgzWVLArjQfZ94xePz1fZftGCygZDxoheM0_gH50MhsWmfRa-g')" }}>
                    
                    {/* Live Worker Marker */}
                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary rounded-full border-4 border-on-primary shadow-lg flex items-center justify-center relative">
                            <Navigation className="text-white" size={14} />
                            {/* Pulse Animation Ring */}
                            <div className="absolute inset-0 border-4 border-primary rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
                        </div>
                        <div className="mt-2 bg-primary px-3 py-1 rounded-full shadow-sm">
                            <span className="text-on-primary font-label-md text-[11px] whitespace-nowrap">You</span>
                        </div>
                    </div>

                    {/* Destination Marker */}
                    <div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                        <div className="w-10 h-10 bg-error rounded-full border-4 border-on-primary shadow-lg flex items-center justify-center">
                            <MapPin className="text-white fill-error" size={20} />
                        </div>
                        <div className="mt-2 bg-on-surface px-3 py-1 rounded-full shadow-sm">
                            <span className="text-on-primary font-label-md text-[11px] whitespace-nowrap">{job.client.location}</span>
                        </div>
                    </div>
                </div>

                {/* Floating ETA Badge */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-white/85 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 flex items-center gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                        <div className="flex flex-col">
                            <span className="font-headline-md text-[16px] md:text-[18px] text-on-surface leading-tight whitespace-nowrap">Arriving in {job.eta_mins} mins</span>
                            <span className="font-label-sm text-[12px] text-on-surface-variant whitespace-nowrap">Estimated arrival: {job.eta_time}</span>
                        </div>
                    </div>
                </div>

                {/* Floating Traffic Info */}
                <div className="absolute right-4 bottom-32 z-20 md:right-8">
                    <div className="bg-surface-container-lowest p-3 rounded-xl shadow-md border border-outline-variant flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2 text-secondary">
                            <Gauge size={18} />
                            <span className="font-label-md">{job.traffic_status}</span>
                        </div>
                        <span className="font-label-sm text-on-surface-variant">{job.distance_remaining} remaining</span>
                    </div>
                </div>
            </main>

            {/* Interaction & Status Layer */}
            <footer className="bg-surface-container-lowest shadow-[0_-8px_24px_rgba(0,0,0,0.06)] z-30 px-container-padding-mobile py-6 rounded-t-[32px] flex flex-col gap-6 relative">
                {/* Quick Actions Row */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                        <button className="flex-1 bg-surface-container-high py-4 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all hover:bg-surface-dim">
                            <MessageSquare className="text-primary" size={24} />
                            <span className="font-label-md text-on-surface">Message</span>
                        </button>
                        <button className="flex-1 bg-surface-container-high py-4 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all hover:bg-surface-dim">
                            <Phone className="text-secondary fill-secondary" size={24} />
                            <span className="font-label-md text-on-surface">Call</span>
                        </button>
                    </div>
                    <button className="w-16 h-16 shrink-0 bg-surface-container-high rounded-2xl flex items-center justify-center active:scale-95 transition-all hover:bg-surface-dim">
                        <MoreHorizontal className="text-on-surface-variant" size={28} />
                    </button>
                </div>

                {/* Kinetic Slider "Slide to Start Job" */}
                <div 
                    ref={containerRef}
                    className="relative w-full h-[72px] bg-surface-variant rounded-full p-2 flex items-center border-2 border-outline-variant/50 group overflow-hidden touch-none select-none"
                >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className={`font-label-md uppercase tracking-widest text-[13px] ${isCompleted ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:animate-pulse'}`}>
                            {isCompleted ? 'Job Started' : 'Slide to start job'}
                        </span>
                    </div>

                    {/* Fill background */}
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary/10 rounded-full transition-all duration-75 pointer-events-none" 
                        style={{ width: `${sliderX + 56}px` }}
                    ></div>

                    {/* Slider Knob */}
                    <div 
                        ref={knobRef}
                        onMouseDown={(e) => handleStart(e.clientX)}
                        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                        className={`absolute left-2 h-[56px] w-[56px] text-on-primary rounded-full flex items-center justify-center shadow-md z-10 transition-transform ${
                            !isDragging && !isCompleted ? 'duration-300 ease-out' : 'duration-75 ease-linear'
                        } ${
                            isCompleted || sliderX >= maxSlide * 0.95 ? 'bg-primary cursor-default' : 'bg-primary cursor-grab active:cursor-grabbing'
                        }`}
                        style={{ transform: `translateX(${sliderX}px)` }}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin text-white" size={28} />
                        ) : isCompleted ? (
                            <Check className="text-white" size={28} strokeWidth={3} />
                        ) : (
                            <Play className="text-white fill-white ml-1" size={24} />
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
