import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, ShieldAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Reports', href: '/admin/reports' },
];

export default function ReportsIndex({ reports }: { reports: any }) {
    const handleAction = (id: number, status: 'resolved' | 'dismissed') => {
        if (confirm(`Apakah Anda yakin ingin menandai laporan ini sebagai ${status}?`)) {
            router.patch(`/admin/reports/${id}`, { status }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Laporan & Keamanan" description="Tinjau laporan pekerjaan atau akun dari komunitas." />
                
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pelapor</TableHead>
                                <TableHead>Objek Laporan</TableHead>
                                <TableHead>Alasan / Deskripsi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.data.map((rep: any) => (
                                <TableRow key={rep.id}>
                                    <TableCell className="text-xs whitespace-nowrap">
                                        {new Date(rep.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{rep.reporter.name}</div>
                                        <div className="text-xs text-muted-foreground">{rep.reporter.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="uppercase text-[10px]">
                                            {rep.reportable_type.split('\\').pop()} #{rep.reportable_id}
                                        </Badge>
                                        <div className="mt-1">
                                            {/* We can add a link to the object here depending on type */}
                                            {rep.reportable_type.includes('JobPosting') ? (
                                                <a href={`/jobs`} className="text-xs text-blue-600 hover:underline">Lihat Tugas</a>
                                            ) : (
                                                <a href={`/user/${rep.reportable_id}`} className="text-xs text-blue-600 hover:underline">Lihat Profil</a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 max-w-[300px]">
                                            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                                                <ShieldAlert className="w-3 h-3" /> {rep.reason}
                                            </span>
                                            {rep.description && (
                                                <span className="text-xs text-muted-foreground line-clamp-2">{rep.description}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={rep.status === 'pending' ? 'outline' : (rep.status === 'resolved' ? 'default' : 'secondary')}>
                                            {rep.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {rep.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-7 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => handleAction(rep.id, 'resolved')}>
                                                    <Check className="w-4 h-4 mr-1" /> Tindak Lanjuti (Resolve)
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-muted-foreground hover:bg-muted" onClick={() => handleAction(rep.id, 'dismissed')}>
                                                    <X className="w-4 h-4 mr-1" /> Abaikan (Dismiss)
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reports.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Tidak ada laporan saat ini.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
