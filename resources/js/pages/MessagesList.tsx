import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, MessageSquarePlus, Home, Briefcase, MessageSquare, User } from 'lucide-react';

interface Conversation {
    id: number;
    name: string;
    time: string;
    last_message: string;
    unread_count: number;
    online: boolean;
    avatar: string;
}

interface MessagesListProps {
    filters: string[];
    conversations: Conversation[];
}

export default function MessagesList({ filters, conversations }: MessagesListProps) {
    const [activeFilter, setActiveFilter] = useState(filters[0]);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
            <Head title="GigConnect | Messages" />

            {/* TopAppBar */}
            <header className={`bg-surface flex items-center justify-between px-gutter w-full h-16 fixed top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
                <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30 active:scale-95 transition-transform cursor-pointer">
                        <img 
                            className="w-full h-full object-cover" 
                            alt="User Profile" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9El1NId7dWGlwjsRzoUtFQJTDZ4kUBrOL9-K5kavHUvEbARhk3B2DOSlU8IUb_0hloA_pnrTRExswX_kTWz3sQaHLeQd9xaZVs2VNA0B7s55VqRW5vMSdw1ap57ws3ee3XyQfMoc9UgpMUvowjZv0GnkPGTEVTF1HMEcwcSV9q668X1CSlzMlFUAZl-eVghFsnbySwSCmpGqHHhTJMonDYwgs-P2uq7WIfZQAYShtwIaYDJMRVCFFRQ" 
                        />
                    </div>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Messages</h1>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-primary">
                    <Search size={24} />
                </button>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 mt-16 mb-20">
                {/* Search & Filter Bar */}
                <div className="px-gutter py-4 bg-surface/80 backdrop-blur-md sticky top-16 z-40 flex gap-stack-sm overflow-x-auto no-scrollbar">
                    {filters.map(filter => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
                                activeFilter === filter
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Conversations List */}
                <section className="flex flex-col">
                    {conversations.map(chat => (
                        <div key={chat.id} className="px-gutter py-4 flex items-center gap-stack-md hover:bg-surface-container-low transition-colors cursor-pointer group active:bg-surface-container-high">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm group-active:scale-95 transition-transform">
                                    <img className="w-full h-full object-cover" alt={chat.name} src={chat.avatar} />
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary border-2 border-surface rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 border-b border-outline-variant/10 pb-4 group-last:border-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-label-md text-label-md text-on-surface truncate">{chat.name}</h3>
                                    <span className={`font-label-sm text-label-sm ${chat.unread_count > 0 ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                                        {chat.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`font-body-md truncate pr-4 ${chat.unread_count > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                                        {chat.last_message}
                                    </p>
                                    {chat.unread_count > 0 && (
                                        <div className="shrink-0 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                                            {chat.unread_count}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            {/* BottomNavBar */}
            <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe bg-surface shadow-lg border-t border-outline-variant/20 md:hidden">
                <Link className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-low transition-colors active:scale-90" href="/worker/gigs/map">
                    <Search className="mb-1" size={24} />
                    <span className="font-label-sm text-label-sm">Explore</span>
                </Link>
                <Link className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 active:scale-90 transition-transform" href="/messages">
                    <MessageSquare className="mb-1 fill-current" size={24} />
                    <span className="font-label-sm text-label-sm">Messages</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-low transition-colors active:scale-90" href="/worker/dashboard">
                    <Briefcase className="mb-1" size={24} />
                    <span className="font-label-sm text-label-sm">My Gigs</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-low transition-colors active:scale-90" href="#">
                    <User className="mb-1" size={24} />
                    <span className="font-label-sm text-label-sm">Profile</span>
                </Link>
            </nav>

            {/* FAB Contextual (New Message) */}
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-[0px_8px_24px_rgba(79,70,229,0.2)] flex items-center justify-center active:scale-95 transition-transform z-40">
                <MessageSquarePlus size={28} />
            </button>
        </div>
    );
}
