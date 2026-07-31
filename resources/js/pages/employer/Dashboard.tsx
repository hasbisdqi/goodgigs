import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, PlusCircle, Rocket, Users, CreditCard, 
    Clock, Terminal, Brush, Video, ArrowRight, MoreVertical,
    Star
} from 'lucide-react';
import BottomNavLayout from '@/layouts/BottomNavLayout';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';

export default function EmployerDashboard({ 
    stats,
    active_gigs,
    in_progress_gig,
    recommended_talent
}: any) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const getIcon = (name: string) => {
        if (name === 'Terminal') return <Terminal className="text-primary" size={28} />;
        if (name === 'Palette') return <Brush className="text-tertiary" size={28} />;
        if (name === 'Video') return <Video className="text-on-surface-variant" size={28} />;
        return <Terminal size={28} />;
    };

    return (
        <BottomNavLayout>
        <div className="bg-background text-on-background font-body-md min-h-screen pb-24 overflow-x-hidden">
            <Head title="GigConnect | Employer Dashboard" />

            {/* Top App Bar */}
            <header className="bg-surface shadow-sm sticky top-0 z-40">
                <div className="flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop w-full h-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
                            <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6y4e4430TxP-HS8Mdh8pnwuIRrh3t7oOgYvenAHaDAQ1Wod-4rS4vPoHCZnhWNo_y4PKkuBIg6I-10L6IvhswSBdnyczlq_62Hw1EfCGKptRTsODGLbTcqZFRyxv20eRkEWoYqL5XHLVhWLISYulTZQdToW-VRCu6RFfOWQM3jnridGKE7l7VVvtJUdWe1HdH8FHAtl5chCyyDiJWokwXZpln7LTG_vMTdLyVA7kWxb7qVB4nVipN8w" />
                        </div>
                        <h1 className="font-headline-md text-headline-md font-bold text-primary">GigConnect</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface-variant">
                            <Search size={24} />
                        </button>
                        {isDesktop && (
                            <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant">
                                <button className="px-4 py-1.5 rounded-full text-label-md font-label-md bg-primary text-on-primary shadow-sm">Employer</button>
                                <Link 
                                    href="/profile"
                                    className="px-4 py-1.5 rounded-full text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                                >
                                    Freelancer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop mt-stack-lg space-y-stack-lg">
                {/* Welcome Hero Section */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
                    <div>
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
                            Halo, Employer!
                        </h1>
                        <p className="text-on-surface-variant font-body-md text-body-md">
                            Your project pipeline is looking strong today.
                        </p>
                    </div>
                    <Button size="lg" className="flex items-center gap-2 rounded-xl">
                        <PlusCircle size={20} />
                        Post a New Gig
                    </Button>
                </section>

                {/* Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                    <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Rocket className="text-primary" size={24} />
                            <span className="text-secondary font-label-sm bg-secondary-container px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <p className="text-on-surface-variant text-label-sm">Active Projects</p>
                        <p className="text-headline-md font-headline-md text-on-surface">0{stats?.active_projects}</p>
                    </div>

                    <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="text-tertiary" size={24} />
                        </div>
                        <p className="text-on-surface-variant text-label-sm">Total Applicants</p>
                        <p className="text-headline-md font-headline-md text-on-surface">{stats?.total_applicants}</p>
                    </div>

                    <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <CreditCard className="text-secondary" size={24} />
                        </div>
                        <p className="text-on-surface-variant text-label-sm">Escrow Budget</p>
                        <p className="text-headline-md font-headline-md text-on-surface">${stats?.escrow_budget?.toLocaleString()}</p>
                    </div>

                    <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="text-on-surface-variant" size={24} />
                        </div>
                        <p className="text-on-surface-variant text-label-sm">Avg. Hire Time</p>
                        <p className="text-headline-md font-headline-md text-on-surface">{stats?.avg_hire_time}</p>
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

                    <div className="space-y-stack-md">
                        {active_gigs?.map((gig: any) => (
                            <div key={gig.id} className="bg-surface-container-lowest p-stack-md md:p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center gap-stack-md shadow-sm">
                                <div className={`w-14 h-14 ${gig.color_class} rounded-lg flex items-center justify-center shrink-0`}>
                                    {getIcon(gig.icon)}
                                </div>
                                <div className="grow">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-label-md text-headline-md text-on-surface">{gig.title}</h3>
                                        <span className={`px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-label-sm flex items-center gap-1`}>
                                            <Users size={14} />
                                            {gig.status}
                                        </span>
                                    </div>
                                    <p className="text-on-surface-variant font-body-md text-body-md mb-3">Project duration: {gig.duration} • Fixed Price: ${gig.price?.toLocaleString()}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {gig.tags?.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm font-label-sm text-on-surface-variant">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:text-right shrink-0 border-t md:border-t-0 md:border-l border-outline-variant pt-stack-md md:pt-0 md:pl-stack-md flex flex-col justify-center">
                                    <p className={`${gig.text_class} font-headline-md text-headline-md`}>{gig.new_applicants}</p>
                                    <p className="text-on-surface-variant text-label-sm font-label-sm mb-3">New Applicants</p>
                                    <Link href={`/gigs/${gig.id}/candidates`}>
                                        <Button className={`w-full md:w-auto ${gig.color_class.replace('-fixed', '')} text-white`}>Review Candidates</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {/* In Progress Gig */}
                        {in_progress_gig && (
                            <div className="bg-surface-container p-stack-md md:p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center gap-stack-md opacity-90 shadow-sm">
                                <div className="w-14 h-14 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
                                    <Video className="text-on-surface-variant" size={28} />
                                </div>
                                <div className="grow">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-label-md text-headline-md text-on-surface">{in_progress_gig.title}</h3>
                                        <span className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-full text-label-sm font-label-sm flex items-center gap-1">
                                            <RefreshCw size={14} />
                                            In Progress
                                        </span>
                                    </div>
                                    <p className="text-on-surface-variant font-body-md text-body-md mb-3">Assigned to: {in_progress_gig.assigned_to} • Due in {in_progress_gig.due_in}</p>
                                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${in_progress_gig.progress}%` }}></div>
                                    </div>
                                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">{in_progress_gig.progress}% Milestones Completed</p>
                                </div>
                                <div className="md:text-right shrink-0 border-t md:border-t-0 md:border-l border-outline-variant pt-stack-md md:pt-0 md:pl-stack-md flex md:flex-col gap-2 items-center justify-center">
                                    <Button variant="outline" className="grow w-full border-outline-variant bg-surface-container-highest text-on-surface hover:bg-surface-bright">Manage</Button>
                                    <button className="shrink-0 p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Suggested Talent Section */}
                {recommended_talent && (
                    <section className="mt-stack-lg">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Recommended for You</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {recommended_talent.map((talent: any) => (
                                <div key={talent.id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant">
                                    <div className="flex items-center gap-stack-md mb-stack-md">
                                        <img className="w-12 h-12 rounded-full object-cover" alt={talent.name} src={talent.avatar} />
                                        <div>
                                            <h4 className="font-label-md text-label-md text-on-surface">{talent.name}</h4>
                                            <p className="text-on-surface-variant text-label-sm font-label-sm">{talent.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-secondary mb-2">
                                        <Star className="fill-secondary text-secondary" size={14} />
                                        <span className="font-label-sm text-label-sm">{talent.rating} ({talent.reviews} reviews)</span>
                                    </div>
                                    <p className="text-on-surface-variant text-body-md line-clamp-2 mb-stack-md">{talent.bio}</p>
                                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-fixed hover:text-on-primary-fixed-variant">Invite to Gig</Button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
        </BottomNavLayout>
    );
}
