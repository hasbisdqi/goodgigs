import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Home, Briefcase, MessageSquare, User } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    userName?: string;
    userAvatar?: string;
    role?: 'employer' | 'worker';
}
import BottomNavLayout from '@/layouts/BottomNavLayout';

export default function DashboardLayout({
    children,
    title = 'Dashboard',
    userName = 'User',
    userAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6y4e4430TxP-HS8Mdh8pnwuIRrh3t7oOgYvenAHaDAQ1Wod-4rS4vPoHCZnhWNo_y4PKkuBIg6I-10L6IvhswSBdnyczlq_62Hw1EfCGKptRTsODGLbTcqZFRyxv20eRkEWoYqL5XHLVhWLISYulTZQdToW-VRCu6RFfOWQM3jnridGKE7l7VVvtJUdWe1HdH8FHAtl5chCyyDiJWokwXZpln7LTG_vMTdLyVA7kWxb7qVB4nVipN8w',
    role = 'employer',
}: DashboardLayoutProps) {
    return (
        <BottomNavLayout>
            <div className="bg-surface font-body-md text-on-surface min-h-screen">
                <Head title={title} />
            
            {/* TopAppBar */}
            <header className="bg-surface shadow-sm fixed top-0 w-full md:w-[calc(100%-16rem)] md:left-[16rem] z-50 flex justify-between md:justify-end items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
                <div className="flex items-center gap-stack-md md:hidden">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20">
                        <img className="w-full h-full object-cover" alt={userName} src={userAvatar} />
                    </div>
                    <span className="font-headline-md text-headline-md font-bold text-primary">
                        Goodgigs
                    </span>
                </div>
                <div className="flex items-center gap-4 md:gap-stack-md">
                    <button className="text-primary p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 transition-transform">
                        <Search size={24} />
                    </button>
                    {role === 'employer' && (
                        <div className="hidden md:flex bg-surface-container-low p-1 rounded-full border border-outline-variant">
                            <button className="px-4 py-1.5 rounded-full text-label-md font-label-md bg-primary text-on-primary shadow-sm">Employer</button>
                            <Link href="/worker/dashboard" className="px-4 py-1.5 rounded-full text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">Freelancer</Link>
                        </div>
                    )}
                    {role === 'worker' && (
                        <div className="hidden md:flex bg-surface-container-low p-1 rounded-full border border-outline-variant">
                            <Link href="/employer/dashboard" className="px-4 py-1.5 rounded-full text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">Employer</Link>
                            <button className="px-4 py-1.5 rounded-full text-label-md font-label-md bg-primary text-on-primary shadow-sm">Freelancer</button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 px-container-padding-mobile md:px-container-padding-desktop max-w-[1200px] mx-auto py-stack-lg">
                {children}
            </main>

            </div>
        </BottomNavLayout>
    );
}
