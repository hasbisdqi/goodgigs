import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Briefcase, MessageSquare, User, Search, Map, LayoutDashboard } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface BottomNavLayoutProps {
    children: React.ReactNode;
}

export default function BottomNavLayout({ children }: BottomNavLayoutProps) {
    const { url } = usePage();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const isHome = url === '/dashboard';
    const isGigs = url === '/gigs' || url.startsWith('/gigs') && !url.includes('/create');
    const isMessages = url.startsWith('/messages');
    const isProfile = url.startsWith('/profile');

    const homeUrl = '/dashboard';

    const getMobileLinkClass = (isActive: boolean) => {
        if (isActive) {
            return "flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 active:scale-90 transition-transform duration-200";
        }
        return "flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-low transition-colors active:scale-90 duration-200";
    };

    const getDesktopLinkClass = (isActive: boolean) => {
        if (isActive) {
            return "flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-label-lg transition-colors";
        }
        return "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl font-label-lg transition-colors";
    };

    const NavigationLinks = ({ isDesktopMode = false }: { isDesktopMode?: boolean }) => {
        const linkClassFn = isDesktopMode ? getDesktopLinkClass : getMobileLinkClass;

        return (
            <>
                <Link className={linkClassFn(isHome)} href={homeUrl}>
                    {isDesktopMode ? <LayoutDashboard size={24} /> : <Home size={24} className={`mb-1 ${isHome ? 'fill-current' : ''}`} />}
                    <span className={isDesktopMode ? "font-label-lg" : "font-label-sm text-label-sm"}>Home</span>
                </Link>
                <Link className={linkClassFn(isGigs)} href="/gigs">
                    {isDesktopMode ? <Map size={24} /> : <Search size={24} className={`mb-1 ${isGigs ? 'fill-current text-on-secondary-container' : ''}`} />}
                    <span className={isDesktopMode ? "font-label-lg" : "font-label-sm text-label-sm"}>Explore</span>
                </Link>
                <Link className={linkClassFn(isMessages)} href="/messages">
                    <MessageSquare size={24} className={`mb-1 ${isMessages ? 'fill-current' : ''}`} />
                    <span className={isDesktopMode ? "font-label-lg" : "font-label-sm text-label-sm"}>Messages</span>
                </Link>
                <Link className={linkClassFn(isProfile)} href="/profile">
                    <User size={24} className={`mb-1 ${isProfile ? 'fill-current' : ''}`} />
                    <span className={isDesktopMode ? "font-label-lg" : "font-label-sm text-label-sm"}>Profile</span>
                </Link>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row relative md:pb-0 pb-20">
            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex flex-col w-64 h-screen border-r border-outline-variant bg-surface sticky top-0 shrink-0">
                <div className="p-6 pb-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-on-primary font-bold text-xl">G</span>
                        </div>
                        <span className="text-xl font-bold text-primary tracking-tight">Goodgigs</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavigationLinks isDesktopMode={true} />
                </nav>

                <div className="p-6 border-t border-outline-variant">
                    <form action="/logout" method="POST">
                        <button>
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-[100vw] md:max-w-[calc(100vw-16rem)]">
                {children}
            </div>

            {/* Bottom Navigation Bar (Mobile) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden flex justify-around items-center px-2 pb-safe h-20 border-t border-outline-variant/20">
                <NavigationLinks isDesktopMode={false} />
            </nav>
        </div>
    );
}
