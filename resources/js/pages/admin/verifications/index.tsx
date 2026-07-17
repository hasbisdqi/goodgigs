import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Verifications', href: '/admin/verifications' },
];

export default function VerificationsIndex({ verifications }: { verifications: any }) {
    const handleAction = (id: number, status: 'approved' | 'rejected') => {
        if (confirm(`Apakah Anda yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} permintaan ini?`)) {
            router.patch(`/admin/verifications/${id}`, { status }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Manage Verifications" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Verification Requests" description="Kelola pengajuan verifikasi identitas dan keahlian pengguna." />
                
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Detail / Dokumen</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {verifications.data.map((req: any) => (
                                <TableRow key={req.id}>
                                    <TableCell className="text-xs whitespace-nowrap">
                                        {new Date(req.created_at).toLocaleDateString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{req.user.name}</div>
                                        <div className="text-xs text-muted-foreground">{req.user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={req.type === 'identity' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                            {req.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {req.type === 'skill' && <span className="text-xs font-semibold">{req.skill_name}</span>}
                                            <a href={`/storage/${req.document_path}`} target="_blank" rel="noreferrer" className="flex items-center text-xs text-blue-600 hover:underline">
                                                <Eye className="w-3 h-3 mr-1" /> Lihat Dokumen
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'pending' ? 'outline' : (req.status === 'approved' ? 'default' : 'destructive')}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-7 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleAction(req.id, 'approved')}>
                                                    <Check className="w-4 h-4 mr-1" /> Terima
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleAction(req.id, 'rejected')}>
                                                    <X className="w-4 h-4 mr-1" /> Tolak
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {verifications.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        Tidak ada permintaan verifikasi.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

VerificationsIndex.layout = {
    breadcrumbs: breadcrumbs,
}