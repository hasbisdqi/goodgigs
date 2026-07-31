import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, SlidersHorizontal, MapPin, Navigation, Wrench, Hammer, CheckCircle2 } from 'lucide-react';

interface GigMarker {
    id: number;
    top: string;
    left: string;
    color_class: string;
    text_class: string;
    icon: string;
    selected?: boolean;
    preview?: {
        title: string;
        price: number;
        distance: string;
        image: string;
    };
}

interface MapBrowseProps {
    categories: string[];
    map_image: string;
    markers: GigMarker[];
}

const getIcon = (name: string, className?: string) => {
    switch (name) {
        case 'Wrench': return <Wrench className={className} size={18} />;
        case 'Hammer': return <Hammer className={className} size={18} />;
        default: return <MapPin className={className} size={18} />;
    }
};

export default function MapBrowse({ categories, map_image, markers }: MapBrowseProps) {
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    return (
        <div className="bg-background text-on-background min-h-screen overflow-hidden flex flex-col">
            <Head title="GigConnect | Browse Gigs Map" />

            {/* Top AppBar */}
            <header className="bg-surface shadow-sm sticky top-0 z-50 flex justify-between items-center px-container-padding-mobile w-full h-16 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
                        <img 
                            className="w-full h-full object-cover" 
                            alt="User avatar" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6y4e4430TxP-HS8Mdh8pnwuIRrh3t7oOgYvenAHaDAQ1Wod-4rS4vPoHCZnhWNo_y4PKkuBIg6I-10L6IvhswSBdnyczlq_62Hw1EfCGKptRTsODGLbTcqZFRyxv20eRkEWoYqL5XHLVhWLISYulTZQdToW-VRCu6RFfOWQM3jnridGKE7l7VVvtJUdWe1HdH8FHAtl5chCyyDiJWokwXZpln7LTG_vMTdLyVA7kWxb7qVB4nVipN8w" 
                        />
                    </div>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">GigConnect</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-primary hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 transition-transform">
                        <Search size={24} />
                    </button>
                </div>
            </header>

            <main className="relative w-full h-[calc(100vh-64px)] flex-grow overflow-hidden">
                {/* Floating Filter Bar & Search */}
                <div className="absolute top-4 left-0 right-0 z-20 px-4 pointer-events-none">
                    <div className="max-w-4xl mx-auto flex flex-col gap-3 pointer-events-auto">
                        
                        {/* Search & View Toggle */}
                        <div className="flex gap-2 items-center">
                            <div className="flex-grow bg-white/85 backdrop-blur-md shadow-md rounded-full px-4 py-2 flex items-center gap-3 border border-outline-variant/30">
                                <Search className="text-outline shrink-0" size={20} />
                                <input 
                                    className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface outline-none" 
                                    placeholder="Search service jobs nearby..." 
                                    type="text"
                                />
                                <div className="h-6 w-[1px] bg-outline-variant/50 shrink-0"></div>
                                <button className="flex items-center gap-2 text-primary font-label-md shrink-0">
                                    <SlidersHorizontal size={20} />
                                </button>
                            </div>
                            <div className="bg-white/85 backdrop-blur-md shadow-md rounded-full p-1 flex border border-outline-variant/30 shrink-0">
                                <button className="px-4 py-1.5 rounded-full text-on-surface-variant font-label-md transition-all">List</button>
                                <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md transition-all shadow-md">Map</button>
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md transition-colors border ${
                                        activeCategory === cat 
                                        ? 'bg-secondary text-on-secondary shadow-sm border-transparent' 
                                        : 'bg-white/85 backdrop-blur-md text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-low'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map Layer (Simulated) */}
                <div className="relative w-full h-full bg-surface-dim">
                    <div className="absolute inset-0 grayscale-[20%] opacity-90">
                        <img className="w-full h-full object-cover" alt="Map background" src={map_image} />
                    </div>

                    {/* Markers */}
                    {markers.map(marker => (
                        <div 
                            key={marker.id} 
                            className={`absolute -translate-x-1/2 -translate-y-1/2 ${marker.selected ? 'z-30' : 'cursor-pointer group'}`}
                            style={{ top: marker.top, left: marker.left }}
                        >
                            {marker.selected ? (
                                <div className="flex flex-col items-center">
                                    {/* Preview Card */}
                                    <div className="bg-white rounded-xl shadow-2xl p-3 mb-3 w-64 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex gap-3 items-start mb-2">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                                <img className="w-full h-full object-cover" alt={marker.preview?.title} src={marker.preview?.image} />
                                            </div>
                                            <div className="grow">
                                                <h3 className="font-label-md text-on-surface line-clamp-1">{marker.preview?.title}</h3>
                                                <div className="flex items-center gap-1 text-secondary">
                                                    <span className="font-label-md">${marker.preview?.price.toFixed(2)}</span>
                                                    <span className="text-[10px] text-outline">/ hr</span>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="text-secondary shrink-0" size={18} />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                                                <Navigation size={14} /> {marker.preview?.distance}
                                            </span>
                                            <button className="bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm shadow-sm active:scale-95 transition-transform">
                                                View Gig
                                            </button>
                                        </div>
                                    </div>
                                    {/* Selected Pin */}
                                    <div className="w-10 h-10 bg-primary rounded-full rounded-bl-none rotate-45 flex items-center justify-center shadow-2xl animate-bounce border-2 border-on-primary">
                                        <div className="-rotate-45">
                                            {getIcon(marker.icon, marker.text_class)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={`w-8 h-8 ${marker.color_class} rounded-full rounded-bl-none rotate-45 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <div className="-rotate-45">
                                        {getIcon(marker.icon, marker.text_class)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Location Button */}
                    <button className="absolute bottom-24 right-4 bg-white p-3 rounded-full shadow-lg border border-outline-variant/20 hover:bg-surface-container transition-colors active:scale-90 duration-200 z-10 flex items-center justify-center text-primary">
                        <Navigation size={24} />
                    </button>
                </div>
            </main>

            {/* Bottom Navigation (Simplified for this view) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] h-16 md:hidden">
                 <Link className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200" href="/worker/dashboard">
                    <MapPin size={24} className="fill-current" />
                    <span className="font-label-sm text-label-sm">Explore</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="#">
                    <Wrench size={24} />
                    <span className="font-label-sm text-label-sm">My Gigs</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="/messages">
                    <Search size={24} />
                    <span className="font-label-sm text-label-sm">Messages</span>
                </Link>
            </nav>
        </div>
    );
}
