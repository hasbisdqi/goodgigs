import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ShieldCheck, ArrowRight, Briefcase, PlusCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as adminUsers } from '@/routes/admin/users';
import { index as jobsIndex } from '@/routes/jobs';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';

import type { User } from '@/types';
import { usePermission } from '@/hooks/use-permission';

type DashboardStats = {
    total_gigs: number;
    my_gigs: number;
    urgent_gigs: number;
};

type PageProps = {
    stats: DashboardStats;
    auth: {
        user: User;
    };
};

export default function Dashboard({ stats }: PageProps) {
    const { auth } = usePage<any>().props;
    const { hasPermission } = usePermission();

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-6 shadow-sm dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 md:p-8">
                    <div className="relative z-10 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="size-5 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider">GoodGigs Workspace</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            Selamat Datang, {auth.user.name}!
                        </h1>
                        <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
                            Temukan bantuan lokal untuk tugas harian Anda, atau tawarkan keahlian jasa informal Anda di sekitar lingkungan hari ini.
                        </p>
                    </div>
                    {/* Subtle decorative background element */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 blur-3xl pointer-events-none w-96 h-96 bg-primary rounded-full" />
                </div>

                {/* Stats Widgets */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Total Active Gigs */}
                    <Card className="hover:shadow-sm transition-all bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Tugas Aktif</CardTitle>
                            <Briefcase className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_gigs}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Pekerjaan tersedia untuk diambil</p>
                        </CardContent>
                    </Card>

                    {/* My Posted Gigs */}
                    <Card className="hover:shadow-sm transition-all bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Tugas Saya</CardTitle>
                            <PlusCircle className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.my_gigs}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Tugas yang Anda posting</p>
                        </CardContent>
                    </Card>

                    {/* Urgent Gigs */}
                    <Card className="hover:shadow-sm transition-all bg-card/60 backdrop-blur-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Tugas Mendesak</CardTitle>
                            <AlertTriangle className="size-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.urgent_gigs}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Membutuhkan penanganan cepat</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Browse Gigs */}
                    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Briefcase className="size-6" />
                                </div>
                                <div>
                                    <CardTitle>Cari Tugas & Gigs</CardTitle>
                                    <CardDescription className="mt-1">Temukan pekerjaan informal</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Telusuri daftar lengkap tugas seperti jahit celana robek, pipa bocor, potong rumput, dan tawarkan keahlian Anda.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href={jobsIndex.url()} prefetch className="flex items-center justify-center gap-2">
                                    Cari Lowongan Jasa
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Post a Gig */}
                    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <PlusCircle className="size-6" />
                                </div>
                                <div>
                                    <CardTitle>Posting Tugas Baru</CardTitle>
                                    <CardDescription className="mt-1">Cari bantuan penyedia jasa</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Butuh perbaikan cepat di rumah atau kantor? Posting detail pekerjaan informal Anda sekarang dalam beberapa detik.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href={jobsIndex.url()} prefetch className="flex items-center justify-center gap-2">
                                    Posting Tugas Baru
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Account Settings */}
                    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <Settings className="size-6" />
                                </div>
                                <div>
                                    <CardTitle>Pengaturan Akun</CardTitle>
                                    <CardDescription className="mt-1">Atur profil dan keahlian Anda</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Perbarui informasi personal Anda, kelola passkey, dan konfigurasikan keamanan otentikasi akun Anda.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href={profileEdit()} prefetch className="flex items-center justify-center gap-2">
                                    Edit Profil
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Admin: User Management */}
                    {hasPermission('manage users') && (
                        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                        <Users className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle>Manajemen User & Peran</CardTitle>
                                        <CardDescription className="mt-1">Konfigurasi hak akses database</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Kelola akun anggota terdaftar, tugaskan peran Spatie, dan sesuaikan permission matrix dalam sistem GoodGigs.
                                </p>
                                <Button asChild className="w-full mt-4" variant="outline">
                                    <Link href={adminUsers.url()} prefetch className="flex items-center justify-center gap-2">
                                        Administrasi Pengguna
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
