import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
    PlusCircle, Rocket, Users, Wallet, Clock, 
    ArrowRight, UserSearch, RefreshCw, MoreVertical, 
    Star, Terminal, Palette, Video 
} from 'lucide-react';

interface EmployerDashboardProps {
    stats: {
        active_projects: number;
        total_applicants: number;
        escrow_budget: number;
        avg_hire_time: string;
    };
    active_gigs: {
        id: number;
        title: string;
        status: string;
        duration: string;
        price: number;
        tags: string[];
        new_applicants: number;
        icon: 'Terminal' | 'Palette';
        color_class: string;
        text_class: string;
    }[];
    in_progress_gig: {
        id: number;
        title: string;
        assigned_to: string;
        due_in: string;
        progress: number;
        icon: 'Video';
    };
    recommended_talent: {
        id: number;
        name: string;
        role: string;
        rating: number;
        reviews: number;
        description: string;
        avatar: string;
    }[];
}

const getIcon = (name: string, className?: string) => {
    switch (name) {
        case 'Terminal': return <Terminal className={className} size={32} />;
        case 'Palette': return <Palette className={className} size={32} />;
        case 'Video': return <Video className={className} size={32} />;
        default: return null;
    }
};

export default function EmployerDashboard({
    stats,
    active_gigs,
    in_progress_gig,
    recommended_talent
}: EmployerDashboardProps) {
    return (
        <DashboardLayout title="Employer Dashboard" role="employer" userName="Employer User">
            {/* Welcome Hero Section */}
            <section className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                <div>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
                        Halo, Employer!
                    </h1>
                    <p className="text-on-surface-variant font-body-md text-body-md">
                        Your project pipeline is looking strong today.
                    </p>
                </div>
                <button className="flex items-center justify-center gap-stack-sm bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md shadow-lg hover:brightness-110 active:scale-95 transition-all">
                    <PlusCircle size={20} />
                    Post a New Gig
                </button>
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
                <div className="bento-card bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <Rocket className="text-primary" size={24} />
                        <span className="text-secondary font-label-sm text-label-sm bg-secondary-container px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <p className="text-on-surface-variant text-label-sm font-label-sm">Active Projects</p>
                    <p className="text-headline-md font-headline-md text-on-surface">{String(stats.active_projects).padStart(2, '0')}</p>
                </div>
                <div className="bento-card bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-tertiary" size={24} />
                    </div>
                    <p className="text-on-surface-variant text-label-sm font-label-sm">Total Applicants</p>
                    <p className="text-headline-md font-headline-md text-on-surface">{stats.total_applicants}</p>
                </div>
                <div className="bento-card bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <Wallet className="text-secondary" size={24} />
                    </div>
                    <p className="text-on-surface-variant text-label-sm font-label-sm">Escrow Budget</p>
                    <p className="text-headline-md font-headline-md text-on-surface">${stats.escrow_budget.toLocaleString()}</p>
                </div>
                <div className="bento-card bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="text-on-surface-variant" size={24} />
                    </div>
                    <p className="text-on-surface-variant text-label-sm font-label-sm">Avg. Hire Time</p>
                    <p className="text-headline-md font-headline-md text-on-surface">{stats.avg_hire_time}</p>
                </div>
            </div>

            {/* Main Content Section: Active Gigs */}
            <section>
                <div className="flex items-center justify-between mb-stack-md">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Your Active Gigs</h2>
                    <button className="text-primary font-label-md text-label-md flex items-center hover:underline">
                        View Archive
                        <ArrowRight size={16} className="ml-1" />
                    </button>
                </div>
                
                {/* Gig Listing Stack */}
                <div className="space-y-stack-md">
                    {active_gigs.map((gig) => (
                        <div key={gig.id} className="bento-card bg-surface-container-lowest p-stack-md md:p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center gap-stack-md">
                            <div className={`w-14 h-14 ${gig.color_class} rounded-lg flex items-center justify-center shrink-0`}>
                                {getIcon(gig.icon, gig.text_class)}
                            </div>
                            <div className="grow">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-label-md text-headline-md text-on-surface">{gig.title}</h3>
                                    <span className={`px-3 py-1 ${gig.id === 1 ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed-variant'} rounded-full text-label-sm font-label-sm flex items-center gap-1`}>
                                        {gig.id === 1 ? (
                                            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                                        ) : (
                                            <UserSearch size={14} />
                                        )}
                                        {gig.status}
                                    </span>
                                </div>
                                <p className="text-on-surface-variant font-body-md text-body-md mb-3">
                                    Project duration: {gig.duration} • Fixed Price: ${gig.price.toLocaleString()}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {gig.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-label-sm text-on-surface-variant">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="md:text-right shrink-0 border-t md:border-t-0 md:border-l border-outline-variant pt-stack-md md:pt-0 md:pl-stack-md">
                                <p className={`${gig.text_class} font-headline-md text-headline-md`}>{gig.new_applicants}</p>
                                <p className="text-on-surface-variant text-label-sm font-label-sm mb-3">New Applicants</p>
                                <button className={`w-full md:w-auto ${gig.id === 1 ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'} px-4 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform`}>
                                    Review Candidates
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* In Progress Gig */}
                    <div className="bento-card bg-surface-container p-stack-md md:p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center gap-stack-md opacity-90">
                        <div className="w-14 h-14 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
                            {getIcon(in_progress_gig.icon, "text-on-surface-variant")}
                        </div>
                        <div className="grow">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-label-md text-headline-md text-on-surface">{in_progress_gig.title}</h3>
                                <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-label-sm font-label-sm flex items-center gap-1">
                                    <RefreshCw size={14} />
                                    In Progress
                                </span>
                            </div>
                            <p className="text-on-surface-variant font-body-md text-body-md mb-3">
                                Assigned to: {in_progress_gig.assigned_to} • Due in {in_progress_gig.due_in}
                            </p>
                            <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                                <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${in_progress_gig.progress}%` }}></div>
                            </div>
                            <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">{in_progress_gig.progress}% Milestones Completed</p>
                        </div>
                        <div className="md:text-right shrink-0 border-t md:border-t-0 md:border-l border-outline-variant pt-stack-md md:pt-0 md:pl-stack-md flex md:flex-col gap-2">
                            <button className="grow bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md border border-outline-variant hover:bg-surface-bright transition-colors">Manage</button>
                            <button className="shrink-0 p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"><MoreVertical size={20} /></button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Suggested Talent Placeholder */}
            <section className="mt-stack-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                    {recommended_talent.map((talent, idx) => (
                        <div key={talent.id} className={`bento-card bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant ${idx > 0 ? 'hidden md:block' : ''}`}>
                            <div className="flex items-center gap-stack-md mb-stack-md">
                                <img className="w-12 h-12 rounded-full object-cover" alt={talent.name} src={talent.avatar} />
                                <div>
                                    <h4 className="font-label-md text-label-md text-on-surface">{talent.name}</h4>
                                    <p className="text-on-surface-variant text-label-sm font-label-sm">{talent.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-secondary mb-2">
                                <Star className="fill-secondary" size={14} />
                                <span className="font-label-sm text-label-sm">{talent.rating} ({talent.reviews} reviews)</span>
                            </div>
                            <p className="text-on-surface-variant text-body-md line-clamp-2 mb-stack-md">{talent.description}</p>
                            <button className="w-full py-2 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors">Invite to Gig</button>
                        </div>
                    ))}
                </div>
            </section>
        </DashboardLayout>
    );
}
