import { useState, useEffect } from 'react';
import { Bell, MessageCircle, UserPlus, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type NotificationData = {
    type: string;
    job_posting_id: number;
    job_posting_title: string;
    message: string;
    chat_message_id?: number;
    sender_id?: number;
    sender_name?: string;
    job_application_id?: number;
    applicant_id?: number;
    applicant_name?: string;
    status?: string;
};

type Notification = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

const getCookie = (name: string): string => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
};

export function NotificationMenu() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.read_at).length;

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read_at) {
            await handleMarkAsRead(notification.id);
        }

        const data = notification.data;
        if (data.job_posting_id) {
            let url = `/jobs?open_job_id=${data.job_posting_id}`;
            if (data.type === 'new_chat_message') {
                url += `&open_tab=chat`;
                if (data.sender_id) {
                    url += `&chat_receiver_id=${data.sender_id}`;
                }
            } else {
                url += `&open_tab=detail`;
            }
            router.visit(url);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_chat_message':
                return <MessageCircle className="size-4 text-indigo-500" />;
            case 'job_application_received':
                return <UserPlus className="size-4 text-emerald-500" />;
            case 'job_application_status_updated':
                return <CheckCircle className="size-4 text-sky-500" />;
            default:
                return <FileText className="size-4 text-neutral-500" />;
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins}m yang lalu`;
        if (diffHrs < 24) return `${diffHrs}j yang lalu`;
        return date.toLocaleDateString();
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 cursor-pointer rounded-full">
                    <Bell className="size-5 opacity-80" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 sm:w-96" align="end">
                <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold">Notifikasi</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 text-muted-foreground hover:text-foreground"
                            onClick={fetchNotifications}
                            disabled={loading}
                        >
                            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
                        </Button>
                        {unreadCount > 0 && (
                            <Button 
                                variant="link" 
                                className="h-auto p-0 text-xs text-primary font-normal"
                                onClick={handleMarkAllAsRead}
                            >
                                Tandai semua dibaca
                            </Button>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                            <Bell className="size-8 opacity-20 mb-2" />
                            Belum ada notifikasi
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer text-xs transition-colors",
                                    !notification.read_at && "bg-neutral-50 dark:bg-neutral-900/50 font-medium"
                                )}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {getIcon(notification.data.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="line-clamp-2 text-foreground leading-relaxed">
                                        {notification.data.message}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground mt-1 block">
                                        {formatTime(notification.created_at)}
                                    </span>
                                </div>
                                {!notification.read_at && (
                                    <div className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
