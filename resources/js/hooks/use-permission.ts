import { usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

export type HasPermissionFn = (permission: string) => boolean;
export type HasRoleFn = (role: string) => boolean;

export type UsePermissionReturn = {
    hasPermission: HasPermissionFn;
    hasRole: HasRoleFn;
    isSuperAdmin: boolean;
};

export function usePermission(): UsePermissionReturn {
    const { auth } = usePage<{ auth: Auth }>().props;

    const isSuperAdmin = auth.roles?.includes('Super Admin') ?? false;

    const hasPermission: HasPermissionFn = (permission: string) => {
        return isSuperAdmin || (auth.permissions?.includes(permission) ?? false);
    };

    const hasRole: HasRoleFn = (role: string) => {
        return auth.roles?.includes(role) ?? false;
    };

    return {
        hasPermission,
        hasRole,
        isSuperAdmin,
    };
}
