<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $manageUsersPermission = Permission::findOrCreate('manage users', 'web');

        // Create roles and assign created permissions
        Role::findOrCreate('User', 'web');

        $adminRole = Role::findOrCreate('Admin', 'web');
        $adminRole->givePermissionTo($manageUsersPermission);

        // Super Admin gets all permissions via the Gate::before hook,
        // but we still define the role.
        Role::findOrCreate('Super Admin', 'web');
    }
}
