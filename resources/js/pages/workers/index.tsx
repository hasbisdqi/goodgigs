import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, Star, Briefcase } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { profile } from '@/routes';
import { BreadcrumbItem } from '@/types';

type Worker = {
    id: number;
    name: string;
    bio?: string;
    address?: string;
    skills?: string[] | string;
    reviews_received_count: number;
    reviews_received_avg_rating?: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '#' },
    { title: 'Cari Pekerja', href: '/workers' },
];

export default function WorkersIndex({ workers, filters }: { workers: any; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/workers',
            { search },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Cari Pekerja" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Direktori Pekerja</h1>
                    <p className="text-muted-foreground">
                        Temukan talenta lokal untuk membantu berbagai pekerjaan harian Anda.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-3 relative">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input 
                            placeholder="Cari berdasarkan nama, keahlian, atau bio..." 
                            className="pl-9 bg-card"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Cari</Button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {workers.data.length > 0 ? (
                        workers.data.map((worker: Worker) => {
                            let parsedSkills: string[] = [];
                            try {
                                if (typeof worker.skills === 'string') {
                                    parsedSkills = JSON.parse(worker.skills);
                                } else if (Array.isArray(worker.skills)) {
                                    parsedSkills = worker.skills;
                                }
                            } catch (e) {
                                if (typeof worker.skills === 'string') {
                                    parsedSkills = [worker.skills];
                                }
                            }

                            return (
                                <Card key={worker.id} className="flex flex-col overflow-hidden hover:shadow-md transition-all group">
                                    <CardHeader className="pb-4 relative">
                                        <div className="flex justify-between items-start">
                                            <Avatar className="size-16 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xl">
                                                    {worker.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                    <Star className="size-3 fill-amber-500" />
                                                    {worker.reviews_received_avg_rating 
                                                        ? Number(worker.reviews_received_avg_rating).toFixed(1) 
                                                        : 'Baru'}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {worker.reviews_received_count} ulasan
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <CardTitle className="line-clamp-1">{worker.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1.5 mt-1.5 line-clamp-1">
                                                <MapPin className="size-3 shrink-0" />
                                                {worker.address || 'Lokasi tidak diatur'}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                                            {worker.bio || 'Pekerja ini belum menuliskan deskripsi profilnya.'}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {parsedSkills && parsedSkills.length > 0 ? (
                                                parsedSkills.slice(0, 3).map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="font-normal text-[10px]">
                                                        {skill}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Belum ada keahlian ditambahkan</span>
                                            )}
                                            {parsedSkills && parsedSkills.length > 3 && (
                                                <Badge variant="outline" className="font-normal text-[10px]">
                                                    +{parsedSkills.length - 3} lainnya
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 pb-5">
                                        <Button asChild variant="default" className="w-full" size="sm">
                                            <Link href={`/user/${worker.id}`}>
                                                Lihat Profil
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center border rounded-xl border-dashed bg-muted/20">
                            <Briefcase className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                            <h3 className="font-semibold text-lg">Tidak ada pekerja ditemukan</h3>
                            <p className="text-muted-foreground text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
                        </div>
                    )}
                </div>

                {/* Simple Pagination */}
                {workers.links && workers.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-6">
                        {workers.links.map((link: any, idx: number) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    link.active 
                                        ? 'bg-primary text-primary-foreground font-medium' 
                                        : link.url 
                                            ? 'hover:bg-muted text-foreground' 
                                            : 'text-muted-foreground cursor-not-allowed opacity-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

WorkersIndex.layout = {
    breadcrumbs: breadcrumbs,
};