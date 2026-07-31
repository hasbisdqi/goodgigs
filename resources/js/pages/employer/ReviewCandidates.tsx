import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Bell, ChevronRight, ChevronDown, Filter, Star as StarIcon, ArrowRight, UsersRound } from 'lucide-react';
import BottomNavLayout from '@/layouts/BottomNavLayout';
import CandidateProfileSheet from '@/components/CandidateProfileSheet';

interface ReviewCandidatesProps {
    gig: {
        id: number;
        title: string;
        project: string;
        applicant_count: number;
    };
    candidates: any[];
}

export default function ReviewCandidates({ gig, candidates }: ReviewCandidatesProps) {
    const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

    return (
        <BottomNavLayout>
        <div className="bg-background text-on-background font-body-md min-h-screen md:pt-16 pb-24 md:pb-0">
            <Head title="Goodgigs | Review Candidates" />

            {/* TopAppBar Shell */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-40 flex justify-between items-center px-container-padding-mobile h-16">
                <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
                        <img className="w-full h-full object-cover" alt="Employer Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFlOAQ-s3JFVwMhMLxSYQZi4270H4P_SKFhoH0xgQvFKtVGwoI5OLkG9Go8_PkhOccmIXtpae8Hj3-2aRg2TZ0a2tPl0uIWj93T3TvnQWJ4jtmx6f47wpE6Zv9xSpYZHoIsVrzqtflqkuGHg-z8iYiuwm5gu4i5_YgjykngDG8t2QuKhcR3rfmtfdh7OgT9MzhQ9doRIXK-s5DcTSnHhLXEzNe7ptUFtMh-qT-WU3YuVY-FoNhYBocNQ" />
                    </div>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Goodgigs</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 transition-transform">
                        <Search size={24} />
                    </button>
                    <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 transition-transform">
                        <Bell size={24} />
                    </button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-container-padding-mobile md:px-container-padding-desktop pt-24 pb-12">
                {/* Gig Summary Hero Section */}
                <section className="mb-stack-lg animate-in fade-in duration-700">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                        <div>
                            <nav className="flex items-center gap-2 mb-2 text-label-md font-label-md text-on-surface-variant">
                                <span className="hover:text-primary cursor-pointer">My Gigs</span>
                                <ChevronRight size={16} />
                                <span className="text-primary font-bold">Candidates</span>
                            </nav>
                            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">{gig.title}</h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">{gig.project} • <span className="font-semibold text-secondary">{gig.applicant_count} Applicants</span></p>
                        </div>
                        {/* Filter/Sort Bar */}
                        <div className="flex flex-wrap gap-stack-sm mt-4 md:mt-0">
                            <div className="relative">
                                <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 pr-10 font-label-md text-label-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer">
                                    <option>Sort by: Best Match</option>
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Experience</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={20} />
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 pr-10 font-label-md text-label-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer">
                                    <option>Filter: All Applicants</option>
                                    <option>Filter: Shortlisted</option>
                                    <option>Filter: High Match (&gt;90%)</option>
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Candidates Grid */}
                {candidates.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                            {candidates.map((candidate) => (
                                <article key={candidate.id} className="bg-white/80 backdrop-blur-md rounded-[16px] p-stack-md shadow-sm hover:shadow-md border border-outline-variant/50 transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                    
                                    <div className="flex items-start gap-stack-md relative z-10">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0">
                                            <img className="w-full h-full object-cover" alt={candidate.name} src={candidate.avatar} />
                                        </div>
                                        <div className="grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-headline-md text-[18px] text-on-background">{candidate.name}</h3>
                                                    <p className="font-label-md text-label-md text-on-surface-variant">{candidate.role}</p>
                                                </div>
                                                <div className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1 border border-secondary-container/30">
                                                    <StarIcon className="fill-current" size={14} />
                                                    {candidate.match}% Match
                                                </div>
                                            </div>
                                            <div className="mt-stack-sm flex flex-wrap gap-2">
                                                {candidate.skills.map((skill: string, index: number) => (
                                                    <span key={index} className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${index === 2 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mt-stack-md font-body-md text-body-md text-on-surface-variant line-clamp-2">
                                                {candidate.bio}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex justify-between items-center relative z-10">
                                        <button 
                                            onClick={() => setSelectedCandidate(candidate)}
                                            className="text-on-surface-variant hover:text-primary font-label-md text-label-md flex items-center gap-1 transition-colors group/btn"
                                        >
                                            View Profile 
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                        <div className="flex gap-3">
                                            {candidate.status === 'shortlisted' ? (
                                                <button 
                                                    onClick={() => {
                                                        router.post(`/applications/${candidate.application_id}/hire`, {}, { preserveScroll: true });
                                                    }}
                                                    className="px-4 py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all bg-primary text-on-primary hover:brightness-110 active:scale-95"
                                                >
                                                    Hire
                                                </button>
                                            ) : candidate.status === 'hired' ? (
                                                <button 
                                                    disabled
                                                    className="px-4 py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all bg-secondary-container text-on-secondary-container opacity-80 cursor-default"
                                                >
                                                    Hired
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        router.post(`/applications/${candidate.application_id}/shortlist`, {}, { preserveScroll: true });
                                                    }}
                                                    className="px-4 py-2 rounded-xl font-label-md text-label-md shadow-sm transition-all bg-surface-container-highest text-on-surface hover:brightness-90 active:scale-95"
                                                >
                                                    Shortlist
                                                </button>
                                            )}
                                            <Link href={`/messages/${candidate.id}`}>
                                                <button className="bg-surface-container-low text-primary px-4 py-2 rounded-xl font-label-md text-label-md hover:bg-surface-container transition-all active:scale-95 border border-primary/10">
                                                    Message
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More Section */}
                        <div className="mt-stack-lg flex justify-center">
                            <button className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-label-md text-label-md hover:bg-primary/5 transition-all active:scale-95">
                                Load More Applicants
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4 bg-surface-container-lowest border border-dashed border-outline-variant rounded-[16px]">
                        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
                            <UsersRound size={32} className="text-on-surface-variant opacity-70" />
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No Candidates Yet</h3>
                        <p className="font-body-md text-on-surface-variant max-w-md">
                            Your gig is live, but no one has applied yet. Candidates will appear here as soon as they submit their application. Check back soon!
                        </p>
                    </div>
                )}
            </main>

            {/* Candidate Profile Sheet */}
            <CandidateProfileSheet 
                candidate={selectedCandidate} 
                isOpen={!!selectedCandidate} 
                onClose={() => setSelectedCandidate(null)} 
            />
        </div>
        </BottomNavLayout>
    );
}
