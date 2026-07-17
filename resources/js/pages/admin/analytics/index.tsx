import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Analytics', href: '/admin/analytics' },
];

export default function AnalyticsIndex({ stats }: { stats: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 max-w-6xl mx-auto w-full">
                <Heading title="Analytics Dashboard" description="Ringkasan metrik platform dan performa pengguna." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Users Stat */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengguna</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.users.employers} Pemberi Kerja, {stats.users.workers} Pekerja
                            </p>
                        </CardContent>
                    </Card>

                    {/* Jobs Stat */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pekerjaan</CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.jobs.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.jobs.active} Aktif, {stats.jobs.completed} Selesai
                            </p>
                        </CardContent>
                    </Card>

                    {/* Success Rate Stat */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Rasio Kesuksesan</CardTitle>
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.jobs.total > 0 ? Math.round((stats.jobs.completed / stats.jobs.total) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Dari total pekerjaan yang diposting
                            </p>
                        </CardContent>
                    </Card>

                    {/* Trust Stat */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tindakan Tertunda</CardTitle>
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.trust.pending_verifications + stats.trust.pending_reports}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.trust.pending_verifications} Verifikasi, {stats.trust.pending_reports} Laporan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Statistik Lamaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Lamaran Masuk</span>
                                    <span className="font-bold">{stats.applications.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-emerald-600">Lamaran Diterima</span>
                                    <span className="font-bold text-emerald-600">{stats.applications.accepted}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
