export interface User {
    id: number;
    name: string;
    username: string | null;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    two_factor_enabled: boolean;
    has_password?: boolean;
    active_mode: 'worker' | 'employer';
    is_worker_active: boolean;
    is_employer_active: boolean;
    bio?: string;
    address?: string;
    latitude?: string | number | null;
    longitude?: string | number | null;
    skills?: string[] | string | null;
    is_identity_verified?: boolean;
    verified_skills?: string[];
    roles?: Role[];
    permissions?: Permission[];
};

export type Auth = {
    user: User;
    roles: string[];
    permissions: string[];
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
