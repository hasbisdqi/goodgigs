import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as adminUsers } from '@/routes/admin/users';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';

import type { Auth } from '@/types';
import { usePermission } from '@/hooks/use-permission';

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { hasPermission } = usePermission();

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-6 shadow-sm dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 md:p-8">
                    <div className="relative z-10 flex flex-col gap-2">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Workspace</span>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Welcome back, {auth.user.name}!
                        </h1>
                        <p className="max-w-2xl text-base text-muted-foreground">
                            Manage users, adjust your account parameters, and configure security setups easily.
                        </p>
                    </div>
                    {/* Subtle decorative background element */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 blur-3xl pointer-events-none w-96 h-96 bg-primary rounded-full" />
                </div>

                {/* Management Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* User Management */}
                    {hasPermission('manage users') && (
                        <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Users className="size-6" />
                                    </div>
                                    <div>
                                        <CardTitle>User Management</CardTitle>
                                        <CardDescription className="mt-1">Manage database accounts</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Create new users, edit existing member accounts, and configure credentials.
                                </p>
                                <Button asChild className="w-full mt-4" variant="outline">
                                    <Link href={adminUsers.url()} prefetch className="flex items-center justify-center gap-2">
                                        Manage Users
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Profile Settings */}
                    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <Settings className="size-6" />
                                </div>
                                <div>
                                    <CardTitle>Profile Settings</CardTitle>
                                    <CardDescription className="mt-1">Update profile information</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Modify your display name and update your email address to receive notifications.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href={profileEdit()} prefetch className="flex items-center justify-center gap-2">
                                    Edit Profile
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security Management */}
                    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription className="mt-1">Secure your account</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Enable two-factor authentication, register passkeys, and update passwords.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href={securityEdit()} prefetch className="flex items-center justify-center gap-2">
                                    Configure Security
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
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
