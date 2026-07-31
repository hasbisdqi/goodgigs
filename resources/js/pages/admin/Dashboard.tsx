import { Head } from '@inertiajs/react';
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Users, FileText, Briefcase } from 'lucide-react';

export default function Dashboard({ total_users, pending_kyc, active_gigs }: any) {
    const stats = [
        { label: 'Total Users', value: total_users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Pending KYC', value: pending_kyc, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Active Gigs', value: active_gigs, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard | Goodgigs" />
            
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-on-surface-variant">Welcome back. Here's what's happening on Goodgigs today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-on-surface-variant font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
