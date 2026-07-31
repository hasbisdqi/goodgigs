import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Briefcase, Star, ArrowRight, Bookmark, CheckCircle, Plus } from 'lucide-react';

interface WorkerDashboardProps {
    stats: {
        total_earnings: number;
        active_gigs: number;
        rating: number;
    };
    recommended_gigs: {
        id: number;
        title: string;
        company: string;
        location: string;
        posted_time: string;
        rate: number;
        tags: string[];
        logo: string;
    }[];
}

export default function WorkerDashboard({
    stats,
    recommended_gigs
}: WorkerDashboardProps) {
    return (
        <DashboardLayout title="Freelancer Dashboard" role="worker" userName="Sarah">
            {/* Hero Section */}
            <section className="mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Halo, Sarah!</h2>
                    <p className="text-on-surface-variant font-body-md">You have 3 pending offers and 2 upcoming deadlines this week. Time to shine!</p>
                </div>
            </section>

            {/* Stats Grid (Bento Style) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
                {/* Total Earnings */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Total Earnings</span>
                        <h3 className="text-headline-md font-bold text-primary mt-1">${stats.total_earnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="mt-4 h-12 flex items-end gap-1">
                        <div className="flex-1 bg-secondary-container/30 h-1/2 rounded-sm transition-all hover:h-full"></div>
                        <div className="flex-1 bg-secondary-container/50 h-2/3 rounded-sm transition-all hover:h-full"></div>
                        <div className="flex-1 bg-secondary-container/40 h-1/2 rounded-sm transition-all hover:h-full"></div>
                        <div className="flex-1 bg-secondary-container/70 h-3/4 rounded-sm transition-all hover:h-full"></div>
                        <div className="flex-1 bg-secondary-container h-full rounded-sm"></div>
                    </div>
                </div>

                {/* Active Gigs */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Active Gigs</span>
                            <h3 className="text-headline-md font-bold text-on-surface mt-1">{String(stats.active_gigs).padStart(2, '0')}</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Briefcase className="text-primary" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img className="w-full h-full" alt="Company 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCSUhJ5Dn1tg-ojX_KbCd1WqWEIxr14gcDWzBs084dbsneheskbfiMmatvBYy5zI5UqfY2vXuAvnsX-WR_W_oZXVOHsmqoyvo4VJzQ_cxHNS69Y4AfwyHmwul0Heyrai3D1PZS6o1UmqCTUCzb8T7Ei5KH-H1V73m1BH0fxj2LGC2M2uawR2haiSq9t_HHLfqiI1_WMlsBRi7trHhg4D5LqpS1JMkr3gK9JzY2EaiYk7dEQkVDpwntrg" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                            <img className="w-full h-full" alt="Company 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsk5NdgJl7Gj04un23RoBJ2-F6yZd7CT38qoRZI83Hq3Uc8vXkynGYYgf_MsvYubwodJJmuQWGF7Ce0fatjfZUqYxIKL3fr3Xivk2B5JScOJ6VfNdiLhWHNMKLJO8N2JEb2ILgH026tWr7nOe7dy4pyH88EGN64bVkXgfLz7q66BEK8QIIRoNzx6EtRNvOfS8nRM27utJ9aExdPEXOQty-xfZoasa7kWggqy4XOdeAvi3QnYsmKRKXJQ" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+2</div>
                    </div>
                </div>

                {/* Client Rating */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Client Rating</span>
                            <h3 className="text-headline-md font-bold text-on-surface mt-1">{stats.rating.toFixed(1)}<span className="text-body-md font-normal text-on-surface-variant">/5.0</span></h3>
                        </div>
                        <div className="bg-secondary-container/30 p-2 rounded-lg">
                            <Star className="text-secondary fill-secondary" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-label-sm font-medium text-secondary">Top Rated Plus</span>
                        <div className="h-1 flex-1 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[98%]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Gigs Section */}
            <section className="mb-12">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Recommended for You</h2>
                        <p className="text-on-surface-variant font-body-md">Based on your skills in UI/UX & React</p>
                    </div>
                    <Link className="text-primary font-label-md hover:underline flex items-center gap-1 active:scale-95 transition-transform" href="#">
                        Find More Gigs
                        <ArrowRight size={16} />
                    </Link>
                </div>
                
                <div className="flex flex-col gap-stack-md">
                    {recommended_gigs.map((gig) => (
                        <div key={gig.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant">
                                    <img className="w-full h-full object-cover" alt={gig.company} src={gig.logo} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">{gig.title}</h4>
                                            <p className="text-on-surface-variant font-body-md flex items-center gap-2">
                                                {gig.company} • {gig.location}
                                                <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                                                Posted {gig.posted_time}
                                            </p>
                                        </div>
                                        {gig.id === 2 && (
                                            <button className="p-2 text-on-surface-variant hover:text-primary active:scale-90 transition-transform">
                                                <Bookmark size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 my-4">
                                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm rounded-full flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            Matched Skill
                                        </span>
                                        {gig.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-surface-container text-on-surface-variant font-label-sm rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                                        <span className="font-headline-md text-on-surface">${gig.rate}<span className="text-body-md text-on-surface-variant font-normal">/hr</span></span>
                                        <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:bg-primary-container active:scale-95 transition-all shadow-sm">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Floating Action Button */}
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl shadow-lg flex items-center justify-center hover:shadow-xl active:scale-90 transition-all z-40 group overflow-hidden">
                <Plus size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
        </DashboardLayout>
    );
}
