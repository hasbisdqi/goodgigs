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

export default function DashboardLayout({
    children,
    title = 'Dashboard',
    userName = 'User',
    userAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6y4e4430TxP-HS8Mdh8pnwuIRrh3t7oOgYvenAHaDAQ1Wod-4rS4vPoHCZnhWNo_y4PKkuBIg6I-10L6IvhswSBdnyczlq_62Hw1EfCGKptRTsODGLbTcqZFRyxv20eRkEWoYqL5XHLVhWLISYulTZQdToW-VRCu6RFfOWQM3jnridGKE7l7VVvtJUdWe1HdH8FHAtl5chCyyDiJWokwXZpln7LTG_vMTdLyVA7kWxb7qVB4nVipN8w',
    role = 'employer',
}: DashboardLayoutProps) {
    return (
        <div className="bg-surface font-body-md text-on-surface min-h-screen pb-24">
            <Head title={title} />
            
            {/* TopAppBar */}
            <header className="bg-surface shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-16">
                <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20">
                        <img className="w-full h-full object-cover" alt={userName} src={userAvatar} />
                    </div>
                    <span className="font-headline-md text-headline-md font-bold text-primary">
                        GigConnect
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

            {/* BottomNavBar (Visible on Mobile) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden flex justify-around items-center px-4 py-2">
                <Link className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-200" href={role === 'employer' ? '/employer/dashboard' : '/worker/dashboard'}>
                    <Home size={24} className="fill-current" />
                    <span className="font-label-sm text-label-sm">Home</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="#">
                    <Briefcase size={24} />
                    <span className="font-label-sm text-label-sm">My Gigs</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200 relative" href="#">
                    <MessageSquare size={24} />
                    <span className="font-label-sm text-label-sm">Messages</span>
                    {role === 'worker' && <span className="absolute top-0 right-1 w-2 h-2 bg-error rounded-full"></span>}
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-transform duration-200" href="#">
                    <User size={24} />
                    <span className="font-label-sm text-label-sm">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
