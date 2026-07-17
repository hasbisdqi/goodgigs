import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';

export default function ReportModal({ 
    reportableId, 
    reportableType, 
    triggerButton 
}: { 
    reportableId: number; 
    reportableType: string; 
    triggerButton?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('spam');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/reports', {
            reportable_id: reportableId,
            reportable_type: reportableType,
            reason: reason,
            description: description,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                setDescription('');
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Laporkan
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-600">
                        <ShieldAlert className="w-5 h-5" />
                        Laporkan Konten
                    </DialogTitle>
                    <DialogDescription>
                        Bantu kami menjaga komunitas tetap aman. Mengapa Anda melaporkan ini?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Alasan Laporan</Label>
                        <select 
                            id="reason"
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="spam">Spam / Penipuan</option>
                            <option value="fake">Profil/Konten Palsu</option>
                            <option value="harassment">Pelecehan / Kata Kasar</option>
                            <option value="inappropriate">Konten Tidak Pantas</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Detail Tambahan (Opsional)</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Berikan detail lebih lanjut..."
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="destructive" disabled={submitting}>
                            {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
