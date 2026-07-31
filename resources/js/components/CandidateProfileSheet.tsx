import React from 'react';
import { MapPin, Clock, MessageSquare, Star as StarIcon } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CandidateProfileSheetProps {
    candidate: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function CandidateProfileSheet({ candidate, isOpen, onClose }: CandidateProfileSheetProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (!candidate) return null;

    const Content = () => (
        <>
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-container-padding-mobile pb-32 mt-4 md:mt-0">
                {/* Candidate Header */}
                <div className="mt-stack-md flex flex-col md:flex-row items-center gap-stack-md mb-stack-lg">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-surface-container-high overflow-hidden shadow-lg border-2 border-white">
                            <img className="w-full h-full object-cover" alt={candidate.name} src={candidate.avatar} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md shadow-sm flex items-center gap-1 border border-secondary/20">
                            <StarIcon className="fill-current" size={16} />
                            {candidate.match}% Match
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{candidate.name}</h2>
                        <p className="font-body-lg text-body-lg text-primary font-semibold">{candidate.role}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-stack-sm">
                            <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                                <MapPin size={18} />
                                {candidate.location}
                            </div>
                            <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                                <Clock size={18} />
                                Full-time
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-stack-sm mb-stack-lg">
                    <div className="bg-surface-container-low p-stack-md rounded-2xl flex flex-col items-center text-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Experience</span>
                        <span className="font-headline-md text-headline-md text-on-surface">{candidate.experience_years} yrs</span>
                    </div>
                    <div className="bg-surface-container-low p-stack-md rounded-2xl flex flex-col items-center text-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Available</span>
                        <span className="font-headline-md text-headline-md text-secondary">{candidate.availability}</span>
                    </div>
                    <div className="bg-surface-container-low p-stack-md rounded-2xl flex flex-col items-center text-center">
                        <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Hourly Rate</span>
                        <span className="font-headline-md text-headline-md text-on-surface">${candidate.rate}/hr</span>
                    </div>
                </div>

                {/* About Section */}
                <section className="mb-stack-lg">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-stack-sm">Professional Bio</h3>
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        {candidate.bio_full}
                    </p>
                </section>

                {/* Skills Section */}
                <section className="mb-stack-lg">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-stack-sm">Core Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {candidate.skills_full?.map((skill: string, index: number) => (
                            <span key={index} className={`px-4 py-1.5 font-label-md text-label-md rounded-full ${index < 3 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface'}`}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Portfolio Preview */}
                {candidate.portfolio && (
                    <section className="mb-stack-lg">
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-stack-sm">Experience Spotlight</h3>
                        <div className="group relative bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="h-32 w-full overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${candidate.portfolio.image}')` }}></div>
                            </div>
                            <div className="p-stack-md">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-label-md text-label-md text-on-surface">{candidate.portfolio.title}</h4>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">{candidate.portfolio.period}</span>
                                </div>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">{candidate.portfolio.description}</p>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Persistent Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-container-padding-mobile bg-surface/80 backdrop-blur-md border-t border-outline-variant flex gap-stack-sm md:rounded-b-lg">
                <button className="flex-1 h-14 bg-primary text-on-primary font-label-md text-label-md rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <StarIcon className="fill-current" size={20} />
                    Shortlist
                </button>
                <button className="flex-1 h-14 border-2 border-primary text-primary font-label-md text-label-md rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <MessageSquare size={20} />
                    Message
                </button>
            </div>
        </>
    );

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-surface max-h-[85vh] flex flex-col">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{candidate.name}'s Profile</DialogTitle>
                    </DialogHeader>
                    <Content />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="h-[85vh] rounded-t-[32px] p-0 flex flex-col bg-surface">
                <DrawerHeader className="sr-only">
                    <DrawerTitle>{candidate.name}'s Profile</DrawerTitle>
                </DrawerHeader>
                <Content />
            </DrawerContent>
        </Drawer>
    );
}
