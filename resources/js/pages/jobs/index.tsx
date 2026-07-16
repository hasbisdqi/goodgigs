import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, ShieldAlert, Briefcase, MapPin, DollarSign, Calendar, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { dashboard } from '@/routes';
import { index as jobsIndex } from '@/routes/jobs';
import type { User } from '@/types';

type Job = {
    id: number;
    user_id: number;
    title: string;
    company: string;
    description: string;
    location: string;
    salary: string | null;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

type JobsPagination = {
    data: Job[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    total: number;
};

type PageProps = {
    jobs: JobsPagination;
    filters: {
        search: string | null;
    };
    auth: {
        user: User;
    };
};

export default function JobsIndex({ jobs, filters, auth }: PageProps) {
    const isMobile = useIsMobile();
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const createForm = useForm({
        title: '',
        company: '',
        location: '',
        type: 'One-time Task',
        salary: '',
        description: '',
    });

    const editForm = useForm({
        title: '',
        company: '',
        location: '',
        type: 'One-time Task',
        salary: '',
        description: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(jobsIndex.url(), { search: searchVal }, { preserveState: true, replace: true });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(jobsIndex.url(), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEditModal = (job: Job, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedJob(job);
        editForm.setData({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: job.salary || '',
            description: job.description,
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) {
            return;
        }
        editForm.patch(jobsIndex.url() + '/' + selectedJob.id, {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
            },
        });
    };

    const openDeleteModal = (job: Job, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedJob(job);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) {
            return;
        }
        router.delete(jobsIndex.url() + '/' + selectedJob.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
            },
        });
    };

    const openDetailsModal = (job: Job) => {
        setSelectedJob(job);
        setIsDetailsOpen(true);
    };

    const canModifyJob = (job: Job) => {
        const { auth } = usePage<any>().props;
        const roles = auth?.roles || [];
        return job.user_id === auth?.user?.id || roles.includes('Super Admin') || roles.includes('Admin');
    };

    return (
        <>
            <Head title="Gigs & Tasks" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Active Gigs & Tasks</h1>
                    <p className="text-sm text-muted-foreground">Find local freelance gigs, or post a task to get quick help.</p>
                </div>

                {/* Actions & Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                        <Input
                            placeholder="Cari tugas, pemberi kerja, lokasi..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-9 pr-4"
                        />
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </form>

                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="size-4 mr-2" />
                        Post a Gig / Task
                    </Button>
                </div>

                {/* Jobs Grid */}
                {jobs.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card">
                        <Briefcase className="size-12 text-muted-foreground/50 mb-3" />
                        <h3 className="text-lg font-semibold">Belum ada tugas aktif</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">Silakan buat tugas baru untuk mencari penyedia jasa.</p>
                        <Button onClick={() => setIsCreateOpen(true)}>Buat Tugas Pertama</Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {jobs.data.map((job) => (
                            <Card
                                key={job.id}
                                className="flex flex-col justify-between hover:shadow-md hover:border-primary/35 transition-all cursor-pointer bg-card"
                                onClick={() => openDetailsModal(job)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{job.company}</span>
                                            <CardTitle className="text-lg font-bold mt-1 line-clamp-1">{job.title}</CardTitle>
                                        </div>

                                        {canModifyJob(job) && (
                                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                    onClick={(e) => openEditModal(job, e)}
                                                    title="Edit Post"
                                                >
                                                    <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8"
                                                    onClick={(e) => openDeleteModal(job, e)}
                                                    title="Delete Post"
                                                >
                                                    <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription className="flex flex-wrap gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                        <Badge 
                                            variant="secondary" 
                                            className={cn(
                                                "text-[10px] py-0.5 px-2 border-transparent",
                                                job.type === 'Urgent' 
                                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                                                    : 'bg-primary/10 text-primary'
                                            )}
                                        >
                                            {job.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] py-0.5 px-2 flex items-center gap-1">
                                            <MapPin className="size-3" />
                                            {job.location}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {job.description}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-border pt-3 mt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1 font-medium text-foreground">
                                            <DollarSign className="size-3.5 text-emerald-500" />
                                            <span>{job.salary || 'Negotiable'}</span>
                                        </div>
                                        <span>Dibuat {new Date(job.created_at).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {jobs.links && jobs.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {jobs.links.map((link, i) => {
                            let label = link.label;
                            if (label.includes('Previous')) {
                                label = 'Previous';
                            }
                            if (label.includes('Next')) {
                                label = 'Next';
                            }

                            return link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={cn(
                                        "px-3 py-1.5 text-sm rounded-md border transition-all",
                                        link.active
                                            ? "bg-primary text-primary-foreground border-transparent"
                                            : "bg-background border-input text-foreground hover:bg-accent"
                                    )}
                                    preserveState
                                >
                                    <span dangerouslySetInnerHTML={{ __html: label }} />
                                </Link>
                            ) : (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 text-sm rounded-md border border-input/40 text-muted-foreground/60 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Job Dialog / Drawer */}
            {isMobile ? (
                <Drawer open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Post a Gig / Task</DrawerTitle>
                            <DrawerDescription>Masukkan detail pekerjaan informal atau tugas harian yang Anda butuhkan.</DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4 pb-6">
                            <GigForm
                                form={createForm}
                                onSubmit={handleCreateSubmit}
                                onCancel={() => setIsCreateOpen(false)}
                                submitLabel="Posting Tugas"
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Post a Gig / Task</DialogTitle>
                            <DialogDescription>Masukkan detail pekerjaan informal atau tugas harian yang Anda butuhkan.</DialogDescription>
                        </DialogHeader>
                        <GigForm
                            form={createForm}
                            onSubmit={handleCreateSubmit}
                            onCancel={() => setIsCreateOpen(false)}
                            submitLabel="Posting Tugas"
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Job Dialog / Drawer */}
            {isMobile ? (
                <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Edit Detail Tugas</DrawerTitle>
                            <DrawerDescription>Ubah detail dari tugas atau pekerjaan informal Anda.</DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4 pb-6">
                            <GigForm
                                form={editForm}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setIsEditOpen(false)}
                                submitLabel="Simpan Perubahan"
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Detail Tugas</DialogTitle>
                            <DialogDescription>Ubah detail dari tugas atau pekerjaan informal Anda.</DialogDescription>
                        </DialogHeader>
                        <GigForm
                            form={editForm}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setIsEditOpen(false)}
                            submitLabel="Simpan Perubahan"
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Details Dialog / Drawer */}
            {isMobile ? (
                <Drawer open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DrawerContent className="max-h-[85vh]">
                        <DrawerHeader className="text-left">
                            <div>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedJob?.company}</span>
                                <DrawerTitle className="text-xl font-bold mt-1">{selectedJob?.title}</DrawerTitle>
                            </div>
                        </DrawerHeader>
                        <div className="px-4 pb-6 overflow-y-auto">
                            <GigDetails job={selectedJob} />
                            <DrawerFooter className="px-0 pt-4">
                                <Button type="button" onClick={() => setIsDetailsOpen(false)} className="w-full">
                                    Tutup Detail
                                </Button>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <div>
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">{selectedJob?.company}</span>
                                <DialogTitle className="text-2xl font-bold mt-1">{selectedJob?.title}</DialogTitle>
                            </div>
                        </DialogHeader>
                        <GigDetails job={selectedJob} />
                        <DialogFooter className="pt-2">
                            <Button type="button" onClick={() => setIsDetailsOpen(false)}>
                                Tutup Detail
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Job Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-1">
                            <ShieldAlert className="size-6" />
                            <DialogTitle>Hapus Tugas</DialogTitle>
                        </div>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus postingan tugas untuk <span className="font-semibold text-foreground">{selectedJob?.title}</span>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleDeleteSubmit}>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" variant="destructive">
                                Hapus Postingan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function GigForm({ form, onSubmit, onCancel, submitLabel }: {
    form: any;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel: string;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Nama Pekerjaan / Tugas</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Jahit Celana Robek, Perbaiki Pipa Bocor"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        required
                    />
                    <InputError message={form.errors.title} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="company">Nama Pemesan / Penyelenggara</Label>
                    <Input
                        id="company"
                        placeholder="e.g. Pribadi (Ibu Rina), Warung Sejahtera"
                        value={form.data.company}
                        onChange={(e) => form.setData('company', e.target.value)}
                        required
                    />
                    <InputError message={form.errors.company} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="location">Lokasi / Alamat</Label>
                    <Input
                        id="location"
                        placeholder="e.g. Jakarta Selatan, Remote"
                        value={form.data.location}
                        onChange={(e) => form.setData('location', e.target.value)}
                        required
                    />
                    <InputError message={form.errors.location} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="type">Jenis Tugas</Label>
                    <select
                        id="type"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                        value={form.data.type}
                        onChange={(e) => form.setData('type', e.target.value)}
                        required
                    >
                        <option value="One-time Task">One-time Task (Tugas Sekali Selesai)</option>
                        <option value="Hourly Freelance">Hourly Freelance (Jasa Per Jam)</option>
                        <option value="Urgent">Urgent (Mendesak / Cepat)</option>
                        <option value="Short-term">Short-term (Jangka Pendek)</option>
                    </select>
                    <InputError message={form.errors.type} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="salary">Imbalan / Upah (Optional)</Label>
                <Input
                    id="salary"
                    placeholder="e.g. Rp 150.000 / Rp 50.000 per jam"
                    value={form.data.salary}
                    onChange={(e) => form.setData('salary', e.target.value)}
                />
                <InputError message={form.errors.salary} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi Tugas / Detail Pekerjaan</Label>
                <textarea
                    id="description"
                    placeholder="Jelaskan apa saja yang perlu dikerjakan, alat yang disediakan/perlu dibawa, dan kebutuhan lainnya..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    required
                />
                <InputError message={form.errors.description} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Batal
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}

function GigDetails({ job }: { job: Job | null }) {
    if (!job) {
        return null;
    }
    return (
        <div className="space-y-6">
            <div className="grid gap-4 py-4 text-sm border-t border-b border-border">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-4 text-foreground/75" />
                        <div>
                            <p className="text-xs">Location</p>
                            <p className="font-medium text-foreground">{job.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="size-4 text-foreground/75" />
                        <div>
                            <p className="text-xs">Task Type</p>
                            <p className="font-medium text-foreground">{job.type}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="size-4 text-foreground/75" />
                        <div>
                            <p className="text-xs">Upah / Imbalan</p>
                            <p className="font-medium text-foreground">{job.salary || 'Negotiable'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4 text-foreground/75" />
                        <div>
                            <p className="text-xs">Tanggal Posting</p>
                            <p className="font-medium text-foreground">
                                {new Date(job.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {job.user && (
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/40 p-3 rounded-lg mt-1">
                        <UserIcon className="size-4 text-foreground/75" />
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold">Diposting Oleh</p>
                            <p className="font-medium text-foreground">{job.user.name} ({job.user.email})</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="py-2">
                <h4 className="font-bold text-base mb-2">Deskripsi & Detail Tugas</h4>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                    {job.description}
                </p>
            </div>
        </div>
    );
}

JobsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Jobs',
            href: jobsIndex.url(),
        },
    ],
};
