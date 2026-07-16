import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserInfo } from '@/components/user-info';
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
import { index as adminUsers } from '@/routes/admin/users';
import type { User } from '@/types';

type Role = {
    id: number;
    name: string;
};

type UserWithRoles = User & {
    roles: Role[];
};

type UsersPagination = {
    data: UserWithRoles[];
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
    users: UsersPagination;
    roles: Role[];
    filters: {
        search: string | null;
    };
    auth: {
        user: User;
    };
};

export default function UsersIndex({ users, roles, filters, auth }: PageProps) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(adminUsers.url(), { search: searchVal }, { preserveState: true, replace: true });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(adminUsers.url(), {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEditModal = (user: UserWithRoles) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles.map(r => r.name),
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            return;
        }
        editForm.patch(adminUsers.url() + '/' + selectedUser.id, {
            onSuccess: () => {
                editForm.reset();
                setIsEditOpen(false);
            },
        });
    };

    const openDeleteModal = (user: UserWithRoles) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            return;
        }
        router.delete(adminUsers.url() + '/' + selectedUser.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
            },
        });
    };

    const toggleRoleInCreate = (roleName: string) => {
        const isChecked = createForm.data.roles.includes(roleName);
        const updated = isChecked
            ? createForm.data.roles.filter(r => r !== roleName)
            : [...createForm.data.roles, roleName];
        createForm.setData('roles', updated);
    };

    const toggleRoleInEdit = (roleName: string) => {
        const isChecked = editForm.data.roles.includes(roleName);
        const updated = isChecked
            ? editForm.data.roles.filter(r => r !== roleName)
            : [...editForm.data.roles, roleName];
        editForm.setData('roles', updated);
    };

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Actions & Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="pl-9 pr-4"
                        />
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </form>

                    <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                        <Plus className="size-4 mr-2" />
                        Add User
                    </Button>
                </div>

                {/* Users Table */}
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground text-left">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Roles</th>
                                    <th className="p-4">Email Status</th>
                                    <th className="p-4">Registered At</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <UserInfo user={user} />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.map((role) => (
                                                        <Badge key={role.id} variant="secondary" className="text-[10px] py-0.5 px-2 font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border-transparent">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {user.email_verified_at ? (
                                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(user)}
                                                        title="Edit User"
                                                    >
                                                        <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteModal(user)}
                                                        disabled={user.id === auth.user.id}
                                                        title={user.id === auth.user.id ? "You cannot delete yourself" : "Delete User"}
                                                    >
                                                        <Trash2 className={cn("size-4", user.id === auth.user.id ? "text-muted-foreground/40" : "text-destructive hover:text-destructive/80")} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {users.links.map((link, i) => {
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

            {/* Create User Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add User</DialogTitle>
                        <DialogDescription>Create a new account by filling out the details below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-email">Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-password">Password</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                required
                            />
                            <InputError message={createForm.errors.password} />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <Label className="text-sm font-semibold">Assign Roles</Label>
                            <div className="flex flex-wrap gap-4 border border-border rounded-lg p-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`create-role-${role.id}`}
                                            checked={createForm.data.roles.includes(role.name)}
                                            onCheckedChange={() => toggleRoleInCreate(role.name)}
                                        />
                                        <label
                                            htmlFor={`create-role-${role.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={createForm.errors.roles} />
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Create User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update account information. Leave the password blank to keep the current password.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={editForm.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Password (Optional)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                placeholder="Leave blank to keep current"
                            />
                            <InputError message={editForm.errors.password} />
                        </div>

                        <div className="grid gap-3 pt-2">
                            <Label className="text-sm font-semibold">Roles Matrix</Label>
                            <div className="flex flex-wrap gap-4 border border-border rounded-lg p-3">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`edit-role-${role.id}`}
                                            checked={editForm.data.roles.includes(role.name)}
                                            onCheckedChange={() => toggleRoleInEdit(role.name)}
                                        />
                                        <label
                                            htmlFor={`edit-role-${role.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <InputError message={editForm.errors.roles} />
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

            {/* Delete User Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-1">
                            <ShieldAlert className="size-6" />
                            <DialogTitle>Delete User Account</DialogTitle>
                        </div>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{selectedUser?.name}</span>'s account? This action is permanent and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleDeleteSubmit}>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive">
                                Delete User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'User Management',
            href: adminUsers.url(),
        },
    ],
};
