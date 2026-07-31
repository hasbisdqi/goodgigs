import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, Edit, RefreshCw, User, CreditCard, 
    Bell, HelpCircle, ShieldCheck, LogOut, Home, Briefcase, MessageSquare
} from 'lucide-react';

interface UserProfileProps {
    user: {
        name: string;
        title: string;
        description: string;
        rating: number;
        avatar: string;
        skills: string[];
        extra_skills_count: number;
    }
}

export default function UserProfile({ user }: UserProfileProps) {
    const [isEmployerMode, setIsEmployerMode] = useState(false);

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen pb-24 overflow-x-hidden">
            <Head title="GigConnect | Profile" />

            {/* Top App Bar */}
            <header className="bg-surface shadow-sm sticky top-0 z-40">
                <div className="flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop w-full h-16 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
                            <img className="w-full h-full object-cover" alt={user.name} src={user.avatar} />
                        </div>
                        <h1 className="font-headline-md text-headline-md font-bold text-primary">GigConnect</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 text-on-surface-variant">
                            <Search size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop mt-stack-lg space-y-stack-lg">
                {/* Profile Header Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Main Profile Card */}
                    <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm relative overflow-hidden border border-outline-variant/30">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary-fixed-dim"></div>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-md">
                                    <img className="w-full h-full object-cover" alt={user.name} src={user.avatar} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white">
                                    <span className="font-label-sm text-label-sm font-bold text-[10px]">★</span>
                                    <span className="font-label-sm text-label-sm">{user.rating}</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-stack-sm">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg">{user.name}</h2>
                                    <button className="text-primary font-label-md flex items-center gap-1 hover:underline">
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                                <p className="text-on-surface-variant max-w-lg font-body-md leading-relaxed">
                                    {user.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {user.skills.map(skill => (
                                        <span key={skill} className="bg-secondary-container/30 text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm border border-secondary-container">
                                            {skill}
                                        </span>
                                    ))}
                                    {user.extra_skills_count > 0 && (
                                        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-label-sm">
                                            +{user.extra_skills_count} skills
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role Switcher Card */}
                    <div className={`md:col-span-4 rounded-xl p-6 shadow-lg flex flex-col justify-between border relative overflow-hidden transition-colors duration-300 ${
                        isEmployerMode 
                        ? 'bg-on-tertiary-container text-on-tertiary border-on-tertiary-container' 
                        : 'bg-primary-container text-on-primary-container border-primary'
                    }`}>
                        <div className="relative z-10">
                            <h3 className="font-headline-md text-headline-md mb-2">
                                {isEmployerMode ? 'Find Work?' : 'Hire Experts?'}
                            </h3>
                            <p className={`font-body-md mb-6 ${isEmployerMode ? 'text-on-tertiary/80' : 'text-on-primary-container/80'}`}>
                                {isEmployerMode 
                                    ? 'Switch to Freelancer mode to browse gigs and submit proposals.' 
                                    : 'Switch to Employer mode to post new gigs and manage your team.'}
                            </p>
                        </div>
                        <div className="relative z-10">
                            <button 
                                onClick={() => setIsEmployerMode(!isEmployerMode)}
                                className="w-full bg-surface text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-md group"
                            >
                                {isEmployerMode ? (
                                    <User className="group-hover:scale-110 transition-transform duration-300" size={24} />
                                ) : (
                                    <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={24} />
                                )}
                                Switch to {isEmployerMode ? 'Freelancer' : 'Employer'}
                            </button>
                            <p className={`text-center text-label-sm mt-3 ${isEmployerMode ? 'text-on-tertiary/60' : 'text-on-primary-container/60'}`}>
                                Current mode: {isEmployerMode ? 'Employer' : 'Freelancer'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Settings Links Bento Section */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Account Settings */}
                    <div className="md:col-span-6 space-y-stack-md">
                        <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest pl-2">General Settings</h4>
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm">
                            <a href="#" className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">Account</p>
                                    <p className="text-label-sm text-on-surface-variant">Profile info, email, security</p>
                                </div>
                                <span className="text-on-surface-variant group-hover:translate-x-1 transition-transform">›</span>
                            </a>
                            <div className="h-px bg-outline-variant/20 mx-6"></div>
                            
                            <a href="#" className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                                    <CreditCard size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">Payment Methods</p>
                                    <p className="text-label-sm text-on-surface-variant">Manage cards and bank accounts</p>
                                </div>
                                <span className="text-on-surface-variant group-hover:translate-x-1 transition-transform">›</span>
                            </a>
                            <div className="h-px bg-outline-variant/20 mx-6"></div>

                            <a href="#" className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">Notifications</p>
                                    <p className="text-label-sm text-on-surface-variant">Push, email, and gig alerts</p>
                                </div>
                                <span className="text-on-surface-variant group-hover:translate-x-1 transition-transform">›</span>
                            </a>
                        </div>
                    </div>

                    {/* Support & Legal */}
                    <div className="md:col-span-6 space-y-stack-md">
                        <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest pl-2">Help & Support</h4>
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm">
                            <a href="#" className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-on-surface-variant/10 text-on-surface-variant flex items-center justify-center">
                                    <HelpCircle size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">Help Center</p>
                                    <p className="text-label-sm text-on-surface-variant">FAQs, tutorials, and support chat</p>
                                </div>
                                <span className="text-on-surface-variant group-hover:translate-x-1 transition-transform">›</span>
                            </a>
                            <div className="h-px bg-outline-variant/20 mx-6"></div>

                            <a href="#" className="flex items-center gap-4 px-6 py-5 hover:bg-surface-container transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-on-surface-variant/10 text-on-surface-variant flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-label-md text-label-md text-on-surface">Privacy & Safety</p>
                                    <p className="text-label-sm text-on-surface-variant">Data usage and identity verification</p>
                                </div>
                                <span className="text-on-surface-variant group-hover:translate-x-1 transition-transform">›</span>
                            </a>
                        </div>

                        <div className="pt-4 px-2">
                            <button className="w-full text-error border border-error/20 bg-error/5 py-4 rounded-xl font-label-md hover:bg-error hover:text-white transition-colors flex items-center justify-center gap-2">
                                <LogOut size={18} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation Bar (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center px-4 py-2 border-none">
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href={isEmployerMode ? '/employer/dashboard' : '/worker/dashboard'}>
                    <Home size={24} />
                    <span className="font-label-sm text-label-sm mt-1">Home</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="#">
                    <Briefcase size={24} />
                    <span className="font-label-sm text-label-sm mt-1">My Gigs</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="/messages">
                    <MessageSquare size={24} />
                    <span className="font-label-sm text-label-sm mt-1">Messages</span>
                </Link>
                <Link className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200" href="/profile">
                    <User size={24} className="fill-current" />
                    <span className="font-label-sm text-label-sm">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
