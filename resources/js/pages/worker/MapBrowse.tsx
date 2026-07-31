import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, SlidersHorizontal, MapPin, Navigation, Wrench, Hammer, CheckCircle2, LocateFixed } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface GigMarker {
    id: number;
    latitude: number;
    longitude: number;
    color_class: string;
    text_class: string;
    icon: string;
    preview?: {
        title: string;
        price: number;
        distance: string;
        image: string;
    };
}

interface MapBrowseProps {
    categories?: string[];
    markers?: GigMarker[];
}

const getIcon = (name: string, className?: string) => {
    switch (name) {
        case 'Wrench': return <Wrench className={className} size={18} />;
        case 'Hammer': return <Hammer className={className} size={18} />;
        default: return <MapPin className={className} size={18} />;
    }
};

import BottomNavLayout from '@/layouts/BottomNavLayout';

export default function MapBrowse({ categories = ['All', 'Handyman', 'Cleaning', 'Moving'], markers = [] }: MapBrowseProps) {
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

    return (
        <BottomNavLayout>
        <div className="bg-background text-on-background min-h-screen overflow-hidden flex flex-col">
            <Head title="Goodgigs | Browse Gigs Map" />

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
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Goodgigs</h1>
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
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 rounded-full font-label-md transition-all ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                >
                                    List
                                </button>
                                <button 
                                    onClick={() => setViewMode('map')}
                                    className={`px-4 py-1.5 rounded-full font-label-md transition-all ${viewMode === 'map' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                                >
                                    Map
                                </button>
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

                {/* Map Layer */}
                {viewMode === 'map' ? (
                    <>
                        <div className="relative w-full h-full bg-surface-dim">
                            <Map
                                initialViewState={{
                                    longitude: 110.3695,
                                    latitude: -7.7956,
                                    zoom: 13
                                }}
                                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                style={{ width: '100%', height: '100%' }}
                                onClick={() => setSelectedMarkerId(null)}
                            >
                                <NavigationControl position="bottom-right" style={{ marginBottom: '100px' }} />

                                {markers.map(marker => {
                                    const isSelected = selectedMarkerId === marker.id;
                                    
                                    return (
                                        <Marker 
                                            key={marker.id}
                                            longitude={marker.longitude}
                                            latitude={marker.latitude}
                                            anchor="bottom"
                                            onClick={e => {
                                                e.originalEvent.stopPropagation();
                                                setSelectedMarkerId(marker.id);
                                            }}
                                        >
                                            <div className={`${isSelected ? 'z-30 relative' : 'cursor-pointer group relative'}`}>
                                                {isSelected ? (
                                                    <div className="flex flex-col items-center">
                                                        {/* Preview Card */}
                                                        <div className="bg-white rounded-xl shadow-2xl p-3 mb-2 w-64 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                                                                    <Navigation size={14} /> {marker.preview?.distance}
                                                                </span>
                                                                <Link href={`/gigs/${marker.id}/apply`}>
                                                                    <button className="bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm shadow-sm active:scale-95 transition-transform">
                                                                        View Gig
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {/* Selected Pin */}
                                                        <div className="w-10 h-10 bg-primary rounded-full rounded-bl-none rotate-45 flex items-center justify-center shadow-2xl animate-bounce border-2 border-on-primary">
                                                            <div className="-rotate-45 text-on-primary">
                                                                {getIcon(marker.icon, 'text-on-primary')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`w-8 h-8 ${marker.color_class} rounded-full rounded-bl-none rotate-45 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                        <div className={`-rotate-45 ${marker.text_class}`}>
                                                            {getIcon(marker.icon, marker.text_class)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Marker>
                                    );
                                })}
                            </Map>

                            {/* Location Button */}
                            <button 
                                title="Find My Location"
                                className="absolute bottom-[160px] right-4 bg-white p-3 rounded-full shadow-lg border border-outline-variant/20 hover:bg-surface-container transition-colors active:scale-90 duration-200 z-10 flex items-center justify-center text-primary"
                            >
                                <LocateFixed size={24} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-surface-container-lowest overflow-y-auto pt-36 px-4 pb-28 md:pt-40">
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {markers.length > 0 ? markers.map(marker => (
                                <div key={marker.id} className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-4 flex gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20">
                                            <img className="w-full h-full object-cover" alt={marker.preview?.title} src={marker.preview?.image} />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1 mb-1">{marker.preview?.title}</h3>
                                                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm">
                                                    <div className={`flex items-center justify-center w-5 h-5 rounded-full ${marker.color_class} ${marker.text_class}`}>
                                                        {getIcon(marker.icon, "w-3 h-3")}
                                                    </div>
                                                    <span>{marker.preview?.distance}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <span className="font-headline-sm text-primary">Rp{marker.preview?.price?.toLocaleString('id-ID')}</span>
                                                <Link href={`/gigs/${marker.id}/apply`}>
                                                    <button className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-label-md active:scale-95 transition-transform hover:bg-secondary hover:text-white">
                                                        Apply
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
                                    <Search size={48} className="mb-4 opacity-50" />
                                    <p className="font-headline-sm text-headline-sm mb-2">No gigs found</p>
                                    <p className="font-body-md text-center max-w-md">Try adjusting your filters or search terms to find more gigs nearby.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
        </BottomNavLayout>
    );
}
