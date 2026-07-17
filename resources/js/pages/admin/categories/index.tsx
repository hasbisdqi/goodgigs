import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Job Categories', href: '/admin/categories' },
];

export default function CategoriesIndex({ categories, parentCategories, errors }: { categories: any[], parentCategories: any[], errors: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        parent_id: '',
    });

    const openCreateModal = () => {
        setForm({ name: '', description: '', parent_id: '' });
        setIsCreateOpen(true);
    };

    const openEditModal = (category: any) => {
        setSelectedCategory(category);
        setForm({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id ? category.parent_id.toString() : '',
        });
        setIsEditOpen(true);
    };

    const openDeleteModal = (category: any) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/admin/categories', {
            name: form.name,
            description: form.description,
            parent_id: form.parent_id || null,
        }, {
            preserveScroll: true,
            onSuccess: () => setIsCreateOpen(false),
            onFinish: () => setSubmitting(false),
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.patch(`/admin/categories/${selectedCategory.id}`, {
            name: form.name,
            description: form.description,
            parent_id: form.parent_id || null,
        }, {
            preserveScroll: true,
            onSuccess: () => setIsEditOpen(false),
            onFinish: () => setSubmitting(false),
        });
    };

    const handleDelete = () => {
        setSubmitting(true);
        router.delete(`/admin/categories/${selectedCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => setIsDeleteOpen(false),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <>
            <Head title="Manage Job Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Job Categories" description="Kelola kategori pekerjaan yang tersedia untuk pengguna." />
                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kategori
                    </Button>
                </div>
                
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Kategori</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Parent (Kategori Induk)</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat: any) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {cat.parent_id && <span className="text-muted-foreground">└─</span>}
                                            {cat.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                                    <TableCell>
                                        {cat.parent ? cat.parent.name : <span className="text-muted-foreground italic">None (Root)</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => openEditModal(cat)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-rose-500" onClick={() => openDeleteModal(cat)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        Belum ada kategori pekerjaan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kategori Pekerjaan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nama Kategori</Label>
                            <Input 
                                id="create-name" 
                                value={form.name} 
                                onChange={(e) => setForm({...form, name: e.target.value})} 
                                required 
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-parent">Kategori Induk (Opsional)</Label>
                            <select 
                                id="create-parent"
                                value={form.parent_id} 
                                onChange={(e) => setForm({...form, parent_id: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="">-- Tidak ada (Kategori Utama) --</option>
                                {parentCategories.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.parent_id} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-description">Deskripsi (Opsional)</Label>
                            <Input 
                                id="create-description" 
                                value={form.description} 
                                onChange={(e) => setForm({...form, description: e.target.value})} 
                            />
                            <InputError message={errors.description} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Kategori Pekerjaan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nama Kategori</Label>
                            <Input 
                                id="edit-name" 
                                value={form.name} 
                                onChange={(e) => setForm({...form, name: e.target.value})} 
                                required 
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-parent">Kategori Induk (Opsional)</Label>
                            <select 
                                id="edit-parent"
                                value={form.parent_id} 
                                onChange={(e) => setForm({...form, parent_id: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="">-- Tidak ada (Kategori Utama) --</option>
                                {parentCategories.filter(p => p.id !== selectedCategory?.id).map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.parent_id} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
                            <Input 
                                id="edit-description" 
                                value={form.description} 
                                onChange={(e) => setForm({...form, description: e.target.value})} 
                            />
                            <InputError message={errors.description} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Apakah Anda yakin ingin menghapus kategori <strong>{selectedCategory?.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={submitting}>
                            {submitting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: breadcrumbs,
}