import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';
import { index as adminRoles } from '@/routes/admin/roles';

type Permission = {
    id: number;
    name: string;
};

type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

type PageProps = {
    roles: Role[];
    permissions: Permission[];
};

export default function RolesIndex({ roles, permissions }: PageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const createForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const editForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(adminRoles.url(), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        editForm.setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) {
            return;
        }
        editForm.patch(adminRoles.url() + '/' + selectedRole.id, {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
            },
        });
    };

    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) {
            return;
        }
        router.delete(adminRoles.url() + '/' + selectedRole.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
            },
        });
    };

    const togglePermissionInCreate = (permName: string) => {
        const isChecked = createForm.data.permissions.includes(permName);
        const updated = isChecked
            ? createForm.data.permissions.filter(p => p !== permName)
            : [...createForm.data.permissions, permName];
        createForm.setData('permissions', updated);
    };

    const togglePermissionInEdit = (permName: string) => {
        const isChecked = editForm.data.permissions.includes(permName);
        const updated = isChecked
            ? editForm.data.permissions.filter(p => p !== permName)
            : [...editForm.data.permissions, permName];
        editForm.setData('permissions', updated);
    };

    const isSystemRole = (roleName: string) => {
        return roleName === 'Super Admin' || roleName === 'Admin' || roleName === 'User';
    };

    return (
        <>
            <Head title="Role Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Actions & Filters */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">System Roles</h2>
                        <p className="text-sm text-muted-foreground">Manage authorization groups and permission matrices.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="size-4 mr-2" />
                        Add Role
                    </Button>
                </div>

                {/* Roles Table */}
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground text-left">
                                    <th className="p-4 w-[250px]">Role</th>
                                    <th className="p-4">Assigned Permissions</th>
                                    <th className="p-4 text-right w-[150px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {roles.map((role) => (
                                    <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="size-4 text-primary" />
                                                {role.name}
                                                {isSystemRole(role.name) && (
                                                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 ml-1 font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                                        System
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {role.name === 'Super Admin' ? (
                                                <span className="text-xs text-muted-foreground font-medium italic">
                                                    Bypasses all checks (super-admin logic)
                                                </span>
                                            ) : role.permissions.length === 0 ? (
                                                <span className="text-xs text-muted-foreground italic">No permissions assigned</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {role.permissions.map((perm) => (
                                                        <Badge key={perm.id} variant="outline" className="bg-primary/5 text-primary text-[11px] font-medium border-primary/20">
                                                            {perm.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(role)}
                                                    disabled={role.name === 'Super Admin'}
                                                    title={role.name === 'Super Admin' ? "Super Admin cannot be edited" : "Edit Role"}
                                                >
                                                    <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteModal(role)}
                                                    disabled={isSystemRole(role.name)}
                                                    title={isSystemRole(role.name) ? "System roles cannot be deleted" : "Delete Role"}
                                                >
                                                    <Trash2 className={cn("size-4", isSystemRole(role.name) ? "text-muted-foreground/40" : "text-destructive hover:text-destructive/80")} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Role Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Role</DialogTitle>
                        <DialogDescription>Create a new custom role and assign permissions to it.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Role Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <Label className="text-sm font-semibold">Assign Permissions</Label>
                            <div className="space-y-2 border border-border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                                {permissions.map((perm) => (
                                    <div key={perm.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`create-perm-${perm.id}`}
                                            checked={createForm.data.permissions.includes(perm.name)}
                                            onCheckedChange={() => togglePermissionInCreate(perm.name)}
                                        />
                                        <label
                                            htmlFor={`create-perm-${perm.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {perm.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create Role
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>Update the role name and check or uncheck permissions.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Role Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <Label className="text-sm font-semibold">Permissions Matrix</Label>
                            <div className="space-y-2 border border-border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                                {permissions.map((perm) => (
                                    <div key={perm.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`edit-perm-${perm.id}`}
                                            checked={editForm.data.permissions.includes(perm.name)}
                                            onCheckedChange={() => togglePermissionInEdit(perm.name)}
                                        />
                                        <label
                                            htmlFor={`edit-perm-${perm.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {perm.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Role Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-1">
                            <ShieldAlert className="size-6" />
                            <DialogTitle>Delete Role</DialogTitle>
                        </div>
                        <DialogDescription>
                            Are you sure you want to delete the role <span className="font-semibold text-foreground">{selectedRole?.name}</span>? This will revoke this role from all assigned users.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleDeleteSubmit}>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive">
                                Delete Role
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Role Management',
            href: adminRoles.url(),
        },
    ],
};
