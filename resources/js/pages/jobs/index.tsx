import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, ShieldAlert, Briefcase, MapPin, DollarSign, Calendar, User as UserIcon, Send, CheckCircle, XCircle, MessageCircle, ArrowLeft, Star } from 'lucide-react';
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
import { store as storeApp } from '@/routes/job-applications';
import { index as chatMessagesIndex, store as chatMessagesStore } from '@/routes/chat-messages';
import { notice as verificationNotice } from '@/routes/verification';
import type { Auth } from '@/types';

type JobApplication = {
    id: number;
    job_posting_id: number;
    user_id: number;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
};

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
    job_applications?: JobApplication[];
    jobApplications?: JobApplication[];
};

type ChatMessage = {
    id: number;
    job_posting_id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    read_at: string | null;
    created_at: string;
    sender?: { id: number; name: string };
    receiver?: { id: number; name: string };
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
    auth: Auth;
};

export default function JobsIndex({ jobs, filters, auth }: PageProps) {
    const isMobile = useIsMobile();
    const isEmailVerified = !!auth.user.email_verified_at;
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [activeTab, setActiveTab] = useState<'detail' | 'chat'>('detail');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatReceiverId, setChatReceiverId] = useState<number | null>(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);

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

    const applyForm = useForm({
        job_posting_id: 0,
        message: '',
    });

    const chatForm = useForm({
        receiver_id: 0,
        message: '',
    });

    const reviewForm = useForm({
        job_posting_id: 0,
        reviewee_id: 0,
        rating: 5,
        comment: '',
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
        setIsApplying(false);
        setActiveTab('detail');
        setChatMessages([]);
        applyForm.setData({
            job_posting_id: job.id,
            message: '',
        });
        applyForm.clearErrors();
        
        setIsReviewing(false);
        reviewForm.reset();
        reviewForm.clearErrors();
        
        setIsDetailsOpen(true);

        // Determine chat receiver: if owner, no receiver yet; if worker, receiver is the job owner
        const apps = job.job_applications || job.jobApplications || [];
        const myApp = apps.find(app => app.user_id === auth?.user?.id);
        const isOwner = job.user_id === auth?.user?.id;

        if (!isOwner && myApp) {
            setChatReceiverId(job.user_id);
        } else {
            setChatReceiverId(null);
        }
    };

    const loadChatMessages = async (job: Job, receiverId: number) => {
        setIsChatLoading(true);
        try {
            const response = await fetch(chatMessagesIndex.url(job.id));
            if (response.ok) {
                const data = await response.json();
                setChatMessages(data);
            }
        } catch {
            // silently fail
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleOpenChat = (job: Job, receiverId: number) => {
        setChatReceiverId(receiverId);
        chatForm.setData({ receiver_id: receiverId, message: '' });
        setActiveTab('chat');
        loadChatMessages(job, receiverId);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const openJobId = params.get('open_job_id');
        const openTab = params.get('open_tab');
        if (openJobId) {
            const jobIdNum = parseInt(openJobId);
            const job = jobs.data.find(j => j.id === jobIdNum);
            if (job) {
                openDetailsModal(job);
                if (openTab === 'chat') {
                    const receiverId = params.get('chat_receiver_id');
                    if (receiverId) {
                        handleOpenChat(job, parseInt(receiverId));
                    } else {
                        const apps = job.job_applications || job.jobApplications || [];
                        const myApp = apps.find(app => app.user_id === auth?.user?.id);
                        if (job.user_id !== auth?.user?.id && myApp) {
                            handleOpenChat(job, job.user_id);
                        }
                    }
                }
            } else {
                fetch(`/api/jobs/${openJobId}`)
                    .then(r => r.json())
                    .then(jobData => {
                        if (jobData && jobData.id) {
                            openDetailsModal(jobData);
                            if (openTab === 'chat') {
                                const receiverId = params.get('chat_receiver_id');
                                if (receiverId) {
                                    handleOpenChat(jobData, parseInt(receiverId));
                                } else {
                                    const apps = jobData.job_applications || jobData.jobApplications || [];
                                    const myApp = apps.find((app: JobApplication) => app.user_id === auth?.user?.id);
                                    if (jobData.user_id !== auth?.user?.id && myApp) {
                                        handleOpenChat(jobData, jobData.user_id);
                                    }
                                }
                            }
                        }
                    })
                    .catch(() => {});
            }

            const newParams = new URLSearchParams(window.location.search);
            newParams.delete('open_job_id');
            newParams.delete('open_tab');
            newParams.delete('chat_receiver_id');
            const cleanSearch = newParams.toString();
            const newUrl = window.location.pathname + (cleanSearch ? '?' + cleanSearch : '');
            window.history.replaceState({}, '', newUrl);
        }
    }, [jobs.data]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob || !chatReceiverId) {
            return;
        }
        chatForm.setData('receiver_id', chatReceiverId);
        chatForm.post(chatMessagesStore.url(selectedJob.id), {
            onSuccess: () => {
                chatForm.setData('message', '');
                loadChatMessages(selectedJob, chatReceiverId);
            },
        });
    };

    const handleApplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyForm.post(storeApp.url(), {
            onSuccess: () => {
                applyForm.reset();
                setIsApplying(false);
                const updatedJob = jobs.data.find(j => j.id === selectedJob?.id);
                if (updatedJob) {
                    setSelectedJob(updatedJob);
                }
                setIsDetailsOpen(false);
            },
        });
    };

    const handleUpdateApplicationStatus = (appId: number, status: 'accepted' | 'rejected') => {
        router.patch(`/job-applications/${appId}`, { status }, {
            onSuccess: () => {
                const updatedJob = jobs.data.find(j => j.id === selectedJob?.id);
                if (updatedJob) {
                    setSelectedJob(updatedJob);
                }
            },
        });
    };

    const handleCompleteJob = (jobId: number) => {
        router.patch(`/jobs/${jobId}/complete`, {}, {
            onSuccess: () => {
                const updatedJob = jobs.data.find(j => j.id === jobId);
                if (updatedJob) {
                    setSelectedJob({ ...updatedJob, status: 'completed' }); // Optimistic update since inertia flash might not refresh data immediately
                    router.reload({ only: ['jobs'] });
                }
            }
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post('/reviews', {
            onSuccess: () => {
                setIsReviewing(false);
                reviewForm.reset();
                router.reload({ only: ['jobs'] });
            }
        });
    };

    const canModifyJob = (job: Job) => {
        const roles = auth?.roles || [];
        return job.user_id === auth?.user?.id || roles.includes('Super Admin') || roles.includes('Admin');
    };

    const getApplicationForJob = (job: Job) => {
        const apps = job.job_applications || job.jobApplications || [];
        return apps.find(app => app.user_id === auth?.user?.id);
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

                {!isEmailVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="font-semibold">Email Anda belum terverifikasi!</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">Anda dapat melihat daftar tugas, tetapi harus memverifikasi email untuk membuat postingan tugas baru atau melamar tugas.</p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto border-amber-500/20 hover:bg-amber-500/20">
                            <Link href={verificationNotice.url()}>Verifikasi Sekarang</Link>
                        </Button>
                    </div>
                )}

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

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        disabled={!isEmailVerified}
                        title={!isEmailVerified ? "Verifikasi email Anda untuk memposting tugas" : ""}
                        className="w-full sm:w-auto"
                    >
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
                        {jobs.data.map((job) => {
                            const myApp = getApplicationForJob(job);
                            return (
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
                                            {job.status === 'completed' && (
                                                <Badge variant="secondary" className="text-[10px] py-0.5 px-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent">
                                                    Selesai
                                                </Badge>
                                            )}
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
                                            {myApp && (
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-[10px] py-0.5 px-2 border-transparent ml-auto",
                                                        myApp.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                        myApp.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                    )}
                                                >
                                                    Dilamar ({myApp.status})
                                                </Badge>
                                            )}
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
                            );
                        })}
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
                    <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader className="text-left">
                            <div>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedJob?.company}</span>
                                <DrawerTitle className="text-xl font-bold mt-1">{selectedJob?.title}</DrawerTitle>
                            </div>
                        </DrawerHeader>
                        <div className="px-4 pb-6 overflow-y-auto">
                            <GigDetails
                                job={selectedJob}
                                currentUserId={auth?.user?.id}
                                isApplying={isApplying}
                                setIsApplying={setIsApplying}
                                applyForm={applyForm}
                                handleApplySubmit={handleApplySubmit}
                                handleUpdateStatus={handleUpdateApplicationStatus}
                                isEmailVerified={isEmailVerified}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                chatMessages={chatMessages}
                                chatForm={chatForm}
                                isChatLoading={isChatLoading}
                                chatReceiverId={chatReceiverId}
                                onOpenChat={handleOpenChat}
                                onSendMessage={handleSendMessage}
                                onCompleteJob={handleCompleteJob}
                                isReviewing={isReviewing}
                                setIsReviewing={setIsReviewing}
                                reviewForm={reviewForm}
                                handleReviewSubmit={handleReviewSubmit}
                            />
                            {!isApplying && activeTab === 'detail' && (
                                <DrawerFooter className="px-0 pt-4">
                                    <Button type="button" onClick={() => setIsDetailsOpen(false)} className="w-full">
                                        Tutup Detail
                                    </Button>
                                </DrawerFooter>
                            )}
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
                        <GigDetails
                            job={selectedJob}
                            currentUserId={auth?.user?.id}
                            isApplying={isApplying}
                            setIsApplying={setIsApplying}
                            applyForm={applyForm}
                            handleApplySubmit={handleApplySubmit}
                            handleUpdateStatus={handleUpdateApplicationStatus}
                            isEmailVerified={isEmailVerified}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            chatMessages={chatMessages}
                            chatForm={chatForm}
                            isChatLoading={isChatLoading}
                            chatReceiverId={chatReceiverId}
                            onOpenChat={handleOpenChat}
                            onSendMessage={handleSendMessage}
                            onCompleteJob={handleCompleteJob}
                            isReviewing={isReviewing}
                            setIsReviewing={setIsReviewing}
                            reviewForm={reviewForm}
                            handleReviewSubmit={handleReviewSubmit}
                        />
                        {!isApplying && activeTab === 'detail' && (
                            <DialogFooter className="pt-2">
                                <Button type="button" onClick={() => setIsDetailsOpen(false)}>
                                    Tutup Detail
                                </Button>
                            </DialogFooter>
                        )}
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

