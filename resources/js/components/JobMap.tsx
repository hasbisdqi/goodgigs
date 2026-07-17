import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { MapPin, Briefcase, MapPin as MapPinIcon, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Types from our JobPosting model
type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    salary?: string;
    type: string;
    status: string;
    latitude?: number;
    longitude?: number;
    user?: {
        name: string;
        email: string;
    };
};

type JobMapProps = {
    jobs: Job[];
    onJobSelect?: (job: Job) => void;
    className?: string;
};

// Custom marker icon using simple HTML string to avoid react-dom/server issues on client
const customMarkerIcon = divIcon({
    html: `
        <div class="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground shadow-lg border-2 border-white -ml-4 -mt-8 relative animate-in zoom-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin size-4"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-primary border-r-[6px] border-r-transparent"></div>
        </div>
    `,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Component to recenter map when jobs change
function MapRecenter({ jobs }: { jobs: Job[] }) {
    const map = useMap();
    
    useEffect(() => {
        const jobsWithCoords = jobs.filter(j => j.latitude && j.longitude);
        if (jobsWithCoords.length > 0) {
            // Find bounds
            let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
            
            jobsWithCoords.forEach(job => {
                if (job.latitude! < minLat) minLat = job.latitude!;
                if (job.latitude! > maxLat) maxLat = job.latitude!;
                if (job.longitude! < minLng) minLng = job.longitude!;
                if (job.longitude! > maxLng) maxLng = job.longitude!;
            });
            
            // Add some padding
            const latPadding = (maxLat - minLat) * 0.1 || 0.05;
            const lngPadding = (maxLng - minLng) * 0.1 || 0.05;
            
            map.fitBounds([
                [minLat - latPadding, minLng - lngPadding],
                [maxLat + latPadding, maxLng + lngPadding]
            ]);
        }
    }, [jobs, map]);
    
    return null;
}

export default function JobMap({ jobs, onJobSelect, className = '' }: JobMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    
    // Ensure Leaflet only renders on client-side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className={`bg-muted/20 animate-pulse rounded-xl border flex items-center justify-center ${className}`}>
            <MapPin className="size-8 text-muted-foreground/30 animate-bounce" />
        </div>;
    }

    const defaultCenter: [number, number] = [-6.200000, 106.816666]; // Jakarta
    
    const jobsWithCoords = jobs.filter(job => job.latitude && job.longitude);

    return (
        <div className={`rounded-xl overflow-hidden border shadow-sm z-10 ${className}`}>
            <MapContainer 
                center={defaultCenter} 
                zoom={11} 
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapRecenter jobs={jobsWithCoords} />

                {jobsWithCoords.map(job => (
                    <Marker 
                        key={job.id} 
                        position={[job.latitude!, job.longitude!]}
                        icon={customMarkerIcon}
                    >
                        <Popup className="rounded-xl">
                            <div className="p-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                        {job.type}
                                    </Badge>
                                    {job.status === 'completed' && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600">
                                            Selesai
                                        </Badge>
                                    )}
                                </div>
                                
                                <h3 className="font-bold text-sm mb-1 leading-tight">{job.title}</h3>
                                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                    <Briefcase className="size-3" />
                                    {job.company}
                                </p>
                                
                                <div className="space-y-1.5 mb-3">
                                    <div className="flex items-start gap-1.5 text-xs">
                                        <MapPinIcon className="size-3.5 text-primary shrink-0 mt-0.5" />
                                        <span className="leading-tight">{job.location}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                            <DollarSign className="size-3.5 shrink-0" />
                                            {job.salary}
                                        </div>
                                    )}
                                </div>
                                
                                {onJobSelect && (
                                    <Button 
                                        size="sm" 
                                        className="w-full h-8 text-xs" 
                                        onClick={() => onJobSelect(job)}
                                    >
                                        <ExternalLink className="size-3 mr-1.5" />
                                        Lihat Detail
                                    </Button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
