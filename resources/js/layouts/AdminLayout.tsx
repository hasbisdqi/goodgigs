import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { dashboard, kycList, settings } from '@/actions/App/Http/Controllers/AdminController';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    const navigation = [
        { name: 'Dashboard', href: dashboard.url(), icon: LayoutDashboard },
        { name: 'KYC Verification', href: kycList.url(), icon: ShieldCheck },
        { name: 'Settings', href: settings.url(), icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-surface-container-lowest flex">
            {/* Sidebar */}
            <div className="w-64 bg-surface border-r border-outline-variant/30 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-outline-variant/30">
                    <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
                        Goodgigs Admin
                    </Link>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    isActive 
                                        ? 'bg-primary-container text-on-primary-container font-medium' 
                                        : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                                }`}
                            >
                                <Icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-outline-variant/30">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors">
                        <LogOut size={20} />
                        Back to App
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-surface border-b border-outline-variant/30 flex items-center px-8 md:hidden">
                    <span className="font-bold text-primary">Goodgigs Admin</span>
                </header>
                <main className="flex-1 p-8 overflow-y-auto text-on-surface">
                    {children}
                </main>
            </div>
        </div>
    );
}