function ChatBox({
    job,
    currentUserId,
    chatMessages,
    chatForm,
    isChatLoading,
    chatReceiverId,
    onSendMessage,
    onBack,
}: {
    job: Job;
    currentUserId: number;
    chatMessages: ChatMessage[];
    chatForm: any;
    isChatLoading: boolean;
    chatReceiverId: number;
    onSendMessage: (e: React.FormEvent) => void;
    onBack: () => void;
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const otherParty = chatMessages.find(m => m.sender_id !== currentUserId)?.sender
        ?? chatMessages.find(m => m.receiver_id !== currentUserId)?.receiver;

    return (
        <div className="flex flex-col h-full min-h-[380px]">
            {/* Chat header */}
            <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onBack}>
                    <ArrowLeft className="size-4" />
                </Button>
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {otherParty?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{otherParty?.name ?? 'Pesan'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{job.title}</p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-64">
                {isChatLoading ? (
                    <div className="flex flex-col gap-2 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                                <div className="h-8 w-48 bg-muted rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 text-muted-foreground">
                        <MessageCircle className="size-8 mb-2 opacity-40" />
                        <p className="text-sm">Belum ada pesan. Mulai percakapan!</p>
                    </div>
                ) : (
                    chatMessages.map((msg) => {
                        const isMine = msg.sender_id === currentUserId;
                        return (
                            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                    isMine
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-muted text-foreground rounded-bl-sm"
                                )}>
                                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                    <p className={cn(
                                        "text-[10px] mt-1",
                                        isMine ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                                    )}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMine && msg.read_at && ' · Dibaca'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={onSendMessage} className="flex items-end gap-2 mt-3 pt-3 border-t border-border">
                <textarea
                    placeholder="Tulis pesan..."
                    className="flex-1 min-h-[40px] max-h-24 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
                    value={chatForm.data.message}
                    onChange={(e) => chatForm.setData('message', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSendMessage(e as any);
                        }
                    }}
                    rows={1}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="size-10 rounded-xl shrink-0"
                    disabled={chatForm.processing || !chatForm.data.message.trim()}
                >
                    <Send className="size-4" />
                </Button>
            </form>
            <InputError message={chatForm.errors.message} />
        </div>
    );
}

function GigDetails({
    job,
    currentUserId,
    isApplying,
    setIsApplying,
    applyForm,
    handleApplySubmit,
    handleUpdateStatus,
    isEmailVerified,
    activeTab,
    setActiveTab,
    chatMessages,
    chatForm,
    isChatLoading,
    chatReceiverId,
    onOpenChat,
    onSendMessage,
}: {
    job: Job | null;
    currentUserId?: number;
    isApplying: boolean;
    setIsApplying: (val: boolean) => void;
    applyForm: any;
    handleApplySubmit: (e: React.FormEvent) => void;
    handleUpdateStatus: (appId: number, status: 'accepted' | 'rejected') => void;
    isEmailVerified: boolean;
    activeTab: 'detail' | 'chat';
    setActiveTab: (tab: 'detail' | 'chat') => void;
    chatMessages: ChatMessage[];
    chatForm: any;
    isChatLoading: boolean;
    chatReceiverId: number | null;
    onOpenChat: (job: Job, receiverId: number) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onCompleteJob: (jobId: number) => void;
    isReviewing: boolean;
    setIsReviewing: (val: boolean) => void;
    reviewForm: any;
    handleReviewSubmit: (e: React.FormEvent) => void;
}) {
    if (!job || currentUserId === undefined) {
        return null;
    }

    const apps = job.job_applications || job.jobApplications || [];
    const myApp = apps.find(app => app.user_id === currentUserId);
    const isOwner = job.user_id === currentUserId;

    // In chat tab
    if (activeTab === 'chat' && chatReceiverId !== null) {
        return (
            <ChatBox
                job={job}
                currentUserId={currentUserId}
                chatMessages={chatMessages}
                chatForm={chatForm}
                isChatLoading={isChatLoading}
                chatReceiverId={chatReceiverId}
                onSendMessage={onSendMessage}
                onBack={() => setActiveTab('detail')}
            />
        );
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
            
            {/* Action for Completing Job (Employer only) */}
            {isOwner && job.status !== 'completed' && apps.some((app: JobApplication) => app.status === 'accepted') && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
                    <div>
                        <h4 className="font-semibold text-sm">Tugas Sudah Selesai?</h4>
                        <p className="text-xs text-muted-foreground mt-1">Tandai tugas ini sebagai selesai jika pekerja telah menyelesaikan kewajibannya.</p>
                    </div>
                    <Button onClick={() => onCompleteJob(job.id)} className="w-full sm:w-auto shrink-0">
                        <CheckCircle className="size-4 mr-2" />
                        Tandai Selesai
                    </Button>
                </div>
            )}
            
            {/* Completed Job Status */}
            {job.status === 'completed' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center justify-center gap-2 mt-4 font-semibold text-sm">
                    <CheckCircle className="size-5" />
                    Tugas ini telah diselesaikan.
                </div>
            )}

            {/* Applications list for the owner */}
            {isOwner && (
                <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-bold text-base mb-3 flex items-center gap-2">
                        <Briefcase className="size-4 text-primary" />
                        <span>Daftar Pelamar ({apps.length})</span>
                    </h4>
                    {apps.length === 0 ? (
                        <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg text-center">
                            Belum ada pelamar untuk tugas ini.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {apps.map((app) => (
                                <div key={app.id} className="border border-border rounded-lg p-4 bg-muted/20 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                {app.user?.name?.[0]?.toUpperCase() || 'P'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">{app.user?.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{app.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "text-[10px] py-0.5 px-2 border-transparent",
                                                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                    app.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                    'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                )}
                                            >
                                                {app.status}
                                            </Badge>
                                            {/* Chat button for owner to message each applicant */}
                                            {app.user && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    title={`Chat dengan ${app.user.name}`}
                                                    onClick={() => onOpenChat(job, app.user_id)}
                                                >
                                                    <MessageCircle className="size-3.5 text-primary" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground bg-background p-2 border border-border rounded mt-1 whitespace-pre-wrap">
                                        {app.message}
                                    </p>
                                    {app.status === 'pending' && job.status !== 'completed' && (
                                        <div className="flex justify-end gap-2 mt-2 pt-1 border-t border-border/40">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 text-[10px] text-destructive hover:bg-destructive/10"
                                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                            >
                                                <XCircle className="size-3 mr-1" />
                                                Tolak
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                            >
                                                <CheckCircle className="size-3 mr-1" />
                                                Terima
                                            </Button>
                                        </div>
                                    )}
                                    {app.status === 'accepted' && job.status === 'completed' && (
                                        <div className="mt-2 pt-2 border-t border-border/40">
                                            {isReviewing && reviewForm.data.reviewee_id === app.user_id ? (
                                                <form onSubmit={handleReviewSubmit} className="space-y-3 p-3 bg-background border rounded-lg">
                                                    <h5 className="text-xs font-semibold">Ulas Pekerja: {app.user?.name}</h5>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => reviewForm.setData('rating', star)}
                                                                className={cn(
                                                                    "focus:outline-none transition-colors",
                                                                    (reviewForm.data.rating >= star) ? "text-amber-500" : "text-muted"
                                                                )}
                                                            >
                                                                <Star className="size-6 fill-current" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <textarea
                                                        placeholder="Tulis ulasan Anda tentang hasil kerjanya..."
                                                        className="w-full min-h-[60px] text-xs rounded-md border border-input bg-transparent px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1"
                                                        value={reviewForm.data.comment}
                                                        onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    />
                                                    <InputError message={reviewForm.errors.rating} />
                                                    <InputError message={reviewForm.errors.comment} />
                                                    <div className="flex justify-end gap-2">
                                                        <Button type="button" size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setIsReviewing(false)}>Batal</Button>
                                                        <Button type="submit" size="sm" className="h-7 text-[10px]" disabled={reviewForm.processing}>Kirim Ulasan</Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full h-8 text-[11px]"
                                                    onClick={() => {
                                                        reviewForm.setData({ job_posting_id: job.id, reviewee_id: app.user_id, rating: 5, comment: '' });
                                                        setIsReviewing(true);
                                                    }}
                                                >
                                                    <Star className="size-3 mr-1.5" />
                                                    Beri Ulasan Pekerja
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Application status / submission for non-owners */}
            {!isOwner && (
                <div className="border-t border-border pt-4 mt-4">
                    {myApp ? (
                        <div className="space-y-3">
                            <div className={cn(
                                "p-4 rounded-xl border flex items-start gap-3",
                                myApp.status === 'accepted' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-200' :
                                myApp.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-200' :
                                'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-200'
                            )}>
                                <div className="p-1 rounded-full bg-background border mt-0.5">
                                    {myApp.status === 'accepted' ? <CheckCircle className="size-4 text-emerald-500" /> :
                                     myApp.status === 'rejected' ? <XCircle className="size-4 text-rose-500" /> :
                                     <Calendar className="size-4 text-amber-500" />}
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm">Status Lamaran Jasa Anda: <span className="capitalize">{myApp.status}</span></h5>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                        Pesan Penawaran Anda: "{myApp.message}"
                                    </p>
                                </div>
                            </div>
                            
                            {myApp.status === 'accepted' && job.status === 'completed' && (
                                <div className="mt-2">
                                    {isReviewing && reviewForm.data.reviewee_id === job.user_id ? (
                                        <form onSubmit={handleReviewSubmit} className="space-y-3 p-4 bg-muted/30 border rounded-xl">
                                            <h5 className="text-sm font-semibold mb-1">Ulas Pemberi Kerja</h5>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => reviewForm.setData('rating', star)}
                                                        className={cn(
                                                            "focus:outline-none transition-colors",
                                                            (reviewForm.data.rating >= star) ? "text-amber-500" : "text-muted"
                                                        )}
                                                    >
                                                        <Star className="size-7 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                placeholder="Tulis ulasan Anda tentang pengalaman bekerja dengan pemberi kerja ini..."
                                                className="w-full min-h-[80px] text-sm rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-1"
                                                value={reviewForm.data.comment}
                                                onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                            />
                                            <InputError message={reviewForm.errors.rating} />
                                            <InputError message={reviewForm.errors.comment} />
                                            <div className="flex justify-end gap-2">
                                                <Button type="button" size="sm" variant="ghost" onClick={() => setIsReviewing(false)}>Batal</Button>
                                                <Button type="submit" size="sm" disabled={reviewForm.processing}>Kirim Ulasan</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            className="w-full flex items-center gap-2 mb-2"
                                            onClick={() => {
                                                reviewForm.setData({ job_posting_id: job.id, reviewee_id: job.user_id, rating: 5, comment: '' });
                                                setIsReviewing(true);
                                            }}
                                        >
                                            <Star className="size-4 text-amber-500 fill-amber-500" />
                                            Beri Ulasan untuk Pemberi Kerja
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Chat button for applicant to message owner */}
                            <Button
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={() => onOpenChat(job, job.user_id)}
                            >
                                <MessageCircle className="size-4" />
                                Chat dengan Pemberi Kerja
                            </Button>
                        </div>
                    ) : (
                        <div>
                            {isApplying ? (
                                <form onSubmit={handleApplySubmit} className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="apply-message">Pesan Penawaran / Kontak Anda</Label>
                                        <textarea
                                            id="apply-message"
                                            placeholder="Tulis pesan Anda untuk pemberi kerja. Misal: tarif yang diharapkan, kapan bisa mulai kerja, dan nomor kontak/HP yang bisa dihubungi..."
                                            className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800"
                                            value={applyForm.data.message}
                                            onChange={(e) => applyForm.setData('message', e.target.value)}
                                            required
                                        />
                                        <InputError message={applyForm.errors.message} />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" size="sm" variant="ghost" onClick={() => setIsApplying(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" size="sm" disabled={applyForm.processing} className="bg-primary text-primary-foreground">
                                            <Send className="size-3 mr-1.5" />
                                            Kirim Lamaran
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                isEmailVerified ? (
                                    <Button onClick={() => setIsApplying(true)} className="w-full bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2">
                                        <Send className="size-4" />
                                        Lamar Tugas Ini / Tawarkan Jasa
                                    </Button>
                                ) : (
                                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl text-center text-xs space-y-2">
                                        <p className="font-semibold">Email Anda belum terverifikasi.</p>
                                        <p className="text-muted-foreground">Silakan verifikasi email Anda terlebih dahulu untuk menawarkan jasa pada tugas ini.</p>
                                        <Button asChild size="sm" variant="outline" className="border-amber-500/20 hover:bg-amber-500/20 text-[10px] h-7 mt-1">
                                            <Link href={verificationNotice.url()}>Verifikasi Sekarang</Link>
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
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
