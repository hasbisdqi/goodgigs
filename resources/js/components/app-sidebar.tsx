import { Link, usePage, router } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Users, Shield, Briefcase, HardHat, Building2, FileBadge, ShieldAlert, BarChart3, ListTree } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminUsers } from '@/routes/admin/users';
import { index as adminRoles } from '@/routes/admin/roles';
import { index as jobsIndex } from '@/routes/jobs';
import { switchMode } from '@/routes/profile';
import { usePermission } from '@/hooks/use-permission';
import type { NavItem, Auth } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];



export function AppSidebar() {
    const { hasPermission } = usePermission();
    const { auth } = usePage<{ auth: Auth }>().props;
    const activeMode = auth.user.active_mode;
    const isEmployer = activeMode === 'employer';

    const handleSwitchMode = () => {
        router.post(switchMode.url(), {
            mode: isEmployer ? 'worker' : 'employer',
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: isEmployer ? 'Tugas Saya' : 'Cari Tugas',
            href: jobsIndex.url(),
            icon: Briefcase,
        },
    ];

    if (isEmployer) {
        mainNavItems.push({
            title: 'Cari Pekerja',
            href: '/workers', // using string as wayfinder might not have it yet, or better use wayfinder index from workers route if available, but for now '/workers'
            icon: Users,
        });
    }

    if (hasPermission('manage users')) {
        mainNavItems.push({
            title: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
        });
        mainNavItems.push({
            title: 'Users',
            href: adminUsers.url(),
            icon: Users,
        });
        mainNavItems.push({
            title: 'Roles',
            href: adminRoles.url(),
            icon: Shield,
        });
        mainNavItems.push({
            title: 'Categories',
            href: '/admin/categories',
            icon: ListTree,
        });
        mainNavItems.push({
            title: 'Verifications',
            href: '/admin/verifications',
            icon: FileBadge,
        });
        mainNavItems.push({
            title: 'Reports',
            href: '/admin/reports',
            icon: ShieldAlert,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Mode Switcher */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Mode Aktif</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleSwitchMode}
                                tooltip={{ children: isEmployer ? 'Ganti ke Pekerja' : 'Ganti ke Pemberi Kerja' }}
                                className="group cursor-pointer"
                            >
                                <div className={`flex items-center justify-center size-5 rounded-md transition-colors ${isEmployer ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'}`}>
                                    {isEmployer ? <Building2 className="size-3.5" /> : <HardHat className="size-3.5" />}
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs font-semibold">
                                        {isEmployer ? 'Pemberi Kerja' : 'Penyedia Jasa'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                                        Klik untuk ganti mode
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
